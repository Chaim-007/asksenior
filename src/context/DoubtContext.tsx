import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  Subject, 
  Question, 
  Answer, 
  QuestionCategory, 
  StatusFilter, 
  SortOption, 
  PlatformStats 
} from '../types';
import { api } from '../services/api';
import { storage } from '../services/storage';

interface DoubtContextType {
  subjects: Subject[];
  questions: Question[];
  filteredQuestions: Question[];
  activeSubject: string;
  activeCategory: string;
  searchQuery: string;
  statusFilter: StatusFilter;
  sortBy: SortOption;
  selectedQuestion: Question | null;
  isAskModalOpen: boolean;
  isDemoGuideOpen: boolean;
  askModalDefaultSubject?: string;
  isDarkMode: boolean;
  stats: PlatformStats;
  isBackendConnected: boolean;
  
  // Actions
  setActiveSubject: (subject: string) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setSortBy: (sort: SortOption) => void;
  openAskModal: (defaultSubject?: string) => void;
  closeAskModal: () => void;
  openQuestionDetail: (question: Question) => void;
  closeQuestionDetail: () => void;
  openDemoGuide: () => void;
  closeDemoGuide: () => void;
  toggleDarkMode: () => void;
  addSubject: (name: string, code?: string) => Promise<Subject>;
  createQuestion: (data: { subject: string; category: QuestionCategory; content: string }) => Promise<Question>;
  createAnswer: (questionId: string, answerData: Omit<Answer, 'id' | 'createdAt' | 'upvotes' | 'questionId'>) => Promise<Answer | null>;
  toggleQuestionUpvote: (questionId: string) => void;
  toggleAnswerUpvote: (questionId: string, answerId: string) => void;
  toggleQuestionResolved: (questionId: string) => void;
  hasUpvotedQuestion: (questionId: string) => boolean;
  hasUpvotedAnswer: (answerId: string) => boolean;
  resetDemoData: () => Promise<void>;
  celebrate: () => void;
}

const DoubtContext = createContext<DoubtContextType | undefined>(undefined);

