import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from '../state/AppContext';
import { LearnPage } from './LearnPage';

const renderLearnPage = (initialRoute: string = '/learn') => {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/learn" element={<LearnPage />} />
        </Routes>
      </MemoryRouter>
    </AppProvider>
  );
};

describe('LearnPage Structured Learning Paths & Quizzes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders progress tracking dashboard and curriculum modules by default', async () => {
    renderLearnPage();

    // Check title and progress dashboard
    expect(screen.getByText('Learn & Practice')).toBeInTheDocument();
    expect(screen.getByText(/Curriculum Mastered/i)).toBeInTheDocument();
    expect(screen.getByText(/Bite-Sized Chapters Read/i)).toBeInTheDocument();
    expect(screen.getByText(/Module Quizzes Passed/i)).toBeInTheDocument();

    // Verify 4 structured modules exist
    expect(screen.getByText(/1. Foundations of Wealth & Compounding/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Mastering Index Funds & Mutual Funds/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Fixed Income, Bonds & Debt Instruments/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Fundamental Stock Analysis & Financials/i)).toBeInTheDocument();

    // Verify "Key Concepts" and "Learning Milestones" tabs do NOT exist
    expect(screen.queryByText('Key Concepts')).not.toBeInTheDocument();
    expect(screen.queryByText('Learning Milestones')).not.toBeInTheDocument();
  });

  it('opens chapter reader modal, displays rupee example and takeaways, and marks chapter completed', async () => {
    renderLearnPage();

    // Click "Read Chapter" on Chapter 1.1
    const readBtns = screen.getAllByRole('button', { name: /(Read|Review) Chapter/i });
    expect(readBtns.length).toBeGreaterThan(0);
    fireEvent.click(readBtns[0]);

    // Verify reader modal is opened
    const dialog = await screen.findByRole('dialog', { name: /Chapter Reader/i });
    expect(within(dialog).getByText(/Chapter Overview/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/The ₹1,00,000 Purchasing Power Test/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/Key Takeaways/i)).toBeInTheDocument();

    // Click Mark Complete & Next Chapter
    const completeBtn = within(dialog).getByRole('button', { name: /Mark Complete & Next Chapter/i });
    fireEvent.click(completeBtn);

    // Moves to Chapter 1.2
    expect(within(dialog).getByText(/The Compounding Engine: Rule of 72 & Starting Early/i)).toBeInTheDocument();

    // Close reader modal
    const closeBtn = within(dialog).getByRole('button', { name: /Close chapter reader/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: /Chapter Reader/i })).not.toBeInTheDocument();
  });

  it('launches module quiz, provides instant answer feedback, and records score', async () => {
    renderLearnPage();

    // Click Take Module Quiz on Module 1
    const quizBtns = screen.getAllByRole('button', { name: /Take Module Quiz/i });
    expect(quizBtns.length).toBeGreaterThan(0);
    fireEvent.click(quizBtns[0]);

    // Verify quiz modal opened
    const dialog = await screen.findByRole('dialog', { name: /Module Quiz/i });
    expect(within(dialog).getByText(/Question 1 of 3/i)).toBeInTheDocument();

    // Select the correct option for Q1 (Option B: index 1)
    const options = within(dialog).getAllByRole('button', { name: /[A-D]/i });
    fireEvent.click(options[1]); // "Your purchasing power is shrinking..."

    // Verify instant feedback analysis appears
    expect(within(dialog).getByText(/Correct Analysis!/i)).toBeInTheDocument();

    // Advance to Question 2
    fireEvent.click(within(dialog).getByRole('button', { name: /Next Question/i }));
    expect(within(dialog).getByText(/Question 2 of 3/i)).toBeInTheDocument();

    // Select correct option for Q2 (Option C: 6 years, index 2)
    const optionsQ2 = within(dialog).getAllByRole('button', { name: /[A-D]/i });
    fireEvent.click(optionsQ2[2]);
    expect(within(dialog).getByText(/Correct Analysis!/i)).toBeInTheDocument();

    // Advance to Question 3
    fireEvent.click(within(dialog).getByRole('button', { name: /Next Question/i }));
    expect(within(dialog).getByText(/Question 3 of 3/i)).toBeInTheDocument();

    // Select correct option for Q3 (Option B: Liquid Mutual Fund, index 1)
    const optionsQ3 = within(dialog).getAllByRole('button', { name: /[A-D]/i });
    fireEvent.click(optionsQ3[1]);

    // Finish quiz
    fireEvent.click(within(dialog).getByRole('button', { name: /Finish Quiz & Record Score/i }));

    // Verify completion summary shows passed/mastered
    await waitFor(() => {
      expect(within(dialog).getByText(/Module Mastered!/i)).toBeInTheDocument();
    });
    expect(within(dialog).getByText(/You scored/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/3 out of 3/i)).toBeInTheDocument();

    // Return to modules
    fireEvent.click(within(dialog).getByRole('button', { name: /Return to Modules/i }));
    expect(screen.queryByRole('dialog', { name: /Module Quiz/i })).not.toBeInTheDocument();
  });
});

