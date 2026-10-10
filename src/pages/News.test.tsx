import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { News } from './News';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('News Instagram-style Swiping Carousel', () => {
  it('renders single news story and shows right arrow but NO left arrow initially', async () => {
    renderWithRouter(<News />);

    // Wait for news data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Story 1 of/i)).toBeInTheDocument();
    });

    // On story 1 (index 0): Left arrow should NOT exist
    const prevButton = screen.queryByRole('button', { name: /previous article/i });
    expect(prevButton).not.toBeInTheDocument();

    // Right arrow SHOULD exist
    const nextButton = screen.getByRole('button', { name: /next article/i });
    expect(nextButton).toBeInTheDocument();

    // Instagram counter pill should show "1"
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('navigates to next story when clicking right arrow, showing both left and right arrows', async () => {
    renderWithRouter(<News />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Story 1 of/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next article/i });
    fireEvent.click(nextButton);

    // Now on Story 2: BOTH left and right arrows must exist
    expect(screen.getByLabelText(/Story 2 of/i)).toBeInTheDocument();
    const prevButton = screen.getByRole('button', { name: /previous article/i });
    expect(prevButton).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next article/i })).toBeInTheDocument();

    // Clicking left arrow returns to Story 1
    fireEvent.click(prevButton);
    expect(screen.getByLabelText(/Story 1 of/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous article/i })).not.toBeInTheDocument();
  });

  it('navigates to the last story and hides the right arrow', async () => {
    renderWithRouter(<News />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Story 1 of/i)).toBeInTheDocument();
    });

    // Advance until we reach the last story
    let nextBtn = screen.queryByRole('button', { name: /next article/i });
    while (nextBtn) {
      fireEvent.click(nextBtn);
      nextBtn = screen.queryByRole('button', { name: /next article/i });
    }

    // Now on last story: Right arrow must NOT exist, Left arrow MUST exist
    expect(screen.queryByRole('button', { name: /next article/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous article/i })).toBeInTheDocument();
  });

  it('ensures all rendered news stories have an option to explore event impact', async () => {
    renderWithRouter(<News />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Story 1 of/i)).toBeInTheDocument();
    });

    // Check that every story in the carousel has the "Explore event impact" button
    const eventButtons = screen.getAllByRole('button', { name: /explore event impact/i });
    expect(eventButtons.length).toBeGreaterThan(0);

    // Count of stories in the feed equals the count of explore event impact buttons
    const counterPill = screen.getByLabelText(/Story 1 of (\d+)/i);
    const totalMatch = counterPill.getAttribute('aria-label')?.match(/Story 1 of (\d+)/);
    const totalCount = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    expect(eventButtons.length).toBe(totalCount);
  });
});
