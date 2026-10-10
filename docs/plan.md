# Implementation Plan — Groww for Gen Z Prototype

## 1. Project Overview & Deliverables
Interactive, responsive frontend prototype designed for Indian investors aged 20–26 as an independent PM case study. Built with React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, and light SVG/Recharts visualizations. Strictly mock data with explicit demo labelling, itemised fee transparency, and educational friction.

## 2. Milestones Breakdown

### Milestone 1 (M1): Foundation, Tokens, Shell & Data Layer
- Design tokens, Tailwind CSS typography and spacing.
- Responsive AppShell (Bottom navigation on mobile, Sidebar/TopBar on desktop).
- Persistent global prototype banner + universal Demo badges.
- TypeScript interfaces, `services/dataService.ts` async mock data interface.
- Complete mock datasets: Stocks, Mutual Funds, Bonds, ETFs, IPOs, News, Events, Options, Notifications, Community.

### Milestone 2 (M2): Home & Discover Engine
- Market overview ticker (Nifty 50, Sensex, Bank Nifty, 1D changes).
- Universal search with instant debounce and categorized filtering.
- Sticky Category Selector: Mutual Funds, Stocks, ETFs, Bonds, IPOs.
- Category-tailored cards (Coupon vs YTM for bonds, Riskometer + Expense ratio for MFs).
- Category-specific filter chips & sorting controls with empty and skeleton loading states.

### Milestone 3 (M3): News & Insights Feed + Event Detail Engine
- News feed with category tabs (All, Markets, Stocks, Companies, Economy, Bonds) and Beginner/All level filters.
- Structured news cards with distinct "Confirmed Facts" vs "Analysis & Interpretation" sections.
- Deep-dive Event Detail screen:
  1. What happened (Facts with sources and IST timestamps).
  2. Why it matters (Plain-English impact with rupee examples).
  3. Category-level impacts with mandatory caveats.
  4. Affected instruments with explicit linkage rationale and uncertainties.
  5. Educational links (RBI, SEBI, AMFI, NSE).

### Milestone 4 (M4): Instrument Detail Suite
- Dedicated detail pages for each asset class (Stock, Mutual Fund, Bond, ETF, IPO).
- Charting with 1D/1W/1M/1Y/5Y toggles.
- Product-specific risk breakdowns (Credit/Liquidity/Duration for bonds; Riskometer for MFs).
- Watchlist bookmarking with localStorage persistence.

### Milestone 5 (M5): Pure Cost Engine & Order Flow
- Isolated `lib/fees/calculateCharges.ts` driven exclusively by `feeConfig.ts` with demo rates.
- Itemised `ChargesBreakdown` distinguishing "Applies to this order" vs "May apply in other situations" (conditional DP charges, etc.).
- Complete order funnel: Ticket -> Review screen with mandatory consent checkbox -> Simulated Result -> Orders list.
- Strict guard against automated order execution.

### Milestone 6 (M6): Notification Centre & Market Simulation
- Notifications drawer with unread tracking, filtering, and timestamp grouping.
- "Demo: Simulate market event" control triggering 3 scenarios:
  1. RBI policy rate cut (repo rate, bond yields, bank NIMs).
  2. Quarterly earnings report (revenue/profit beat, guidance explainer).
  3. Crude oil price surge (OMC refining margins, inflation caveats).
- Flow verification: Notification -> Event Detail -> Affected Instruments -> Instrument Detail -> Ticket -> Order Review.

### Milestone 7 (M7): Stock Financials Tab
- Sticky header with As-of date, source, basis (Consolidated/Standalone), unit (₹ Cr).
- Metric cards for P/E, EPS, ROE, D/E, Dividend Yield, YoY Revenue & Profit growth.
- Annual vs Quarterly toggle with dual chart & table representations.
- Edge case handling: "Not meaningful" for loss-making firms, "Not comparable for banks" for D/E, "No dividend declared", and null value fallbacks.

### Milestone 8 (M8): Options Derivative Module
- Education gate with mandatory "I understand options risk" acknowledgement before access.
- Persistent high-risk derivative warning strip.
- Option Chain with Expiry selector, Call/Put columns, Greeks toggle (Delta, Gamma, Theta with tooltips).
- Clear ITM, ATM, OTM visual and text labelling (not color-alone).
- Interactive Payoff Chart (breakeven, max loss, theoretically unlimited gain for calls).
- Buy-only options order ticket with lot-size calculation and maximum potential loss disclosure.

### Milestone 9 (M9): Learn & Community (Simulated)
- Educational hub with verified expert posts, credential tags, and conflict of interest disclosures.
- Sponsored content explicitly flagged.
- Q&A threads with anonymous questions and source citations.
- Content reporting modal and milestone sharing without financial figures.
- Strict absence of tip-sharing, copy-trading, or gamified leaderboards.

### Milestone 10 (M10): Polish, Watchlist-Aware Insights, QA & Validation
- Watchlist-tailored news filtering.
- LocalStorage reset capability in Settings.
- Comprehensive automated test suite (fee engine, options moneyness/payoff, formatting, and accidental-order prevention).
- Cross-breakpoint testing (360px, 390px, 768px, 1440px) and QA report generation.

## 3. Key Risks & Mitigations
- **Risk:** Inadvertent dark patterns or implied financial advice.
  - *Mitigation:* Strict disclaimer banners, "Possibilities not guarantees" copy, and complete separation of confirmed facts from commentary.
- **Risk:** Complex fee math coupling with UI code.
  - *Mitigation:* Pure functional calculation module `lib/fees/calculateCharges.ts` with 100% unit test coverage.
- **Risk:** Responsive table breakage on mobile for Option Chain.
  - *Mitigation:* Sticky strike column with smooth horizontal container-only scroll and toggleable Greeks.
