import React from 'react';
import { Sparkles } from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';
import { QuestionCard } from './QuestionCard';
import { EmptyState } from '../common/EmptyState';

export const QuestionList: React.FC = () => {
  const { filteredQuestions, activeSubject, activeCategory, searchQuery, statusFilter, questions } = useDoubt();

  const isFiltered = activeSubject !== 'All' || activeCategory !== 'All' || searchQuery.trim() !== '' || statusFilter !== 'all';
  const hasNoTotalQuestions = questions.length === 0;

  return (
    <div id="doubt-feed-section" className="space-y-4">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {activeSubject === 'All' ? 'Recent Peer Doubts' : `${activeSubject} Doubts`}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {filteredQuestions.length}
          </span>
        </div>

        {isFiltered && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Filtered by:{' '}
            {activeSubject !== 'All' && <strong className="text-indigo-600 dark:text-indigo-400">{activeSubject} · </strong>}
            {activeCategory !== 'All' && <span>{activeCategory} · </span>}
            {statusFilter !== 'all' && <span>{statusFilter} · </span>}
            {searchQuery && <span>"{searchQuery}"</span>}
          </p>
        )}
      </div>

      {/* Questions Feed Grid / List */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <EmptyState isFilterEmpty={!hasNoTotalQuestions} />
      )}
    </div>
  );
};
