# SPEC.md — "Groww for Gen Z" Interactive Prototype

> Source of truth for the build. If the kickoff prompt and this file disagree, this file wins.
> This is an **independent design study / PM assignment prototype**. It is NOT an official Groww product. All data is mock/illustrative. All trades are simulated.

---

## 1. Problem, user, thesis

**Problem.** Young Indian investors consume market news (news apps, YouTube, Instagram, finfluencers, Reddit) that is disconnected from products they can actually explore. A beginner who sees "RBI changes repo rate" doesn't know: what happened, why it matters, which instruments could be affected, whether it matters for long-term investing vs trading, what the risks are, or what it will cost to act.

**Target user.** Indian investors aged 20-26: college students, first-time investors, first-salary earners, young professionals with limited or irregular income. Mixed knowledge: beginner-friendly without being simplistic for experienced users.

**Hypothesis.** Groww can improve outcomes by connecting financial discovery, understandable news, education and informed decision-making in one simple interface.

**Core journey.**
`Discover -> Understand -> Explore relevant instruments -> Review risks and costs -> Make your own decision`

**Product principles (non-negotiable).**
1. Trust over engagement: no FOMO, no urgency, no gamified trading, no endless-scroll dark patterns.
2. Facts vs interpretation always visually distinguished.
3. Possibilities, never certainties. No "will rise/fall", no "guaranteed", no "risk-free".
4. Costs shown before commitment. Explicit confirmation always.
5. Simple by default, depth on demand (progressive disclosure).
6. Demo data is always labelled; never passed off as live data or real news.

---

## 2. Scope and priorities

### P0 — must work end to end
1. Groww-inspired design system + responsive navigation (bottom nav mobile, sidebar/top nav desktop).
2. Category selector (Mutual Funds, Stocks, ETFs, Bonds, IPOs) with working scrollable feeds, category-specific filters/sorts.
3. News & Insights feed with structured story cards + filters.
4. Event detail screen: What happened / Why it matters / Possible effects & uncertainties / Affected instruments / Source.
5. Navigation: news/event -> affected instrument -> instrument detail.
6. Instrument detail pages (stock, mutual fund, bond, ETF, IPO).
7. Simulated order ticket -> order review with itemised charges -> explicit confirmation -> simulated result.
8. Notification centre + simulated notification trigger demonstrating the full flow.
9. **Itemised cost transparency** (Section 9) wired into every order review.
10. **Stock Financials tab** (Section 7) with metric cards + charts.
11. **Options chain** (Section 6) with Buy Call / Buy Put pre-filled order ticket and payoff chart.
12. Demo-data labelling everywhere (global banner + per-item badges).
13. Empty / error / missing-field states.

### P1 — if feasible
- **Learn & Community** section (Section 8) with mock content, report flow, sponsored disclosure.
- Watchlist (add/remove) and watchlist-aware news.
- Search + sorting across categories.
- Notification preferences.
- Interactive glossary / tooltips everywhere.
- Short-video / expert-explainer placeholders.
- Stock comparison view; multi-leg strategy selector in options (beyond long call/put).
- Anonymous milestone sharing in community.

### P2 — do NOT build
Real brokerage/exchange integration; real push notifications; AI-generated recommendations; full F&O terminal / complex strategies beyond a small illustrative set; social graph, copy-trading, return-based leaderboards, user-generated stock tips; real payment; auth backend.

---

## 3. Tech stack and architecture

First inspect the repo and reuse any existing stack. If empty:
- **React + TypeScript + Vite + Tailwind CSS**, `react-router-dom`, `lucide-react`.
- Charts: lightweight (`recharts` OR hand-rolled SVG). Prefer hand-rolled SVG for payoff and sparkline charts; recharts acceptable for bar/line financial charts. Keep dependencies minimal.
- State: React context + `useReducer` (or Zustand if already present). Persist watchlist, notifications read state, simulated orders and preferences in `localStorage` (guard with try/catch).
- No API keys, no secrets, no backend.

### Suggested folder structure
```
src/
  app/            routes.tsx, App.tsx, layout (AppShell, BottomNav, SideNav, TopBar)
  components/
    ui/           Button, Card, Badge, Chip, Tabs, Tooltip, InfoPopover, Accordion, Modal, Sheet, Skeleton, EmptyState, ErrorState, DemoBadge
    charts/       Sparkline, LineChart, BarChart, PayoffChart
    market/       MarketOverview, CategorySelector, ProductCard(s), PriceChange, RiskMeter
    news/         NewsCard, EventDetail, SourceBlock, FactVsAnalysis
    trade/        OrderTicket, OrderReview, ChargesBreakdown, OrderResult
    options/      OptionChain, StrikeRow, GreeksCell, StrategySummary
    financials/   MetricCard, FinancialsTab, RatioExplainer
    community/    PostCard, QAThread, ReportDialog, GuidelinesCard, SponsoredLabel
  pages/          Home, News, EventPage, Instrument (Stock/MF/Bond/ETF/IPO), Options, Learn, Community, Notifications, Watchlist, Orders, Settings
  data/           mock data files (see Section 4) — NO data inside components
  lib/
    fees/         calculateCharges.ts, feeConfig.ts (demo rates), types.ts, calculateCharges.test.ts
    options/      greeks.ts (static/illustrative), payoff.ts, moneyness.ts
    format.ts     INR formatting (en-IN, lakh/crore), dates (IST), percent
    glossary.ts
  state/          store, selectors, types
  services/       dataService.ts (async interface over mock data; swappable for real API later)
  styles/         tokens.css / tailwind config
```

