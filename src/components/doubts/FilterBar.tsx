import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';
import { QuestionCategory, SortOption } from '../../types';

const CATEGORIES: ('All' | QuestionCategory)[] = [
  'All',
  'Conceptual',
  'Assignment',
  'Exam Prep',
  'Lab',
  'General',
];

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  } = useDoubt();

  return (
    <div className="space-y-3 mb-6 bg-white dark:bg-slate-900/90 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search doubts by keywords, concept, or formula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full sm:w-auto pl-8 pr-8 py-2 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="upvotes">Sort: Most Upvoted</option>
              <option value="newest">Sort: Newest First</option>
              <option value="answers">Sort: Most Explanations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Status Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Type:</span>
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-300 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Status Toggle (All / Open / Resolved) */}
        <div className="flex items-center self-start sm:self-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            All Doubts
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('open')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'open'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            🟠 Open
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('resolved')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'resolved'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            🟢 Resolved
          </button>
        </div>

      </div>

    </div>
  );
};
