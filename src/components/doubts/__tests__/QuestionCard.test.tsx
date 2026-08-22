import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard } from '../QuestionCard';
import { Question } from '../../../types';

const openQuestionDetail = vi.fn();
const toggleQuestionUpvote = vi.fn();
const toggleQuestionResolved = vi.fn();

vi.mock('../../../context/DoubtContext', () => ({
  useDoubt: () => ({
    subjects: [{ id: 'sub-1', name: 'Data Structures', code: 'CS201', color: 'indigo' }],
    openQuestionDetail,
    toggleQuestionUpvote,
    toggleQuestionResolved,
    hasUpvotedQuestion: () => false,
  }),
}));

const baseQuestion: Question = {
  id: 'q-test-1',
  subject: 'Data Structures',
  category: 'Conceptual',
  content: 'Why are linked lists useful?',
  upvotes: 4,
  isResolved: false,
  answers: [],
  createdAt: new Date().toISOString(),
};

describe('QuestionCard', () => {
  it('renders the question content, subject, and upvote count', () => {
    render(<QuestionCard question={baseQuestion} />);
    expect(screen.getByText(/Why are linked lists useful\?/)).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText(/0 Answers/)).toBeInTheDocument();
  });

  it('never renders any asker identity, even implicitly', () => {
    render(<QuestionCard question={baseQuestion} />);
    // The card must not leak an identity field for the asker under any circumstance
    expect(screen.queryByText(/Sneaky Student/)).not.toBeInTheDocument();
  });

  it('opens the question detail when clicked', () => {
    render(<QuestionCard question={baseQuestion} />);
    fireEvent.click(screen.getByText(/Why are linked lists useful\?/));
    expect(openQuestionDetail).toHaveBeenCalledWith(baseQuestion);
  });

  it('shows the top answer author and level when answers exist', () => {
    const withAnswer: Question = {
      ...baseQuestion,
      answers: [
        {
          id: 'ans-1',
          questionId: 'q-test-1',
          content: 'Because insertion is O(1) at the head.',
          authorType: 'Named',
          authorName: 'Rahul',
          isSenior: true,
          explanationLevel: 'Beginner',
          upvotes: 10,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    render(<QuestionCard question={withAnswer} />);
    expect(screen.getByText('Rahul')).toBeInTheDocument();
    expect(screen.getByText(/1 Answer/)).toBeInTheDocument();
  });
});