**Data-access rule:** UI never imports mock files directly. It calls `services/dataService.ts` (async, returns promises, can simulate latency and errors) so a real news/market API can be swapped in later. Do not claim any such integration exists.

---

## 4. Data model (TypeScript)

All mock records include `isDemo: true` and are rendered with a demo badge.

```ts
type AssetClass = 'STOCK' | 'MF' | 'ETF' | 'BOND' | 'IPO';

interface Source { publisher: string; url: string; publishedAt: string /* ISO, IST */; isDemo: true; }

interface NewsStory {
  id: string; headline: string; source: Source;
  category: 'Markets'|'Stocks'|'Companies'|'Economy'|'Bonds';
  eventLabel: string;                  // e.g. "RBI Policy", "Quarterly Results"
  summary: string;                     // what happened (confirmed facts only)
  whyItMatters: string;                // interpretation, labelled as such
  possibleEffects: { assetCategory: string; description: string; direction: 'mixed'|'depends'|'uncertain' }[];
  uncertainties: string[];
  relatedInstrumentIds: string[];
  relevanceReasons: Record<string,string>;  // instrumentId -> why linked
  eventId?: string; mediaType?: 'article'|'video-placeholder'; level: 'beginner'|'intermediate';
}

interface MarketEvent {
  id: string; title: string; type: 'RBI_POLICY'|'EARNINGS'|'COMMODITY'|'INFLATION'|'GOVT'|'GLOBAL';
  occurredAt: string; confirmedFacts: string[]; whyItMatters: string[];
  assetImpacts: { assetCategory: string; explanation: string; caveat: string }[];
  affectedInstruments: { instrumentId: string; reason: string; caveat: string }[];
  risks: string[]; glossaryTermIds: string[]; sources: Source[]; relatedStoryIds: string[];
}

interface BaseInstrument { id: string; assetClass: AssetClass; name: string; isDemo: true; asOf: string; }

interface Stock extends BaseInstrument { ticker: string; sector: string; price: number; changePct: number; changePeriod: '1D';
  description: string; mcapBucket: 'Large'|'Mid'|'Small'; ratios: Partial<Record<'pe'|'eps'|'roe'|'de'|'divYield',number|null>>;
  priceSeries: {t:string;p:number}[]; financials: FinancialsData; hasOptions: boolean; lotSize?: number; recentStoryIds: string[]; }

interface FinancialsData {
  asOf: string; source: string; basis: 'Consolidated'|'Standalone'; currency: 'INR'; unit: 'Cr';
  annual: { period: string; revenue: number|null; profit: number|null; eps: number|null }[];
  quarterly: { period: string; revenue: number|null; profit: number|null; eps: number|null }[];
  metrics: { pe: number|null; eps: number|null; roe: number|null; debtToEquity: number|null; dividendYield: number|null;
             revenueGrowthYoY: number|null; profitGrowthYoY: number|null; sectorMedianPe?: number|null };
}

interface MutualFund extends BaseInstrument { amc: string; category: string; riskLevel: 1|2|3|4|5|6; // Riskometer: Low..Very High
  expenseRatio: number; minSip: number; minLumpsum: number; returns: {period:'1Y'|'3Y'|'5Y'; pct:number|null; annualised:boolean}[];
  categoryExplainer: string; plan: 'Direct'|'Regular'; nav: number; }
interface Bond extends BaseInstrument { issuer: string; coupon: number; ytm: number; maturity: string; rating: string|null; ratingAgency: string|null;
  minInvestment: number; faceValue: number; liquidityNote: string; creditRiskNote: string; rateRiskNote: string; type: 'G-Sec'|'SDL'|'Corporate'|'T-Bill'; }
interface Etf extends BaseInstrument { ticker: string; tracks: string; expenseRatio: number; returns: {period:string;pct:number|null}[]; risks: string[]; price: number; changePct: number; trackingNote: string; }
interface Ipo extends BaseInstrument { company: string; opens: string; closes: string; status: 'Upcoming'|'Open'|'Closed'; priceBand: [number,number]; lotSize: number;
  minInvestment: number; overview: string; keyRisks: string[]; }

interface Notification { id: string; title: string; body: string; type: 'EVENT'|'WATCHLIST'|'RESULT'|'COMPANY'; createdAt: string;
  read: boolean; eventId?: string; instrumentId?: string; isDemo: true; }

// Options
interface OptionContract { strike: number; type: 'CE'|'PE'; ltp: number; changePct: number; volume: number; oi: number;
  iv?: number; delta: number; gamma: number; theta: number; }
interface OptionChainData { underlyingId: string; spot: number; expiries: string[]; lotSize: number; asOf: string; assumptions: string;
  rows: { strike: number; ce: OptionContract; pe: OptionContract }[]; isDemo: true; }

// Orders
interface OrderDraft { instrumentId: string; assetClass: AssetClass|'OPTION'; side: 'BUY'|'SELL'; product: 'DELIVERY'|'INTRADAY'|'OPTION';
  quantity: number; lots?: number; price: number; orderType: 'MARKET'|'LIMIT'; source: 'notification'|'news'|'discover'|'options'|'direct'; }
interface SimulatedOrder extends OrderDraft { id: string; confirmedAt: string; charges: ChargesResult; status: 'SIMULATED'; }

// Community
interface Post { id: string; author: { name: string; credentials: string; verifiedBy: string; isDemo: true }; title: string; body: string;
  sources: {label:string;url:string}[]; sponsored?: { sponsor: string; disclosure: string }; conflictsDisclosure?: string; tags: string[]; }
interface Thread { id: string; question: string; askedBy: 'Anonymous'; answers: { id:string; author:Post['author']; body:string; sources?:{label:string;url:string}[] }[]; }
```

