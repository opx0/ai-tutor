const { generateCourseContent } = require('./lib/gemini');
const { prisma } = require('./lib/prisma');
const { Prisma } = require('@prisma/client');

(async () => {
  console.log('Generating course content via Gemini...');
  const topic = 'Algorithms & Data Structures';
  const difficulty = 'Beginner';
  const details = 'IMPORTANT: Every lesson about an algorithm MUST include a visualization field with 5-10 steps. Cover: arrays, sorting (bubble sort, selection sort, insertion sort, merge sort, quick sort), searching (linear search, binary search), stacks, queues, linked lists, trees (BST, traversals), graphs (BFS, DFS, Dijkstra), dynamic programming (fibonacci, knapsack), and recursion. Each algorithm lesson MUST have a step-by-step visualization showing the data structure changing state with array, graph, grid, variable, and log elements.';

  const courseData = await generateCourseContent(topic, difficulty, details);
  console.log('Generated:', courseData.title, '-', courseData.modules.length, 'modules');

  let vizCount = 0;
  let totalLessons = 0;
  courseData.modules.forEach(m => {
    m.lessons.forEach(l => {
      totalLessons++;
      if (l.visualization) vizCount++;
    });
  });
  console.log('Lessons with visualization:', vizCount, '/', totalLessons);

  const user = await prisma.user.findFirst();
  if (!user) { console.log('No user found!'); return; }

  const course = await prisma.course.create({
    data: {
      title: courseData.title,
      description: courseData.description,
      difficulty,
      topic,
      userId: user.id,
      modules: {
        create: courseData.modules.map((mod, mi) => ({
          title: mod.title,
          description: mod.description,
          order: mi,
          lessons: {
            create: mod.lessons.map((les, li) => ({
              title: les.title,
              description: les.summary,
              content: les.content,
              exercises: les.exercises || {},
              visualization: les.visualization || Prisma.DbNull,
              order: li,
            })),
          },
        })),
      },
    },
  });

  console.log('Course created! ID:', course.id);
  console.log('URL: http://localhost:3000/courses/' + course.id);
  await prisma.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