describe('LearnPage Expert Posts Swiping Carousel', () => {
  it('renders swipeable carousel with single post at a time and directional arrows', async () => {
    renderLearnPage('/learn?tab=posts');

    // Wait for posts to load
    await screen.findByText(/Aditi Sharma, CFA/i);

    // Check counter pill
    expect(screen.getByText(/Post 1 of 5/i)).toBeInTheDocument();

    // On post 1: Left arrow should NOT exist
    const prevBtn = screen.queryByRole('button', { name: /previous expert post/i });
    expect(prevBtn).not.toBeInTheDocument();

    // Right arrow SHOULD exist
    const nextBtn = screen.getByRole('button', { name: /next expert post/i });
    expect(nextBtn).toBeInTheDocument();

    // Click next arrow to slide to Post 2
    fireEvent.click(nextBtn);

    // On Post 2: BOTH left and right arrows must exist
    expect(screen.getByText(/Post 2 of 5/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous expert post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next expert post/i })).toBeInTheDocument();

    // Advance to last post
    let advBtn = screen.queryByRole('button', { name: /next expert post/i });
    while (advBtn) {
      fireEvent.click(advBtn);
      advBtn = screen.queryByRole('button', { name: /next expert post/i });
    }

    // On last post: Left arrow exists, Right arrow does NOT exist
    expect(screen.getByRole('button', { name: /previous expert post/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next expert post/i })).not.toBeInTheDocument();
  });
});

describe('LearnPage Q&A Discussions', () => {
  it('does NOT render community standards and rules, and provides interactive question search and tag filtering', async () => {
    renderLearnPage('/learn?tab=qa');

    // Wait for threads to load
    await screen.findByText(/What is the practical difference between a SIP and investing a lumpsum/i);

    // Verify "Community Standards & Rules" is NOT in Q&A tab
    expect(screen.queryByText(/Community Standards & Rules/i)).not.toBeInTheDocument();

    // Verify search bar exists
    const searchInput = screen.getByRole('textbox', { name: /Search questions/i });
    expect(searchInput).toBeInTheDocument();

    // Search for "Gold"
    fireEvent.change(searchInput, { target: { value: 'Gold' } });

    // Gold thread should be visible
    expect(
      screen.getByText(/Are sovereign gold bonds or Gold ETFs better for a 22-year-old beginner/i)
    ).toBeInTheDocument();

    // SIP thread should NOT be visible
    expect(
      screen.queryByText(/What is the practical difference between a SIP and investing a lumpsum/i)
    ).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearBtn);

    // SIP thread is visible again
    expect(
      screen.getByText(/What is the practical difference between a SIP and investing a lumpsum/i)
    ).toBeInTheDocument();

    // Search for a non-existent question to test empty state
    fireEvent.change(searchInput, { target: { value: 'cryptocurrency speculative coin' } });
    expect(screen.getByText(/No questions found matching your search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ask This Question/i })).toBeInTheDocument();
  });

  it('renders swipeable Q&A carousel with single question at a time and directional arrows', async () => {
    renderLearnPage('/learn?tab=qa');

    // Wait for threads to load
    await screen.findByText(/What is the practical difference between a SIP and investing a lumpsum/i);

    // Check question counter pill (1 / total)
    expect(screen.getByText('1')).toBeInTheDocument();

    // On Question 1: Left arrow should NOT exist
    expect(screen.queryByRole('button', { name: /previous question/i })).not.toBeInTheDocument();

    // Right arrow SHOULD exist
    const nextBtn = screen.getByRole('button', { name: /next question/i });
    expect(nextBtn).toBeInTheDocument();

    // Click next arrow to slide to Question 2
    fireEvent.click(nextBtn);

    // On Question 2: BOTH left and right arrows must exist
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous question/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();

    // Advance to last question
    let advBtn = screen.queryByRole('button', { name: /next question/i });
    while (advBtn) {
      fireEvent.click(advBtn);
      advBtn = screen.queryByRole('button', { name: /next question/i });
    }

    // On last question: Left arrow exists, Right arrow does NOT exist
    expect(screen.getByRole('button', { name: /previous question/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next question/i })).not.toBeInTheDocument();
  });
});


