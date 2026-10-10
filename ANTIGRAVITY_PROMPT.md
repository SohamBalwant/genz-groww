# Antigravity Kickoff Pack

**How to use:** 1) Put `SPEC.md` in your project root. 2) Paste the **Master Prompt** (Part 2) into Antigravity. 3) Use follow-ups in Part 3 as needed. 4) Judge readiness with Part 4.

---

## Part 1 — Product assumptions

- **Problem:** Young investors read news that isn't connected to products they can explore, and don't understand what it means, what's affected, what the risks are, or what acting will cost.
- **Target user:** Indian investors aged 20-26 (students, first-timers, first-salary earners, young professionals with irregular income).
- **Core journey:** Discover → Understand → Explore relevant instruments → Review risks and costs → Decide for yourself.
- **MVP scope:** Frontend-only React prototype, mock data, simulated trades, in-app notification centre (no real push). Mobile-first, works on desktop.
- **Assumptions I made:** fictional company names and clearly labelled demo data; fee rates are demo config (not official current rates); options are *buy-only* (no writing/selling) with a deliberate education gate; community is simulated and lightweight; Greeks/payoffs are static illustrative values; "Groww-inspired" design without copying proprietary logos/assets.
- **Key design decisions:** facts vs interpretation separated everywhere; event pages never carry "Buy now"; no order can be created from a notification; fee engine is a pure, unit-tested module separate from UI; data accessed via an async service layer so real APIs could be swapped in later.
- **P0:** design system, category discovery, news + event detail, event→instrument→order flow, order review with itemised charges, notification centre, Financials tab, options chain with payoff, responsive, demo labelling, empty/error states.
- **P1:** Learn & Community, watchlist-aware news, search/sort, preferences, glossary polish, comparison, expert-video placeholders, multi-leg strategy selector (≤3).
- **P2 (don't build):** real brokerage/exchange/push, AI recommendations, full F&O terminal, copy-trading, rankings, social network.

---

## Part 2 — Master Prompt (copy everything in the block below)

```text
You are a senior full-stack engineer, fintech UX/UI designer and product-minded builder. Build an interactive, responsive frontend prototype called "Groww for Gen Z" (a Groww-inspired concept for Indian investors aged 20-26) for a Product Manager internship assignment: "Designing Groww for the Gen Z investor." It is an independent design study, NOT an official Groww product. All data is mock/illustrative and all trades are simulated.

SOURCE OF TRUTH
Read SPEC.md in the project root completely before doing anything. It defines scope, priorities (P0/P1/P2), data models, screens, flows, options module, financials tab, community, fee engine, design system, acceptance tests (T1-T20) and the fully-functional-vs-simulated table. If this prompt and SPEC.md conflict, SPEC.md wins.

PRODUCT THESIS
Help young investors move from: Discover -> Understand -> Explore relevant instruments -> Review risks and costs -> Make their own decision. Trust is a core feature. Never encourage impulsive trading.

WORKFLOW (follow in order)
1. INSPECT: Look at the repository, existing stack and conventions. If it's empty, use React + TypeScript + Vite + Tailwind CSS + react-router-dom + lucide-react; use SVG or recharts sparingly for charts. If browsing is available, briefly review public Groww web/app references for navigation, layout, typography, colour and card hierarchy and save notes in docs/design-notes.md. Do not copy proprietary logos/assets.
2. PLAN: Write a short plan (milestones, folder structure, risks) in docs/plan.md. Do not wait for approval; proceed.
3. BUILD in milestones, committing/saving after each:
   M1 Design tokens, AppShell (bottom nav on mobile; sidebar/top nav on desktop), global "Prototype: demo data, simulated trades" banner + Demo badges, data service layer + mock data + typed models.
   M2 Home/Discover: market overview, search, category selector (Mutual Funds, Stocks, ETFs, Bonds, IPOs) with category-specific cards, filters and sorts, empty/loading states.
   M3 News & Insights feed (All/Markets/Stocks/Companies/Economy/Bonds), structured news cards, news detail, Event detail (What happened / Why it matters / category impacts with caveats / affected instruments with reason + caveat / risks / sources).
   M4 Instrument detail pages for stock, mutual fund, bond, ETF, IPO, with charts, product-specific risk info, watchlist toggle.
   M5 Cost engine + order flow: lib/fees (pure functions + config of DEMO rates + unit tests), order ticket, order review with itemised ChargesBreakdown (applicable vs conditional lines), required confirmation checkbox, simulated result, Orders list.
   M6 Notification centre + "Demo: simulate market event" control for 3 scenarios (RBI rate change, quarterly results, oil-price move). Flow: Notification -> Event detail -> Affected instruments -> Instrument detail -> optional order ticket -> Order review -> Explicit confirmation.
   M7 Stock Financials tab: metric cards (P/E, EPS, ROE, Debt-to-equity, Dividend yield, revenue and profit growth), annual/quarterly toggle, revenue/profit/EPS charts with table alternative, explanations with limitations, as-of date and source, edge cases (loss-making, missing, no dividend, banks).
   M8 Options: stock Options tab with education gate, option chain (strike, expiry, LTP, % change, volume, OI; Delta/Gamma/Theta with tooltips), ITM/ATM/OTM labels (not colour alone), contract panel, payoff chart at expiry with breakeven/max profit/max loss, "Buy Call"/"Buy Put" -> pre-filled simulated ticket with lot size, premium, total premium, max potential loss, itemised charges. Buy-only; no writing/selling.
   M9 (P1) Learn & Community: simulated community banner, expert posts with credentials + source links, Q&A, concept explainers, optional anonymous milestones (no amounts), guidelines, report-content dialog, visible Sponsored/conflict disclosures. NO copy-trading, return-based rankings, stock tips or rewards for trading.
   M10 (P1) Watchlist-aware news, search/sort, notification preferences, glossary polish.
4. RUN & VALIDATE: Start the app, run build, lint and tests. Walk through acceptance tests T1-T20 from SPEC.md in the browser at 360, 390, 768 and 1440px widths. Record results in docs/qa-report.md. Fix every failure, console error, dead button and broken route before declaring done. If something can't be run in this environment, say so and list the manual checks you did.
5. REPORT: Finish with a concise summary: what's complete, what is simulated, what's incomplete/known gaps, how to run locally, and the file map.

HARD REQUIREMENTS (never violate)
- Mock data only; no API keys, secrets or paid services; no real push notifications. Structure data access (services/dataService.ts, async) so a real API could be integrated later, but never claim it exists.
- Label all demo data visibly (global banner + per-item Demo badge + "Illustrative data as of ..."). Prefer fictional company names. Never present mock data as live market data or real breaking news.
- No language implying guaranteed, risk-free, certain or "will rise/fall". Past returns always captioned as not a guide to future returns. Possible effects are possibilities with caveats; never assume all bonds/stocks move one way after an event.
- Distinguish confirmed facts from interpretation visually. Every news/event item shows source + timestamp (fallback "Source not available").
- NEVER place an order automatically from a notification, news item or deep link. Notifications and event pages must not say "Buy now/Sell now" and must not use FOMO, urgency, countdowns or "others are buying". Tapping a notification opens the explanation only; viewing an instrument is a separate step; trading is an explicit separate choice.
- Orders require: pre-filled instrument (user-editable side/quantity), visible order value, itemised estimated charges, risk note, a required "I understand this is a simulated order and I've reviewed the charges" checkbox, and an explicit Confirm button. Result text must say "Simulated order recorded", never "executed on exchange". Add an automated test that opening a notification creates no order.
- Fee engine: keep calculation logic in lib/fees separate from UI, driven by a config of clearly labelled DEMO rates (with asOf + disclaimer). Itemise brokerage, STT, exchange transaction charges, GST, SEBI charges, stamp duty, DP charges (delivery SELL only), other. Separate "Applies to this order" from "May apply in other situations" (conditional lines excluded from the total). Show estimated total charges and net payable/receivable, an expandable calculation, and the note that final charges may vary with executed price, order type and applicable rates.
- Options: warning that options can cause substantial losses and that time decay and volatility affect prices; note that Greeks and payoffs depend on assumptions and change; illustrative static data only; education gate before first use; do not encourage inexperienced users to trade derivatives. Do not fabricate live derivatives data.
- Financials: no implication that any ratio proves a company is a good investment; handle negative earnings ("Not meaningful"), missing values ("Not available", never 0), industry differences; show period labels, previous-period comparison, source and as-of date.
- Community: simulated and clearly labelled; sponsored content and conflicts of interest visibly disclosed; report flow works; no personal financial info in milestones.
- No personalised investment recommendations or "suitable for you" claims.
- Accessibility: colour is never the only signal (arrows, signs, text labels), keyboard navigable, ARIA labels/text alternatives for charts, 44px touch targets, AA contrast, reduced-motion respected.

DESIGN DIRECTION
Clean, white/very light backgrounds, Groww-inspired green accent for primary actions (define tokens; don't copy proprietary assets), dark legible text, generous whitespace, minimal borders, restrained shadows, compact readable financial info, small consistent icons, familiar investment cards and simple charts. Mobile-first with real mobile spacing and breakpoints (not a shrunk desktop). Bottom nav on mobile, sidebar/top nav on desktop. Avoid gradients, big hero sections, heavy animation, crowded dashboards, endless scroll and random colours. Use ₹ with Indian number formatting (lakh/crore) and IST timestamps.

CODE QUALITY
Reusable components, design tokens, strict TypeScript, no business logic or mock data inside UI components, readable folder structure as in SPEC.md, minimal dependencies, README with run instructions and a table of "fully functional" vs "illustrative/simulated" features, unit tests for lib/fees, lib/options (moneyness, payoff), formatting utilities and the "no accidental order" guard.

PRIORITY RULE
Quality over feature count. If time or scope is tight, finish P0 end to end (especially event -> instrument -> order review with itemised charges) before any P1. Do not do P2. Do not ask me clarifying questions: make reasonable product-judgment assumptions, record them in docs/assumptions.md, and continue.

Begin now with step 1 (inspect), then build, run, validate and report.
```

---

## Part 3 — Follow-up prompts (max 5)

**1. Closer to Groww's design**
```text
Review the UI against public Groww web/app references (if browsing is available) and refine to be closer in spirit: spacing, type scale, card density, tab/chip styling, price/change formatting, detail-page hierarchy, bottom-nav behaviour. Keep it an inspired study: no proprietary logos or assets, keep demo labelling, keep all tokens in the theme file. List what you changed and screenshot at 390px and 1440px.
```

**2. Improve news -> instrument -> order flow**
```text
Audit and improve the flow Notification -> Event detail -> Affected instruments -> Instrument detail -> Order ticket -> Review -> Confirm for all three scenarios (RBI, quarterly results, oil). Verify: instrument pre-filled, reasons + caveats shown, no 'buy now' language, no auto-order, back-button safety, clear breadcrumbs, and the charges summary visible on the ticket. Fix friction without removing informed-consent steps. Add/extend tests T3-T5 and report results.
```

**3. Fix responsive issues**
```text
Test every page at 360x640, 390x844, 768x1024, 1280x800 and 1440x900. Fix horizontal overflow (option chain must scroll inside its container with a sticky strike column), clipped text, unreachable CTAs, overlapping sticky bars, tap targets under 44px and chart legibility. Confirm bottom nav/sidebar behaviour and safe-area padding. Document fixes in docs/qa-report.md.
```

**4. Improve explanations and investment cards**
```text
Improve financial education: review every glossary term, tooltip and card for plain English, short sentences, rupee examples and no promises. Ensure bond cards distinguish coupon vs YTM, MF cards show riskometer + expense ratio + labelled returns, stock Financials show limitations, options Greeks tooltips include the 'depends on assumptions' caveat, and every charge line has an explanation. Add missing explainers and external educational links (RBI, SEBI, AMFI, NSE) marked as external.
```

**5. Full functional review**
```text
Do a full QA pass: run build, lint and tests; click through every route and control; execute acceptance tests T1-T20 from SPEC.md; check console errors, dead buttons, broken links, empty/error states, localStorage reset, and the fee engine against its unit tests. Fix all issues, update docs/qa-report.md with pass/fail per test, and update README's functional-vs-simulated table.
```

---

## Part 4 — Interview-readiness checklist

**Flow & product**
- [ ] I can demo Notification → Event → Instrument → Ticket → Review → Confirm in under 2 minutes for the RBI scenario.
- [ ] Opening a notification never creates an order (and I can show the test).
- [ ] No "buy now", urgency or FOMO language anywhere.
- [ ] Each event-instrument link shows a *reason* and a *caveat*.
- [ ] Facts and interpretation are visibly separated; sources and timestamps present.

**Discovery & content**
- [ ] All 5 categories switch cleanly with category-specific cards, filters and sorts; empty states work.
- [ ] Bond cards show coupon and YTM separately; MF cards show riskometer + expense ratio + labelled returns.
- [ ] Glossary tooltips are short, plain, rupee-based.

**Financials / Options**
- [ ] Financials tab: 7 metrics with period labels, comparison, as-of date, source, charts + table view; loss-making/no-dividend/missing cases handled.
- [ ] Option chain: ITM/ATM/OTM labelled, Greeks with tooltips and caveats, payoff chart with correct breakeven/max loss, education gate, warnings, buy-only.
- [ ] Buy Call/Put opens a pre-filled ticket showing lot size, premium, total premium, max loss.

**Costs**
- [ ] Review screen itemises brokerage, STT, exchange, GST, SEBI, stamp duty, DP (only when applicable), other.
- [ ] "Applies" vs "May apply" separated; total, net payable/receivable and expandable maths shown; demo-rate disclaimer present.

**Community**
- [ ] Simulated banner, credentials, sources, sponsored + conflict disclosure, report flow, guidelines; no tips/rankings/copy-trading.

**Quality**
- [ ] Build, lint, tests pass; no console errors or dead buttons.
- [ ] Works at 360/390/768/1440px; no page-level horizontal overflow.
- [ ] Demo labelling visible on every screen; no real data claims.
- [ ] README + qa-report + assumptions docs exist; I can state what's simulated vs functional.
- [ ] I can explain 3 trade-offs I chose (e.g., buy-only options, friction at review, no gamification) and the metrics I'd track (e.g., learn-before-trade rate, order cancellations after viewing charges, 30-day retention, event-page → explore rate).