### Seed data requirements (all labelled "Demo data")
- ~12 stocks across sectors (incl. an oil company, a bank, an IT company, an FMCG, one loss-making company for negative-EPS edge case, one with no dividend). Use fictional-but-plausible names OR real names with prominent "illustrative" labelling; prices/ratios must be marked illustrative either way. **Prefer fictional names** (e.g., "Bharat Petrochem Ltd") to avoid implying real figures; if using real company names, never show invented figures as real.
- ~8 mutual funds (index, large-cap, flexi-cap, ELSS, liquid, debt, hybrid, small-cap) with riskometer levels.
- ~6 bonds (G-Sec, SDL, T-Bill, 3 corporate with ratings; one with `rating: null`).
- ~5 ETFs, ~4 IPOs (Upcoming, Open, Closed).
- ~14 news stories covering all filters; ~4 market events: **RBI policy-rate change, quarterly results, oil-price move, inflation print**.
- 1 stock with full option chain (~11 strikes x 3 expiries, even if only the nearest expiry has complete data); lot size defined.
- 8-10 notifications (mixed read/unread).
- Community: ~5 expert posts, ~4 Q&A threads, 1 sponsored post, ~8 curated concepts.
- Glossary: expense ratio, YTM, coupon, P/E, EPS, ROE, D/E, dividend yield, earnings surprise, investing vs trading, bond price vs rates, Delta, Gamma, Theta, IV, moneyness, STT, GST, stamp duty, DP charges, lot size, breakeven.

---

## 5. Screens and flows

### 5.1 Global shell
- **Mobile (<768px):** top bar (logo-ish wordmark "Groww-inspired", search, bell with unread count) + bottom nav: **Home, News, Learn, Watchlist, Orders** (Options reachable via Stocks category / stock detail "Options" tab and Home shortcut).
- **Desktop (>=1024px):** left sidebar nav + top bar; content max-width ~1100px with optional right rail (watchlist/market summary). Tablet: collapsible nav.
- **Persistent slim banner:** "Prototype · Demo data & simulated trades. Not real market data. Not financial advice. Independent design study, not an official Groww product." Dismissible per session but a compact "DEMO" chip remains in the top bar. Every price/news item carries a small `Demo` badge.

### 5.2 Home / Discover
1. Market overview strip (illustrative index levels, 1D change, with +/- text and arrow, not colour alone).
2. Search bar (instruments + news + glossary; P1 debounce, empty state).
3. **Category selector** (chips/segmented, sticky on scroll): Mutual Funds · Stocks · ETFs · Bonds · IPOs. Selecting swaps the feed below without a page reload, preserves scroll gracefully, and remembers the last category.
4. Category-specific **filters + sort** (see 5.3).
5. Scrollable product list (paged/“Show more”, not infinite).
6. "Relevant for you today" news (3 cards max) + watchlist highlights + "See all news".
7. Bell entry point; "Simulate a market event" demo control (clearly labelled demo tool, see 5.8).

### 5.3 Category cards, filters and sorts
| Category | Card fields | Filters | Sort |
|---|---|---|---|
| Mutual Funds | name, category, riskometer (label + meter), expense ratio, min SIP, 1Y/3Y/5Y returns (labelled "past returns, not a guide to future"), 1-line category explainer, Explore | Category (Equity/Debt/Hybrid/Index/ELSS), Risk level, Plan (Direct), Min SIP | Returns (3Y), Expense ratio, Risk |
| Stocks | name+ticker, price, change (labelled "1D"), description snippet, P/E & market-cap bucket, latest headline, View | Sector, Market cap, Has options, Movers | Change, Market cap, P/E |
| ETFs | name, tracks, expense ratio, returns, risks chip, details | Asset type (Equity index/Gold/Debt), Expense ratio | Expense ratio, Returns |
| Bonds | issuer, coupon vs **YTM (shown separately, labelled)**, maturity, rating+agency (or "Unrated"), min investment, risk chips (liquidity/credit/interest-rate), Explore | Type (G-Sec/SDL/Corporate/T-Bill), Rating bucket, Maturity band | YTM, Maturity, Min investment |
| IPOs | company, dates, status badge, price band, lot size, min investment, overview, key risks, "Explore IPO" | Status | Open date |

