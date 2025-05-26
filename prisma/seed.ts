import { prisma } from '../lib/prisma';

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'janedoe@example.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      role: 'Developer',
    },
  });

  // Create another user
  const user2 = await prisma.user.upsert({
    where: { email: 'johnsmith@example.com' },
    update: {},
    create: {
      name: 'John Smith',
      email: 'johnsmith@example.com',
      role: 'Product Manager',
    },
  });

  // Create a board
  const board = await prisma.board.upsert({
    where: { name: 'Demo Board' },
    update: {},
    create: {
      name: 'Demo Board',
    },
  });

  // Create a sprint
  const sprint = await prisma.sprint.upsert({
    where: { id: 'sprint-1' },
    update: {},
    create: {
      id: 'sprint-1',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      velocity: 42,
      health: 'Good',
      burndownData: [
        { day: 1, remaining: 24 },
        { day: 2, remaining: 20 },
        { day: 3, remaining: 16 },
        { day: 4, remaining: 12 },
        { day: 5, remaining: 8 },
        { day: 6, remaining: 4 },
        { day: 7, remaining: 0 },
      ],
      teamPerformance: [
        { name: 'Jane Doe', role: 'Developer', tasks: 5, completed: 4, points: 12 },
        { name: 'John Smith', role: 'Product Manager', tasks: 4, completed: 2, points: 8 },
      ],
    },
  });

  // Create tasks for the sprint
  await prisma.task.createMany({
    data: [
      {
        title: 'Implement login',
        description: 'Add login functionality',
        status: 'DONE',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        boardId: board.id,
        assigneeId: user.id,
        sprintId: sprint.id,
        storyPoints: 3,
        priority: 'HIGH',
      },
      {
        title: 'Set up database',
        description: 'Initialize Postgres and Prisma',
        status: 'DONE',
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        boardId: board.id,
        assigneeId: user2.id,
        sprintId: sprint.id,
        storyPoints: 5,
        priority: 'MEDIUM',
      },
      {
        title: 'Create Sprint Snap UI',
        description: 'Build the Sprint Snap dashboard',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        boardId: board.id,
        assigneeId: user.id,
        sprintId: sprint.id,
        storyPoints: 8,
        priority: 'HIGH',
      },
      {
        title: 'Write API tests',
        description: 'Add tests for sprint endpoints',
        status: 'TODO',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        boardId: board.id,
        assigneeId: user2.id,
        sprintId: sprint.id,
        storyPoints: 2,
        priority: 'LOW',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeded users:', user, user2);
  console.log('Seeded board:', board);
  console.log('Seeded sprint:', sprint);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 