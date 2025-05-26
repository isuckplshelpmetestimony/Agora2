import request from 'supertest';
// You may need to adjust the import below to match your Next.js custom server or API handler
// import app from '@/app';

// For demonstration, we'll use a placeholder for the app/server
const app = 'http://localhost:3000'; // Replace with your actual app/server instance if needed

describe('Feedback API', () => {
  let feedbackId: string;
  let userId = 'cmb3zia8x0000p1ef6em1utbs'; // Jane Doe's real userId from the database

  it('should list all feedback', async () => {
    const res = await request(app).get('/api/feedback');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create feedback (success)', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: 'Test Feedback',
        description: 'Test description',
        category: 'FEATURE',
        status: 'PLANNED',
        authorId: userId,
      });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id');
    feedbackId = res.body.id;
  });

  it('should fail to create feedback (missing fields)', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ title: 'Incomplete' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('should get feedback detail (success)', async () => {
    const res = await request(app).get(`/api/feedback/${feedbackId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', feedbackId);
  });

  it('should return 404 for non-existent feedback', async () => {
    const res = await request(app).get('/api/feedback/nonexistentid');
    expect(res.status).toBe(404);
  });

  it('should upvote feedback (success)', async () => {
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .send({ userId });
    expect([200, 201]).toContain(res.status);
  });

  it('should prevent duplicate upvotes', async () => {
    await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .send({ userId });
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .send({ userId });
    expect(res.status).toBe(409);
  });

  it('should get comments (success)', async () => {
    const res = await request(app).get(`/api/feedback/${feedbackId}/comments`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should add anonymous comment (success)', async () => {
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/comments`)
      .send({ content: 'Anonymous comment' });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id');
  });

  it('should fail to add comment (missing content)', async () => {
    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/comments`)
      .send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
}); 