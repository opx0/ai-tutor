import { useState, useEffect, useRef } from "react";
import { Activity, Sparkles, GitCommit, ArrowDown, PlayCircle, Layers, SkipBack, SkipForward, Play, Pause, RotateCcw } from "lucide-react";
import SceneElement from "@/components/visualization/SceneElement";
import { motion, AnimatePresence } from "framer-motion";
import type { VisualizationBlock } from "@/lib/visualization/types";

type Props = {
  runCount: number;
  output: string | null;
  isRunning: boolean;
  block?: VisualizationBlock | null; // pre-authored viz block
  problemTitle?: string;
};

export function VisualizationPanel({ runCount, output, isRunning, block = null, problemTitle }: Props) {
  // ─── Static ScenePlayer state ─────────────────────────────────────
  const [staticStep, setStaticStep] = useState(0);
  const [isStaticPlaying, setIsStaticPlaying] = useState(false);
  const [staticSpeed, setStaticSpeed] = useState(1500);

  // ─── Live debug parser state ──────────────────────────────────────
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [parsedSteps, setParsedSteps] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mode: "static" when no run yet, "live" after user hits Run
  const mode = runCount === 0 ? "static" : "live";

  // Reset static player when block changes
  useEffect(() => {
    setStaticStep(0);
    setIsStaticPlaying(false);
  }, [block]);

  // Auto-advance static player
  useEffect(() => {
    if (!isStaticPlaying || !block) return;
    const timer = setInterval(() => {
      setStaticStep((s) => {
        if (s >= block.steps.length - 1) { setIsStaticPlaying(false); return s; }
        return s + 1;
      });
    }, staticSpeed);
    return () => clearInterval(timer);
  }, [isStaticPlaying, staticSpeed, block]);

  // Parse [DEBUG] logs for live mode
  useEffect(() => {
    if (!output) { setParsedSteps([]); return; }
    const lines = output.split("\n");
    const newSteps: any[] = [];
    let stepCounter = 1;
    lines.forEach((line) => {
      if (line.includes("[DEBUG]")) {
        try {
          const jsonStr = line.substring(line.indexOf("[DEBUG]") + 7).trim();
          const data = JSON.parse(jsonStr);
          const elements: any[] = [];
          if (data.vars) {
            Object.entries(data.vars).forEach(([key, value], idx) => {
              if (Array.isArray(value)) {
                elements.push({ type: "array", id: `arr_${stepCounter}_${idx}`, label: key, items: value.map((v) => ({ value: v, state: "default" })) });
              } else {
                elements.push({ type: "variable", id: `var_${stepCounter}_${idx}`, name: key, value: value as any, state: "active" });
              }
            });
          }
          newSteps.push({ message: data.message || "State Update", elements });
          stepCounter++;
        } catch { /* skip malformed */ }
      }
    });
    setParsedSteps(newSteps);
  }, [output]);

  // Animate live steps
  useEffect(() => {
    if (runCount === 0 || isRunning) { setVisibleSteps(0); return; }
    if (parsedSteps.length === 0) return;
    setVisibleSteps(1);
    let cur = 1;
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    const interval = setInterval(() => {
      if (cur < parsedSteps.length) {
        cur++;
        setVisibleSteps(cur);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [runCount, parsedSteps.length, isRunning]);

  const displayedSteps = parsedSteps.slice(0, visibleSteps);
  const totalStatic = block?.steps.length ?? 0;
  const currentScene = block?.steps[staticStep];

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col bg-[#050505]">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full mix-blend-screen filter blur-[128px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/8 rounded-full mix-blend-screen filter blur-[128px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 flex-shrink-0 px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            {mode === "static" ? "Algorithm Walkthrough" : "Live Execution Trace"}
          </span>
          {mode === "static" && (
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400 font-medium">
              {totalStatic} steps
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400/60 animate-pulse" />
          <span className="text-[10px] text-white/20 font-mono">
            {mode === "static" ? "PRE-AUTHORED" : "DEBUG MODE"}
          </span>
        </div>
      </div>

      {/* ─── STATIC MODE: ScenePlayer ─── */}
      {mode === "static" && block && currentScene && (
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
            {/* Step indicator */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/30 font-mono">Step {staticStep + 1} / {totalStatic}</div>
              <div className="h-1 flex-1 mx-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"
                  animate={{ width: `${((staticStep + 1) / totalStatic) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Scene card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={staticStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/8 bg-[#0a0e14]/90 backdrop-blur-xl overflow-hidden"
              >
                {/* Message */}
                <div className="px-5 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <GitCommit className="w-3.5 h-3.5 text-violet-400/60" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400/60">State Snapshot</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{currentScene.message}</p>
                </div>

                {/* Elements */}
                <div className="p-5 space-y-4">
                  {(() => {
                    const variables = currentScene.elements.filter((e) => e.type === "variable");
                    const others = currentScene.elements.filter((e) => e.type !== "variable");
                    return (
                      <>
                        {others.length > 0 && (
                          <div className="space-y-3">
                            {others.map((el, i) => (
                              <div key={i} className="p-4 rounded-xl bg-black/40 ring-1 ring-white/5">
                                <SceneElement element={el as any} />
                              </div>
                            ))}
                          </div>
                        )}
                        {variables.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-black/20 ring-1 ring-white/5">
                            {variables.map((el, i) => <SceneElement key={i} element={el as any} />)}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Playback Controls */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                <button onClick={() => { setStaticStep(0); setIsStaticPlaying(false); }} disabled={staticStep === 0} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Restart"><RotateCcw className="w-4 h-4" /></button>
                <button onClick={() => setStaticStep((s) => Math.max(0, s - 1))} disabled={staticStep === 0} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><SkipBack className="w-4 h-4" /></button>
                <button onClick={() => setIsStaticPlaying((p) => !p)} className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-colors flex items-center gap-2 text-sm font-medium">
                  {isStaticPlaying ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" fill="currentColor" /> Play</>}
                </button>
                <button onClick={() => setStaticStep((s) => Math.min(totalStatic - 1, s + 1))} disabled={staticStep >= totalStatic - 1} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><SkipForward className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30 uppercase">Speed</span>
                <select value={staticSpeed} onChange={(e) => setStaticSpeed(Number(e.target.value))} className="bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg px-2 py-1 focus:outline-none">
                  <option value={3000}>0.5×</option>
                  <option value={1500}>1×</option>
                  <option value={750}>2×</option>
                  <option value={400}>4×</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-white/20">Hit <span className="text-violet-400">Run Code</span> above to switch to live execution trace</p>
            </div>
          </div>
        </div>
      )}

      {/* Static mode but no block */}
      {mode === "static" && !block && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Layers className="w-10 h-10 text-white/10 mx-auto" />
            <p className="text-white/30 text-sm">Select a problem to start</p>
          </div>
        </div>
      )}

      {/* ─── LIVE MODE: Debug Timeline ─── */}
      {mode === "live" && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10">
          {runCount > 0 && !isRunning && parsedSteps.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="px-6 py-3 bg-amber-400/10 rounded-xl border border-amber-500/20 text-amber-400/80 text-sm text-center max-w-xs">
                No <code className="font-mono">[DEBUG]</code> logs found. The starter code already has them — just hit Run!
              </div>
            </div>
          )}

          {isRunning && (
            <div className="flex items-center justify-center h-full gap-2">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}

          <div className="max-w-3xl mx-auto px-8 py-8">
            <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/8 before:to-transparent">
              <AnimatePresence>
                {displayedSteps.map((step, idx) => {
                  const variables = step.elements.filter((e: any) => e.type === "variable");
                  const others = step.elements.filter((e: any) => e.type !== "variable");
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#050505] bg-violet-500/20 text-violet-300 text-sm font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {idx + 1}
                      </div>
                      <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl bg-[#0a0e14]/80 backdrop-blur-xl border border-white/5 hover:border-violet-500/20 transition-colors">
                        <p className="text-white/80 text-sm font-medium leading-relaxed mb-4">{step.message}</p>
                        <div className="space-y-3">
                          {others.map((el: any) => (
                            <div key={el.id} className="p-3 rounded-xl bg-black/40 ring-1 ring-white/5">
                              <SceneElement element={el} />
                            </div>
                          ))}
                          {variables.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-black/20 ring-1 ring-white/5">
                              {variables.map((el: any) => <SceneElement key={el.id} element={el} />)}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} className="h-16 flex items-center justify-center">
                {visibleSteps === parsedSteps.length && parsedSteps.length > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-emerald-400/60 font-mono flex items-center gap-1.5">
                    <ArrowDown className="w-3.5 h-3.5" /> Execution complete
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
