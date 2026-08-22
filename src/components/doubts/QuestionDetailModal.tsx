import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  UserCheck, 
  User, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Code, 
  List, 
  Sparkles,
  Share2
} from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';
import { ExplanationLevel, AuthorType, Answer } from '../../types';
import { 
  SubjectBadge, 
  CategoryBadge, 
  AnonymousBadge, 
  SeniorBadge, 
  ExplanationLevelBadge, 
  MostHelpfulBadge 
} from '../common/Badge';
import { UpvoteButton } from '../common/UpvoteButton';

export const QuestionDetailModal: React.FC = () => {
  const {
    selectedQuestion,
    closeQuestionDetail,
    subjects,
    toggleQuestionUpvote,
    toggleAnswerUpvote,
    toggleQuestionResolved,
    hasUpvotedQuestion,
    hasUpvotedAnswer,
    createAnswer,
  } = useDoubt();

  // Answer Form State
  const [answerContent, setAnswerContent] = useState('');
  const [authorType, setAuthorType] = useState<AuthorType>('Named');
  const [authorName, setAuthorName] = useState('Rahul');
  const [academicInfo, setAcademicInfo] = useState('3rd Year · Computer Engineering');
  const [isSenior, setIsSenior] = useState(true);
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('Beginner');
  const [formError, setFormError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuestionDetail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeQuestionDetail]);

  if (!selectedQuestion) return null;

  const currentSubject = subjects.find(
    s => s.name.toLowerCase() === selectedQuestion.subject.toLowerCase()
  );

  const isQuestionUpvoted = hasUpvotedQuestion(selectedQuestion.id);

  // Sort answers: Highest upvotes first, oldest as tie breaker
  const sortedAnswers = [...selectedQuestion.answers].sort((a, b) => {
    if (b.upvotes !== a.upvotes) {
      return b.upvotes - a.upvotes;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Most Helpful Answer is the top answer if it has at least 1 upvote
  const mostHelpfulAnswerId = sortedAnswers.length > 0 && sortedAnswers[0].upvotes > 0 
    ? sortedAnswers[0].id 
    : null;

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      setFormError('Please write your explanation before submitting');
      return;
    }

    await createAnswer(selectedQuestion.id, {
      content: answerContent,
      authorType,
      authorName: authorType === 'Named' ? authorName : undefined,
      academicInfo: authorType === 'Named' ? academicInfo : undefined,
      isSenior: authorType === 'Named' ? isSenior : false,
      explanationLevel,
    });

    setAnswerContent('');
    setFormError('');
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    setAnswerContent(prev => `${prev}${prefix}${suffix}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Render markdown-like simple text formatting
  const renderFormattedText = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => {
      // Check for bullet lists
      if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
        const lines = paragraph.split('\n');
        return (
          <ul key={idx} className="my-2 pl-5 space-y-1 list-disc text-slate-700 dark:text-slate-300">
            {lines.map((line, lIdx) => (
              <li key={lIdx}>
                {line.replace(/^[-*]\s+|\d+\.\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="my-2 leading-relaxed text-slate-700 dark:text-slate-300">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-3xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-xs sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <SubjectBadge 
              name={selectedQuestion.subject} 
              code={currentSubject?.code} 
              color={currentSubject?.color} 
            />
            <CategoryBadge category={selectedQuestion.category} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Link copied!
              </span>
            )}

            <button
              type="button"
              onClick={closeQuestionDetail}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Main Doubt / Question Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
              "{selectedQuestion.content}"
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/50">
              <AnonymousBadge />

              <div className="flex items-center gap-3">
                {/* Mark as Resolved / Reopen Toggle */}
                <button
                  type="button"
                  onClick={() => toggleQuestionResolved(selectedQuestion.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    selectedQuestion.isResolved
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
                  }`}
                >
                  {selectedQuestion.isResolved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Marked Resolved</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mark as Resolved</span>
                    </>
                  )}
                </button>

                {/* Question Upvote */}
                <UpvoteButton
                  count={selectedQuestion.upvotes}
                  hasUpvoted={isQuestionUpvoted}
                  onToggle={() => toggleQuestionUpvote(selectedQuestion.id)}
                  size="md"
                  label="Upvote Doubt"
                />
              </div>
            </div>
          </div>

          {/* Answers Feed Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedQuestion.answers.length} {selectedQuestion.answers.length === 1 ? 'Peer Explanation' : 'Peer Explanations'}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sorted by most helpful & rating
              </span>
            </div>

            {/* Answer Cards */}
            {sortedAnswers.length > 0 ? (
              <div className="space-y-4">
                {sortedAnswers.map((ans: Answer) => {
                  const isHelpful = ans.id === mostHelpfulAnswerId;
                  const isAnsUpvoted = hasUpvotedAnswer(ans.id);

                  return (
                    <div
                      key={ans.id}
                      className={`relative p-5 sm:p-6 rounded-3xl border transition-all ${
                        isHelpful
                          ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/70 shadow-sm'
                          : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {/* Top ribbon if Most Helpful */}
                      {isHelpful && (
                        <div className="mb-3">
                          <MostHelpfulBadge />
                        </div>
                      )}

                      {/* Author row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            ans.authorType === 'Named'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            {ans.authorType === 'Named' ? (
                              ans.authorName?.charAt(0).toUpperCase() || 'S'
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                                {ans.authorType === 'Named' ? ans.authorName : 'Anonymous Peer'}
                              </span>
                              {ans.isSenior && <SeniorBadge />}
                            </div>
                            {ans.academicInfo && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {ans.academicInfo}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Explanation Level */}
                        <ExplanationLevelBadge level={ans.explanationLevel} />
                      </div>

                      {/* Answer Content */}
                      <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2 whitespace-pre-line font-normal">
                        {renderFormattedText(ans.content)}
                      </div>

                      {/* Answer Upvote Footer */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                        <span className="text-[10px] text-slate-400">
                          {new Date(ans.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        <UpvoteButton
                          count={ans.upvotes}
                          hasUpvoted={isAnsUpvoted}
                          onToggle={() => toggleAnswerUpvote(selectedQuestion.id, ans.id)}
                          size="sm"
                          label="Helpful"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  No answers yet. Be the first senior or peer to explain this concept!
                </p>
              </div>
            )}
          </div>

          {/* Answer Composer Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Share your explanation</span>
                </h4>
                <span className="text-[11px] text-slate-400">No judgment, just pure peer help</span>
              </div>

              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                
                {/* Author Type Toggle: Anonymous vs Named */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Answer as:
                  </span>
                  <div className="inline-flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAuthorType('Anonymous')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        authorType === 'Anonymous'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Anonymous</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthorType('Named')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        authorType === 'Named'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Named Senior / Peer</span>
                    </button>
                  </div>
                </div>

                {/* If Named, show Name & Academic Identity inputs */}
                {authorType === 'Named' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul, Priya, Alex"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Academic Info (Year & Branch)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3rd Year · Computer Engineering"
                        value={academicInfo}
                        onChange={(e) => setAcademicInfo(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-800 dark:text-amber-300">
                        <input
                          type="checkbox"
                          checked={isSenior}
                          onChange={(e) => setIsSenior(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                        />
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4 text-amber-600" />
                          Tag with <strong>Senior</strong> credibility badge
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Explanation Level Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Explanation Depth (Crucial for Juniors)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { level: 'Beginner', desc: 'ELIF5, analogies, intuitive mental models', color: 'emerald' },
                      { level: 'Intermediate', desc: 'Code patterns, step-by-step logic, complexity', color: 'amber' },
                      { level: 'Advanced', desc: 'Underlying hardware, edge cases, theory', color: 'rose' },
                    ].map((item) => {
                      const isSelected = explanationLevel === item.level;
                      return (
                        <button
                          key={item.level}
                          type="button"
                          onClick={() => setExplanationLevel(item.level as ExplanationLevel)}
                          className={`p-2.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 text-slate-900 dark:text-white'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold">
                              {item.level === 'Beginner' ? '🟢 Beginner' : item.level === 'Intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            {item.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Answer Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Your Explanation
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => insertSnippet('`', '`')}
                        className="p-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md"
                        title="Inline Code"
                      >
                        <Code className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('\n- ')}
                        className="p-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md"
                        title="Bullet list"
                      >
                        <List className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Break it down simply. Use real-world analogies, code snippets, or mnemonics to make it stick..."
                    value={answerContent}
                    onChange={(e) => {
                      setAnswerContent(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  {formError && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                      {formError}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200 dark:shadow-none transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Explanation</span>
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
