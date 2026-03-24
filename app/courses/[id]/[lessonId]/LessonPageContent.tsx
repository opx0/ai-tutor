"use client";

import Link from "next/link";
import { ChevronLeft, GraduationCap, ChevronRight, NotebookPen, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeachingAssistant from "@/components/teaching-assistant";
import LessonKnowledgeTest from "@/components/lesson-knowledge-test";
import LessonNotes from "@/components/lesson-notes";
import LessonBookmark from "@/components/lesson-bookmark";
import CourseSidebar from "@/components/course-sidebar";
import dynamic from "next/dynamic";
import type { VisualizationBlock } from "@/lib/visualization/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ScenePlayer = dynamic(
  () => import("@/components/visualization/ScenePlayer"),
  { ssr: false }
);

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import AdvancedCodeBlock from "@/components/advanced-code-block";
import { useLessonCompletionToast } from "@/components/lesson-complete-toast";
import { useEffect, useState } from "react";

type LessonPageContentProps = {
  lesson: any;
  course: any;
  courseHref: string;
  currentModule: any;
  currentLessonIndex: number;
  nextLesson: any;
  previousLesson: any;
  modules?: any[];
  completedLessonIds?: string[];
  isCurated?: boolean;
  autoCompleteEnabled?: boolean;
};

