"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Check, Play, Square, ChevronDown, ChevronUp, Terminal } from "lucide-react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";

// Register languages
hljs.registerLanguage("python", python);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c++", cpp);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("py", python);

// ─── Language display names & execution support ─────────────────────
const LANG_META: Record<string, { label: string; icon: string; runnable: boolean }> = {
  python: { label: "Python", icon: "🐍", runnable: true },
  py: { label: "Python", icon: "🐍", runnable: true },
  javascript: { label: "JavaScript", icon: "⚡", runnable: true },
  js: { label: "JavaScript", icon: "⚡", runnable: true },
  typescript: { label: "TypeScript", icon: "📘", runnable: false },
  ts: { label: "TypeScript", icon: "📘", runnable: false },
  java: { label: "Java", icon: "☕", runnable: false },
  cpp: { label: "C++", icon: "⚙️", runnable: true },
  "c++": { label: "C++", icon: "⚙️", runnable: true },
  "": { label: "Code", icon: "📝", runnable: false },
};

// ─── Pyodide singleton ──────────────────────────────────────────────
let pyodidePromise: Promise<any> | null = null;

function loadPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      // Load Pyodide from CDN
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

// ─── Component ──────────────────────────────────────────────────────
type Props = {
  code: string;
  language: string;
  className?: string;
};

export default function AdvancedCodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editableCode, setEditableCode] = useState(code);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  const lang = language?.toLowerCase().replace("language-", "") || "";
  const meta = LANG_META[lang] || LANG_META[""];
  
  // A snippet is runnable if the language supports it AND
  // for C++, it MUST contain an entry point (main function) to compile.
  const isCPlusPlus = lang === "cpp" || lang === "c++";
  const isRunnable = meta.runnable && (!isCPlusPlus || editableCode.includes("int main"));

  // Highlight code
  const highlightedCode = (() => {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(editableCode, { language: lang }).value;
      }
      // Try auto-detection
      const result = hljs.highlightAuto(editableCode);
      return result.value;
    } catch {
      return editableCode
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  })();

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editableCode]);

  // Execute code
  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);
    setShowOutput(true);

    try {
      if (lang === "python" || lang === "py") {
        // Python execution via Pyodide
        setOutput("⏳ Loading Python runtime...");
        const pyodide = await loadPyodide();
        setOutput("▶ Running...");

        // Capture stdout
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
        `);

        try {
          pyodide.runPython(editableCode);
          const stdout = pyodide.runPython("sys.stdout.getvalue()");
          const stderr = pyodide.runPython("sys.stderr.getvalue()");
          const result = (stdout || "") + (stderr ? `\n⚠ ${stderr}` : "");
          setOutput(result || "✓ Code executed successfully (no output)");
        } catch (pyErr: any) {
          setError(pyErr.message || String(pyErr));
        }
      } else if (lang === "javascript" || lang === "js") {
        // JavaScript execution
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => logs.push(args.map(String).join(" "));
        console.error = (...args) => logs.push(`❌ ${args.map(String).join(" ")}`);
        console.warn = (...args) => logs.push(`⚠ ${args.map(String).join(" ")}`);

        try {
          const result = new Function(editableCode)();
          if (result !== undefined) logs.push(`→ ${String(result)}`);
          setOutput(logs.join("\n") || "✓ Code executed successfully (no output)");
        } catch (jsErr: any) {
          setError(jsErr.message || String(jsErr));
        } finally {
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
        }
      } else if (lang === "cpp" || lang === "c++") {
        // C++ execution via local API route
        setOutput("⏳ Compiling & Running C++...");
        
        const response = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: editableCode, language: "cpp" }),
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || errData.details || `Server Error ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.stderr && data.stderr.includes("Error")) {
          // Compilation or runtime error
          setError(data.stderr);
          setOutput(null);
        } else {
          // Success (might have some warnings in stderr but we show stdout)
          const result = (data.stdout || "") + (data.stderr ? `\n⚠ ${data.stderr}` : "");
          setOutput(result || "✓ Code executed successfully (no output)");
        }
      }
    } catch (err: any) {
      setError(err.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  }, [editableCode, lang]);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing, editableCode]);

  // Line numbers
  const lines = editableCode.split("\n");
  const lineCount = lines.length;

  return (
    <div className="group relative my-6 rounded-xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden">
      {/* ─── Header bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
          </div>
          {/* Language badge */}
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
            {meta.icon} {meta.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Run button */}
          {isRunnable && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                border border-emerald-500/20 hover:border-emerald-500/40"
            >
              {isRunning ? (
                <>
                  <Square className="w-3 h-3 animate-pulse" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Run
                </>
              )}
            </button>
          )}

          {/* Edit toggle */}
          {isRunnable && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                transition-all duration-200 border
                ${isEditing
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-white/5 text-white/40 hover:text-white/60 border-white/10 hover:border-white/20"
                }`}
            >
              ✏️ Edit
            </button>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10
              transition-all duration-200 border border-white/10 hover:border-white/20"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Code area ──────────────────────────────────────────── */}
      <div className="relative overflow-auto max-h-[500px]">
        <div className="flex min-w-full">
          {/* Line numbers */}
          <div className="sticky left-0 flex flex-col text-right px-3 py-4 bg-[#0d1117] border-r border-white/[0.06] select-none z-10"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <span
                key={i}
                className="text-[13px] leading-[1.6] text-white/20 font-mono"
              >
                {i + 1}
              </span>
            ))}
          </div>

          {/* Code content */}
          <div className="flex-1 relative">
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                spellCheck={false}
                className="w-full p-4 bg-transparent text-[13px] leading-[1.6] font-mono text-white/90
                  resize-none outline-none min-h-[100px] whitespace-pre overflow-x-auto"
                style={{ tabSize: 2 }}
              />
            ) : (
              <pre className="!m-0 !p-0 !bg-transparent !border-none !shadow-none !rounded-none overflow-visible">
                <code
                  ref={codeRef}
                  className={`hljs block p-4 !bg-transparent text-[13px] leading-[1.6] font-mono ${lang ? `language-${lang}` : ""}`}
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* ─── Output panel ───────────────────────────────────────── */}
      {showOutput && (output || error) && (
        <div className="border-t border-white/[0.06]">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="flex items-center gap-2 w-full px-4 py-2 bg-[#161b22] hover:bg-[#1c2128] transition-colors text-xs font-medium text-white/50"
          >
            <Terminal className="w-3.5 h-3.5" />
            Output
            {showOutput ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
          </button>
          <div className="px-4 py-3 bg-[#0a0e14] max-h-[200px] overflow-auto">
            <pre className="!m-0 !p-0 !bg-transparent !border-none !shadow-none text-[13px] leading-[1.5] font-mono whitespace-pre-wrap">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <span className="text-emerald-400/90">{output}</span>
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
