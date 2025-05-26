import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function computeSprintMetrics(sprint: any) {
  const tasks = sprint.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === 'DONE').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const velocity = tasks.reduce((sum: number, t: any) => sum + (t.storyPoints || 0), 0);

  // Burndown: count remaining tasks per day
  const burndown = [];
  if (totalTasks > 0) {
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    for (let i = 0; i <= days; i++) {
      const day = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const completed = tasks.filter((t: any) => t.status === 'DONE' && t.dueDate && new Date(t.dueDate) <= day).length;
      burndown.push({ day: i + 1, remaining: totalTasks - completed });
    }
  }

  // Team performance: points per user
  const teamMap: Record<string, any> = {};
  for (const t of tasks) {
    if (!t.assigneeId) continue;
    if (!teamMap[t.assigneeId]) {
      teamMap[t.assigneeId] = { id: t.assigneeId, name: t.assignee?.name || '', points: 0, tasks: 0, completed: 0 };
    }
    teamMap[t.assigneeId].points += t.storyPoints || 0;
    teamMap[t.assigneeId].tasks += 1;
    if (t.status === 'DONE') teamMap[t.assigneeId].completed += 1;
  }
  const teamPerformance = Object.values(teamMap);

  return {
    ...sprint,
    progress,
    velocity,
    burndown,
    teamPerformance,
  };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sprint = await prisma.sprint.findUnique({ where: { id: params.id }, include: { tasks: { include: { assignee: true } } } });
  if (!sprint) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(computeSprintMetrics(sprint));
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  try {
    const sprint = await prisma.sprint.update({
      where: { id: params.id },
      data,
      include: { tasks: true },
    });
    return NextResponse.json(sprint);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update sprint', details: e }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.sprint.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete sprint', details: e }, { status: 400 });
  }
} 