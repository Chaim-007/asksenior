import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Question } from '../../types';
import { useDoubt } from '../../context/DoubtContext';
import { 
  SubjectBadge, 
  CategoryBadge, 
  AnonymousBadge, 
  ResolvedBadge, 
  ExplanationLevelBadge 
} from '../common/Badge';
import { UpvoteButton } from '../common/UpvoteButton';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { 
    subjects, 
    openQuestionDetail, 
    toggleQuestionUpvote, 
    toggleQuestionResolved, 
    hasUpvotedQuestion 
  } = useDoubt();

  const currentSubject = subjects.find(
    s => s.name.toLowerCase() === question.subject.toLowerCase()
  );

  const isUpvoted = hasUpvotedQuestion(question.id);

  // Determine top answer if any
  const topAnswer = question.answers.length > 0 
    ? [...question.answers].sort((a, b) => {
        if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })[0]
    : null;

  return (
    <article 
      onClick={() => openQuestionDetail(question)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header: Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <SubjectBadge 
              name={question.subject} 
              code={currentSubject?.code} 
              color={currentSubject?.color} 
            />
            <CategoryBadge category={question.category} />
          </div>

          <div className="flex items-center gap-2">
            <ResolvedBadge 
              isResolved={question.isResolved} 
              interactive={true}
              onClick={() => toggleQuestionResolved(question.id)}
            />
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-3">
          "{question.content}"
        </h3>

        {/* Top Answer Teaser Snippet (if available) */}
        {topAnswer && (
          <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                {topAnswer.isSenior && <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />}
                <span>
                  {topAnswer.authorType === 'Named' ? topAnswer.authorName : 'Anonymous peer'}
                </span>
                {topAnswer.academicInfo && (
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                    · {topAnswer.academicInfo}
                  </span>
                )}
              </div>
              <ExplanationLevelBadge level={topAnswer.explanationLevel} className="scale-90 origin-right" />
            </div>
            <p className="line-clamp-2 text-slate-500 dark:text-slate-400 font-normal italic">
              "{topAnswer.content.replace(/[#*`$]/g, '')}"
            </p>
          </div>
        )}
      </div>

      {/* Footer: Anonymous notice, Upvote, Answer count */}
      <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between gap-2">
        <AnonymousBadge />

        <div className="flex items-center gap-2">
          {/* Answer Count */}
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>{question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}</span>
          </div>

          {/* Upvote Button */}
          <UpvoteButton
            count={question.upvotes}
            hasUpvoted={isUpvoted}
            onToggle={() => toggleQuestionUpvote(question.id)}
            size="sm"
          />

          {/* Open arrow icon */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </article>
  );
};
