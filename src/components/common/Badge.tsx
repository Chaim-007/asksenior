import React from 'react';
import { Lock, Sparkles, Trophy, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { ExplanationLevel, QuestionCategory } from '../../types';

// Subject Color Mapper
export const getSubjectColorClasses = (colorName: string = 'indigo') => {
  switch (colorName) {
    case 'indigo':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
    case 'blue':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
    case 'emerald':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
    case 'amber':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    case 'rose':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    case 'purple':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    case 'cyan':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800';
    case 'teal':
      return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
};

export const SubjectBadge: React.FC<{ name: string; color?: string; code?: string }> = ({ name, color = 'indigo', code }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSubjectColorClasses(color)} transition-all`}>
      {code && <span className="opacity-70 font-mono text-[10px]">{code} ·</span>}
      <span>{name}</span>
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: QuestionCategory }> = ({ category }) => {
  const categoryStyles: Record<QuestionCategory, string> = {
    Conceptual: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    Assignment: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800',
    'Exam Prep': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    Lab: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    General: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${categoryStyles[category] || categoryStyles.General}`}>
      {category}
    </span>
  );
};

export const AnonymousBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 px-2 py-0.5 rounded-full ${className}`}>
      <Lock className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
      <span>Posted anonymously</span>
    </span>
  );
};

export const SeniorBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-full ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span>Senior</span>
    </span>
  );
};

export const ExplanationLevelBadge: React.FC<{ level: ExplanationLevel; className?: string }> = ({ level, className = '' }) => {
  const config = {
    Beginner: {
      dot: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
      label: 'Beginner friendly',
    },
    Intermediate: {
      dot: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60',
      label: 'Intermediate depth',
    },
    Advanced: {
      dot: 'bg-rose-500',
      text: 'text-rose-700 dark:text-rose-300',
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60',
      label: 'Advanced theory',
    },
  }[level];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${className}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      <span>{level} explanation</span>
    </span>
  );
};

export const ResolvedBadge: React.FC<{ isResolved: boolean; onClick?: () => void; interactive?: boolean }> = ({ 
  isResolved, 
  onClick, 
  interactive = false 
}) => {
  if (isResolved) {
    return (
      <button
        type="button"
        disabled={!interactive}
        onClick={onClick}
        className={`inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-full transition-all ${
          interactive ? 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer shadow-sm' : 'cursor-default'
        }`}
        title={interactive ? 'Click to toggle open/resolved' : undefined}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Resolved</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-0.5 rounded-full transition-all ${
        interactive ? 'hover:bg-amber-100 dark:hover:bg-amber-900/50 cursor-pointer shadow-sm' : 'cursor-default'
      }`}
      title={interactive ? 'Click to toggle open/resolved' : undefined}
    >
      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span>Open Doubt</span>
    </button>
  );
};

export const MostHelpfulBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-900 dark:text-amber-200 bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-200 dark:from-amber-950 dark:via-amber-900 dark:to-yellow-950 border border-amber-300 dark:border-amber-700 shadow-sm ${className}`}>
      <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span>Most Helpful Answer</span>
      <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
    </div>
  );
};
