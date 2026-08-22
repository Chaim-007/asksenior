import { Subject, Question, Answer, QuestionCategory, PlatformStats } from '../types';
import { INITIAL_SUBJECTS, INITIAL_QUESTIONS } from './seedData';

const STORAGE_KEYS = {
  SUBJECTS: 'asksenior_subjects_v1',
  QUESTIONS: 'asksenior_questions_v1',
  VOTED_QUESTIONS: 'asksenior_voted_questions_v1',
  VOTED_ANSWERS: 'asksenior_voted_answers_v1',
  THEME: 'asksenior_theme_v1',
};

// Colors palette for custom subjects
const SUBJECT_COLORS = ['indigo', 'blue', 'emerald', 'amber', 'rose', 'purple', 'cyan', 'teal', 'orange'];

export const storage = {
  // --- SUBJECTS ---
  getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (!data) {
        this.saveSubjects(INITIAL_SUBJECTS);
        return INITIAL_SUBJECTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading subjects from localStorage', e);
      return INITIAL_SUBJECTS;
    }
  },

  saveSubjects(subjects: Subject[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error('Error saving subjects to localStorage', e);
    }
  },

  addSubject(name: string, code?: string): Subject {
    const subjects = this.getSubjects();
    const cleanName = name.trim();
    const existing = subjects.find(s => s.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) return existing;

    const randomColor = SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length];
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name: cleanName,
      code: code?.trim() || cleanName.substring(0, 3).toUpperCase(),
      color: randomColor,
      isCustom: true,
    };

    const updated = [...subjects, newSubject];
    this.saveSubjects(updated);
    return newSubject;
  },

  // --- QUESTIONS ---
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) {
        this.saveQuestions(INITIAL_QUESTIONS);
        return INITIAL_QUESTIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading questions from localStorage', e);
      return INITIAL_QUESTIONS;
    }
  },

  saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Error saving questions to localStorage', e);
    }
  },

  addQuestion(payload: { subject: string; category: QuestionCategory; content: string }): Question {
    const questions = this.getQuestions();
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      subject: payload.subject,
      category: payload.category,
      content: payload.content.trim(),
      upvotes: 0,
      isResolved: false,
      answers: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newQuestion, ...questions];
    this.saveQuestions(updated);
    return newQuestion;
  },

  toggleQuestionResolved(questionId: string): boolean {
    const questions = this.getQuestions();
    let newStatus = false;
    const updated = questions.map(q => {
      if (q.id === questionId) {
        newStatus = !q.isResolved;
        return { ...q, isResolved: newStatus };
      }
      return q;
    });
    this.saveQuestions(updated);
    return newStatus;
  },

  // --- ANSWERS ---
  addAnswer(questionId: string, answerData: Omit<Answer, 'id' | 'createdAt' | 'upvotes' | 'questionId'>): Answer | null {
    const questions = this.getQuestions();
    const newAnswer: Answer = {
      id: `ans-${Date.now()}`,
      questionId,
      content: answerData.content.trim(),
      authorType: answerData.authorType,
      authorName: answerData.authorType === 'Named' ? (answerData.authorName?.trim() || 'Student') : undefined,
      academicInfo: answerData.authorType === 'Named' ? answerData.academicInfo?.trim() : undefined,
      isSenior: answerData.isSenior,
      explanationLevel: answerData.explanationLevel,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    let created = false;
    const updated = questions.map(q => {
      if (q.id === questionId) {
        created = true;
        return {
          ...q,
          answers: [...q.answers, newAnswer],
        };
      }
      return q;
    });

    if (created) {
      this.saveQuestions(updated);
      return newAnswer;
    }
    return null;
  },

  // --- VOTING & DEDUPLICATION ---
  getVotedQuestionIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOTED_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getVotedAnswerIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOTED_ANSWERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  hasUpvotedQuestion(questionId: string): boolean {
    const voted = this.getVotedQuestionIds();
    return voted.includes(questionId);
  },

  hasUpvotedAnswer(answerId: string): boolean {
    const voted = this.getVotedAnswerIds();
    return voted.includes(answerId);
  },

  toggleQuestionUpvote(questionId: string): { upvotes: number; hasUpvoted: boolean } {
    const questions = this.getQuestions();
    const votedIds = this.getVotedQuestionIds();
    const alreadyVoted = votedIds.includes(questionId);

    let currentUpvotes = 0;
    let newVotedIds: string[];

    if (alreadyVoted) {
      newVotedIds = votedIds.filter(id => id !== questionId);
    } else {
      newVotedIds = [...votedIds, questionId];
    }

    const updated = questions.map(q => {
      if (q.id === questionId) {
        const delta = alreadyVoted ? -1 : 1;
        const newCount = Math.max(0, q.upvotes + delta);
        currentUpvotes = newCount;
        return { ...q, upvotes: newCount };
      }
      return q;
    });

    this.saveQuestions(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.VOTED_QUESTIONS, JSON.stringify(newVotedIds));
    } catch (e) {
      console.error(e);
    }

    return { upvotes: currentUpvotes, hasUpvoted: !alreadyVoted };
  },

  toggleAnswerUpvote(questionId: string, answerId: string): { upvotes: number; hasUpvoted: boolean } {
    const questions = this.getQuestions();
    const votedIds = this.getVotedAnswerIds();
    const alreadyVoted = votedIds.includes(answerId);

    let currentUpvotes = 0;
    let newVotedIds: string[];

    if (alreadyVoted) {
      newVotedIds = votedIds.filter(id => id !== answerId);
    } else {
      newVotedIds = [...votedIds, answerId];
    }

    const updated = questions.map(q => {
      if (q.id === questionId) {
        const updatedAnswers = q.answers.map(ans => {
          if (ans.id === answerId) {
            const delta = alreadyVoted ? -1 : 1;
            const newCount = Math.max(0, ans.upvotes + delta);
            currentUpvotes = newCount;
            return { ...ans, upvotes: newCount };
          }
          return ans;
        });
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });

    this.saveQuestions(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.VOTED_ANSWERS, JSON.stringify(newVotedIds));
    } catch (e) {
      console.error(e);
    }

    return { upvotes: currentUpvotes, hasUpvoted: !alreadyVoted };
  },

  // --- STATS ---
  calculateStats(questions: Question[]): PlatformStats {
    const totalQuestions = questions.length;
    const totalResolved = questions.filter(q => q.isResolved).length;
    const totalAnswers = questions.reduce((sum, q) => sum + q.answers.length, 0);

    const subjectCounts: Record<string, number> = {};
    questions.forEach(q => {
      subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
    });

    const activeSubjects = Object.entries(subjectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const resolutionRate = totalQuestions > 0 ? Math.round((totalResolved / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      totalResolved,
      totalAnswers,
      activeSubjects,
      resolutionRate,
    };
  },

  // --- RESET DEMO DATA ---
  resetToDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.VOTED_QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.VOTED_ANSWERS);
    this.saveSubjects(INITIAL_SUBJECTS);
    this.saveQuestions(INITIAL_QUESTIONS);
  },
};
