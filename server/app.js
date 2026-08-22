import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const MAX_CONTENT_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS: restrict to configured origin(s) in production, allow all only in dev
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : (process.env.NODE_ENV === 'production' ? false : '*'),
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '100kb' }));

  // Rate limiting on write endpoints — prevents spam/DoS on questions, answers, votes
  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use('/api', (req, res, next) => {
    if (req.method === 'GET') return next();
    return writeLimiter(req, res, next);
  });

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // --- helpers ---
  const isValidString = (val, maxLen) =>
    typeof val === 'string' && val.trim().length > 0 && val.trim().length <= maxLen;

  const clampDelta = (raw) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return 1;
    // Only ever a single up/down vote per request — blocks vote-stuffing via a huge delta
    return n >= 0 ? 1 : -1;
  };

  // --- HEALTH & STATUS ---
  app.get('/api/health', (req, res) => {
    const stats = db.getStats();
    res.json({
      status: 'ok',
      service: 'AskSenior REST API',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      metrics: {
        totalQuestions: stats.totalQuestions,
        totalAnswers: stats.totalAnswers,
        totalResolved: stats.totalResolved,
      },
    });
  });

  // --- SUBJECTS ---
  app.get('/api/subjects', (req, res) => {
    res.json(db.getSubjects());
  });

  app.post('/api/subjects', (req, res) => {
    const { name, code } = req.body;
    if (!isValidString(name, MAX_NAME_LENGTH)) {
      return res.status(400).json({ error: 'Subject name is required and must be under 100 characters' });
    }
    const created = db.addSubject(name.trim(), code);
    res.status(201).json(created);
  });

  // --- QUESTIONS ---
  app.get('/api/questions', (req, res) => {
    const { subject, category, status, search, sortBy } = req.query;
    let questions = db.getQuestions();

    if (subject && subject !== 'All') {
      questions = questions.filter(q => q.subject.toLowerCase() === String(subject).toLowerCase());
    }
    if (category && category !== 'All') {
      questions = questions.filter(q => q.category.toLowerCase() === String(category).toLowerCase());
    }
    if (status === 'open') {
      questions = questions.filter(q => !q.isResolved);
    } else if (status === 'resolved') {
      questions = questions.filter(q => q.isResolved);
    }
    if (search && String(search).trim()) {
      const query = String(search).toLowerCase().trim();
      questions = questions.filter(q => {
        const matchContent = q.content.toLowerCase().includes(query);
        const matchSubject = q.subject.toLowerCase().includes(query);
        const matchCategory = q.category.toLowerCase().includes(query);
        const matchAnswers = q.answers.some(a =>
          a.content.toLowerCase().includes(query) ||
          a.authorName?.toLowerCase().includes(query)
        );
        return matchContent || matchSubject || matchCategory || matchAnswers;
      });
    }

    if (sortBy === 'newest') {
      questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'answers') {
      questions.sort((a, b) => b.answers.length - a.answers.length);
    } else {
      questions.sort((a, b) => b.upvotes - a.upvotes);
    }

    res.json(questions);
  });

  app.get('/api/questions/:id', (req, res) => {
    const question = db.getQuestionById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  });

  app.post('/api/questions', (req, res) => {
    const { subject, category, content } = req.body;
    if (!isValidString(subject, MAX_NAME_LENGTH)) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!isValidString(content, MAX_CONTENT_LENGTH)) {
      return res.status(400).json({ error: `Question content is required and must be under ${MAX_CONTENT_LENGTH} characters` });
    }

    // Anonymity enforcement: only subject/category/content are ever persisted here —
    // no identity field is accepted from the client for questions.
    const created = db.addQuestion({ subject: subject.trim(), category, content: content.trim() });
    res.status(201).json(created);
  });

  app.post('/api/questions/:id/resolve', (req, res) => {
    const updated = db.toggleResolveQuestion(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    res.json(updated);
  });

  app.post('/api/questions/:id/upvote', (req, res) => {
    const delta = clampDelta(req.body.delta);
    const updated = db.upvoteQuestion(req.params.id, delta);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    res.json(updated);
  });

  // --- ANSWERS ---
  app.post('/api/questions/:id/answers', (req, res) => {
    const { content, authorType, authorName, academicInfo, isSenior, explanationLevel } = req.body;
    if (!isValidString(content, MAX_CONTENT_LENGTH)) {
      return res.status(400).json({ error: `Answer content is required and must be under ${MAX_CONTENT_LENGTH} characters` });
    }
    if (authorName !== undefined && authorName !== null && !isValidString(authorName, MAX_NAME_LENGTH)) {
      return res.status(400).json({ error: 'Author name must be under 100 characters' });
    }

    const created = db.addAnswer(req.params.id, {
      content,
      authorType,
      authorName,
      academicInfo,
      isSenior,
      explanationLevel,
    });

    if (!created) return res.status(404).json({ error: 'Question not found' });
    res.status(201).json(created);
  });

  app.post('/api/questions/:id/answers/:answerId/upvote', (req, res) => {
    const delta = clampDelta(req.body.delta);
    const updated = db.upvoteAnswer(req.params.id, req.params.answerId, delta);
    if (!updated) return res.status(404).json({ error: 'Answer not found' });
    res.json(updated);
  });

  // --- STATS ---
  app.get('/api/stats', (req, res) => {
    res.json(db.getStats());
  });

  // --- RESET (protected: demo-reset token required) ---
  app.post('/api/reset', (req, res) => {
    const token = req.get('x-admin-token');
    const expected = process.env.ADMIN_RESET_TOKEN;
    if (!expected || token !== expected) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const data = db.reset();
    res.json({ message: 'Database reset to initial demo seeds', data });
  });

  // --- SPA FALLBACK ---
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    res.status(404).send('Not Found');
  });

  return app;
}