Always include **empty state** ("No funds match these filters" + Clear filters) and loading skeletons.

### 5.4 News & Insights
- Tabs/filters: **All · Markets · Stocks · Companies · Economy · Bonds**, plus "My watchlist" toggle (P1) and level toggle (Beginner / All).
- **News card layout (in order):** headline · publisher + relative/absolute IST time + `Demo` badge · event label chip · "What happened" (2-3 lines) · "Why it matters" (1-2 lines, labelled *Interpretation*) · "Could be relevant to" chips (companies/categories) · buttons: **Read full story · Learn more · View instrument**.
- Finite, paged feed ("Load more"). No autoplay. Video/expert placeholder cards are static placeholders labelled "Video placeholder (demo)".
- News detail page: facts section (labelled *Confirmed facts*) vs *Analysis & interpretation* section; uncertainties; linked instruments with per-instrument relevance reason; source block with timestamp and "View source" link (demo URLs to `#`/example.com marked as demo); glossary terms inline.

### 5.5 Event detail (core differentiator)
Sections, in order:
1. Header: event title, type chip, time, `Demo`.
2. **What happened** — confirmed facts, with source + timestamp.
3. **Why it matters** — plain English, rupee examples ("If a bond pays ₹7,000/yr on ₹1,00,000..."), labelled *Interpretation*.
4. **How different asset categories could be affected** — per category: possible effect + caveat. Must say direction depends on circumstances; never one-directional blanket claims.
5. **Is this relevant to a long-term investor or a short-term trader?** (brief, balanced)
6. **Affected instruments** — cards with *why linked* and *what could go differently*. CTA: **View details** (primary). A secondary "Explore" only; **no "Buy now"/"Sell now" on this screen.**
7. Risks & uncertainty.
8. Learn more (glossary accordions) + authoritative links (RBI, SEBI, NSE/BSE, AMFI, Investor.gov-style education sites — as plain links marked "external").
9. Sources.

### 5.6 Instrument detail
Common: header (name, price/NAV, change with period label), demo badge, chart with period toggle (1D/1W/1M/1Y/5Y; illustrative), tabs, risks & disclosures, sticky CTA bar (mobile) / right panel (desktop).

- **Stock tabs:** Overview · **Financials** · News & Events · **Options** (if `hasOptions`) · About. CTAs: Buy / Sell (open order ticket), Add to watchlist.
- **Mutual fund:** overview, riskometer, expense ratio explainer, returns table (labelled), SIP/lumpsum calculator (illustrative, simple), risks, "Start SIP (simulated)" -> review screen with applicable fees note (expense ratio is embedded in NAV; no brokerage for direct plans, note stamp duty on purchase where relevant — use demo config).
- **Bond:** coupon vs YTM explanation, maturity, rating, cash-flow illustration, three risk blocks (liquidity, credit, interest-rate), "Why prices move when rates change" accordion, buy -> simulated review.
- **ETF:** tracks, expense ratio, tracking note, risks; Buy/Sell like stock (delivery).
- **IPO:** timeline, price band, lot size, min investment (= lot size x upper band), overview, risks; "Apply (simulated)" -> review with confirmation. No "subscribe now" urgency; no "grey market premium".

### 5.7 Order flow (stocks/ETFs; adapted for others)
`Order ticket -> Order review -> Explicit confirmation -> Simulated result`
- **Ticket:** instrument pre-filled (via notification/news/option chain), Buy/Sell toggle (default from entry point; user can change), Delivery/Intraday (stocks), quantity stepper, order type (Market/Limit; limit price field), illustrative price, order value, live-updating *estimated* charges summary line ("Est. charges ₹X · expand"), risk note, "Review order" button. Quantity validation (>=1, integer, caps, lot multiples for options). Intraday shows a short note on squared-off positions and higher risk.
- **Review:** instrument, side, qty, price, order value, **ChargesBreakdown (Section 9)**, estimated net payable/receivable, relevant risk note by asset class, "Prototype: this will NOT be sent to any exchange" notice, checkbox **"I understand this is a simulated order and I've reviewed the charges"** (required), buttons **Edit order** and **Confirm simulated order** (disabled until checked). 
- **Result:** "Simulated order recorded" — never says "executed on exchange". Shows order id, timestamp, and a link to Orders. Stored in Orders list with `SIMULATED` badge.
- **Guards:** no auto-submission from any notification, deep link or news CTA; order drafts are never persisted as confirmed; browser back from review returns to ticket without placing anything; unit test that opening a notification leaves orders unchanged.
- Anti-dark-pattern: no countdown timers, no "X people are buying", no confetti on trade.

