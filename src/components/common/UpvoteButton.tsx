import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

interface UpvoteButtonProps {
  count: number;
  hasUpvoted: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'pill' | 'minimal';
  label?: string;
}

export const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  count,
  hasUpvoted,
  onToggle,
  size = 'md',
  variant = 'pill',
  label = 'Upvotes',
}) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onToggle();
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1.5 gap-1.5',
    lg: 'text-sm font-bold px-3.5 py-2 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Upvote. Current count: ${count}`}
        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-150 active:scale-95 ${
          animating ? 'scale-110' : ''
        } ${
          hasUpvoted
            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        <ThumbsUp
          className={`${iconSizes} transition-transform ${hasUpvoted ? 'fill-indigo-600 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400 -translate-y-0.5' : ''}`}
        />
        <span className="text-xs font-bold mt-0.5">{count}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Upvote. Current count: ${count}`}
      className={`inline-flex items-center rounded-full border transition-all duration-150 active:scale-95 ${sizeClasses} ${
        animating ? 'scale-105 ring-2 ring-indigo-300 dark:ring-indigo-700' : ''
      } ${
        hasUpvoted
          ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
      }`}
    >
      <ThumbsUp
        className={`${iconSizes} ${hasUpvoted ? 'fill-white text-white' : 'text-slate-500 dark:text-slate-400'}`}
      />
      <span>{count}</span>
      {label && <span className="opacity-80 hidden sm:inline">{label}</span>}
    </button>
  );
};
