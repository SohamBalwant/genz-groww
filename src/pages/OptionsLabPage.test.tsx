import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from '../state/AppContext';
import { OptionsLabPage } from './OptionsLabPage';
import { BottomNav } from '../components/layout/BottomNav';

const renderOptionsLab = (initialRoute: string = '/options') => {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <div>
          <Routes>
            <Route path="/options" element={<OptionsLabPage />} />
          </Routes>
          <BottomNav />
        </div>
      </MemoryRouter>
    </AppProvider>
  );
};

describe('Options Lab Landing Screen & Navigation (P0)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('replaces Watchlist with Options in bottom navigation', () => {
    renderOptionsLab();

    // Verify "Options" exists in bottom nav
    const optionsNavLink = screen.getByRole('link', { name: /options/i });
    expect(optionsNavLink).toBeInTheDocument();
    expect(optionsNavLink).toHaveAttribute('href', '/options');

    // Verify "Watchlist" does NOT exist in navigation
    expect(screen.queryByRole('link', { name: /watchlist/i })).not.toBeInTheDocument();
  });

  it('renders Options Lab header, subtitle, and how options work button without interactive lab badge or beginner/advanced toggle', () => {
    renderOptionsLab();

    expect(screen.getByRole('heading', { level: 1, name: /options lab/i })).toBeInTheDocument();
    expect(
      screen.getByText(/understand the chain\. explore the risk\./i)
    ).toBeInTheDocument();

    // Verify "Interactive Derivatives Lab" is removed
    expect(screen.queryByText(/interactive derivatives lab/i)).not.toBeInTheDocument();

    // Verify Beginner / Advanced options are removed
    expect(screen.queryByRole('button', { name: /^beginner$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^advanced$/i })).not.toBeInTheDocument();

    // Verify "How options work" button exists below the body text
    const howOptionsBtn = screen.getByRole('button', { name: /how options work/i });
    expect(howOptionsBtn).toBeInTheDocument();
  });

  it('opens and closes the "How options work" educational primer modal', async () => {
    renderOptionsLab();

    const howOptionsBtn = screen.getByRole('button', { name: /how options work/i });
    fireEvent.click(howOptionsBtn);

    // Dialog opens
    const dialog = await screen.findByRole('dialog', { name: /how options work beginner guide/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/Demystifying Options: 5 Core Questions/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/What is actually happening in the options market\?/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/How do I read an Option Chain\?/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/What do Delta, Gamma, Theta, and Vega actually mean\?/i)).toBeInTheDocument();

    // Close dialog
    const closeBtn = within(dialog).getByRole('button', { name: /got it, open options lab/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: /how options work beginner guide/i })).not.toBeInTheDocument();
  });
});

describe('Underlying Instrument & Expiry Selection (P0)', () => {
  it('displays supported instruments and switches underlying when clicked', () => {
    renderOptionsLab();

    // Default underlying is NIFTY 50
    expect(screen.getByText(/NIFTY 50 Benchmark Index/i)).toBeInTheDocument();
    expect(screen.queryByText(/Lot: \d+ shares/i)).not.toBeInTheDocument();

    // Click BANKNIFTY
    const bankNiftyBtn = screen.getByRole('button', { name: /banknifty/i });
    fireEvent.click(bankNiftyBtn);

    // Instrument changes to BANKNIFTY
    expect(screen.getByText(/Nifty Bank Index/i)).toBeInTheDocument();
    expect(screen.queryByText(/Lot: \d+ shares/i)).not.toBeInTheDocument();
  });

  it('updates expiry selector and updates DTE when changing expiry', () => {
    renderOptionsLab();

    // Default expiry buttons
    const expiryBtns = screen.getAllByRole('button', { name: /\d{2}-[a-z]{3}-2025/i });
    expect(expiryBtns.length).toBeGreaterThan(1);

    // Select second expiry
    fireEvent.click(expiryBtns[1]);
    expect(screen.getByText(/Time to Expiry:/i)).toBeInTheDocument();
  });

  it('renders market overview metrics including PCR, Max Pain, and Total OI', () => {
    renderOptionsLab();

    // PCR Card
    expect(screen.getByText(/Put\/Call Ratio \(PCR\)/i)).toBeInTheDocument();

    // Max Pain Card
    expect(screen.getByText(/Max Pain Strike/i)).toBeInTheDocument();

    // Total Open Interest Card
    expect(screen.getByText(/Total Open Interest/i)).toBeInTheDocument();
    expect(screen.getByText(/ATM Strike:/i)).toBeInTheDocument();
  });
});

