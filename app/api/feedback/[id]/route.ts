import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/feedback/[id] - Get single feedback with comments
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, content: true, createdAt: true }, // anonymous
      },
      _count: { select: { comments: true } },
    },
  });
  if (!feedback) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(feedback);
}

// PUT /api/feedback/[id] - Update feedback (restrict to author/admin)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  // TODO: Add auth check for author/admin
  const { title, description, category, status } = body;
  const feedback = await prisma.feedback.update({
    where: { id },
    data: { title, description, category, status },
  });
  return NextResponse.json(feedback);
}

// DELETE /api/feedback/[id] - Delete feedback (restrict to author/admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  // TODO: Add auth check for author/admin
  await prisma.feedback.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 