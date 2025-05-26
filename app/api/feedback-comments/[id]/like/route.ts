import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/feedback-comments/[id]/like - Like a comment (optionally prevent duplicate likes per user)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { userId } = body;
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  // Prevent duplicate likes
  const existing = await prisma.feedbackCommentLike.findUnique({
    where: { commentId_userId: { commentId: id, userId } },
  });
  if (existing) {
    return NextResponse.json({ error: 'Already liked' }, { status: 409 });
  }

  // Create like and increment likeCount
  await prisma.feedbackCommentLike.create({ data: { commentId: id, userId } });
  await prisma.feedbackCommentSimple.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
} 