describe('Option Chain Responsiveness & Metric Views (P0 & P1)', () => {
  it('renders Call, Strike, and Put columns with sticky strike column', () => {
    renderOptionsLab();

    expect(screen.getByRole('columnheader', { name: /Calls \(CE\) — Bullish/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Strike Price/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Puts \(PE\) — Bearish/i })).toBeInTheDocument();

    // Jump to ATM button
    expect(screen.getByRole('button', { name: /jump to atm/i })).toBeInTheDocument();
  });

  it('switches metric views between Price, Open Interest, Greeks, and IV', () => {
    renderOptionsLab();

    // Switch to Open Interest view
    const oiBtn = screen.getByRole('button', { name: /open interest/i });
    fireEvent.click(oiBtn);
    expect(screen.getAllByText(/OI Distribution/i).length).toBeGreaterThan(0);

    // Switch to Greeks view
    const greeksBtn = screen.getByRole('button', { name: /greeks \(Δ,Γ,Θ,ν\)/i });
    fireEvent.click(greeksBtn);
    expect(screen.getAllByText(/Delta \(Δ\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Theta \(Θ\)/i).length).toBeGreaterThan(0);

    // Switch to IV view
    const ivBtn = screen.getByRole('button', { name: /implied vol \(iv\)/i });
    fireEvent.click(ivBtn);
    expect(screen.getAllByText(/IV \(%\)/i).length).toBeGreaterThan(0);
  });
});

describe('Contract Panel, Scenario Explorer & Simulator (P1 & P2)', () => {
  it('opens Contract Details panel on contract tap, displays Greeks and Payoff Chart', async () => {
    renderOptionsLab();

    // Tap a Call option cell in the option chain table
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    const firstOptionRow = rows[2];
    const cells = within(firstOptionRow).getAllByRole('cell');
    fireEvent.click(cells[0]);

    // Bottom Sheet Panel opens
    expect(await screen.findByText(/Option Premium \(LTP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Outlay:/i)).toBeInTheDocument();
    expect(screen.getByText(/Option Greeks Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Payoff at Expiration/i)).toBeInTheDocument();
  });

  it('navigates to Explore Scenarios tab and recalculates when moving spot or IV sliders', async () => {
    renderOptionsLab();

    // Tap contract in table
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    const firstOptionRow = rows[2];
    const cells = within(firstOptionRow).getAllByRole('cell');
    fireEvent.click(cells[0]);

    // Click "Explore Scenarios" button
    const scenarioTabs = await screen.findAllByRole('button', { name: /explore scenarios/i });
    fireEvent.click(scenarioTabs[0]);

    // Verify Scenario Explorer is active
    expect(await screen.findByText(/One-Click Market Scenarios:/i)).toBeInTheDocument();
    expect(screen.getByText(/Projected Premium \(Per Share\)/i)).toBeInTheDocument();

    // Click a preset: "Spot Rallies +1.5%"
    const rallyBtn = screen.getByRole('button', { name: /Spot Rallies \+1\.5%/i });
    fireEvent.click(rallyBtn);

    // Verify reset scenario button appears
    expect(screen.getByRole('button', { name: /reset scenario/i })).toBeInTheDocument();
  });

  it('supports right and left directional navigation in Market Scenarios swiping carousel', async () => {
    renderOptionsLab();

    // Tap contract in table
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    const firstOptionRow = rows[2];
    const cells = within(firstOptionRow).getAllByRole('cell');
    fireEvent.click(cells[0]);

    // Click "Explore Scenarios" button
    const scenarioTabs = await screen.findAllByRole('button', { name: /explore scenarios/i });
    fireEvent.click(scenarioTabs[0]);

    // Initial state: right arrow visible, left arrow hidden
    expect(screen.queryByRole('button', { name: /previous market scenario/i })).not.toBeInTheDocument();
    const nextBtn = await screen.findByRole('button', { name: /next market scenario/i });
    expect(nextBtn).toBeInTheDocument();

    // Click next -> now on slide 2, both left and right visible
    fireEvent.click(nextBtn);
    expect(screen.getByRole('button', { name: /previous market scenario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next market scenario/i })).toBeInTheDocument();

    // Click next 3 more times to reach the last scenario (slide 5)
    fireEvent.click(screen.getByRole('button', { name: /next market scenario/i }));
    fireEvent.click(screen.getByRole('button', { name: /next market scenario/i }));
    fireEvent.click(screen.getByRole('button', { name: /next market scenario/i }));

    // On last slide: right arrow hidden, left arrow visible
    expect(screen.queryByRole('button', { name: /next market scenario/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous market scenario/i })).toBeInTheDocument();

    // Click previous arrow -> returns to slide 4, right arrow reappears
    fireEvent.click(screen.getByRole('button', { name: /previous market scenario/i }));
    expect(screen.getByRole('button', { name: /next market scenario/i })).toBeInTheDocument();
  });

  it('navigates to Paper Simulator, allows lot adjustment and saves simulated trade', async () => {
    renderOptionsLab();

    // Tap contract in table
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    const firstOptionRow = rows[2];
    const cells = within(firstOptionRow).getAllByRole('cell');
    fireEvent.click(cells[0]);

    // Click "Paper Simulator" tab
    const simTab = await screen.findByRole('button', { name: /paper simulator/i });
    fireEvent.click(simTab);

    // Verify simulator UI
    expect(await screen.findByText(/Position Side/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of Lots/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulate Settlement Price At Expiry/i)).toBeInTheDocument();

    // Switch side to SELL
    const sellBtn = screen.getByRole('button', { name: /SELL/i });
    fireEvent.click(sellBtn);
    expect(screen.getByText(/High-Risk Option Writing/i)).toBeInTheDocument();

    // Switch back to BUY
    const buyBtn = screen.getByRole('button', { name: /BUY/i });
    fireEvent.click(buyBtn);

    // Click "Save to Paper Portfolio"
    const saveBtn = screen.getByRole('button', { name: /save to paper portfolio/i });
    fireEvent.click(saveBtn);

    // Toast appears
    expect(await screen.findByText(/Simulated Trade Saved!/i)).toBeInTheDocument();
  });
});