### 5.8 Notification centre
- List with unread dots, type icons, timestamps, grouped (Today / Earlier), mark-all-read, per-item read on open. Filters: All · Events · Watchlist · Results.
- Tapping a notification: marks read, opens **Event detail** (or company event page for results). Secondary action chip on notification row: "View [instrument]" (opens instrument detail, **never** the order ticket directly).
- **Simulated notification trigger:** a clearly labelled demo control ("Demo: simulate market event") with a dropdown: *RBI rate change*, *Quarterly results (followed company)*, *Oil-price move (watchlist oil company)*. It shows an in-app toast/banner styled like a push notification, labelled "Simulated notification", adds to the centre, and tapping it follows the flow.
- **Notification copy rules:** informational, neutral. Allowed: "RBI announces a policy-rate change. See how rates can affect bond yields, borrowing costs and equity valuations." Disallowed: "Buy now", "Don't miss out", "Stocks set to soar", exclamation marks, urgency.
- Preferences (P1): toggle event types, watchlist-only, quiet hours (UI only), note "demo; no real notifications are sent".

### 5.9 Three scenario flows (must be fully built)
1. **RBI rate change** -> notification -> event detail (rates -> bond prices/yields, borrowing costs, equity valuations; mixed effects) -> affected instruments: a G-Sec, a corporate bond fund/bond, a bank stock, a rate-sensitive stock (each with reason + caveat) -> instrument detail -> (optional) Buy -> ticket -> review -> confirm.
2. **Quarterly results** for a followed company -> notification -> event/company results page (headline figures, vs previous quarter and vs year-ago, risks, coverage) -> "View stock" -> detail -> Buy/Sell -> ticket (pre-filled) -> review -> confirm. Include the explainer "Why might shares fall after good results?" (expectations, guidance).
3. **Oil-price move** affecting watchlist oil company -> notification -> neutral explainer -> company page (news, business context, financials) -> optional trade.

---

## 6. Options module (Stocks / F&O)

**Entry:** Stock detail -> Options tab (for `hasOptions`) and Home shortcut. First-time access shows an **education gate**: short "Before you look at options" card (what an option is, premium, expiry, lot size, time decay, volatility; "Options can lose a large part or all of the premium paid in a short time") with a **"I've read this"** acknowledgement. This is a friction-on-purpose design choice: no "fast lane", no promotional language, no youth-targeted framing.

**Persistent warning strip:** "Options can cause substantial losses. Time decay and volatility affect option prices. Illustrative data; not live derivatives data."

**Option chain table** (mobile: horizontally scrollable with sticky strike column, or stacked Calls/Puts toggle; desktop: classic calls | strike | puts layout):
- Expiry selector (chips).
- Columns per side: **LTP, % change, Volume, OI**; centre: **Strike**. Greeks (**Delta, Gamma, Theta**) shown via a "Show Greeks" toggle (off by default to reduce clutter) or in the selected-contract panel.
- **Moneyness styling:** ITM (tinted background + "ITM" label), **ATM** (highlighted row + "ATM" label, nearest strike to spot), OTM (plain + "OTM"). Never rely on colour only. Legend + tooltip explaining each. For calls: ITM if strike < spot; puts: ITM if strike > spot. Compute in `lib/options/moneyness.ts`.
- Spot price and as-of timestamp ("Illustrative, as of ..."), lot size shown.
- Tooltips on headers: LTP, OI, Volume, Delta ("approx. how much the premium may change for a ₹1 move in the stock — an estimate"), Gamma, Theta ("approx. premium lost per day from time passing, all else equal").
- Greeks disclaimer: "Greeks and payoff estimates depend on market assumptions (volatility, interest rates, time) and change continuously."
- Tapping a contract opens a **Contract panel** (bottom sheet / side panel): premium, lot size, Greeks with plain-English meaning, **payoff chart**, summary, **Buy Call / Buy Put** button (only buying in P0; no selling/writing options in the prototype and a note: "Selling options is not available in this prototype because losses can be unlimited").

**Payoff chart (long call / long put at expiry):** SVG line chart. X axis: underlying price at expiry (range ~±20% of spot); Y axis: profit/loss per lot in ₹. Mark: breakeven point, strike, current spot, max loss region (flat at -premium x lot size). Shaded profit/loss areas with +/- labels. Text summary beneath (accessible alternative):
- **Max loss** = premium x lot size (plus charges).
- **Breakeven** = strike + premium (call) / strike - premium (put).
- **Max profit** = "Theoretically unlimited" (long call) / "(strike - premium) x lot size, if stock goes to zero" (long put).
- Caption: "At expiry only. Before expiry, value also depends on time and volatility. Charges not included in chart."
- P1: selector for a few illustrative strategies (long straddle, bull call spread) with max profit/loss/breakeven calc when applicable; keep to <=3.

**Order ticket for options:** pre-filled contract (e.g., "XYZ 24-Dec 1500 CE"), side BUY (fixed), lots stepper (1 lot min), quantity = lots x lot size shown, premium per unit, **total premium = premium x lot size x lots**, **maximum potential loss = total premium (+ charges)**, estimated charges via fee engine (product `OPTION`), risk note, review -> same explicit confirmation checkbox. Must require that the education gate was acknowledged.

**Data:** `data/optionChain.ts` with ~11 strikes around spot and 3 expiries, consistent monotonic premiums, deltas in 0..1 (calls) and -1..0 (puts), gamma >0, theta <0. Static, hand-authored; label `isDemo` and note "Static illustrative values; not computed from live data". No fake live ticking.

