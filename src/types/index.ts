export type QuestionCategory = 
  | 'Conceptual' 
  | 'Assignment' 
  | 'Exam Prep' 
  | 'Lab' 
  | 'General';

export type ExplanationLevel = 
  | 'Beginner' 
  | 'Intermediate' 
  | 'Advanced';

export type AuthorType = 'Anonymous' | 'Named';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
  isCustom?: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorType: AuthorType;
  authorName?: string;
  academicInfo?: string; // e.g. "3rd Year · Computer Engineering"
  isSenior: boolean;
  explanationLevel: ExplanationLevel;
  upvotes: number;
  createdAt: string; // ISO string
}

export interface Question {
  id: string;
  subject: string;
  category: QuestionCategory;
  content: string;
  upvotes: number;
  isResolved: boolean;
  answers: Answer[];
  createdAt: string; // ISO string
}

export type StatusFilter = 'all' | 'open' | 'resolved';
export type SortOption = 'upvotes' | 'newest' | 'answers';

export interface FilterState {
  subject: string; // 'All' or specific subject name
  category: string; // 'All' or QuestionCategory
  searchQuery: string;
  status: StatusFilter;
  sortBy: SortOption;
}

export interface PlatformStats {
  totalQuestions: number;
  totalResolved: number;
  totalAnswers: number;
  activeSubjects: { name: string; count: number }[];
  resolutionRate: number;
}