export const DoubtProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects());
  const [questions, setQuestions] = useState<Question[]>(() => storage.getQuestions());
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('upvotes');
  
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [askModalDefaultSubject, setAskModalDefaultSubject] = useState<string | undefined>(undefined);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('asksenior_theme_v1');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Check health and sync with backend on mount
  useEffect(() => {
    const initData = async () => {
      const health = await api.checkHealth();
      setIsBackendConnected(health.online);

      if (health.online) {
        const [fetchedSubjects, fetchedQuestions] = await Promise.all([
          api.getSubjects(),
          api.getQuestions(),
        ]);
        setSubjects(fetchedSubjects);
        setQuestions(fetchedQuestions);
      }
    };

    initData();

    // Poll health check every 10s
    const timer = setInterval(async () => {
      const health = await api.checkHealth();
      setIsBackendConnected(health.online);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('asksenior_theme_v1', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('asksenior_theme_v1', 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Refresh selected question whenever questions change
  const selectedQuestion = useMemo(() => {
    if (!selectedQuestionId) return null;
    return questions.find(q => q.id === selectedQuestionId) || null;
  }, [selectedQuestionId, questions]);

  // Dynamic statistics
  const stats = useMemo(() => storage.calculateStats(questions), [questions]);

  // Celebration confetti effect
  const celebrate = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filter and Sort Pipeline
  const filteredQuestions = useMemo(() => {
    return questions
      .filter(q => {
        // Subject filter
        if (activeSubject !== 'All' && q.subject.toLowerCase() !== activeSubject.toLowerCase()) {
          return false;
        }
        // Category filter
        if (activeCategory !== 'All' && q.category.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
        // Status filter
        if (statusFilter === 'open' && q.isResolved) {
          return false;
        }
        if (statusFilter === 'resolved' && !q.isResolved) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const qNorm = searchQuery.toLowerCase().trim();
          const matchContent = q.content.toLowerCase().includes(qNorm);
          const matchSubject = q.subject.toLowerCase().includes(qNorm);
          const matchCategory = q.category.toLowerCase().includes(qNorm);
          const matchAnswers = q.answers.some(a => a.content.toLowerCase().includes(qNorm) || a.authorName?.toLowerCase().includes(qNorm));
          if (!matchContent && !matchSubject && !matchCategory && !matchAnswers) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'upvotes') {
          return b.upvotes - a.upvotes;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'answers') {
          return b.answers.length - a.answers.length;
        }
        return 0;
      });
  }, [questions, activeSubject, activeCategory, statusFilter, searchQuery, sortBy]);

  // Actions
  const openAskModal = (defaultSubject?: string) => {
    setAskModalDefaultSubject(defaultSubject || (activeSubject !== 'All' ? activeSubject : undefined));
    setIsAskModalOpen(true);
  };

  const closeAskModal = () => {
    setIsAskModalOpen(false);
    setAskModalDefaultSubject(undefined);
  };

  const openQuestionDetail = (question: Question) => {
    setSelectedQuestionId(question.id);
  };

  const closeQuestionDetail = () => {
    setSelectedQuestionId(null);
  };

  const openDemoGuide = () => setIsDemoGuideOpen(true);
  const closeDemoGuide = () => setIsDemoGuideOpen(false);

  const addSubject = async (name: string, code?: string) => {
    const newSubject = await api.addSubject(name, code);
    const updated = await api.getSubjects();
    setSubjects(updated);
    return newSubject;
  };

  const createQuestion = async (data: { subject: string; category: QuestionCategory; content: string }) => {
    const newQ = await api.addQuestion(data);
    const updated = await api.getQuestions();
    setQuestions(updated);
    celebrate();
    return newQ;
  };

  const createAnswer = async (questionId: string, answerData: Omit<Answer, 'id' | 'createdAt' | 'upvotes' | 'questionId'>) => {
    const newAns = await api.addAnswer(questionId, answerData);
    if (newAns) {
      const updated = await api.getQuestions();
      setQuestions(updated);
      celebrate();
    }
    return newAns;
  };

  const toggleQuestionUpvote = async (questionId: string) => {
    api.toggleQuestionUpvote(questionId);
    setQuestions(storage.getQuestions());
  };

  const toggleAnswerUpvote = async (questionId: string, answerId: string) => {
    api.toggleAnswerUpvote(questionId, answerId);
    setQuestions(storage.getQuestions());
  };

  const toggleQuestionResolved = async (questionId: string) => {
    const isNowResolved = await api.toggleQuestionResolved(questionId);
    setQuestions(storage.getQuestions());
    if (isNowResolved) {
      celebrate();
    }
  };

  const hasUpvotedQuestion = (questionId: string) => storage.hasUpvotedQuestion(questionId);
  const hasUpvotedAnswer = (answerId: string) => storage.hasUpvotedAnswer(answerId);

  const resetDemoData = async () => {
    await api.resetDemoData();
    setSubjects(storage.getSubjects());
    setQuestions(storage.getQuestions());
    setActiveSubject('All');
    setActiveCategory('All');
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('upvotes');
    setSelectedQuestionId(null);
  };

  return (
    <DoubtContext.Provider
      value={{
        subjects,
        questions,
        filteredQuestions,
        activeSubject,
        activeCategory,
        searchQuery,
        statusFilter,
        sortBy,
        selectedQuestion,
        isAskModalOpen,
        isDemoGuideOpen,
        askModalDefaultSubject,
        isDarkMode,
        stats,
        isBackendConnected,
        setActiveSubject,
        setActiveCategory,
        setSearchQuery,
        setStatusFilter,
        setSortBy,
        openAskModal,
        closeAskModal,
        openQuestionDetail,
        closeQuestionDetail,
        openDemoGuide,
        closeDemoGuide,
        toggleDarkMode,
        addSubject,
        createQuestion,
        createAnswer,
        toggleQuestionUpvote,
        toggleAnswerUpvote,
        toggleQuestionResolved,
        hasUpvotedQuestion,
        hasUpvotedAnswer,
        resetDemoData,
        celebrate,
      }}
    >
      {children}
    </DoubtContext.Provider>
  );
};

export const useDoubt = () => {
  const context = useContext(DoubtContext);
  if (!context) {
    throw new Error('useDoubt must be used within a DoubtProvider');
  }
  return context;
};