---

## 7. Stock Financials tab

Layout: sticky sub-header with **As-of date, source ("Demo data"), basis (Consolidated/Standalone), unit (₹ Cr)**; toggle **Annual / Quarterly**.

**Metric cards (grid, 2 cols mobile / 3-4 desktop):** P/E · EPS · ROE · Debt-to-equity · Dividend yield · Revenue growth (YoY) · Profit growth (YoY). Each card: value with unit, period label ("TTM", "FY25"), comparison to previous period (arrow + text "up from X"), info icon -> short plain-English explanation with a rupee example and "Limitations" line, optional industry context ("Sector median P/E is a demo value").

**Charts:** Revenue (bar), Profit (bar), EPS (line) over last 5 FY or 8 quarters; period labels on axis; tooltips and a text table alternative ("View as table" toggle). Show growth % labels. Charts handle null values (gap + "n/a").

**Edge-case handling (must be demonstrated by seed data):**
- Negative EPS / loss -> P/E shown as **"Not meaningful (loss-making)"** not a number; growth shows "n/m" if base is negative/zero.
- Missing values -> "Not available" with a tooltip, never 0.
- No dividend -> "No dividend" (not 0%).
- Banks/financials -> D/E note "Not comparable for banks/NBFCs" (industry differences).
- Footer note: "No single ratio shows whether a company is a good investment. Compare within the same industry and over time." Link to educational resources.
- Plain-English explainer per ratio: P/E, EPS, ROE, D/E, dividend yield, growth.

---

## 8. Learn & Community (P1, lightweight, simulated)

Top banner: "Simulated community — mock content for this prototype." Sections (tabs): **Learn · Q&A · Concepts · Milestones**.

- **Expert posts:** author name, credentials (e.g., "SEBI-registered Research Analyst (demo)"), verification label, date, title, short body, **source links**, tags, read time. If sponsored: visible **"Sponsored"** label with sponsor name and disclosure; if author holds positions in discussed securities: **"Conflict of interest disclosure"** line. Missing disclosure field -> show "No disclosures provided" (not blank).
- **Q&A threads:** beginner questions ("What is SIP vs lumpsum?"), answers from experts with sources; anonymous asker; sort by Newest/Most helpful; "Helpful" counter (simple, local only, not engagement-farmed). Ask-a-question form (mock; adds local pending item "Simulated — not sent").
- **Concept explainers:** curated cards (Investing vs trading, Diversification, Expense ratio, Time decay...). Each links to glossary entries.
- **Milestones (P1, optional anonymous):** user can share a *non-financial-value* milestone ("Started my first SIP", "Read 5 beginner guides"), posted as "Anonymous learner"; system forbids amounts/portfolio balances (no numeric currency input; client-side validation rejects ₹ amounts/digits strings with helper text). No likes ranking, no leaderboards.
- **Community guidelines card** (always reachable): no tips presented as certainties, no solicitation, no sharing personal financial details, respect, disclose conflicts.
- **Report content:** "Report" on every post/answer -> dialog with reasons (Misleading/Tip or promotion, Undisclosed sponsorship, Personal info, Abusive, Other) + optional note -> confirmation toast "Report recorded (simulated)". Stored locally, post shows "You reported this".
- **Explicitly not built:** copy-trading, return-based rankings, stock tips, trade-sharing, follower counts, rewards for trading activity.

---

## 9. Cost transparency (fee engine)

**Separate pure module:** `lib/fees/calculateCharges.ts`, configured by `lib/fees/feeConfig.ts` (all rates as clearly labelled **DEMO RATES**, with `asOf`, `source: "Demo configuration — verify against official exchange/SEBI/broker schedules before any real use"`, and `isDemo: true`). No rates hard-coded in UI. Unit tests required.

```ts
interface ChargeLine { id: string; label: string; amount: number; applicability: 'APPLIES' | 'CONDITIONAL' | 'NOT_APPLICABLE';
  condition?: string; explanation: string; formula?: string; }
interface ChargesResult { orderValue: number; lines: ChargeLine[]; totalApplicable: number;
  netPayable?: number; netReceivable?: number; assumptions: string[]; configAsOf: string; isDemo: true; }
function calculateCharges(input: { assetClass; product: 'DELIVERY'|'INTRADAY'|'OPTION'|'MF'|'BOND'|'IPO'; side:'BUY'|'SELL'; price:number; quantity:number; exchange:'NSE'|'BSE'; premiumBased?:boolean }, config: FeeConfig): ChargesResult
```

**Line items:** Brokerage · STT · Exchange transaction charges · GST (computed on brokerage + exchange charges + SEBI charges, per demo config) · SEBI turnover charges · Stamp duty (buy side only, per demo config) · DP charges (**delivery SELL only**, flat per scrip, CONDITIONAL on sell) · Other (e.g., clearing, IPFT) as demo config.

