import React from 'react';
import { 
  Lock, 
  HelpCircle, 
  ArrowDown, 
  CheckCircle2, 
  Shield, 
  Layers
} from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';

export const Hero: React.FC = () => {
  const { openAskModal } = useDoubt();

  const handleScrollToFeed = () => {
    const feedElement = document.getElementById('doubt-feed-section');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Reassurance pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 mb-6 shadow-xs animate-fade-in">
          <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Ask anything. No names. No judgment.</span>
        </div>

        {/* Main Headings */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none mb-4">
          AskSenior
        </h1>

        <h2 className="text-lg sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight mb-4">
          Learn without being afraid to ask.
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Clear your doubts without worrying about what anyone thinks. Ask the questions you're too afraid to ask in large class groups. Completely anonymous, course-focused, and answered by seniors who have already been there.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            type="button"
            onClick={() => openAskModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ask a Question</span>
          </button>

          <button
            type="button"
            onClick={handleScrollToFeed}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
          >
            <span>Browse Doubts</span>
            <ArrowDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Value pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left max-w-3xl mx-auto">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Zero Name Fields</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Questions are strictly anonymous by default.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Senior Credibility</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Seniors share real academic insights without DMs.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Explanation Levels</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pick from Beginner, Intermediate, or Advanced depth.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
