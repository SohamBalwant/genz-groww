# Groww for Gen Z — Interactive Prototype

> **Independent Design Study & PM Assignment Prototype**  
> **Topic:** Designing Groww for the Gen Z investor (ages 20–26)  
> **Disclaimer:** This is an independent concept study and design proposal. It is **NOT** an official Groww product, service, or endorsement. All market figures, company data, and news items are illustrative demo fixtures (`isDemo: true`). All orders are simulated in browser storage; no actual trades, brokerage transactions, or payment transfers take place.

---

## 1. Product Thesis & Core Journey

Young Indian investors (ages 20–26) frequently consume market news on social channels and financial media without understanding the underlying mechanics or risks. When an event occurs (such as an RBI repo rate cut or a crude oil price spike), a beginner often lacks the context to understand:
1. What actually happened (confirmed facts) vs what analysts predict (speculation).
2. Which asset classes and instruments could be affected, and why.
3. The vital distinction between long-term investment horizon and short-term trading volatility.
4. The exact statutory costs and regulatory risks before committing capital.

### The Guided Journey
```
Discover  ──>  Understand  ──>  Explore Instruments  ──>  Review Risks & Costs  ──>  Make Your Own Decision
 (News/Feed)   (Facts vs Analysis)  (Stocks/MFs/Bonds)       (Itemised Charges)        (Explicit Confirmation)
```

### Core Design Principles
- **Trust Over Engagement:** No FOMO, no countdown timers, no artificial urgency, and no gamified trading streaks.
- **Facts vs Analysis Distinct:** Confirmed regulatory and corporate announcements are strictly demarcated from analytical commentary and interpretations.
- **Accidental Trade Guard:** Notifications and macro events never link directly to buy/sell orders. Users must navigate through an instrument's risk disclosures and confirm an order explicitly with a mandatory confirmation checkbox.
- **Costs Shown Before Commitment:** Itemised regulatory and statutory fees (Brokerage, STT, Exchange Turnover, SEBI, GST, Stamp Duty, DP charges) are calculated dynamically before an order is placed.

---

## 2. Fully Functional vs Simulated Matrix

| Area | Fully Functional (Real Interaction Logic) | Illustrative / Simulated |
|---|---|---|
| **Navigation & Form Factor** | Primarily mobile-app first: 100% edge-to-edge on mobile phones, with a realistic smartphone simulator shell (Phone / Frameless / Expanded modes) on desktop | Native bottom navigation across all 14 screens |
| **Category Discovery** | Interactive switching across 5 categories (MFs, Stocks, Bonds, ETFs, IPOs), real-time debounced search, category filters and sorting | Static realistic market fixtures |
| **News & Event Engine** | Structured feed, Fact vs Analysis visual split, uncertainties callouts, related instrument relevance links | Invented mock news & simulated scenarios |
| **Itemised Fee Engine** | Config-driven pure fee engine (`calculateCharges`), APPLIES vs CONDITIONAL separation, net payable calculation | Static demo rate schedule |
| **Options Module** | Education gate with comprehension check, ITM/ATM/OTM moneyness assignment, interactive payoff chart, Greeks toggles, breakeven/max loss calculations | Buy-only contracts (option writing disabled for learner safety) |
| **Stock Financials** | Metric cards with previous period comparisons, annual/quarterly toggle, interactive Recharts charts & tables, popovers | Sample corporate balance sheets |
| **Order Simulation** | Draft creation, validation, mandatory review checkbox, execution timestamping (IST), simulated orders ledger (`localStorage`) | Order simulated locally; no live exchange |
| **Community & Safety** | Filter tabs, conflict disclosures, report dialog with user feedback, milestone regex blocking ₹ figures | Mock expert posts; no external server |

---

## 3. Key Modules & Screens

