import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tasks?status=TODO|IN_PROGRESS|REVIEW|DONE&boardId=...&groupByStatus=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const boardId = searchParams.get('boardId');
  const groupByStatus = searchParams.get('groupByStatus') === 'true';
  const where: any = {};
  if (status) where.status = status;
  if (boardId) where.boardId = boardId;

  try {
    const tasks = await prisma.task.findMany({
      where,
      include: { assignee: true },
      orderBy: { dueDate: 'asc' },
    });
    if (groupByStatus) {
      // Group tasks by status
      const grouped: Record<string, any[]> = {};
      for (const task of tasks) {
        if (!grouped[task.status]) grouped[task.status] = [];
        grouped[task.status].push(task);
      }
      return NextResponse.json(grouped);
    }
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let { title, status, assigneeId, boardId, description, dueDate, priority } = data;
    // Validate required fields
    if (!title || !status || !assigneeId || !boardId) {
      return NextResponse.json({ error: 'Missing required fields: title, status, assigneeId, boardId' }, { status: 400 });
    }
    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (priority) {
      priority = priority.toUpperCase();
      if (!validPriorities.includes(priority)) {
        return NextResponse.json({ error: 'Invalid priority. Must be LOW, MEDIUM, or HIGH.' }, { status: 400 });
      }
    } else {
      priority = 'MEDIUM';
    }
    // Check if assignee exists
    const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
    if (!assignee) {
      return NextResponse.json({ error: 'Assignee not found' }, { status: 404 });
    }
    // Check if board exists
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    const task = await prisma.task.create({
      data: {
        title,
        status,
        assigneeId,
        boardId,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      },
      include: { assignee: true },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 400 });
  }
}

// PUT /api/tasks/:id and DELETE /api/tasks/:id are handled in a dynamic route file: [id]/route.ts 