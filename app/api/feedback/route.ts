import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/feedback - List all feedback with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const where: any = {};
  if (category) where.category = category;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const feedback = await prisma.feedback.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });
  return NextResponse.json(feedback);
}

// POST /api/feedback - Create new feedback (requires user)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, category, status, authorId } = body;
  if (!title || !description || !category || !status || !authorId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Optionally: validate category/status enums
  const feedback = await prisma.feedback.create({
    data: {
      title,
      description,
      category,
      status,
      authorId,
    },
  });
  return NextResponse.json(feedback, { status: 201 });
} 