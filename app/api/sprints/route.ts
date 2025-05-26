import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function computeSprintMetrics(sprint) {
  const tasks = sprint.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const velocity = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);

  // Burndown: count remaining tasks per day
  const burndown = [];
  if (totalTasks > 0) {
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    for (let i = 0; i <= days; i++) {
      const day = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const completed = tasks.filter(t => t.status === 'DONE' && t.dueDate && new Date(t.dueDate) <= day).length;
      burndown.push({ day: i + 1, remaining: totalTasks - completed });
    }
  }

  // Team performance: points per user
  const teamMap = {};
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

export async function GET() {
  const sprints = await prisma.sprint.findMany({ include: { tasks: { include: { assignee: true } } } });
  const computed = sprints.map(computeSprintMetrics);
  return NextResponse.json(computed);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const sprint = await prisma.sprint.create({
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        velocity: data.velocity,
        health: data.health,
        burndownData: data.burndownData,
        teamPerformance: data.teamPerformance,
        tasks: data.tasks ? { connect: data.tasks.map((id: string) => ({ id })) } : undefined,
      },
      include: { tasks: true },
    });
    return NextResponse.json(sprint, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create sprint', details: e }, { status: 400 });
  }
} 