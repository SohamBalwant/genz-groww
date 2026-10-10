# IMPLEMENTATION_PLAN.md — Groww for Gen Z prototype

Companion to `SPEC.md`. Build in order. Each phase ends with a **gate**: don't start the next phase until the gate passes. Time estimates assume Antigravity doing the heavy lifting + you reviewing.

**Golden rule:** finish the P0 spine (Phases 0-7) before any P1. The spine = discover → news → event → instrument → order review with itemised charges.

---

## Phase 0 — Setup (30 min)

1. Create project folder, put `SPEC.md` + this file in root.
2. Open in Antigravity, paste master prompt from `ANTIGRAVITY_PROMPT.md`.
3. Tell agent: "Do Phase 0-1 only first, then stop and show me." (Breaking into phases beats one giant run.)
4. Scaffold: `npm create vite@latest . -- --template react-ts`, install `tailwindcss`, `react-router-dom`, `lucide-react`, `vitest`, `@testing-library/react`, `jsdom`, `eslint` (optional: `recharts`).
5. Add scripts: `dev`, `build`, `lint`, `test`.
6. Create folders exactly as in SPEC §3. Add `docs/` with `plan.md`, `assumptions.md`, `qa-report.md`.

**Gate:** `npm run dev` shows blank app; `npm run build`, `lint`, `test` all run.

---

## Phase 1 — Foundation (2-3 hrs)

1. **Design tokens** (`tailwind.config`, `styles/tokens.css`): green primary, red/green gain-loss, greys, amber, blue, radius, shadows, spacing, type scale.
2. **Formatting utils** (`lib/format.ts`): `formatINR` (en-IN, ₹1,23,456.78), `formatPct` (sign + arrow), `formatDateIST`, `relativeTime`. Add tests.
3. **UI primitives** (`components/ui`): Button, Card, Badge, Chip, Tabs, Tooltip/InfoPopover (hover on desktop, bottom sheet on mobile), Accordion, Modal, Sheet, Skeleton, EmptyState, ErrorState, DemoBadge, PriceChange (arrow + sign, not colour only).
4. **AppShell**: TopBar (wordmark, search, bell, DEMO chip), BottomNav (<768px: Home, News, Learn, Watchlist, Orders), SideNav (>=1024px), prototype banner (dismissible, DEMO chip stays).
5. **Router** with all routes from SPEC §13 as placeholder pages + 404.
6. **Types** (`state/types.ts`) from SPEC §4.
7. **State**: context + reducer for watchlist, notifications, orders, prefs, category; localStorage persistence with try/catch; "Reset demo" action.

**Gate:** nav works on mobile + desktop, banner shows, tokens used (no ad-hoc hex), tests for format utils pass.

---

## Phase 2 — Data layer (2-3 hrs)

1. `services/dataService.ts`: async functions (`getStocks`, `getFunds`, `getBonds`, `getEtfs`, `getIpos`, `getNews`, `getEvent`, `getInstrument`, `getOptionChain`, `getNotifications`, `getPosts`...) with small simulated latency and an optional error flag for testing.
2. Seed data in `data/`:
   - 12 stocks (incl. 1 oil co, 1 bank, 1 IT, 1 FMCG, **1 loss-making**, **1 no-dividend**), fictional names.
   - 8 MFs, 6 bonds (1 unrated), 5 ETFs, 4 IPOs (Upcoming/Open/Closed).
   - 14 news stories across all filters; 4 events (RBI, results, oil, inflation) each with facts, why-it-matters, asset impacts + caveats, affected instruments with reason + caveat, sources.
   - Financials data for each stock (annual 5 FY, quarterly 8), with nulls/negatives where designed.
   - 1 option chain (11 strikes × 3 expiries, consistent premiums/Greeks).
   - 10 notifications, community posts/threads, glossary (SPEC §4 list).
3. Every record `isDemo: true`, fictional publishers ("Demo Business Daily"), dates in IST.
4. Data validation test: all `relatedInstrumentIds`/`affectedInstruments` resolve to real instruments; each link has reason + caveat.

