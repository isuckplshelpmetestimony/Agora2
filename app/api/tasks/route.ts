import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tasks?status=TODO|IN_PROGRESS|REVIEW|DONE
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const where = status ? { status } : {};
  try {
    const tasks = await prisma.task.findMany({
      where,
      include: { assignee: true },
      orderBy: { dueDate: 'asc' },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const task = await prisma.task.create({
      data,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 400 });
  }
}

// PUT /api/tasks/:id and DELETE /api/tasks/:id are handled in a dynamic route file: [id]/route.ts 