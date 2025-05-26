import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendees: {
          select: { id: true, name: true, image: true },
        },
      },
    });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, startTime, endTime, type, attendeeIds, description } = body;
    if (!title || !startTime || !endTime || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!Array.isArray(attendeeIds)) {
      return NextResponse.json({ error: 'attendeeIds must be an array' }, { status: 400 });
    }
    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
        attendees: {
          set: attendeeIds.map((id: string) => ({ id })),
        },
      },
      include: {
        attendees: {
          select: { id: true, name: true, image: true },
        },
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 