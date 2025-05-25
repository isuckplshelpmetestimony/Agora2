import { prisma } from '../lib/prisma';

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'janedoe@example.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
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

  console.log('Seeded user:', user);
  console.log('Seeded board:', board);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 