**Gate:** data tests pass; no UI imports `data/` directly.

---

## Phase 3 — Discover (Home) (3 hrs)

1. Market overview strip (illustrative indices).
2. `CategorySelector` (sticky chips): MF · Stocks · ETFs · Bonds · IPOs; persist selection.
3. Category card components per SPEC §5.3: `FundCard` (riskometer, expense ratio, min SIP, labelled returns), `StockCard`, `EtfCard`, `BondCard` (coupon vs YTM separate, rating or "Unrated", risk chips), `IpoCard` (status, price band, lot, min investment).
4. Filters + sorts per category (config-driven, not shared irrelevant ones). Filter bar as horizontal chips + sheet on mobile.
5. List with "Show more" (no infinite scroll), skeletons, empty state with "Clear filters".
6. "Relevant today" (3 news cards), watchlist highlights, bell, search bar (P1 logic later).
7. Demo control: "Simulate a market event" dropdown (wired in Phase 6).

**Gate (T1):** MF → scroll → Bonds → open bond works; empty state tested by filtering to zero.

---

## Phase 4 — News & Event detail (3-4 hrs)

1. `NewsCard` in exact SPEC order: headline, publisher + time + Demo, event label, What happened, Why it matters (labelled *Interpretation*), "Could be relevant to" chips, buttons (Read full story, Learn more, View instrument).
2. News page: filter tabs (All/Markets/Stocks/Companies/Economy/Bonds), level toggle, paged feed, video-placeholder card.
3. News detail: *Confirmed facts* vs *Analysis*, uncertainties, linked instruments + reasons, source block with timestamp + "View source", glossary terms inline.
4. **Event detail page** (SPEC §5.5): What happened → Why it matters (rupee example) → asset-category impacts with caveats → long-term vs short-term note → affected instruments (View details only; **no Buy/Sell**) → risks → learn more → sources.
5. Fallbacks: missing source/timestamp → "Source not available"; never blank.

**Gate (T2, T3 partial, T8):** headline/source/time/summary/significance/uncertainty present; story with a missing field renders safely.

---

## Phase 5 — Instrument detail pages (4 hrs)

1. Shared header (name, price/NAV, change + period label, Demo badge), chart (SVG sparkline/line with period toggle), tabs, risk & disclosures, sticky CTA bar mobile / side panel desktop, watchlist toggle.
2. **Stock** tabs: Overview, Financials (placeholder until Phase 8), News & Events, Options (placeholder until Phase 9), About.
3. **MF**: riskometer, expense ratio explainer, returns table + "past performance" caption, simple SIP calculator (illustrative), "Start SIP (simulated)".
4. **Bond**: coupon vs YTM explainer, cash-flow illustration, 3 risk blocks, "why prices move when rates change" accordion.
5. **ETF** and **IPO** (timeline, price band, lot, min investment = lot × upper band, risks; no urgency copy).
6. News & Events section pulls related stories; links back to events.

**Gate:** every card from Phase 3 and every instrument link from Phase 4 opens the correct page.

---

## Phase 6 — Cost engine + order flow (5-6 hrs) ⭐ critical

**6a. Fee engine first (no UI):**
1. `lib/fees/feeConfig.ts`: DEMO rates + `asOf` + disclaimer, per product/side.
2. `calculateCharges.ts`: pure function returning `ChargeLine[]` with `applicability` (APPLIES / CONDITIONAL / NOT_APPLICABLE), formulas, explanations, `totalApplicable`, `netPayable`/`netReceivable`, assumptions.
3. Rules: delivery BUY (brokerage, STT, exchange, GST, SEBI, stamp), delivery SELL (+DP, no stamp), intraday (STT sell only, stamp buy only, no DP), option buy (premium turnover), MF direct, bond, IPO.
4. **Unit tests** across product × side; sum check; rounding; changing config changes output.

