import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/feedback-comments - List all non-expired comments
export async function GET() {
  const now = new Date();
  const comments = await prisma.feedbackCommentSimple.findMany({
    where: { expiresAt: { gt: now } },
    orderBy: { createdAt: 'desc' },
    include: {
      aboutUser: { select: { id: true, name: true, image: true } },
    },
  });
  return NextResponse.json(comments);
}

// POST /api/feedback-comments - Add a new anonymous comment
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, aboutUserId } = body;
  if (!content || !aboutUserId) {
    return NextResponse.json({ error: 'Missing content or aboutUserId' }, { status: 400 });
  }
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const comment = await prisma.feedbackCommentSimple.create({
    data: {
      content,
      aboutUserId,
      createdAt: now,
      expiresAt,
    },
    include: {
      aboutUser: { select: { id: true, name: true, image: true } },
    },
  });
  return NextResponse.json(comment, { status: 201 });
} 