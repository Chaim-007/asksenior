import React, { useState } from 'react';
import { Plus, BookOpen, Check, X } from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';
import { getSubjectColorClasses } from '../common/Badge';

export const SubjectSelector: React.FC = () => {
  const { subjects, activeSubject, setActiveSubject, addSubject, questions } = useDoubt();
  const [isAdding, setIsAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [error, setError] = useState('');

  // Calculate questions count per subject
  const getSubjectCount = (subjectName: string) => {
    if (subjectName === 'All') return questions.length;
    return questions.filter(q => q.subject.toLowerCase() === subjectName.toLowerCase()).length;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) {
      setError('Please enter a course name');
      return;
    }
    const created = await addSubject(newSubjectName, newSubjectCode);
    setActiveSubject(created.name);
    setNewSubjectName('');
    setNewSubjectCode('');
    setIsAdding(false);
    setError('');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Select Course / Subject
          </h3>
        </div>

        {/* Add custom subject button */}
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Subject</span>
          </button>
        )}
      </div>

      {/* Add Custom Subject Inline Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mb-4 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl animate-scale-in">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Operating Systems, Machine Learning"
              value={newSubjectName}
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              className="flex-1 w-full px-3 py-1.5 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Code (e.g. CS301)"
              value={newSubjectCode}
              onChange={(e) => setNewSubjectCode(e.target.value)}
              className="w-full sm:w-28 px-3 py-1.5 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setError('');
                }}
                className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {error && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{error}</p>}
        </form>
      )}

      {/* Subject Chips / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin no-scrollbar">
        {/* All Subjects Pill */}
        <button
          type="button"
          onClick={() => setActiveSubject('All')}
          className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all border ${
            activeSubject === 'All'
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span>All Courses</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeSubject === 'All'
              ? 'bg-slate-700 text-slate-100 dark:bg-slate-200 dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {getSubjectCount('All')}
          </span>
        </button>

        {/* Individual Subject Pills */}
        {subjects.map((sub) => {
          const isSelected = activeSubject.toLowerCase() === sub.name.toLowerCase();
          const count = getSubjectCount(sub.name);

          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubject(sub.name)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none'
                  : `${getSubjectColorClasses(sub.color)} hover:opacity-90`
              }`}
            >
              {sub.code && <span className="opacity-75 font-mono text-[10px]">{sub.code}</span>}
              <span>{sub.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected 
                  ? 'bg-indigo-700 text-white dark:bg-indigo-600'
                  : 'bg-white/70 dark:bg-slate-900/70'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
