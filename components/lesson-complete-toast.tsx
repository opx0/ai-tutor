"use client";

import { Sparkles, Trophy } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function useLessonCompletionToast(isNewlyCompleted: boolean) {
  useEffect(() => {
    if (isNewlyCompleted) {
      toast.custom(
        (t) => (
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-4 shadow-xl backdrop-blur-xl w-[320px]">
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -left-6 -bottom-6 h-24 w-24 bg-chart-2/20 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-md shrink-0 animate-bounce-subtle">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">Lesson Complete!</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Keep up the great work.</p>

                <div className="mt-3 flex items-center justify-between bg-background/50 rounded-lg p-2 border border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-chart-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    +10 XP
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Gained
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        { duration: 4000 },
      );
    }
  }, [isNewlyCompleted]);
}
