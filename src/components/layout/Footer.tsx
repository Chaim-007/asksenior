import React from 'react';
import { ShieldQuestion, Heart, Sparkles, BookOpen, Users } from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';

export const Footer: React.FC = () => {
  const { openDemoGuide } = useDoubt();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <ShieldQuestion className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">AskSenior</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Course-scoped, anonymous doubt-solving for college students.
              </p>
            </div>
          </div>

          {/* Quick Links / Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              100% Course Scoped
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              Senior-to-Junior Mentorship
            </span>
            <button
              type="button"
              onClick={openDemoGuide}
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              60s Pitch Tour
            </button>
          </div>

          {/* Hackathon Note */}
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Student Life Hackathon</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
