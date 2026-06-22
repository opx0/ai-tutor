"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type TimeSpentProps = {
  data: { day: string; hours: number }[];
  totalTimeString: React.ReactNode;
};

export function TimeSpentChart({ data, totalTimeString }: TimeSpentProps) {
  // Find the day with the max hours to highlight it (optional logic)
  let maxDayIndex = -1;
  let maxHours = -1;
  data.forEach((entry, i) => {
    if (entry.hours > maxHours) {
      maxHours = entry.hours;
      maxDayIndex = i;
    }
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-semibold text-lg tracking-tight mb-2">Time spent in learning</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold flex items-baseline gap-1">
              {totalTimeString}
            </span>
          </div>
          <p className="text-sm text-chart-2 font-medium flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-chart-2 inline-block animate-pulse" /> Well
            time spent!
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-muted/50 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors">
          Last 7 days ▼
        </div>
      </div>

      <div className="flex-1 w-full min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border/50 p-2 rounded-lg shadow-xl text-xs font-semibold flex flex-col items-center">
                      <span className="text-chart-2">
                        {Math.round((payload[0].value as number) * 60)} min
                      </span>
                      <span className="text-muted-foreground mt-1">Time spent</span>
                      <span>{Number(payload[0].value).toFixed(1)} hr</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Custom Bar with rounded top/bottom */}
            <Bar
              dataKey="hours"
              fill="hsl(var(--muted)/0.8)"
              radius={[4, 4, 4, 4]}
              activeBar={{ fill: "hsl(var(--chart-2))" }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  // Highlight the day with the most hours
                  fill={
                    index === maxDayIndex && maxHours > 0
                      ? "hsl(var(--chart-2))"
                      : "hsl(var(--primary)/0.2)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
