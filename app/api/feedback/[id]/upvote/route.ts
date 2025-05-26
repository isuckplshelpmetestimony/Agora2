import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/feedback/[id]/upvote - Upvote feedback (prevent duplicate upvotes per user)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { userId } = body;
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  // Prevent duplicate upvotes
  const existing = await prisma.upvote.findUnique({
    where: { feedbackId_userId: { feedbackId: id, userId } },
  });
  if (existing) {
    return NextResponse.json({ error: 'Already upvoted' }, { status: 409 });
  }

  await prisma.upvote.create({ data: { feedbackId: id, userId } });
  // Increment upvotes count
  await prisma.feedback.update({ where: { id }, data: { upvotes: { increment: 1 } } });
  return NextResponse.json({ success: true });
} 