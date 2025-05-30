import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sprint = await prisma.sprint.findUnique({ where: { id: params.id }, select: { burndownData: true } });
  if (!sprint) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(sprint.burndownData);
} 