**6b. UI:**
1. `OrderTicket`: pre-filled instrument (editable side/qty), Delivery/Intraday, quantity validation, Market/Limit, order value, live "Est. charges ₹X · expand", risk note, "Review order".
2. `ChargesBreakdown`: collapsed total + net; expanded "Applies to this order" and "May apply in other situations" (excluded from total), formulas + tooltips, variation note.
3. `OrderReview`: all details, risk note by asset class, "will NOT be sent to any exchange" notice, required checkbox, Edit order, Confirm simulated order (disabled until ticked).
4. `OrderResult`: "Simulated order recorded", id, time, link to Orders. `Orders` page with SIMULATED badges.
5. **Guards:** no order from notifications/deep links; drafts never stored as confirmed; browser-back from review places nothing.
6. Test: `noAccidentalOrder.test` (open notification, navigate, orders unchanged).

**Gate (T4, T5, T18-T20):** full ticket → review → confirm works; unit tests green.

---

## Phase 7 — Notification centre + 3 scenarios (3-4 hrs)

1. Notification list: unread dots, type icons, Today/Earlier groups, mark-all-read, filters (All/Events/Watchlist/Results).
2. Tap → mark read → Event detail (or results page). Secondary chip "View [instrument]" → instrument detail only.
3. Demo trigger: toast styled as push, labelled "Simulated notification", adds to centre.
4. Build the 3 scenarios fully:
   - **RBI** → bond/G-Sec, bond fund/corporate bond, bank stock, rate-sensitive stock; mixed-direction language.
   - **Results** → results page (headline numbers, vs prev quarter and year-ago, risks, coverage) → View stock → Buy/Sell pre-filled; includes "why shares can fall after good results" explainer.
   - **Oil move** → neutral summary → oil company page.
