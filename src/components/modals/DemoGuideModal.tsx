import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Trophy, 
  Layers, 
  GraduationCap, 
  Play,
  RotateCcw
} from 'lucide-react';
import { useDoubt } from '../../context/DoubtContext';

export const DemoGuideModal: React.FC = () => {
  const {
    isDemoGuideOpen,
    closeDemoGuide,
    setActiveSubject,
    openAskModal,
    resetDemoData,
    questions,
    openQuestionDetail,
  } = useDoubt();

  if (!isDemoGuideOpen) return null;

  const handleStartStep1 = () => {
    setActiveSubject('Data Structures');
    closeDemoGuide();
  };

  const handleStartStep2 = () => {
    setActiveSubject('Data Structures');
    closeDemoGuide();
    setTimeout(() => {
      openAskModal('Data Structures');
    }, 150);
  };

  const handleOpenPointerDemoQuestion = () => {
    const pointerQ = questions.find(q => q.content.toLowerCase().includes('pointers'));
    if (pointerQ) {
      closeDemoGuide();
      openQuestionDetail(pointerQ);
    } else {
      handleStartStep2();
    }
  };

  const steps = [
    {
      num: 1,
      title: 'Course-Scoped Selection',
      desc: 'Select "Data Structures" from the subject selector strip to focus on specific course doubts.',
      actionLabel: 'Select Data Structures',
      action: handleStartStep1,
      icon: Layers,
      color: 'indigo',
    },
    {
      num: 2,
      title: 'Zero-Judgement Anonymous Question',
      desc: 'Click "+ Ask Anonymously". Note the zero-name guarantee: no identity is stored or asked.',
      actionLabel: 'Open Ask Modal',
      action: handleStartStep2,
      icon: HelpCircle,
      color: 'blue',
    },
    {
      num: 3,
      title: 'Feed Confirmation',
      desc: 'Question instantly appears on feed stamped with 🔒 "Posted anonymously".',
      icon: ShieldCheck,
      color: 'emerald',
    },
    {
      num: 4,
      title: 'Senior Explanation with Depth Tag',
      desc: 'Answer as "Rahul · 3rd Year · Senior" with a 🟢 Beginner explanation.',
      actionLabel: 'View Pointer Doubt & Answers',
      action: handleOpenPointerDemoQuestion,
      icon: GraduationCap,
      color: 'amber',
    },
    {
      num: 5,
      title: 'Most Helpful Answer & Upvoting',
      desc: 'Upvoting an answer dynamically crowns it with 🏆 "Most Helpful Answer" at the top.',
      icon: Trophy,
      color: 'yellow',
    },
    {
      num: 6,
      title: 'Mark Resolved & Celebrate',
      desc: 'Mark the doubt 🟢 Resolved to close the learning loop with positive reinforcement.',
      icon: CheckCircle2,
      color: 'emerald',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-2xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-white to-amber-50/50 dark:from-indigo-950/50 dark:via-slate-900 dark:to-amber-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                60-Second Hackathon Demo Guide
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Step-by-step walkthrough for judging and presentation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDemoGuide}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pitch Thesis Box */}
        <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40">
          <p className="text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200 italic">
            "The key idea is that students don't need to risk embarrassment to ask basic questions, while seniors get a simple, low-effort way to share knowledge without flooded WhatsApp DMs."
          </p>
        </div>

        {/* Steps List */}
        <div className="p-6 space-y-3 max-h-[55vh] overflow-y-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step.num}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    {step.desc}
                  </p>

                  {step.action && (
                    <button
                      type="button"
                      onClick={step.action}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 hover:bg-indigo-200/70 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
                      <span>{step.actionLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              resetDemoData();
              closeDemoGuide();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>

          <button
            type="button"
            onClick={closeDemoGuide}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
