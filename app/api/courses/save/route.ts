import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { CourseData } from "@/lib/ai-providers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, modules, topic, difficulty } = body as CourseData & {
      topic: string;
      difficulty: string;
    };

    if (!title || !topic || !difficulty) {
      return NextResponse.json(
        { error: "title, topic, and difficulty are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(modules) || modules.length === 0) {
      return NextResponse.json(
        { error: "Generated course is missing modules" },
        { status: 400 }
      );
    }

    // Ensure each module has at least one lesson
    const validatedModules = modules.map((module) => {
      if (!module.lessons || module.lessons.length === 0) {
        return {
          ...module,
          lessons: [
            {
              title: `Introduction to ${module.title}`,
              content: `<h1>Introduction to ${module.title}</h1><p>This lesson will introduce you to the key concepts of this module.</p>`,
              summary: "An introduction to the key concepts of this module.",
              exercises: {
                "Exercise 1": "Review the key concepts presented in this lesson.",
              },
            },
          ],
        };
      }
      return module;
    });

    const course = await prisma.course.create({
      data: {
        title: title,
        description: description,
        difficulty: difficulty.toUpperCase() as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        topic,
        userId: session.user.id,
        modules: {
          create: validatedModules.map((module, moduleIndex) => ({
            title: module.title,
            description: module.description,
            order: moduleIndex,
            lessons: {
              create: module.lessons.map((lesson, lessonIndex) => ({
                title: lesson.title,
                description: lesson.summary,
                content: lesson.content,
                exercises: lesson.exercises || {},
                visualization: lesson.visualization ?? Prisma.DbNull,
                order: lessonIndex,
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json({ id: course.id });
  } catch (error) {
    console.error("Error saving course:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save course",
      },
      { status: 500 }
    );
  }
}
