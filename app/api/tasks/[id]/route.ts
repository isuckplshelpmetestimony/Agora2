import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/tasks/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await req.json();
    let { title, status, assigneeId, boardId, description, dueDate, priority, sprintId } = data;
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
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        status,
        assigneeId,
        boardId,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        sprintId,
      },
      include: { assignee: true },
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 400 });
  }
}

// DELETE /api/tasks/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 400 });
  }
} 