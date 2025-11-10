import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.createMany({
    data: [
      { task: "Finish Next.js tutorial", completed: false, priority: "high" },
      { task: "Update GitHub profile", completed: false, priority: "medium" },
      { task: "Buy groceries", completed: true, priority: "low" },
      { task: "Work on portfolio website", completed: false, priority: "high" },
      { task: "Read Tailwind CSS documentation", completed: true, priority: "medium" },
    ],
  });
  console.log('Seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());