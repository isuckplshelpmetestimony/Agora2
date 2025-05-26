import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tasks?status=TODO|IN_PROGRESS|REVIEW|DONE&boardId=...&groupByStatus=true
export async function GET() {
  const tasks = await prisma.task.findMany({ include: { assignee: true, sprint: true } });
  return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
        boardId: data.boardId,
        assigneeId: data.assigneeId,
        sprintId: data.sprintId,
        storyPoints: data.storyPoints,
        priority: data.priority,
      },
      include: { assignee: true, sprint: true },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create task', details: e }, { status: 400 });
  }
}

// PUT /api/tasks/:id and DELETE /api/tasks/:id are handled in a dynamic route file: [id]/route.ts 