import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// GET /api/users
export async function GET() {
  const users = await prisma.user.findMany({ include: { assignedTasks: true } });
  return NextResponse.json(users);
}

// POST /api/users (signup)
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      },
      include: { assignedTasks: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create user', details: e }, { status: 400 });
  }
} 