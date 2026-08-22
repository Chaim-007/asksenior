import React from 'react';
import { HelpCircle, PlusCircle, Sparkles, FilterX } from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';

interface EmptyStateProps {
  isFilterEmpty?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isFilterEmpty = false }) => {
  const { activeSubject, openAskModal, setActiveSubject, setActiveCategory, setSearchQuery, setStatusFilter } = useDoubt();

  const handleResetFilters = () => {
    setActiveSubject('All');
    setActiveCategory('All');
    setSearchQuery('');
    setStatusFilter('all');
  };

  if (isFilterEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl my-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
          <FilterX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          No matching doubts found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          We couldn't find any questions matching your current filters or search keywords.
        </p>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Clear all filters
          </button>
          <button
            type="button"
            onClick={() => openAskModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ask this doubt instead</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 relative">
        <HelpCircle className="w-8 h-8" />
        <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        No doubts here yet.
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {activeSubject !== 'All' ? (
          <span>Nobody has asked a question in <strong className="text-slate-800 dark:text-slate-200">{activeSubject}</strong> yet.</span>
        ) : (
          <span>Be the first one to kickstart the academic discussion.</span>
        )}
      </p>
      <button
        type="button"
        onClick={() => openAskModal(activeSubject !== 'All' ? activeSubject : undefined)}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Be the first to ask anonymously</span>
      </button>
    </div>
  );
};
