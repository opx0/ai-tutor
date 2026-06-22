import { spawn } from "child_process";
import fs from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import os from "os";
import path from "path";
import { authOptions } from "@/lib/auth";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

type ProcessResult = {
  stdout: string;
  stderr: string;
  code: number | null;
  timedOut: boolean;
};

function runProcess(command: string, args: string[], timeoutMs: number): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      resolve({ stdout, stderr, code, timedOut });
    });
  });
}

function isExecutionEnabled() {
  return (
    process.env.ENABLE_SERVER_CODE_EXECUTION === "true" || process.env.NODE_ENV !== "production"
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    if (!isExecutionEnabled()) {
      return NextResponse.json(
        {
          error:
            "Server-side code execution is disabled. Set ENABLE_SERVER_CODE_EXECUTION=true to enable it.",
        },
        { status: 503 },
      );
    }

    const clientId = getClientIdentifier(req, session.user.id);
    const limit = await consumeRateLimit(`execute:${session.user.id}:${clientId}`, {
      max: 20,
      windowMs: 60_000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many execution requests. Please retry shortly.",
          retryAfterMs: limit.retryAfterMs,
        },
        { status: 429 },
      );
    }

    const { code, language } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (language !== "cpp" && language !== "c++") {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    if (code.length > 20_000) {
      return NextResponse.json(
        { error: "Code is too long. Maximum allowed is 20,000 characters." },
        { status: 400 },
      );
    }

    // 1. Create a temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "code-exec-"));
    const sourceFile = path.join(tempDir, "main.cpp");
    const binaryFile = path.join(tempDir, "main.out");

    try {
      // 2. Write code to file
      await fs.writeFile(sourceFile, code, "utf8");

      // 3. Compile the code
      const compileResult = await runProcess(
        "g++",
        ["-O2", "-std=c++20", sourceFile, "-o", binaryFile],
        8_000,
      );

      if (compileResult.timedOut) {
        return NextResponse.json({
          stdout: "",
          stderr: "Compilation timed out after 8 seconds.",
        });
      }

      if (compileResult.code !== 0) {
        return NextResponse.json({
          stdout: "",
          stderr: `Compilation Error:\n${compileResult.stderr || "Unknown compiler error."}`,
        });
      }

      // 4. Run the code
      const runResult = await runProcess(binaryFile, [], 5_000);
      if (runResult.timedOut) {
        return NextResponse.json({
          stdout: runResult.stdout,
          stderr: "Execution timed out after 5 seconds.",
        });
      }

      return NextResponse.json({
        stdout: runResult.stdout,
        stderr: runResult.stderr,
      });
    } finally {
      // 5. Cleanup temp directory
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }
    }
  } catch (error: any) {
    console.error("Execution API Error:", error);
    return NextResponse.json(
      { error: "Failed to execute code", details: error.message },
      { status: 500 },
    );
  }
}
