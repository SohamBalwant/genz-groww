import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../state/AppContext';
import { NotificationsPage } from './NotificationsPage';

describe('NotificationsPage Cards UI', () => {
  it('renders EVENT, RESULT, and WATCHLIST badges with updated UI and color coding', async () => {
    render(
      <AppProvider>
        <MemoryRouter>
          <NotificationsPage />
        </MemoryRouter>
      </AppProvider>
    );

    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByText(/RBI announces policy repo rate cut/i)).toBeInTheDocument();
    });

    // Check EVENT badge
    const eventBadge = screen.getAllByText('EVENT')[0];
    expect(eventBadge).toBeInTheDocument();
    const eventBadgeContainer = eventBadge.closest('span.inline-flex');
    expect(eventBadgeContainer?.className).toContain('bg-purple-50');
    expect(eventBadgeContainer?.className).toContain('text-purple-700');

    // Check RESULT badge
    const resultBadge = screen.getAllByText('RESULT')[0];
    expect(resultBadge).toBeInTheDocument();
    const resultBadgeContainer = resultBadge.closest('span.inline-flex');
    expect(resultBadgeContainer?.className).toContain('bg-amber-50');
    expect(resultBadgeContainer?.className).toContain('text-amber-800');

    // Check WATCHLIST badge
    const watchlistBadge = screen.getAllByText('WATCHLIST')[0];
    expect(watchlistBadge).toBeInTheDocument();
    const watchlistBadgeContainer = watchlistBadge.closest('span.inline-flex');
    expect(watchlistBadgeContainer?.className).toContain('bg-blue-50');
    expect(watchlistBadgeContainer?.className).toContain('text-blue-700');
  });

  it('formats dates in 24-hour clock without AM/PM or IST', async () => {
    render(
      <AppProvider>
        <MemoryRouter>
          <NotificationsPage />
        </MemoryRouter>
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/14 Mar 2025, 16:05/i)).toBeInTheDocument();
    });

    // Verify 24-hour time exists and there is no AM/PM or IST in the timestamp elements
    expect(screen.getByText(/14 Mar 2025, 16:05/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Mar 2025, 21:55/i)).toBeInTheDocument();

    const timestampElements = screen.getAllByText(/\d{1,2} [A-Z][a-z]{2} \d{4}, \d{2}:\d{2}/);
    expect(timestampElements.length).toBeGreaterThan(0);
    timestampElements.forEach((el) => {
      expect(el.textContent).not.toMatch(/am|pm|AM|PM/);
      expect(el.textContent).not.toContain('IST');
    });
  });

  it('renders "View Instrument Profile" with the exact same styling as "Explore Analysis & Details"', async () => {
    render(
      <AppProvider>
        <MemoryRouter>
          <NotificationsPage />
        </MemoryRouter>
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Apex InfoTech reports Q3 financial results/i)).toBeInTheDocument();
    });

    const exploreBtn = screen.getAllByRole('button', { name: /Explore Analysis & Details/i })[0];
    const profileBtn = screen.getAllByRole('button', { name: /View Instrument Profile/i })[0];

    expect(exploreBtn).toBeInTheDocument();
    expect(profileBtn).toBeInTheDocument();

    // Verify both have the identical typography, color, and hover classes
    expect(exploreBtn.className).toContain('text-primary-600');
    expect(exploreBtn.className).toContain('text-xs');
    expect(exploreBtn.className).toContain('font-bold');
    expect(profileBtn.className).toBe(exploreBtn.className);
  });
});
