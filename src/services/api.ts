import { Subject, Question, Answer, QuestionCategory, PlatformStats } from '../types';
import { storage } from './storage';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:3001/api'
  : '/api';

export const api = {
  // Track backend availability
  isOnline: false,

  async checkHealth(): Promise<{ online: boolean; info?: any }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        this.isOnline = true;
        return { online: true, info: data };
      }
    } catch {
      this.isOnline = false;
    }
    return { online: false };
  },

  // --- SUBJECTS ---
  async getSubjects(): Promise<Subject[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/subjects`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        storage.saveSubjects(data);
        this.isOnline = true;
        return data;
      }
    } catch (e) {
      console.warn('[API] Server unreachable, using local storage for subjects', e);
      this.isOnline = false;
    }
    return storage.getSubjects();
  },

  async addSubject(name: string, code?: string): Promise<Subject> {
    try {
      const res = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code }),
      });
      if (res.ok) {
        const created = await res.json();
        storage.addSubject(name, code);
        return created;
      }
    } catch (e) {
      console.warn('[API] Server unreachable, using local storage for addSubject', e);
    }
    return storage.addSubject(name, code);
  },

  // --- QUESTIONS ---
  async getQuestions(): Promise<Question[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/questions`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        storage.saveQuestions(data);
        this.isOnline = true;
        return data;
      }
    } catch (e) {
      console.warn('[API] Server unreachable, using local storage for questions', e);
      this.isOnline = false;
    }
    return storage.getQuestions();
  },

  async addQuestion(payload: { subject: string; category: QuestionCategory; content: string }): Promise<Question> {
    try {
      const res = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        // Also keep local storage in sync
        const current = storage.getQuestions();
        storage.saveQuestions([created, ...current]);
        return created;
      }
    } catch (e) {
      console.warn('[API] Server unreachable, using local storage for addQuestion', e);
    }
    return storage.addQuestion(payload);
  },

  async toggleQuestionResolved(questionId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${questionId}/resolve`, {
        method: 'POST',
      });
      if (res.ok) {
        const updated = await res.json();
        storage.toggleQuestionResolved(questionId);
        return updated.isResolved;
      }
    } catch (e) {
      console.warn('[API] Server unreachable, using local storage for toggleQuestionResolved', e);
    }
    return storage.toggleQuestionResolved(questionId);
  },

  async toggleQuestionUpvote(questionId: string): Promise<{ upvotes: number; hasUpvoted: boolean }> {
    const localResult = storage.toggleQuestionUpvote(questionId);
    const delta = localResult.hasUpvoted ? 1 : -1;

    try {
      fetch(`${API_BASE_URL}/questions/${questionId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      }).catch(err => console.warn('[API] Background upvote sync failed', err));
    } catch (e) {
      console.warn(e);
    }

    return localResult;
  },

  // --- ANSWERS ---
  async addAnswer(questionId: string, answerData: Omit<Answer, 'id' | 'createdAt' | 'upvotes' | 'questionId'>): Promise<Answer | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData),
      });
      if (res.ok) {
        const created = await res.json();
        // Sync local storage
        storage.addAnswer(questionId, answerData);
        return created;
      }
    } catch (e) {
      console.warn('[API] Server unreachable, using local storage for addAnswer', e);
    }
    return storage.addAnswer(questionId, answerData);
  },

  async toggleAnswerUpvote(questionId: string, answerId: string): Promise<{ upvotes: number; hasUpvoted: boolean }> {
    const localResult = storage.toggleAnswerUpvote(questionId, answerId);
    const delta = localResult.hasUpvoted ? 1 : -1;

    try {
      fetch(`${API_BASE_URL}/questions/${questionId}/answers/${answerId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      }).catch(err => console.warn('[API] Background answer upvote sync failed', err));
    } catch (e) {
      console.warn(e);
    }

    return localResult;
  },

  // --- STATS ---
  async getStats(fallbackQuestions: Question[]): Promise<PlatformStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return storage.calculateStats(fallbackQuestions);
  },

  // --- RESET ---
  async resetDemoData(): Promise<void> {
    storage.resetToDemoData();
    try {
      await fetch(`${API_BASE_URL}/reset`, { method: 'POST' });
    } catch (e) {
      console.warn('[API] Server unreachable on reset', e);
    }
  },
};
