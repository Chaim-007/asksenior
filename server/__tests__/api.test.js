import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DB_FILE = path.join(__dirname, '.test-db.json');

// Point the db module at an isolated file BEFORE importing the app,
// so tests never read or write the real demo data.
process.env.DB_FILE = TEST_DB_FILE;
process.env.ADMIN_RESET_TOKEN = 'test-secret-token';

let app;

beforeAll(async () => {
  if (fs.existsSync(TEST_DB_FILE)) fs.unlinkSync(TEST_DB_FILE);
  ({ createApp } = await import('../app.js'));
  app = createApp();
});

afterAll(() => {
  if (fs.existsSync(TEST_DB_FILE)) fs.unlinkSync(TEST_DB_FILE);
});

let createApp;

describe('GET /api/health', () => {
  it('returns ok status with metrics', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.metrics).toHaveProperty('totalQuestions');
  });
});

describe('GET /api/subjects', () => {
  it('returns the seeded list of subjects', async () => {
    const res = await request(app).get('/api/subjects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('POST /api/questions', () => {
  it('rejects a question with no content', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({ subject: 'Physics', category: 'Conceptual', content: '' });
    expect(res.status).toBe(400);
  });

  it('rejects a question with no subject', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({ subject: '', category: 'Conceptual', content: 'What is inertia?' });
    expect(res.status).toBe(400);
  });

  it('rejects content over the max length', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({ subject: 'Physics', category: 'Conceptual', content: 'a'.repeat(6000) });
    expect(res.status).toBe(400);
  });

  it('creates a question and never persists an identity field', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        subject: 'Physics',
        category: 'Conceptual',
        content: 'What is inertia?',
        // Attempt to smuggle identity fields — server must ignore these
        authorName: 'Sneaky Student',
        email: 'sneaky@example.com',
      });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('What is inertia?');
    expect(res.body).not.toHaveProperty('authorName');
    expect(res.body).not.toHaveProperty('email');
    expect(res.body.upvotes).toBe(0);
    expect(res.body.isResolved).toBe(false);
  });
});

describe('question lifecycle: resolve, answer, upvote', () => {
  let questionId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({ subject: 'Calculus', category: 'Exam Prep', content: 'How does the chain rule work?' });
    questionId = res.body.id;
  });

  it('returns 404 for a question that does not exist', async () => {
    const res = await request(app).get('/api/questions/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('toggles resolved state', async () => {
    const res1 = await request(app).post(`/api/questions/${questionId}/resolve`);
    expect(res1.body.isResolved).toBe(true);
    const res2 = await request(app).post(`/api/questions/${questionId}/resolve`);
    expect(res2.body.isResolved).toBe(false);
  });

  it('adds an answer and rejects an empty one', async () => {
    const bad = await request(app)
      .post(`/api/questions/${questionId}/answers`)
      .send({ content: '' });
    expect(bad.status).toBe(400);

    const good = await request(app)
      .post(`/api/questions/${questionId}/answers`)
      .send({ content: 'Multiply the outer derivative by the inner derivative.', authorType: 'Anonymous' });
    expect(good.status).toBe(201);
    expect(good.body.upvotes).toBe(0);
  });

  it('clamps upvote delta so a client cannot inflate votes in one call', async () => {
    const res = await request(app)
      .post(`/api/questions/${questionId}/upvote`)
      .send({ delta: 999999 });
    expect(res.status).toBe(200);
    // Regardless of the requested delta, a single call can only move the count by 1
    expect(res.body.upvotes).toBe(1);
  });

  it('never lets upvotes go negative', async () => {
    const res = await request(app)
      .post(`/api/questions/${questionId}/upvote`)
      .send({ delta: -50 });
    expect(res.status).toBe(200);
    expect(res.body.upvotes).toBe(0);
  });
});

describe('POST /api/reset', () => {
  it('is rejected without the admin token', async () => {
    const res = await request(app).post('/api/reset');
    expect(res.status).toBe(403);
  });

  it('is rejected with the wrong token', async () => {
    const res = await request(app).post('/api/reset').set('x-admin-token', 'wrong');
    expect(res.status).toBe(403);
  });

  it('succeeds with the correct admin token', async () => {
    const res = await request(app).post('/api/reset').set('x-admin-token', 'test-secret-token');
    expect(res.status).toBe(200);
  });
});
