import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      select: { id: true, name: true }
    });
    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
  }
} 