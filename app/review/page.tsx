"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Brain,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  PartyPopper,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { qualityLabels } from "@/lib/spaced-repetition"

type ReviewLesson = {
  id: string
  title: string
  description: string | null
  content: string | null
  estimatedMinutes: number | null
  module: {
    title: string
    course: {
      id: string
      title: string
      slug: string | null
      color: string | null
      icon: string | null
    }
  }
}

type Review = {
  id: string
  lessonId: string
  nextReviewAt: string
  interval: number
  easeFactor: number
  repetitions: number
  lesson: ReviewLesson
}

export default function ReviewPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [grading, setGrading] = useState(false)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/reviews?limit=20")
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/review")
      return
    }
    if (authStatus === "authenticated") {
      fetchReviews()
    }
  }, [authStatus, router, fetchReviews])

  const currentReview = reviews[currentIndex]

  const handleGrade = async (quality: number) => {
    if (!currentReview || grading) return
    setGrading(true)
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentReview.lessonId,
          quality,
        }),
      })

      // Move to next review
      if (currentIndex < reviews.length - 1) {
        setCurrentIndex((i) => i + 1)
        setRevealed(false)
      } else {
        // All done — refetch to see if more have come due
        setCurrentIndex(0)
        setRevealed(false)
        await fetchReviews()
      }
    } catch {
      // silent fail
    } finally {
      setGrading(false)
    }
  }

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // All reviews done
  if (reviews.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <div className="flex flex-col items-center gap-4">
          <PartyPopper className="w-16 h-16 text-chart-2" />
          <h1 className="text-2xl font-bold">All caught up!</h1>
          <p className="text-muted-foreground">
            No lessons due for review right now. Complete more lessons to add
            them to your review queue.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  const lesson = currentReview.lesson
  const course = lesson.module.course
  const courseHref = course.slug || course.id
  const accentColor = course.color || "hsl(var(--primary))"

  // Create a summary/prompt from the lesson content
  // Show title + first paragraph as the "prompt"
  const contentPreview = lesson.content
    ? lesson.content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300)
    : lesson.description || ""

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Spaced Review</h1>
            <p className="text-xs text-muted-foreground">
              {currentIndex + 1} of {reviews.length} due
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / reviews.length) * 100}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      {/* Review card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span style={{ color: accentColor }}>{course.title}</span>
            <ChevronRight className="w-3 h-3" />
            <span>{lesson.module.title}</span>
          </div>
          <CardTitle className="text-lg">{lesson.title}</CardTitle>
          {lesson.estimatedMinutes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              ~{lesson.estimatedMinutes} min
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Prompt — always shown */}
          <div className="text-sm text-muted-foreground leading-relaxed mb-4">
            <p className="font-medium text-foreground mb-2">
              What do you remember about this topic?
            </p>
            <p className="italic">
              {contentPreview}
              {contentPreview.length >= 300 && "..."}
            </p>
          </div>

          {/* Reveal button */}
          {!revealed && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setRevealed(true)}
            >
              <Eye className="w-4 h-4" />
              Reveal full lesson
            </Button>
          )}

          {/* Full lesson link (after reveal) */}
          {revealed && (
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <Link
                  href={`/courses/${courseHref}/${lesson.id}`}
                  target="_blank"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Open full lesson
                </Link>
              </Button>

              <p className="text-sm text-muted-foreground">
                Rate how well you recalled this material:
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grading buttons — only show after reveal */}
      {revealed && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Show simplified 3-button grading: Hard (q=1), Good (q=3), Easy (q=5) */}
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-auto py-3 border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleGrade(1)}
              disabled={grading}
            >
              <span className="text-sm font-medium">Again</span>
              <span className="text-[10px] text-muted-foreground">
                1 day
              </span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-auto py-3 border-chart-5/30 hover:bg-chart-5/10"
              onClick={() => handleGrade(3)}
              disabled={grading}
            >
              <span className="text-sm font-medium">Good</span>
              <span className="text-[10px] text-muted-foreground">
                {currentReview.repetitions <= 1
                  ? "6 days"
                  : `~${Math.round(currentReview.interval * currentReview.easeFactor)} days`}
              </span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-auto py-3 border-chart-2/30 hover:bg-chart-2/10"
              onClick={() => handleGrade(5)}
              disabled={grading}
            >
              <span className="text-sm font-medium">Easy</span>
              <span className="text-[10px] text-muted-foreground">
                {currentReview.repetitions <= 1
                  ? "6 days"
                  : `~${Math.round(currentReview.interval * currentReview.easeFactor * 1.3)} days`}
              </span>
            </Button>
          </div>

          {grading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Scheduling next review...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
