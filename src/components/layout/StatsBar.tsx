import React from 'react';
import { HelpCircle, CheckCircle2, MessageSquare, Flame } from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';

export const StatsBar: React.FC = () => {
  const { stats, setActiveSubject } = useDoubt();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        
        {/* Metric 1: Total Doubts */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-2">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalQuestions}
              </span>
              <span className="text-[11px] font-medium text-slate-400">doubts</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Questions Asked
            </p>
          </div>
        </div>

        {/* Metric 2: Doubts Resolved */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.totalResolved}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded-md">
                {stats.resolutionRate}%
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Doubts Resolved
            </p>
          </div>
        </div>

        {/* Metric 3: Total Explanations */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalAnswers}
              </span>
              <span className="text-[11px] font-medium text-slate-400">peer tips</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Explanations
            </p>
          </div>
        </div>

        {/* Metric 4: Active Subjects */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Top Active Course
            </p>
            {stats.activeSubjects.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveSubject(stats.activeSubjects[0].name)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate block max-w-full text-left"
              >
                {stats.activeSubjects[0].name} ({stats.activeSubjects[0].count})
              </button>
            ) : (
              <span className="text-xs text-slate-400">No activity yet</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
