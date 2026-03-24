"use client";

import { ARRAY_PROBLEMS, PROBLEM_GROUPS, type ArrayProblem } from "@/lib/playground/array-problems";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Zap, Layers, ArrowLeftRight, Gauge, GitMerge, Brain, Database, type LucideIcon } from "lucide-react";

const PATTERN_ICONS: Record<string, LucideIcon> = {
  "Two Pointer": ArrowLeftRight,
  "Sliding Window": Gauge,
  "Fast-Slow Pointer": Zap,
  "Prefix Sum": Layers,
  "Dynamic Programming": Brain,
  "Array Fundamentals": Database,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

type Props = {
  selectedId: string;
  onSelect: (problem: ArrayProblem) => void;
};

export function ProblemSelector({ selectedId, onSelect }: Props) {
  const problemMap = Object.fromEntries(ARRAY_PROBLEMS.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col h-full bg-[#080c12] border-r border-white/5">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <GitMerge className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Array Problems</span>
        </div>
        <p className="text-[10px] text-white/30 leading-relaxed">
          Select a problem to fork its code into the editor and watch it animate step by step.
        </p>
      </div>

      {/* Problem groups */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {PROBLEM_GROUPS.map((group) => {
          const Icon = PATTERN_ICONS[group.label] ?? Layers;
          return (
            <div key={group.label}>
              <div className="flex items-center gap-1.5 px-2 mb-1.5">
                <Icon className="w-3 h-3 text-white/30" aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {group.label}
                </span>
              </div>
              <div className="space-y-1">
                {group.ids.map((id) => {
                  const problem = problemMap[id];
                  if (!problem) return null;
                  const isSelected = id === selectedId;
                  return (
                    <motion.button
                      key={id}
                      onClick={() => onSelect(problem)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group ${
                        isSelected
                          ? "bg-violet-500/15 border border-violet-500/30 text-white"
                          : "border border-transparent hover:bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{problem.title}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                            {problem.difficulty}
                          </span>
                          {problem.visualization && (
                            <span className="text-[9px] text-violet-400/60 font-mono">
                              {problem.visualization.steps.length} steps
                            </span>
                          )}
                        </div>
                      </div>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-white/5 flex-shrink-0">
        <p className="text-[10px] text-white/20 leading-relaxed text-center">
          Hit <span className="text-violet-400 font-bold">Run</span> to switch from static viz to live trace
        </p>
      </div>
    </div>
  );
}
