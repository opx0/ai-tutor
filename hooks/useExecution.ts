import { useCallback, useState } from "react";

// ─── Pyodide singleton ──────────────────────────────────────────────
let pyodidePromise: Promise<any> | null = null;

function loadPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
      script.onload = async () => {
        try {
          const pyodide = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
          });
          resolve(pyodide);
        } catch (e) {
          reject(e);
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    } catch (e) {
      reject(e);
    }
  });
  return pyodidePromise;
}

export function useExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearOutput = useCallback(() => {
    setOutput(null);
    setError(null);
  }, []);

  const execute = useCallback(async (code: string, language: string) => {
    setIsRunning(true);
    setError(null);
    setOutput(null);

    const lang = language.toLowerCase();

    try {
      if (lang === "python" || lang === "py") {
        setOutput("⏳ Loading Python runtime...");
        const pyodide = await loadPyodide();
        setOutput("▶ Running...");

        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
        `);

        try {
          pyodide.runPython(code);
          const stdout = pyodide.runPython("sys.stdout.getvalue()");
          const stderr = pyodide.runPython("sys.stderr.getvalue()");
          const result = (stdout || "") + (stderr ? `\n⚠ ${stderr}` : "");
          setOutput(result || "✓ Code executed successfully (no output)");
        } catch (pyErr: any) {
          setError(pyErr.message || String(pyErr));
          setOutput(null);
        }
      } else if (lang === "javascript" || lang === "js") {
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => logs.push(args.map(String).join(" "));
        console.error = (...args) => logs.push(`❌ ${args.map(String).join(" ")}`);
        console.warn = (...args) => logs.push(`⚠ ${args.map(String).join(" ")}`);

        try {
          // eslint-disable-next-line no-new-func
          const result = new Function(code)();
          if (result !== undefined) logs.push(`→ ${String(result)}`);
          setOutput(logs.join("\n") || "✓ Code executed successfully (no output)");
        } catch (jsErr: any) {
          setError(jsErr.message || String(jsErr));
          setOutput(null);
        } finally {
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
        }
      } else if (lang === "cpp" || lang === "c++") {
        setOutput("⏳ Compiling & Running C++...");

        const response = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language: "cpp" }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || errData.details || `Server Error ${response.status}`);
        }

        const data = await response.json();

        if (data.stderr && data.stderr.includes("Error")) {
          setError(data.stderr);
          setOutput(null);
        } else {
          const result = (data.stdout || "") + (data.stderr ? `\n⚠ ${data.stderr}` : "");
          setOutput(result || "✓ Code executed successfully (no output)");
        }
      } else {
        throw new Error(`Language '${language}' is not runnable in this playground yet.`);
      }
    } catch (err: any) {
      setError(err.message || "Execution failed");
      setOutput(null);
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { isRunning, output, error, execute, clearOutput };
}
