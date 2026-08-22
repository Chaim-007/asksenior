import { createApp } from './app.js';

const app = createApp();
const PORT = process.env.PORT || 3001;

if (!process.env.ADMIN_RESET_TOKEN) {
  console.warn('⚠️  ADMIN_RESET_TOKEN is not set — /api/reset will be disabled until it is.');
}

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 AskSenior REST API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Questions API: http://localhost:${PORT}/api/questions`);
  console.log(`=================================================\n`);
});