**Applicability rules to implement (as demo config, adjustable):**
- Delivery BUY: brokerage, STT, exchange, GST, SEBI, stamp duty applies; DP N/A.
- Delivery SELL: STT, exchange, GST, SEBI apply; **DP charges APPLY (delivery sell)**; stamp duty N/A.
- Intraday: STT on sell side only; stamp duty buy side only; no DP.
- Options (long buy): STT not on buy (sell-side on premium); stamp on buy; exchange charges on premium turnover; brokerage flat-per-order demo.
- Show conditional lines in a separate group "May apply in other situations" (e.g., on a BUY order show "DP charges — applies when you sell delivery shares: ₹X per scrip (demo)") — **excluded from the order's total**.
- MF direct: no brokerage; stamp duty on purchase (demo); show expense ratio note (embedded in NAV, not an upfront charge). Bonds/IPO: simplified applicable lines with notes.
- Rounding rules documented; amounts in ₹ with 2 decimals.

**UI — `ChargesBreakdown`:**
- Collapsed: "Estimated charges ₹X" and "Estimated net payable ₹Y" (BUY: order value + charges; SELL: order value − charges = net receivable).
- Expandable: grouped list **"Applies to this order"** (each with amount, info tooltip, optional formula "0.1% of ₹10,000") and **"May apply in other situations"** (greyed, with condition, not summed).
- Footer note: "Estimates only. Final charges may vary with the executed price, order type, exchange, and applicable rates at the time. Rates shown are demo values."
- Appears (a) as a live summary on the ticket, (b) in full on the review screen, (c) in the order record.

---

## 10. Education layer
- `lib/glossary.ts` terms with: short definition (<=2 sentences), rupee example, "Limitation", optional link to authoritative source (e.g., RBI, SEBI, AMFI, NSE academy — as external links).
- Components: `InfoPopover` (tooltip on desktop hover/focus; bottom-sheet on tap mobile), `Accordion`, `ExplainerCard`.
- Must cover: expense ratio; YTM vs coupon; P/E; why prices can fall after good results; why bond prices move when rates change; investing vs trading; earnings surprise; Delta/Gamma/Theta; moneyness; lot size; charges items.
- Language: plain English, short sentences, no promises, no personalised suitability claims ("we can't tell what's right for you").

---

## 11. Design system

- **Tokens:** primary green ≈ `#00B386` family (inspired, not an official asset), green-dark for hover, text `#44475B`/near-black `#121316`, subtle grey borders `#E8E8EB`, background white / `#F8F8FA`, gain green, loss red (`#EB5B3C`-family), amber for caution, blue for info. Define in Tailwind config/CSS variables; no ad-hoc hex in components.
- **Type:** system/Inter-like sans; scale 12/14/16/20/24/32; tabular numerals for prices; INR formatting `₹1,23,456.78` (en-IN).
- **Layout:** 8px grid; mobile cards full-width with 16px padding; subtle 1px border + very light shadow; rounded 12px; generous whitespace.
- **Colour independence:** every gain/loss shows arrow and sign ("▲ +1.2%" / "▼ −0.8%"), not colour alone. WCAG AA contrast.
- **Accessibility:** semantic HTML, focus rings, keyboard-navigable tabs/chips/table, ARIA labels on charts with text alternatives, 44px touch targets, reduced-motion respected.
- **Motion:** minimal (opacity/translate <=150ms). No confetti, no pulsing CTAs.
- **Avoid:** gradients, hero banners, crowded dashboards, random colours, auto-play video, infinite scroll, urgency badges.
- **Logo/assets:** do not copy proprietary Groww logo/assets; use a neutral wordmark ("Groww-inspired · Gen Z concept") and open icons (lucide).
- If browsing is available, first review public Groww web/app references for navigation, hierarchy, card layout, typography; note observations in `docs/design-notes.md`; keep it an inspired study.

---

## 12. Demo-data labelling and honesty rules
- Global prototype banner (5.1) + per-card `Demo` badge + footer on every detail page: "Illustrative data as of <date>".
- No real-looking headlines presented as real; use fictional companies/publishers (e.g., "Demo Business Daily") or mark as invented.
- No claims such as "will rise", "guaranteed", "risk-free", "sure-shot", "multibagger", "outperform".
- Past returns always captioned "Past performance is not a guide to future returns."
- Every event->instrument link has `reason` and `caveat`.
- Facts and interpretation visually distinguished (labelled sections/icons).
- Source + timestamp fields mandatory in UI; fallback "Source not available" when absent.

---

## 13. State, persistence and routes
Routes: `/` Home · `/news` · `/news/:id` · `/event/:id` · `/instrument/:id` (tabs via `?tab=`) · `/instrument/:id/options` · `/order/:instrumentId` (ticket) · `/order/review` · `/order/result/:id` · `/notifications` · `/watchlist` · `/orders` · `/learn` (+ `/learn/qa`, `/learn/concepts`) · `/settings`. Unknown route -> friendly 404.
Persist (localStorage, try/catch): watchlist, notification read state, simulated orders, preferences, options-gate acknowledgement, reports, selected category. "Reset demo" control in Settings.

---

## 14. Fully functional vs simulated

