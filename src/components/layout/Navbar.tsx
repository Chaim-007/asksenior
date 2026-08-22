import React from 'react';
import { 
  ShieldQuestion, 
  Plus, 
  Sparkles, 
  Moon, 
  Sun, 
  RotateCcw, 
  GraduationCap,
  Server,
  Radio
} from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';

export const Navbar: React.FC = () => {
  const { 
    openAskModal, 
    openDemoGuide, 
    resetDemoData, 
    isDarkMode, 
    toggleDarkMode,
    isBackendConnected
  } = useDoubt();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <ShieldQuestion className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Ask<span className="text-indigo-600 dark:text-indigo-400">Senior</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <GraduationCap className="w-3 h-3 text-indigo-500" />
                <span>Student Life</span>
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              Learn without being afraid to ask
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Server Status Indicator */}
          <div 
            className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              isBackendConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
            title={isBackendConnected ? 'Backend REST API connected on Port 3001' : 'Using Local Client Persistence'}
          >
            {isBackendConnected ? (
              <>
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>API: Connected (3001)</span>
              </>
            ) : (
              <>
                <Server className="w-3 h-3 text-amber-500" />
                <span>Offline / Client Mode</span>
              </>
            )}
          </div>

          {/* 60s Demo Guide Trigger */}
          <button
            type="button"
            onClick={openDemoGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition-colors shadow-xs"
            title="Open 60-Second Demo Walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Demo Tour</span>
            <span className="md:hidden">Tour</span>
          </button>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all doubts and votes back to initial demo state?')) {
                resetDemoData();
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset to clean sample data"
            aria-label="Reset Demo Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary CTA: + Ask Anonymously */}
          <button
            type="button"
            onClick={() => openAskModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ask Anonymously</span>
          </button>
        </div>

      </div>
    </header>
  );
};
