import { POST, GET } from './route';
import { NextRequest } from 'next/server';

function mockRequest(method: string, body?: any, url = 'http://localhost/api/sprints') {
  return {
    method,
    url,
    json: async () => body,
    headers: new Headers(),
    nextUrl: new URL(url),
  } as unknown as NextRequest;
}

describe('/api/sprints API (handler direct)', () => {
  let createdSprintId: string;

  it('should create a sprint', async () => {
    const req = mockRequest('POST', {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      velocity: 10,
      health: 'Good',
      burndownData: [],
      teamPerformance: [],
      tasks: [],
    });
    const res = await POST(req as NextRequest);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data).toHaveProperty('id');
    createdSprintId = data.id;
  });

  it('should fetch all sprints', async () => {
    const req = mockRequest('GET');
    const res = await GET(req as NextRequest);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should return error for missing fields', async () => {
    const req = mockRequest('POST', {});
    const res = await POST(req as NextRequest);
    expect(res.status).toBe(400);
  });
}); 