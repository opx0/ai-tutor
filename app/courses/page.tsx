import { getRoadmapData } from "@/lib/roadmap"
import RoadmapFlow from "@/components/roadmap/roadmap-flow"
import { Map, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Learning Roadmap - AI Tutor",
  description: "Interactive course roadmap — master topics step by step",
}

export default async function CoursesRoadmapPage() {
  const data = await getRoadmapData()

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="container mx-auto px-4 pt-4 pb-2 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <Map className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Learning Roadmap
              </h1>
              <p className="text-sm text-muted-foreground">
                {data.courses.length} course{data.courses.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href="/courses/my">My Courses</Link>
          </Button>
        </div>

        {data.courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-semibold mb-2">No courses yet</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Curated courses will appear here once an admin adds them to the
              roadmap. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Flow canvas */}
      {data.courses.length > 0 && <RoadmapFlow data={data} />}
    </div>
  )
}
