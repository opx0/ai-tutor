"use client";

import { useState } from "react";
import { EditorPanel } from "@/components/playground/EditorPanel";
import { ConsolePanel } from "@/components/playground/ConsolePanel";
import { VisualizationPanel } from "@/components/playground/VisualizationPanel";
import { ProblemSelector } from "@/components/playground/ProblemSelector";
import { useExecution } from "@/hooks/useExecution";
import { ARRAY_PROBLEMS, type ArrayProblem } from "@/lib/playground/array-problems";
import { Play, RotateCcw, ArrowLeft, Code2, Layers3, PanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Language = "javascript" | "python" | "cpp";

export default function PlaygroundPage() {
  const router = useRouter();
  const [selectedProblem, setSelectedProblem] = useState<ArrayProblem>(ARRAY_PROBLEMS[0]);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(ARRAY_PROBLEMS[0].starterCode.javascript);
  const [runCount, setRunCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { isRunning, output, error, execute, clearOutput } = useExecution();

  const handleProblemSelect = (problem: ArrayProblem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode[language]);
    clearOutput();
    setRunCount(0); // reset to static mode
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as Language;
    setLanguage(lang);
    setCode(selectedProblem.starterCode[lang]);
    clearOutput();
    setRunCount(0);
  };

  const handleRun = () => {
    execute(code, language);
    setRunCount((p) => p + 1);
  };

  const handleReset = () => {
    setCode(selectedProblem.starterCode[language]);
    clearOutput();
    setRunCount(0);
  };

  return (
    <div className="relative flex w-screen h-screen bg-[#050505] text-white overflow-hidden font-sans">

      {/* ─── Left Panel: Problem Selector ─── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="relative z-30 h-full flex-shrink-0 overflow-hidden"
          >
            <div className="w-[260px] h-full">
              <ProblemSelector selectedId={selectedProblem.id} onSelect={handleProblemSelect} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Middle Panel: Logic Hub (editor + console) ─── */}
      <div className="relative z-20 w-[500px] flex-shrink-0 h-full flex flex-col bg-[#0a0e14]/95 backdrop-blur-3xl border-x border-white/8 shadow-2xl shadow-black/80">

        {/* Title Bar */}
        <div className="flex flex-col gap-2 px-4 py-4 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Sidebar toggle */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                title="Toggle Problem List"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/courses')}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/10" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-500 to-emerald-500 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0a0e14] flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5 text-violet-400" />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate max-w-[140px]">{selectedProblem.title}</div>
                <div className="text-[10px] uppercase tracking-widest text-violet-400/70">{selectedProblem.pattern}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                title="Reset to Solution"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRun}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
                  isRunning
                    ? "bg-violet-500/10 text-violet-400 cursor-not-allowed border border-violet-500/20"
                    : "bg-violet-500 hover:bg-violet-400 text-white shadow-violet-500/25"
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-pulse" : ""}`} fill={isRunning ? "none" : "currentColor"} />
                {isRunning ? "Running..." : "Run & Visualize"}
              </motion.button>
            </div>
          </div>

          {/* Controls row: language + problem input hint */}
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="flex-1 appearance-none bg-black/30 border border-white/8 text-white text-xs font-medium rounded-lg px-3 py-1.5 outline-none hover:bg-black/50 focus:border-violet-500/50 transition-colors cursor-pointer"
            >
              <option value="javascript">JavaScript (Node v20)</option>
              <option value="python">Python (Pyodide 3.11)</option>
              <option value="cpp">C++ (GCC 12)</option>
            </select>
            <div className="text-[10px] text-white/25 font-mono bg-white/4 border border-white/8 rounded-lg px-2 py-1.5 whitespace-nowrap">
              {selectedProblem.defaultInput}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative min-h-0">
          <EditorPanel code={code} onChange={setCode} language={language} />
        </div>

        {/* Console */}
        <div className="h-[30%] flex-shrink-0 border-t border-white/8 relative bg-[#05080b]">
          <ConsolePanel output={output} error={error} isRunning={isRunning} />
        </div>
      </div>

      {/* ─── Right Panel: Visualization Canvas ─── */}
      <div className="absolute inset-0 z-0 pl-[500px]" style={{ paddingLeft: sidebarOpen ? 760 : 500 }}>
        <VisualizationPanel
          runCount={runCount}
          output={output}
          isRunning={isRunning}
          block={selectedProblem.visualization}
          problemTitle={selectedProblem.title}
        />
      </div>

    </div>
  );
}
