import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import { useRef } from "react";

hljs.registerLanguage("python", python);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("cpp", cpp);

type Props = {
  code: string;
  onChange: (code: string) => void;
  language: string;
};

export function EditorPanel({ code, onChange, language }: Props) {
  const preRef = useRef<HTMLPreElement>(null);

  const lang = language.toLowerCase() === "c++" ? "cpp" : language.toLowerCase();

  const highlightedCode = (() => {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch {
      return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  })();

  const lines = code.split("\n");
  const lineCount = lines.length;

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="flex-1 relative flex flex-col h-full w-full bg-transparent">
      <div className="flex min-w-full flex-1 overflow-hidden">
        {/* Line numbers */}
        <div
          className="flex flex-col text-right px-3 py-4 bg-black/20 border-r border-white/5 select-none z-20 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
            <span key={i} className="text-[13px] leading-[1.6] text-white/20 font-mono">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative group bg-transparent overflow-hidden">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            spellCheck={false}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-[13px] leading-[1.6] font-mono text-transparent caret-white resize-none outline-none whitespace-pre overflow-auto z-10"
            style={{ tabSize: 4 }}
          />
          <pre
            ref={preRef}
            className="absolute inset-0 m-0 w-full h-full p-4 bg-transparent border-none overflow-hidden pointer-events-none"
          >
            <code
              className={`hljs block !bg-transparent text-[13px] leading-[1.6] font-mono ${lang ? `language-${lang}` : ""}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
