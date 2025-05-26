import request from 'supertest';
// You may need to adjust the import below to match your Next.js custom server or API handler
// import app from '@/app';

// For demonstration, we'll use a placeholder for the app/server
const app = 'http://localhost:3000'; // Replace with your actual app/server instance if needed

describe('Feedback API', () => {
  let feedbackId: string;
  const userId = 'test-user-id';

  it('should create feedback', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: 'Test Feedback',
        description: 'Test description',
        category: 'FEATURE',
        status: 'PLANNED',
        authorId: userId,
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Feedback');
    feedbackId = res.body.id;
  });

  it('should fail to create feedback with missing fields', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ title: 'Missing fields' });
    expect(res.status).toBe(400);
  });

  it('should list feedback', async () => {
    const res = await request(app).get('/api/feedback');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get feedback detail', async () => {
    const res = await request(app).get(`/api/feedback/${feedbackId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(feedbackId);
  });

  it('should upvote feedback', async () => {
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .send({ userId });
    expect(res.status).toBe(200);
  });

  it('should prevent duplicate upvotes', async () => {
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .send({ userId });
    expect(res.status).toBe(409);
  });

  it('should add anonymous comment', async () => {
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/comments`)
      .send({ content: 'Anonymous comment' });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Anonymous comment');
  });

  it('should fail to add comment with missing content', async () => {
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/comments`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('should list comments', async () => {
    const res = await request(app).get(`/api/feedback/${feedbackId}/comments`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 