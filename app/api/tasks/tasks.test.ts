import * as handlers from './route';
import * as idHandlers from './[id]/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

function mockRequest(method: string, body?: any, url = 'http://localhost/api/tasks') {
  return {
    method,
    url,
    json: async () => body,
    headers: new Headers(),
    nextUrl: new URL(url),
  } as unknown as NextRequest;
}

describe('Tasks API', () => {
  let createdTaskId: string;
  let userId: string;
  let boardId: string;
  const sprintId = 'sprint-1';

  beforeAll(async () => {
    // Fetch the seeded user and board
    const user = await prisma.user.findFirst({ where: { email: 'janedoe@example.com' } });
    const board = await prisma.board.findFirst({ where: { name: 'Demo Board' } });
    userId = user?.id || '';
    boardId = board?.id || '';
  });

  const validTask = () => ({
    title: 'Test Task',
    description: 'Test Desc',
    status: 'TODO',
    dueDate: new Date().toISOString(),
    boardId,
    assigneeId: userId,
    sprintId,
    storyPoints: 3,
    priority: 'HIGH',
  });

  it('GET returns array', async () => {
    const res = await handlers.GET();
    const data = await res.json();
    expect(res.status || 200).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST creates with valid', async () => {
    const req = mockRequest('POST', validTask());
    const res = await handlers.POST(req as NextRequest);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data).toHaveProperty('id');
    createdTaskId = data.id;
  });

  it('POST errors with missing fields', async () => {
    const req = mockRequest('POST', {});
    const res = await handlers.POST(req as NextRequest);
    expect(res.status).toBe(400);
  });

  it('PUT updates with valid', async () => {
    if (!createdTaskId) return;
    const req = mockRequest('PUT', { ...validTask(), title: 'Updated Task' }, `http://localhost/api/tasks/${createdTaskId}`);
    const res = await idHandlers.PUT(req as NextRequest, { params: { id: createdTaskId } });
    const data = await res.json();
    expect(res.status || 200).toBe(200);
    expect(data.title).toBe('Updated Task');
  });

  it('PUT errors with missing fields', async () => {
    if (!createdTaskId) return;
    const req = mockRequest('PUT', { title: '' }, `http://localhost/api/tasks/${createdTaskId}`);
    const res = await idHandlers.PUT(req as NextRequest, { params: { id: createdTaskId } });
    expect(res.status).toBe(400);
  });

  it('DELETE deletes with valid id', async () => {
    if (!createdTaskId) return;
    const req = mockRequest('DELETE', undefined, `http://localhost/api/tasks/${createdTaskId}`);
    const res = await idHandlers.DELETE(req as NextRequest, { params: { id: createdTaskId } });
    const data = await res.json();
    expect(res.status || 200).toBe(200);
    expect(data.success).toBe(true);
  });

  it('DELETE errors with invalid id', async () => {
    const req = mockRequest('DELETE', undefined, 'http://localhost/api/tasks/invalid-id');
    const res = await idHandlers.DELETE(req as NextRequest, { params: { id: 'invalid-id' } });
    expect(res.status).toBe(400);
  });
}); 