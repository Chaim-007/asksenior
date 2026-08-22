import { createApp } from '../server/app.js';

// Vercel's Node runtime can run an Express app directly when it's the
// default export — it wraps each request/response instead of calling
// app.listen(), which never runs (and shouldn't) in a serverless function.
const app = createApp();

export default app;
