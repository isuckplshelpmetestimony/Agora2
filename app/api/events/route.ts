import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Helper to parse date from query
function parseDate(dateStr?: string) {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let where: any = {};
    if (date) {
      const d = parseDate(date);
      if (!d) return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
      where = {
        startTime: {
          gte: new Date(d.setHours(0, 0, 0, 0)),
          lt: new Date(d.setHours(24, 0, 0, 0)),
        },
      };
    } else if (start && end) {
      const s = parseDate(start);
      const e = parseDate(end);
      if (!s || !e) return NextResponse.json({ error: 'Invalid start or end date' }, { status: 400 });
      where = {
        startTime: {
          gte: s,
          lte: e,
        },
      };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        attendees: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, startTime, endTime, type, attendeeIds, description } = body;
    if (!title || !startTime || !endTime || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!Array.isArray(attendeeIds)) {
      return NextResponse.json({ error: 'attendeeIds must be an array' }, { status: 400 });
    }
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
        attendees: {
          connect: attendeeIds.map((id: string) => ({ id })),
        },
      },
      include: {
        attendees: {
          select: { id: true, name: true, image: true },
        },
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 