5. Notification copy lint: test that copy has none of the banned words (buy now, don't miss, soar, !, hurry).
6. Preferences page (P1 UI-only).

**Gate (T3, T5):** each scenario runs notification → … → confirm in a few taps; no order created unless user confirms.

> **MVP checkpoint:** after Phase 7 you have a demo-able core. Commit + tag `mvp-core`.

---

## Phase 8 — Financials tab (3 hrs)

1. `MetricCard` (value, unit, period label, previous-period delta with arrow + text, info icon).
2. Cards: P/E, EPS, ROE, D/E, dividend yield, revenue growth, profit growth.
3. Annual/Quarterly toggle; Revenue (bar), Profit (bar), EPS (line) charts with null gaps; "View as table" toggle.
4. Header: as-of date, source "Demo data", basis, unit (₹ Cr).
5. Edge cases: P/E "Not meaningful (loss-making)", growth "n/m", missing → "Not available", no dividend → "No dividend", bank D/E caveat; footer "no single ratio…".
6. Ratio explainers with limitations (glossary-driven).

**Gate (T14, T15).**

---

## Phase 9 — Options (5 hrs)

1. `lib/options/moneyness.ts` (+tests: call ITM if strike < spot; put ITM if strike > spot; ATM = nearest strike).
2. `lib/options/payoff.ts` (+tests): long call/put payoff per lot, breakeven, max loss, max profit text.
3. Education gate (first visit, acknowledgement persisted) + persistent warning strip.
4. `OptionChain`: expiry chips, columns (LTP, %chg, Volume, OI | Strike | …), "Show Greeks" toggle (Delta, Gamma, Theta + tooltips + caveat), ITM/ATM/OTM labels + legend, spot + as-of + lot size. Mobile: scroll inside container with sticky strike column.
5. Contract panel: premium, Greeks meaning, `PayoffChart` (SVG: breakeven, strike, spot, loss region, +/- labels, text summary).
6. Buy Call / Buy Put → option ticket (lots stepper, qty = lots × lot size, total premium, **max potential loss**), charges via fee engine, confirmation checkbox. Buy-only; note on why selling isn't available.
7. P1: ≤3 strategy views (straddle, bull call spread).

**Gate (T10-T13).**

---

## Phase 10 — Learn & Community (P1, 3-4 hrs)

1. Simulated banner; tabs Learn · Q&A · Concepts · Milestones.
2. `PostCard` (credentials, verification label, source links, Sponsored label + sponsor, conflict disclosure or "No disclosures provided").
3. Q&A threads (anonymous asker, sort, local "Helpful", mock ask form).
4. Concept explainers linking to glossary.
5. Milestones: anonymous, validation rejects amounts/digit strings.
6. Guidelines card; Report dialog (reasons + note) → "You reported this".
7. Verify nothing resembling tips, rankings, copy-trading.

**Gate (T16, T17).**

---

## Phase 11 — P1 polish (3 hrs)

1. Watchlist page + watchlist-aware news filter.
2. Search (instruments, news, glossary) with empty state; sort polish.
3. Glossary pass: every term has definition, rupee example, limitation, external source link.
4. Expert-video placeholders; optional stock comparison.

---

## Phase 12 — QA, a11y, responsive (3-4 hrs)

1. Run `build`, `lint`, `test`; fix all.
2. Manual pass at 360×640, 390×844, 768×1024, 1280×800, 1440×900: no page-level horizontal scroll, sticky bars don't overlap, CTAs reachable.
3. Accessibility: keyboard through tabs/chips/table, focus rings, chart text alternatives, AA contrast, 44px targets, reduced motion.
4. Content audit: grep for banned phrases (guaranteed, risk-free, will rise, sure-shot, multibagger, buy now); every screen shows Demo labelling.
5. Run T1-T20, fill `docs/qa-report.md` with pass/fail + known gaps.
6. Console clean; no dead buttons or broken routes.

**Gate:** T1-T20 pass (or documented).

---

## Phase 13 — Demo prep (2 hrs)

1. README: run steps, structure, simulated-vs-functional table, assumptions.
2. Deploy static build (Vercel/Netlify) so you can share a link.
3. Rehearse 5-minute walkthrough: problem → hypothesis → RBI flow → cost screen → financials → options (with friction rationale) → community → metrics.
4. Prep answers: why friction at review, why buy-only options, what you cut (P2) and why, success metrics (event-page → explore rate, learn-before-trade rate, cancellations after seeing charges, 30-day retention), risks (regulatory, misleading "relevance" links, engagement vs trust).

---

## Timeline (realistic)

| Phase | Est. |
|---|---|
| 0-2 Setup, foundation, data | 5-7 hrs |
| 3-5 Discover, news/events, instruments | 10-11 hrs |
| 6-7 Orders + notifications (core) | 8-10 hrs |
| 8-9 Financials + options | 8 hrs |
| 10-11 Community + polish (P1) | 6-7 hrs |
| 12-13 QA + demo | 5-6 hrs |
| **Total** | **~42-49 hrs** (≈ 4-6 days; far less with agent parallelism) |

**If short on time (cut order):** Phase 11 → 10 → options strategies → options (keep chain + long call only) → comparison. Never cut: fee engine, review/confirmation, event pages, demo labelling.

## How to drive Antigravity phase by phase

Use this template per phase:

```text
Read SPEC.md and IMPLEMENTATION_PLAN.md. Implement Phase N only. Follow the gate criteria. When done: run build/lint/tests, verify in browser at 390px and 1440px, fix issues, update docs/qa-report.md, then stop and summarise what's done, what's simulated and what's left. Do not start Phase N+1.
```

## Risk register

| Risk | Mitigation |
|---|---|
| Agent builds everything at once, quality drops | Phase-by-phase prompts + gates |
| Mock data drifts / broken links | Data validation test (Phase 2) |
| Fee logic leaks into UI | Pure module + tests; UI imports only `calculateCharges` |
| Accidental trade path | Guard test + no order creation in notification handlers |
| Option chain overflow on mobile | Scroll container + sticky strike column; test at 360px |
| Misleading copy sneaks in | Banned-phrase lint test + manual audit |
| Scope creep | P2 list is hard no; cut order above |
