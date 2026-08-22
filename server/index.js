import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

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
  const subjects = db.getSubjects();
  res.json(subjects);
});

app.post('/api/subjects', (req, res) => {
  const { name, code } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Subject name is required' });
  }
  const created = db.addSubject(name, code);
  res.status(201).json(created);
});

// --- QUESTIONS ---
app.get('/api/questions', (req, res) => {
  const { subject, category, status, search, sortBy } = req.query;
  let questions = db.getQuestions();

  if (subject && subject !== 'All') {
    questions = questions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }

  if (category && category !== 'All') {
    questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  if (status === 'open') {
    questions = questions.filter(q => !q.isResolved);
  } else if (status === 'resolved') {
    questions = questions.filter(q => q.isResolved);
  }

  if (search && search.trim()) {
    const query = search.toLowerCase().trim();
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
    // default: most upvoted
    questions.sort((a, b) => b.upvotes - a.upvotes);
  }

  res.json(questions);
});

app.get('/api/questions/:id', (req, res) => {
  const question = db.getQuestionById(req.params.id);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(question);
});

app.post('/api/questions', (req, res) => {
  const { subject, category, content } = req.body;
  if (!subject || !subject.trim()) {
    return res.status(400).json({ error: 'Subject is required' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Question content is required' });
  }

  // Anonymity enforcement: reject any payload attempting to store asker identity
  const created = db.addQuestion({ subject, category, content });
  res.status(201).json(created);
});

app.post('/api/questions/:id/resolve', (req, res) => {
  const updated = db.toggleResolveQuestion(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(updated);
});

app.post('/api/questions/:id/upvote', (req, res) => {
  const delta = req.body.delta !== undefined ? Number(req.body.delta) : 1;
  const updated = db.upvoteQuestion(req.params.id, delta);
  if (!updated) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(updated);
});

// --- ANSWERS ---
app.post('/api/questions/:id/answers', (req, res) => {
  const { content, authorType, authorName, academicInfo, isSenior, explanationLevel } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Answer explanation content is required' });
  }

  const created = db.addAnswer(req.params.id, {
    content,
    authorType,
    authorName,
    academicInfo,
    isSenior,
    explanationLevel,
  });

  if (!created) {
    return res.status(404).json({ error: 'Question not found' });
  }

  res.status(201).json(created);
});

app.post('/api/questions/:id/answers/:answerId/upvote', (req, res) => {
  const delta = req.body.delta !== undefined ? Number(req.body.delta) : 1;
  const updated = db.upvoteAnswer(req.params.id, req.params.answerId, delta);
  if (!updated) {
    return res.status(404).json({ error: 'Answer not found' });
  }
  res.json(updated);
});

// --- STATS ---
app.get('/api/stats', (req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

// --- RESET ---
app.post('/api/reset', (req, res) => {
  const data = db.reset();
  res.json({ message: 'Database reset to initial demo seeds', data });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 AskSenior REST API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Questions API: http://localhost:${PORT}/api/questions`);
  console.log(`=================================================\n`);
});
