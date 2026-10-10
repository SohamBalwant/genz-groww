import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from '../state/AppContext';
import { EventPage } from './EventPage';

describe('EventPage Asset Class Impacts Swiping Carousel', () => {
  it('renders single asset impact with right arrow and no left arrow on first slide', async () => {
    render(
      <AppProvider>
        <MemoryRouter initialEntries={['/event/evt-rbi-001']}>
          <Routes>
            <Route path="/event/:id" element={<EventPage />} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    );

    // Wait for event to load
    await waitFor(() => {
      expect(screen.getByText(/3. Asset Class Impacts & Inherent Caveats/i)).toBeInTheDocument();
    });

    // Check counter pill
    expect(screen.getByText('1')).toBeInTheDocument();

    // First slide: Left arrow must NOT exist
    const prevBtn = screen.queryByRole('button', { name: /previous asset impact/i });
    expect(prevBtn).not.toBeInTheDocument();

    // Right arrow MUST exist
    const nextBtn = screen.getByRole('button', { name: /next asset impact/i });
    expect(nextBtn).toBeInTheDocument();

    // Click next arrow to slide to second asset impact
    fireEvent.click(nextBtn);

    // On slide 2 (out of 4): BOTH Left and Right arrows must exist
    expect(screen.getByRole('button', { name: /previous asset impact/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next asset impact/i })).toBeInTheDocument();

    // Advance until we reach the last asset impact slide
    let advanceBtn = screen.queryByRole('button', { name: /next asset impact/i });
    while (advanceBtn) {
      fireEvent.click(advanceBtn);
      advanceBtn = screen.queryByRole('button', { name: /next asset impact/i });
    }

    // On last slide: Left arrow exists, Right arrow does NOT exist
    expect(screen.getByRole('button', { name: /previous asset impact/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next asset impact/i })).not.toBeInTheDocument();

    // Click previous arrow all the way back to the first asset impact
    let backBtn = screen.queryByRole('button', { name: /previous asset impact/i });
    while (backBtn) {
      fireEvent.click(backBtn);
      backBtn = screen.queryByRole('button', { name: /previous asset impact/i });
    }

    // Back on first slide: Left arrow does NOT exist, Right arrow MUST exist
    expect(screen.queryByRole('button', { name: /previous asset impact/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next asset impact/i })).toBeInTheDocument();
  });

  it('renders Section 5 Simulate and Section 6 Decide with AI correctly', async () => {
    render(
      <AppProvider>
        <MemoryRouter initialEntries={['/event/evt-rbi-001']}>
          <Routes>
            <Route path="/event/:id" element={<EventPage />} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    );

    // Verify Section 5: Simulate
    await waitFor(() => {
      expect(screen.getByText('5. Simulate')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Test an amount, holding period and hypothetical entry price, including estimated charges/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Estimated Charges/i).length).toBeGreaterThanOrEqual(1);

    // Toggle fee breakdown
    const feeToggle = screen.getByRole('button', { name: /view breakdown/i });
    fireEvent.click(feeToggle);
    expect(screen.getByText(/Estimated Statutory & Regulatory Charges/i)).toBeInTheDocument();

    // Verify Section 6: Decide with AI
    expect(screen.getByText('06. Decide with AI')).toBeInTheDocument();
    expect(
      screen.getByText(/Review risks and evidence before choosing to research more, add to a watchlist or proceed to the normal order flow/i)
    ).toBeInTheDocument();

    // Verify the 3 action pathways
    expect(screen.getByRole('button', { name: /research instrument/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed to order ticket/i })).toBeInTheDocument();

    // Toggle Watchlist button (bond-gsec-001 is in initial watchlist, so it shows '✓ In Watchlist')
    const initialWatchlistBtn = screen.getByRole('button', { name: /in watchlist/i });
    expect(initialWatchlistBtn).toBeInTheDocument();
    fireEvent.click(initialWatchlistBtn);
    expect(screen.getByRole('button', { name: /\+ add to watchlist/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /\+ add to watchlist/i }));
    expect(screen.getByRole('button', { name: /in watchlist/i })).toBeInTheDocument();

    // Verify renumbered instruments section
    expect(screen.getByText(/7. Instruments Touched by This Event/i)).toBeInTheDocument();
  });
});
