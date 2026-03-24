const fs = require('fs');
const file = '/home/abhi/Project/ai-tutor/app/courses/[id]/[lessonId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  // Mark lesson as completed + update progress (requires auth)
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      let isNewlyCompleted = false;
      const existingCompletion = await prisma.lessonCompletion.findUnique({
        where: { lessonId_userId: { lessonId: lesson.id, userId } },
      });

      if (!existingCompletion) {
        isNewlyCompleted = true;
        await prisma.lessonCompletion.create({
          data: { id: \`\${lesson.id}_\${userId}\`, lessonId: lesson.id, userId }
        });
      }

      const totalLessons = modules.reduce(
        (acc, mod) => acc + mod.lessons.length,
        0
      );
      const completedLessons = await prisma.lessonCompletion.count({
        where: {
          userId,
          Lesson: { module: { courseId: course.id } },
        },
      });

      const progress = Math.round((completedLessons / totalLessons) * 100);

      await prisma.userProgress.upsert({
        where: { courseId_userId: { courseId: course.id, userId } },
        update: { progress, lastLessonId: lesson.id },
        create: {
          courseId: course.id,
          userId,
          progress,
          lastLessonId: lesson.id,
        },
      });

      // Auto-enqueue for spaced review (if not already scheduled)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      await prisma.spacedReview.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        update: {}, // Don't overwrite existing review schedule
        create: {
          userId,
          lessonId: lesson.id,
          nextReviewAt: tomorrow,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
        },
      });`;

const replacement = `  // Mark lesson as completed + update progress (requires auth)
  let isNewlyCompleted = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      const userId = user.id;
      const existingCompletion = await prisma.lessonCompletion.findUnique({
        where: { lessonId_userId: { lessonId: lesson.id, userId } },
      });

      if (!existingCompletion) {
        isNewlyCompleted = true;
        await prisma.lessonCompletion.create({
          data: { id: \`\${lesson.id}_\${userId}\`, lessonId: lesson.id, userId }
        });
      }

      const totalLessons = modules.reduce(
        (acc, mod) => acc + mod.lessons.length,
        0
      );
      const completedLessons = await prisma.lessonCompletion.count({
        where: {
          userId,
          Lesson: { module: { courseId: course.id } },
        },
      });

      const progress = Math.round((completedLessons / totalLessons) * 100);

      await prisma.userProgress.upsert({
        where: { courseId_userId: { courseId: course.id, userId } },
        update: { progress, lastLessonId: lesson.id },
        create: {
          courseId: course.id,
          userId,
          progress,
          lastLessonId: lesson.id,
        },
      });

      // Auto-enqueue for spaced review (if not already scheduled)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      await prisma.spacedReview.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        update: {}, // Don't overwrite existing review schedule
        create: {
          userId,
          lessonId: lesson.id,
          nextReviewAt: tomorrow,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
        },
      });
    }
  }`;

content = content.replace(targetStr, replacement);
fs.writeFileSync(file, content);
