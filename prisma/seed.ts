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

  // Create feedback items
  const feedback1 = await prisma.feedback.create({
    data: {
      title: 'Improve task filtering options',
      description: 'It would be helpful to have more advanced filtering options for tasks, such as filtering by multiple tags or assignees.',
      category: 'FEATURE',
      status: 'UNDER_REVIEW',
      upvotes: 12,
      authorId: user.id,
    },
  });
  const feedback2 = await prisma.feedback.create({
    data: {
      title: 'Add dark mode support',
      description: 'Would love to have a dark mode option for the entire application to reduce eye strain during night work sessions.',
      category: 'FEATURE',
      status: 'PLANNED',
      upvotes: 24,
      authorId: user2.id,
    },
  });
  const feedback3 = await prisma.feedback.create({
    data: {
      title: 'Calendar sync with Google Calendar',
      description: 'It would be great if we could sync our SpeedSync calendar with Google Calendar to avoid scheduling conflicts.',
      category: 'INTEGRATION',
      status: 'UNDER_REVIEW',
      upvotes: 18,
      authorId: user2.id,
    },
  });
  const feedback4 = await prisma.feedback.create({
    data: {
      title: 'Mobile app for on-the-go access',
      description: 'A mobile app would make it easier to check tasks and updates when away from the computer.',
      category: 'FEATURE',
      status: 'PLANNED',
      upvotes: 32,
      authorId: user.id,
    },
  });
  const feedback5 = await prisma.feedback.create({
    data: {
      title: 'Fix lag when dragging tasks in QuickFlow',
      description: 'There\'s a noticeable lag when dragging tasks between columns in QuickFlow, especially with many tasks.',
      category: 'BUG',
      status: 'IN_PROGRESS',
      upvotes: 8,
      authorId: user.id,
    },
  });

  // Add anonymous comments to feedback items
  await prisma.feedbackComment.createMany({
    data: [
      { feedbackId: feedback1.id, content: 'This would make my workflow so much easier!' },
      { feedbackId: feedback1.id, content: 'Filtering by assignee is a must.' },
      { feedbackId: feedback2.id, content: 'Dark mode would be amazing for late night work.' },
      { feedbackId: feedback2.id, content: 'Please add this soon!' },
      { feedbackId: feedback3.id, content: 'Google Calendar sync would help avoid double bookings.' },
      { feedbackId: feedback4.id, content: 'A mobile app is essential for remote teams.' },
      { feedbackId: feedback4.id, content: 'Would love push notifications too.' },
      { feedbackId: feedback5.id, content: 'The lag is really noticeable with lots of tasks.' },
      { feedbackId: feedback5.id, content: 'Hope this gets fixed soon!' },
    ],
  });

  console.log('Seeded users:', user, user2);
  console.log('Seeded board:', board);
  console.log('Seeded sprint:', sprint);
  console.log('Seeded feedback and comments.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 