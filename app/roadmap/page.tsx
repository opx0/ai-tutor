import { ArrowLeft, Orbit } from "lucide-react";
import Link from "next/link";
import RoadmapFlow from "@/components/roadmap/roadmap-flow";
import { getRoadmapData } from "@/lib/roadmap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visual Path - LearnLM",
};

export default async function VisualPathPage() {
  const data = await getRoadmapData();

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] relative overflow-hidden bg-background">
      {/* Immersive Space Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-chart-4/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Title HUD */}
      <div className="absolute top-[80px] right-6 lg:right-10 z-50 pointer-events-none flex flex-col items-end">
        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <Orbit className="w-3.5 h-3.5" /> Topology
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tighter drop-shadow-2xl text-foreground">
          Visual Path
        </h1>
      </div>

      {/* Flow canvas */}
      {data.courses.length > 0 && <RoadmapFlow data={data} />}
    </div>
  );
}
