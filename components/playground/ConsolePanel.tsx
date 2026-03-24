import { Terminal, Square } from "lucide-react";

type Props = {
  output: string | null;
  error: string | null;
  isRunning: boolean;
};

export function ConsolePanel({ output, error, isRunning }: Props) {
  return (
    <div className="flex-1 flex flex-col h-full w-full bg-transparent overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border-b border-white/5 shrink-0">
        <Terminal className="w-3.5 h-3.5 text-white/40" />
        <span className="text-xs font-medium text-white/60 tracking-wider uppercase">Console</span>
        {isRunning && (
          <span className="ml-auto text-xs font-medium text-emerald-400 animate-pulse flex items-center gap-1.5">
            <Square className="w-3 h-3" /> Running...
          </span>
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto font-mono text-[13px] leading-[1.6]">
        {!output && !error && !isRunning && (
          <span className="text-white/20 italic">No output yet. Run your code to see results.</span>
        )}
        {error ? (
          <span className="text-red-400 whitespace-pre-wrap">{error}</span>
        ) : (
          <span className="text-emerald-400/90 whitespace-pre-wrap">{output}</span>
        )}
      </div>
    </div>
  );
}