export default function LessonPageContent({
  lesson,
  course,
  courseHref,
  currentModule,
  currentLessonIndex,
  nextLesson,
  previousLesson,
  modules = [],
  completedLessonIds = [],
  isCurated = false,
  autoCompleteEnabled = false,
}: LessonPageContentProps) {
  // Use a softer accent color
  const accentColor = course.color || "hsl(var(--primary))";
  const [clientCompletedLessonIds, setClientCompletedLessonIds] =
    useState<string[]>(completedLessonIds);
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  useLessonCompletionToast(showCompletionToast);

  useEffect(() => {
    setClientCompletedLessonIds(completedLessonIds);
  }, [completedLessonIds]);

  useEffect(() => {
    if (!autoCompleteEnabled) return;

    let isCancelled = false;

    const markLessonCompleted = async () => {
      try {
        const response = await fetch("/api/lessons/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id }),
        });

        if (!response.ok) return;

        const data = await response.json();
        if (isCancelled) return;

        if (data?.newlyCompleted) {
          setShowCompletionToast(true);
        }

        setClientCompletedLessonIds((prev) =>
          prev.includes(lesson.id) ? prev : [...prev, lesson.id]
        );
      } catch (error) {
        console.error("Failed to complete lesson:", error);
      }
    };

    void markLessonCompleted();

    return () => {
      isCancelled = true;
    };
  }, [autoCompleteEnabled, lesson.id]);

  const content = (
    <>
      {/* FIX 7: Polished Toolbar */}
      <div className="mb-8 flex justify-between items-center bg-card/40 backdrop-blur-sm p-3 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex-1">
          {!isCurated && (
            <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50 rounded-xl">
              <Link href={`/courses/${courseHref}`} className="flex items-center text-muted-foreground hover:text-foreground">
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back to Outline
              </Link>
            </Button>
          )}
          {isCurated && (
            <div className="text-sm font-medium text-muted-foreground/80 pl-2">
              Lesson {currentLessonIndex + 1} of {currentModule.lessons.length}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-9 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
            onClick={() =>
              document.dispatchEvent(
                new CustomEvent("toggle-teaching-assistant")
              )
            }
          >
            <GraduationCap className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline font-medium">Ask Assistant</span>
          </Button>

          {/* FIX 4: Replace Notes textarea with a Sheet/Modal */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl h-9 w-9 p-0 hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
                title="Lesson Notes"
              >
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Notes</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[500px]">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <NotebookPen className="h-5 w-5 text-primary" />
                  Your Notes
                </SheetTitle>
                <SheetDescription>
                  These notes are private and saved automatically.
                </SheetDescription>
              </SheetHeader>
              <div className="h-[calc(100vh-10rem)]">
                <LessonNotes lessonId={lesson.id} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Wrapper to make the bookmark button match the new styles */}
          <div className="[&>button]:rounded-xl [&>button]:h-9 [&>button]:w-9 [&>button]:p-0 [&>button]:text-muted-foreground [&>button:hover]:text-foreground [&>button]:transition-colors">
            <LessonBookmark lessonId={lesson.id} />
          </div>
        </div>
      </div>

      {/* FIX 3: Constrain Content Width */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 text-foreground pb-6 border-b border-border/50">
          {lesson.title}
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none text-base/relaxed sm:text-lg/relaxed lesson-content tracking-[-0.01em]">
          {lesson.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                pre: ({ node, children, ...props }) => {
                  // Check if the child is a <code> element with a language class
                  const child = (children as any);
                  if (child?.type === 'code' || (child?.props?.className && typeof child?.props?.children === 'string')) {
                    const codeChild = child?.props || {};
                    const className = codeChild.className || '';
                    const lang = className.replace(/^language-/, '') || '';
                    const codeText = typeof codeChild.children === 'string'
                      ? codeChild.children
                      : String(codeChild.children || '');
                    return <AdvancedCodeBlock code={codeText.replace(/\n$/, '')} language={lang} />;
                  }
                  // Fallback for non-code pre blocks
                  return <pre className="bg-black/90 p-4 rounded-xl overflow-auto my-6 border border-white/10 shadow-lg text-sm" {...props}>{children}</pre>;
                },
                code: ({ node, className, children, ...props }) => {
                  // Block code is handled by pre above; this is only inline code
                  const isInline = !className;
                  if (!isInline) {
                    // If somehow a code block wasn't caught by pre, handle it
                    const lang = (className || '').replace(/^language-/, '');
                    const codeText = typeof children === 'string' ? children : String(children || '');
                    return <AdvancedCodeBlock code={codeText.replace(/\n$/, '')} language={lang} />;
                  }
                  return (
                    <code
                      className="bg-muted px-1.5 py-0.5 rounded-md text-foreground/90 text-[0.85em] font-medium font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }) => (
                  <a
                    className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary/80 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 my-5 space-y-2 marker:text-muted-foreground" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 my-5 space-y-2 marker:text-muted-foreground font-medium [&>li]:font-normal" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="pl-1" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-12 mb-6 tracking-tight text-foreground" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-10 mb-5 tracking-tight text-foreground" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold mt-8 mb-4 tracking-tight text-foreground" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="my-5 text-muted-foreground/90" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary/50 pl-6 italic my-6 text-muted-foreground bg-primary/5 py-3 pr-4 rounded-r-xl"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-auto my-8 rounded-xl border border-border/50 bg-card/30">
                    <table
                      className="w-full border-collapse text-sm"
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="border-b border-border/50 px-4 py-3 bg-muted/50 font-semibold text-left text-foreground"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="border-b border-border/50 px-4 py-3 text-muted-foreground/90"
                    {...props}
                  />
                ),
                img: ({ node, ...props }) => (
                  <img
                    className="max-w-full h-auto rounded-xl shadow-md my-8 border border-border/50"
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-10 border-border/50" {...props} />
                )
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          ) : (
            <p>No content available for this lesson.</p>
          )}
        </div>

        {lesson.visualization && (
          <div className="mt-16 mb-8">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">
              Interactive Visualization
            </h2>
            <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-background">
              <ScenePlayer
                block={lesson.visualization as VisualizationBlock}
              />
            </div>
          </div>
        )}

        {lesson.exercises && (
          <div className="mt-16 mb-8 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Practice Activities</h2>
            <div className="space-y-6">
              {Object.entries(
                lesson.exercises as Record<string, string>
              ).map(([key, value], index) => (
                <div key={index} className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs shrink-0">
                      {index + 1}
                    </span>
                    {key}
                  </h3>
                  <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground/90">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {String(value)}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FIX 5: Removed Redundant "Summary" section entirely */}

        {/* FIX 6: Upgraded Navigation Buttons */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center sm:items-stretch">
          {previousLesson ? (
            <Link 
              href={`/courses/${courseHref}/${previousLesson.id}`}
              className="group flex flex-col justify-center px-6 py-4 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-border transition-all w-full sm:w-[48%] relative overflow-hidden"
            >
              <div className="flex items-center text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1 group-hover:text-foreground transition-colors">
                <ChevronLeft className="mr-1 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                Previous
              </div>
              <div className="text-sm font-medium text-foreground/90 truncate pr-4">
                {previousLesson.title}
              </div>
            </Link>
          ) : (
            <div className="w-full sm:w-[48%] hidden sm:block"></div>
          )}
          
          {nextLesson ? (
            <Link 
              href={`/courses/${courseHref}/${nextLesson.id}`}
              className="group flex flex-col justify-center items-end px-6 py-4 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-[48%] relative overflow-hidden text-right"
              style={{
                background: `linear-gradient(to right, transparent, ${accentColor}08)`,
                borderColor: `${accentColor}30`
              }}
            >
              <div 
                className="flex items-center text-xs font-semibold uppercase tracking-wider mb-1 transition-colors"
                style={{ color: accentColor }}
              >
                Next
                <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="text-sm font-medium text-foreground truncate pl-4">
                {nextLesson.title}
              </div>
            </Link>
          ) : (
            <Link 
              href={`/courses/${courseHref}`}
              className="group flex flex-col justify-center items-center px-6 py-4 rounded-2xl transition-all w-full sm:w-[48%] hover:shadow-lg hover:-translate-y-0.5 text-center text-white"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`
              }}
            >
              <div className="font-bold mb-0.5 flex items-center">
                Complete Course
              </div>
              <div className="text-xs text-white/80">
                Return to outline
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Teaching Assistant is now a floating component */}
      <TeachingAssistant
        courseId={course.id}
        lessonId={lesson.id}
        moduleName={currentModule.title}
        lessonName={lesson.title}
      />
    </>
  );

  // For curated courses, render the immersive flow state layout
  if (isCurated) {
    return (
      <div className="flex-1 flex min-h-screen relative">
        <CourseSidebar
          modules={modules}
          courseHref={courseHref}
          completedLessonIds={clientCompletedLessonIds}
          accentColor={accentColor}
        />
        <div className="flex-1 overflow-auto bg-background relative flex flex-col">
          {/* Subtle top breadcrumb bar */}
          <div className="h-14 flex items-center px-8 border-b border-border/5 shrink-0 sticky top-0 bg-background/80 backdrop-blur-xl z-10 w-full" style={{ borderBottomColor: `${accentColor}10` }}>
            <div className="flex items-center text-xs font-semibold tracking-wider hover:text-foreground transition-colors" style={{ color: accentColor }}>
              <span className="uppercase">{course.title}</span>
              <ChevronRight className="w-3.5 h-3.5 mx-2 opacity-50" />
              <span className="text-muted-foreground uppercase">{currentModule.title}</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 lg:p-12 lg:max-w-4xl max-w-full mx-auto w-full">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // For custom courses, use the original container wrapper
  return <div className="container mx-auto px-4 py-8">{content}</div>;
}