| Area | Fully functional (real interaction logic) | Illustrative / simulated |
|---|---|---|
| Navigation, routing, responsive layout | ✔ | |
| Category switching, filters, sorting, search | ✔ over mock data | Data itself is mock |
| News filters, cards, event pages, instrument links | ✔ | News content is invented/demo |
| Watchlist add/remove, notification read/unread, preferences | ✔ (localStorage) | No real push; no sync |
| Order ticket validation, charge calculation, review, checkbox gating, order history | ✔ (real computation) | Prices static; order never goes to an exchange; fee rates are demo values |
| Option chain rendering, moneyness, Greeks toggle, payoff calc/chart, breakeven/max loss | ✔ (computed from selected contract) | Premiums/Greeks/OI/volume are static illustrative, not live/derived from a pricing model |
| Financials charts/cards, null/negative handling | ✔ | All figures are sample data |
| Community: post/Q&A browse, sort, report, milestone validation | ✔ (local) | Authors, posts, credentials, sponsors are mock; nothing is sent to a server |
| Glossary tooltips/accordions | ✔ | Content is educational summaries; external links are references only |

---

## 15. Acceptance tests (manual + automated where possible)

**T1 Discovery.** Open app -> select Mutual Funds -> scroll -> switch to Bonds -> open a bond. *Expect:* feed changes; MF cards show riskometer/expense ratio/min SIP/labelled returns; bond cards show coupon and YTM distinctly + rating/maturity; right detail page.
**T2 News.** Open News -> open a company announcement. *Expect:* headline, source, timestamp, summary, why it matters (labelled interpretation), uncertainty, linked instruments, Demo badge.
**T3 Event -> instrument.** Simulate RBI event -> tap notification -> read explanation -> open an affected bond/stock. *Expect:* correct navigation; reason + caveat; mixed-direction language; no "buy now".
**T4 Safe simulated trade.** News -> stock -> Buy -> qty. *Expect:* instrument pre-filled; order value + itemised charges; review step; confirm disabled until checkbox ticked; result says "Simulated".
**T5 No accidental trading.** Tap notification then leave. *Expect:* Orders list unchanged; no order object created; back-navigation from review doesn't place orders (automated test).
**T6 Beginner comprehension.** Open each glossary term (expense ratio, YTM, P/E, Delta...). *Expect:* short, plain, no promises.
**T7 Responsive.** 360x640, 390x844, 768x1024, 1440x900. *Expect:* no horizontal page overflow (option chain scrolls within its container), nav usable, CTAs reachable, no clipped text.
**T8 Empty/error.** Filter to zero results; story with missing field; loss-making stock; unrated bond; option chain with missing expiry. *Expect:* empty/fallback states, "Not available", no crash, no zero-as-fact.
**T9 Build quality.** `npm run build`, `npm run lint`, `npm test` pass; no console errors; no dead buttons; no broken routes.

**Options (T10-T13).**
- **T10** Open stock Options tab for the first time -> education gate shown -> acknowledge -> chain visible. Expiry switching updates rows.
- **T11** ITM/ATM/OTM correctly assigned for calls and puts relative to spot, shown with labels (not colour alone).
- **T12** Select a call -> payoff chart: breakeven = strike + premium; max loss = premium x lot size; max profit labelled unlimited; Greeks tooltips present with disclaimer. Select a put -> breakeven = strike − premium; max profit formula correct. Unit tests for `payoff.ts`.
- **T13** Buy Call -> ticket pre-filled (contract, lot size, premium, total premium, max loss), charges shown for option product, confirmation checkbox required; no sell/write option available; warning visible.

**Financials (T14-T15).**
- **T14** Open Financials for a profit-making stock: 7 metric cards with period labels, previous-period comparison, as-of date and source, annual/quarterly toggle, charts + table view, info explanations with limitations.
- **T15** Loss-making stock: P/E "Not meaningful", growth "n/m"; no-dividend stock shows "No dividend"; missing value shows "Not available"; bank D/E caveat.

**Community (T16-T17).**
- **T16** Browse expert post: credentials, source links, sponsored label and conflict disclosure visible where applicable; simulated-community banner present; no tips/rankings/copy-trading anywhere.
- **T17** Report a post -> dialog -> confirmation -> "You reported this"; milestone with ₹ amount is rejected with helper text; guidelines card reachable.

**Cost transparency (T18-T20).**
- **T18** Delivery BUY: lines for brokerage, STT, exchange, GST, SEBI, stamp duty applied; DP shown under "may apply" (not in total). Delivery SELL: DP applied, stamp duty not. Totals = sum of applicable lines; net payable/receivable correct.
- **T19** Expand/collapse calculation shows formulas and per-line explanations; footer note about variation and demo rates visible.
- **T20** Unit tests for `calculateCharges` across product x side (delivery, intraday, option, MF); fee rates only from config; changing a config value updates UI with no component edits.

---

## 16. Definition of done
All P0 complete and tested; P1 attempted in priority order (Learn & Community, watchlist-aware news, search/sort, preferences); `npm run build`, lint, tests green; README with run instructions, structure, data/labelling notes, simulated-vs-functional table; `docs/qa-report.md` listing tests T1-T20 with pass/fail and known gaps; no secrets; no copied proprietary assets.
