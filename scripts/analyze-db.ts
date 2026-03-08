import { prisma } from '../lib/prisma';

async function main() {
  // 1. All courses
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, userId: true, isPublic: true, _count: { select: { modules: true } } },
    orderBy: { createdAt: 'desc' },
  });
  console.log('=== COURSES ===');
  courses.forEach(c => {
    console.log(`  ${c.id} | "${c.title}" | user=${c.userId} | public=${c.isPublic} | modules=${c._count.modules}`);
  });

  // 2. Modules and lessons for the algorithms course
  const algoCourse = courses.find(c => c.title.includes('Algorithms'));
  if (algoCourse) {
    const modules = await prisma.module.findMany({
      where: { courseId: algoCourse.id },
      include: { lessons: { select: { id: true, title: true, visualization: true, content: true }, orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    console.log(`\n=== MODULES for "${algoCourse.title}" ===`);
    modules.forEach(m => {
      console.log(`  Module: ${m.title} (${m.lessons.length} lessons)`);
      m.lessons.forEach(l => {
        const viz = l.visualization as any;
        const hasContent = !!l.content && l.content.length > 20;
        const vizInfo = viz ? `${viz.type}, ${viz.steps?.length || 0} steps` : 'null';
        console.log(`    ${l.title} | content=${hasContent ? l.content!.length + 'chars' : 'EMPTY'} | viz=${vizInfo}`);
      });
    });
  }

  // 3. Check schema alignment - are there orphaned records?
  const orphanModules = await prisma.module.findMany({
    where: { course: null as any },
    select: { id: true },
  }).catch(() => []);
  console.log('\n=== INTEGRITY ===');
  console.log('Orphan modules:', orphanModules.length);

  // 4. Check users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, _count: { select: { courses: true } } },
  });
  console.log('\n=== USERS ===');
  users.forEach(u => console.log(`  ${u.id} | ${u.email} | courses=${u._count.courses}`));

  // 5. Check if visualization column exists in DB
  const rawCheck = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Lesson' ORDER BY ordinal_position;`;
  console.log('\n=== LESSON TABLE COLUMNS ===');
  (rawCheck as any[]).forEach(col => console.log(`  ${col.column_name}: ${col.data_type}`));

  await prisma.$disconnect();
}

main().catch(console.error);