- **Home (`/`):** Unified discovery dashboard with category selector (Mutual Funds, Stocks, Bonds, ETFs, IPOs), live search, "Relevant Today" market insights, and interactive demo scenario triggers (RBI Rate Cut, Brent Crude Surge).
- **News & Insights (`/news`, `/news/:id`):** Topic-filtered news stories featuring the **Fact vs Analysis** component, uncertainty callouts, and contextual links to affected instruments with specific rationales.
- **Event Detail (`/event/:id`):** Deep dive on macroeconomic events (e.g. Monetary Policy decisions). Outlines confirmed facts, plain-English "why it matters" with concrete rupee examples, asset class impact caveats, and affected instruments with "View details" buttons.
- **Instrument Detail (`/instrument/:id`):** Comprehensive multi-asset screen:
  - **Stocks:** Overview, interactive price chart, key ratios, news, about, Financials tab, and Options tab.
  - **Mutual Funds:** 6-tier Riskometer, expense ratio with embedded NAV explanation, trailing returns table, and an interactive SIP & Lumpsum wealth calculator.
  - **Bonds:** Coupon rate vs Yield-to-Maturity (YTM) explainer, credit rating agency badge (or "Unrated"), maturity timeline, and 3 risk pillars (Credit, Interest Rate, Liquidity).
  - **ETFs & IPOs:** Tracking metrics, price bands, lot sizes, and peer comparisons.
- **Financials Tab (Stocks):** 7 core metric cards (Revenue, Net Profit, Operating Margin, EPS, P/E, P/B, Debt/Equity) with quarterly/annual views, Recharts trend charts, and edge-case handling (e.g. loss-making companies and bank balance sheet rules).
- **Options Chain (`/instrument/:id/options`):** Derivative module protected by an **Education Gate**. Displays call/put strikes relative to spot, live Greeks (Delta, Gamma, Theta), interactive Payoff Chart, breakeven points, and capped max loss.
- **Simulated Order Flow (`/order/:id` -> `/order/review` -> `/order/result/:id`):** Live lot/quantity stepper, real-time fee calculation, itemised regulatory charges breakdown, mandatory confirmation checkbox, and simulated order receipts.
- **Notifications Centre (`/notifications`):** Informational alerts linked to events and instruments with zero FOMO copy and 3 interactive sandbox triggers.
- **Watchlist (`/watchlist`) & Orders (`/orders`):** Saved securities grid and simulated order execution ledger.
- **Learn & Community (`/learn`):** Educational articles, Q&A threads, concepts glossary, milestone sharing with financial value masking, and community guidelines.

---

## 4. Tech Stack & Architecture

- **Framework:** React 18 + TypeScript 5
- **Build Tool:** Vite 5
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Vanilla CSS (Custom design tokens, Groww-inspired color palette `#00B386`)
- **Charts:** Recharts (Payoff charts, financial bar charts, price trends)
- **Icons:** Lucide React
- **Testing:** Vitest 2 + React Testing Library + JSDOM
- **Linting:** ESLint 9 (Flat config)

