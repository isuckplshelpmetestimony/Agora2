import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/feedback/[id]/comments - List all comments for feedback
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const comments = await prisma.feedbackComment.findMany({
    where: { feedbackId: id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, content: true, createdAt: true }, // anonymous
  });
  return NextResponse.json(comments);
}

// POST /api/feedback/[id]/comments - Add anonymous comment
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { content } = body;
  if (!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  const comment = await prisma.feedbackComment.create({
    data: { feedbackId: id, content },
  });
  return NextResponse.json(comment, { status: 201 });
} 