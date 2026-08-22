import React from 'react';
import { DoubtProvider } from './context/DoubtContext';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { StatsBar } from './components/layout/StatsBar';
import { Footer } from './components/layout/Footer';
import { SubjectSelector } from './components/doubts/SubjectSelector';
import { FilterBar } from './components/doubts/FilterBar';
import { QuestionList } from './components/doubts/QuestionList';
import { AskQuestionModal } from './components/modals/AskQuestionModal';
import { QuestionDetailModal } from './components/doubts/QuestionDetailModal';
import { DemoGuideModal } from './components/modals/DemoGuideModal';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      
      <main className="flex-1">
        {/* Landing Hero */}
        <Hero />

        {/* Live Academic Metrics */}
        <StatsBar />

        {/* Core Feed & Doubt Experience */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="space-y-6">
            {/* Subject Selector Strip */}
            <SubjectSelector />

            {/* Search & Multidimensional Filters */}
            <FilterBar />

            {/* Doubts Grid & Feed */}
            <QuestionList />
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals & Overlays */}
      <AskQuestionModal />
      <QuestionDetailModal />
      <DemoGuideModal />
    </div>
  );
};

export function App() {
  return (
    <DoubtProvider>
      <AppContent />
    </DoubtProvider>
  );
}

export default App;