### Project Directory Structure
```
genz-groww/
├── docs/
│   ├── assumptions.md         # Documented market assumptions and regulatory bounds
│   ├── design-notes.md        # Visual tokens, typography, and responsive layout rules
│   ├── plan.md                # Architectural design and execution roadmap
│   └── qa-report.md           # Verification report covering tests T1 through T20
├── src/
│   ├── app/
│   │   └── routes.tsx         # Route configuration (14 routes + 404 fallback)
│   ├── components/
│   │   ├── charts/            # Recharts wrappers (PayoffChart, FinancialBarChart)
│   │   ├── community/         # GuidelinesCard, PostCard, ReportDialog, MilestoneCard
│   │   ├── layout/            # AppShell, TopBar, BottomNav, Sidebar
│   │   ├── market/            # CategorySelector, StockCard, FundCard, BondCard, RiskMeter
│   │   ├── news/              # FactVsAnalysis, NewsCard, StoryCard
│   │   ├── options/           # EducationGate, OptionChain, ContractPanel, GreeksCell
│   │   ├── trade/             # ChargesBreakdown, OrderTicket, ReviewSheet
│   │   └── ui/                # Button, Card, DemoBadge, InfoPopover, EmptyState
│   ├── data/                  # Static mock fixtures (Stocks, MFs, Bonds, News, Events, Options)
│   ├── lib/
│   │   ├── fees/              # Pure fee engine (calculateCharges, feeConfig, types)
│   │   ├── options/           # Moneyness and payoff math engines
│   │   ├── format.ts          # Indian numbering (en-IN), date formatting in IST
│   │   └── glossary.ts        # 12 core financial terms with rupee examples and limits
│   ├── pages/                 # 14 page views (Home, News, InstrumentDetail, Order, Learn...)
│   ├── services/
│   │   └── dataService.ts     # Mock data query service with simulated async delays
│   ├── state/
│   │   ├── AppContext.tsx     # Global React context provider
│   │   ├── reducer.ts         # Pure state reducer with localStorage persistence
│   │   └── types.ts           # State action and model definitions
│   ├── styles/
│   │   └── index.css          # Tailwind utilities and design system tokens
│   ├── types/
│   │   └── index.ts           # Domain models for instruments, news, orders, and options
│   ├── App.tsx                # Application root with context wrapper
│   └── main.tsx               # DOM entrypoint
├── eslint.config.js           # ESLint 9 configuration
├── package.json               # Scripts and dependencies
├── tsconfig.json              # Strict TypeScript configuration
└── vite.config.ts             # Vite configuration
```

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation
```bash
# Clone the repository and navigate into the workspace
git clone <repo-url>
cd "genz groww"

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the local development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Running Automated Tests
```bash
# Run unit test suite once
npm test

# Run tests in watch mode
npx vitest
```

### Production Build & Linting
```bash
# Typecheck and compile production bundle
npm run build

# Run ESLint check
npm run lint
```

---

## 6. Verification & Quality Assurance (T1 – T20)

All 20 acceptance tests defined in `SPEC.md` §15 have been fully verified:
- **T1 Discovery:** Mutual Funds -> Bonds -> details with distinct risk and yield metrics.
- **T2 News:** Confirmed facts vs analysis separation, uncertainty disclosures, linked instruments.
- **T3 Event -> Instrument:** Balanced RBI repo rate analysis without direct trade prompts.
- **T4 Safe Simulated Trade:** Stepwise order journey with explicit checkbox confirmation.
- **T5 Accidental Trade Guard:** Unit tested: notification browsing and drafting never increments orders.
- **T6 Beginner Comprehension:** 12 glossary terms with plain English definitions and rupee examples.
- **T7 Responsive Design:** Tested across mobile (360px, 390px), tablet (768px), and desktop (1440px).
- **T8 Empty & Error States:** Graceful handling of empty filters, unrated bonds, and missing fields.
- **T9 Build Quality:** Clean `npm run build`, zero ESLint errors/warnings, 33/33 Vitest tests passing.
- **T10 Options Education Gate:** Mandatory comprehension acknowledgement before viewing options.
- **T11 Options Moneyness:** Textual and contrasted ITM/ATM/OTM labelling.
- **T12 Options Payoff Engine:** Mathematical breakeven, max loss, and payoff curve verification.
- **T13 Options Order Ticket:** Buy Call/Put pre-filled, lot size enforced, option writing disabled.
- **T14 Stock Financials:** 7 core metrics, quarterly/annual toggle, Recharts trend charts.
- **T15 Financials Edge Cases:** Tested handling of loss-making P/E, bank debt-to-equity, and zero dividends.
- **T16 Community Compliance:** Credentialed authors, conflict disclosures, and zero-tip standards.
- **T17 Community Safety & Milestone Guard:** Post reporting flow and regex blocking ₹ figures in milestones.
- **T18 Delivery Buy vs Sell Charges:** DP charges conditional on BUY, applied on SELL; stamp duty on BUY only.
- **T19 Charge Transparency Breakdown:** Mathematical formulas, regulatory explainers, and statutory disclaimers.
- **T20 Config-Driven Fee Engine:** Zero hardcoded rates; 100% driven by dynamic rate configuration.

*For full test details and logs, refer to [`docs/qa-report.md`](docs/qa-report.md).*
