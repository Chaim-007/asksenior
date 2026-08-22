import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Lock, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';
import { QuestionCategory } from '../../types';

const CATEGORIES: QuestionCategory[] = [
  'Conceptual',
  'Assignment',
  'Exam Prep',
  'Lab',
  'General',
];

export const AskQuestionModal: React.FC = () => {
  const {
    isAskModalOpen,
    closeAskModal,
    subjects,
    addSubject,
    createQuestion,
    askModalDefaultSubject,
    setActiveSubject,
  } = useDoubt();

  const [subject, setSubject] = useState('');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [category, setCategory] = useState<QuestionCategory>('Conceptual');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (askModalDefaultSubject && subjects.some(s => s.name.toLowerCase() === askModalDefaultSubject.toLowerCase())) {
      setSubject(askModalDefaultSubject);
    } else if (subjects.length > 0) {
      setSubject(subjects[0].name);
    }
  }, [askModalDefaultSubject, subjects, isAskModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAskModal]);

  if (!isAskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalSubject = subject;

    if (isCustomSubject) {
      if (!customSubjectName.trim()) {
        setError('Please enter your custom subject / course name.');
        return;
      }
      const newSub = await addSubject(customSubjectName.trim());
      finalSubject = newSub.name;
    }

    if (!finalSubject) {
      setError('Please select or specify a subject.');
      return;
    }

    if (!content.trim()) {
      setError('Please type your doubt or question.');
      return;
    }

    if (content.trim().length < 10) {
      setError('Please provide a bit more context so seniors can give a helpful answer (min 10 characters).');
      return;
    }

    await createQuestion({
      subject: finalSubject,
      category,
      content: content.trim(),
    });

    setActiveSubject(finalSubject);
    setContent('');
    setCustomSubjectName('');
    setIsCustomSubject(false);
    setError('');
    closeAskModal();
  };

  const loadPresetExample = (exampleText: string, exampleSubject: string, exampleCategory: QuestionCategory) => {
    setContent(exampleText);
    setSubject(exampleSubject);
    setCategory(exampleCategory);
    setIsCustomSubject(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Ask Anonymously
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                No judgment. No profile linked. Ever.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAskModal}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance Banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50/40 dark:from-indigo-950/40 dark:via-slate-900/40 dark:to-indigo-950/20 border-b border-indigo-100/60 dark:border-indigo-900/40 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs text-indigo-900 dark:text-indigo-200 font-medium leading-tight">
            <strong>🔒 Zero Identity Mode:</strong> Your question will always be posted completely anonymously. We do not ask for or store your name.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Subject Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Course / Subject <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomSubject(prev => !prev)}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isCustomSubject ? '← Pick from list' : '+ Other subject'}
              </button>
            </div>

            {isCustomSubject ? (
              <input
                type="text"
                placeholder="Type course name (e.g. Operating Systems, Microeconomics)"
                value={customSubjectName}
                onChange={(e) => setCustomSubjectName(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-2xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name} {sub.code ? `(${sub.code})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Doubt Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Question / Doubt <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Be as frank and simple as you want</span>
            </div>

            <textarea
              rows={4}
              placeholder="e.g. I understand arrays, but I don't understand why linked lists are useful. Can someone explain it simply without jargon?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            {error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Quick Demo Pre-fills / Prompt scenario helper */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick Prompt Idea for Hackathon Demo:</span>
            </span>
            <button
              type="button"
              onClick={() => loadPresetExample(
                "I've heard everyone talk about pointers but I still don't understand what they actually do. Can someone explain them like I'm a beginner?",
                "Data Structures",
                "Conceptual"
              )}
              className="text-[11px] text-left text-indigo-600 dark:text-indigo-400 hover:underline block leading-tight font-medium"
            >
              "I've heard everyone talk about pointers but I still don't understand what they actually do. Can someone explain them like I'm a beginner?"
            </button>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeAskModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200 dark:shadow-none transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Anonymously</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
