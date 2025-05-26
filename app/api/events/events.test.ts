import { POST, GET } from './route';
import { NextRequest } from 'next/server';

function mockRequest(method: string, body?: any, url = 'http://localhost/api/events') {
  return {
    method,
    url,
    json: async () => body,
    headers: new Headers(),
    nextUrl: new URL(url),
  } as unknown as NextRequest;
}

describe('/api/events API (handler direct)', () => {
  let createdEventId: string;

  it('should create an event', async () => {
    const req = mockRequest('POST', {
      title: 'Test Event',
      description: 'Test Description',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      type: 'ONE_TIME',
      attendeeIds: [],
    });
    const res = await POST(req as NextRequest);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data).toHaveProperty('id');
    createdEventId = data.id;
  });

  it('should fetch events', async () => {
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