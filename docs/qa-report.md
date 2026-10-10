# QA Test Report — Groww for Gen Z Prototype

**Project:** Groww for Gen Z (Interactive PM Internship Prototype)  
**Specification Reference:** `SPEC.md` §15 Acceptance Tests (T1–T20)  
**Execution Environment:** Node.js, Vite 5, React 18, TypeScript 5, Vitest 2  
**Test Suite Summary:** 5 test files, 33 tests executed, 33 passed (100% pass rate)  
**Build Verification:** `tsc && vite build` (0 TypeScript errors, clean bundle)  
**Linter Verification:** `eslint .` (0 errors, 0 warnings)  

---

## Executive Summary

This report documents the verification of acceptance criteria T1 through T20 for the "Groww for Gen Z" independent PM concept prototype. Every critical architectural, regulatory, and educational requirement has been tested via automated test suites and structured manual UI flow audits.

All mock data is explicitly labelled with persistent `Demo` badges and disclaimers. The simulated trade flow strictly enforces an accidental order guard, requiring explicit multi-step navigation and a mandatory confirmation checkbox before any order is recorded to local storage.

---

## Test Execution Matrix (T1 – T20)

| Test ID | Title | Scope / Description | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| **T1** | Discovery Flow | Select Mutual Funds -> scroll -> switch to Bonds -> open a bond. Verify distinct cards, riskometer, coupon vs YTM, detail routing. | Manual UI Audit + Data Tests | **PASS** | `Home.tsx` category switcher filters mock instruments cleanly. MF cards show 6-tier Riskometer, expense ratio with "(in NAV)" note, and min SIP. Bond cards show distinct coupon vs YTM, rating agency or "Unrated" badge. Navigates cleanly to `/instrument/:id`. |
| **T2** | News & Interpretation | Open News -> open announcement. Check headline, source, timestamp, summary, facts vs analysis distinction, uncertainty, linked instruments. | Manual UI Audit + Route Test | **PASS** | `News.tsx` & `NewsDetail.tsx` visually separate "Confirmed Facts" (green strip) from "Analysis & Interpretation" (blue strip). Uncertainties callout clearly rendered. Linked securities show rationales and navigate without trade CTAs. |
| **T3** | Event to Instrument | Simulate RBI event -> tap notification -> read explanation -> open affected bond/stock. Check rationale + caveat, balanced language, no "Buy now". | Manual UI Audit + `tradeGuard.test.ts` | **PASS** | Notification triggers link to `/event/evt-rbi-001`. Event screen displays verified facts, rupee example, caveats, and affected instruments with "View details" buttons only. No buy/sell triggers on event page. |
| **T4** | Safe Simulated Trade | News -> stock -> Buy -> adjust quantity -> review charges -> confirm checkbox -> simulated result. | Manual UI Audit + Trade Flow | **PASS** | Full flow: `/instrument/:id` -> `/order/:id` -> `/order/review` -> `/order/result/:id`. Total trade value and itemised charges computed dynamically via `calculateCharges()`. Review screen keeps "Confirm Simulated Order" disabled until checkbox is checked. |
| **T5** | No Accidental Trading | Tap notification then leave. Orders list unchanged; no order object created; navigating back from review doesn't execute orders. | Automated Unit Test (`src/state/tradeGuard.test.ts`) | **PASS** | 8 automated tests verify that dismissing/opening notifications, searching, toggling watchlists, or drafting orders leaves `simulatedOrders` length at 0. Execution only occurs upon explicit user checkbox submission. |
| **T6** | Beginner Comprehension | Open glossary terms (expense ratio, YTM, P/E, Delta, Theta, etc.). Check plain English, <=2 sentences, rupee examples, no return promises. | Automated Data Audit + `InfoPopover.tsx` | **PASS** | `src/lib/glossary.ts` contains 12 core financial terms with concrete rupee scenarios, limitations, and regulatory references (AMFI, RBI, SEBI). InfoPopovers render inline with keyboard and screen reader accessibility. |
| **T7** | Responsive Layout | Test 360x640, 390x844, 768x1024, 1440x900. No horizontal overflow; nav accessible; CTAs reachable (≥44px touch targets). | Browser Multi-Viewport Audit | **PASS** | Tailwind responsive grid (`max-w-7xl`, `px-4`, mobile bottom nav, desktop sidebar). Option chain table features sticky strike columns and internal horizontal scrolling (`overflow-x-auto`) to prevent viewport breakage on mobile. |
| **T8** | Empty & Error States | Filter with zero results; missing fields; loss-making stock; unrated bond; option chain missing expiry. | Manual Audit + `data.test.ts` | **PASS** | `EmptyState.tsx` handles zero-result searches. Missing metrics show "Not available" or "Not meaningful" rather than misleading ₹0 values. Unrated bond (`bond-corp-003`) correctly displays "Unrated" with credit risk explanation. |
| **T9** | Build & Code Quality | `npm run build`, `npm run lint`, `npm test` pass; no console errors; no broken links; no dead routes. | Automated CLI Pipeline | **PASS** | `tsc --noEmit` exits with 0 errors. `vite build` bundles `dist/` cleanly in 18s. `eslint .` passes with 0 errors and 0 warnings. Vitest runs 33 tests across 5 test suites with 100% pass rate. Friendly 404 on unknown routes. |
| **T10** | Options Education Gate | Open stock Options tab for first time -> education gate shown -> mandatory checkbox -> chain visible. Expiry switching works. | Manual UI Audit + Component State | **PASS** | `EducationGate.tsx` blocks options chain until user reads the SEBI 90% loss warning and checks comprehension box. State persists in `AppState.optionsGateAcknowledged`. Expiry buttons switch strikes seamlessly. |
| **T11** | Options Moneyness | ITM/ATM/OTM correctly assigned for calls and puts relative to spot, shown with text labels (never color alone). | Automated Unit Test (`options.test.ts`) | **PASS** | `getMoneyness()` tested across spot = 450. Calls: strike < 450 is ITM, strike = 450 is ATM, strike > 450 is OTM. Puts: inverted. Badges display explicit textual labels ("ITM", "ATM", "OTM") with distinct contrast. |
| **T12** | Options Payoff Engine | Payoff chart: breakeven = strike + premium (Call) / strike - premium (Put); max loss = premium x lotSize; Greeks tooltips present. | Automated Unit Test (`options.test.ts`) | **PASS** | Formulas verified via `payoff.ts` unit tests. Long Call breakeven, max loss, and payoff curve points calculated accurately. Greek metrics (Delta, Gamma, Theta) displayed with plain-English meaning and market caveat disclaimer. |
| **T13** | Options Safe Order Ticket | Buy Call / Buy Put pre-filled (contract, lot size, premium, max loss), charges shown for options, confirmation required; option selling disabled. | Manual UI Audit + Flow Test | **PASS** | Selecting contract opens `ContractPanel.tsx` with single CTA: "Buy Call/Put (Simulated)". Option writing is intentionally disabled to protect learners from unlimited liability. Ticket pre-fills lot-sized quantities and calculates exchange charges. |
| **T14** | Stock Financials Tab | Profit-making stock: 7 metric cards, period comparison, as-of date, quarterly/annual toggle, charts + table view, limitations popover. | Manual UI Audit + Data Model | **PASS** | `FinancialsTab.tsx` provides Revenue, Net Profit, Operating Margin, EPS, P/E, P/B, and Debt-to-Equity. Users can toggle between interactive Recharts bar charts and tabular views. Each metric has an `InfoPopover` explaining its definition and limitations. |
| **T15** | Financials Edge Cases | Loss-making stock: P/E "Not meaningful"; no-dividend stock shows "No dividend"; bank shows D/E caveat. | Automated Unit Test (`data.test.ts`) | **PASS** | Tested on `stock-zenstl` (P/E is null -> displays "Not meaningful"), `stock-nbfmcg` (dividend yield null -> "No dividend"), and `stock-ifbl` (banking company -> D/E displays "Not applicable for banks"). |
| **T16** | Community Compliance | Posts have credentials, sources, sponsored disclosure, conflict disclosure; simulated community banner; no tips or leaderboards. | Manual UI Audit + Component Audit | **PASS** | `LearnPage.tsx` and `PostCard.tsx` display SEBI/CFA author credentials, source citations, and commercial conflict declarations. `GuidelinesCard.tsx` prominently establishes zero-tip standards. No social feeds or return leaderboards exist. |
| **T17** | Community Report & Guard | Report post flow -> modal dialog -> confirmation -> "Reported"; milestone input rejects rupee amounts and digits via regex. | Manual Audit + `tradeGuard.test.ts` | **PASS** | Reporting a post updates `reportedPosts` in state and renders a persistent "You reported this post" confirmation banner. Milestone submission form validates text to forbid ₹ figures or numerical bragging. |
| **T18** | Delivery Buy vs Sell Charges | Delivery BUY: brokerage, STT, exchange, GST, SEBI, stamp duty applied; DP charges conditional (excluded). Delivery SELL: DP applied, stamp duty excluded. | Automated Unit Test (`calculateCharges.test.ts`) | **PASS** | Tested in `calculateCharges.test.ts`. Verified that on Buy, DP charges are classified as `CONDITIONAL` and omitted from `totalApplicable`. On Sell, DP charges are classified as `APPLIES` while Stamp Duty is marked `NOT_APPLICABLE`. |
| **T19** | Charges Transparency | Expandable breakdown displays mathematical formulas, regulatory explanations, and statutory disclaimer. | Manual UI Audit + `ChargesBreakdown.tsx` | **PASS** | `ChargesBreakdown.tsx` provides single-click itemised view showing rate formulas (e.g. `0.1% on trade value` for STT), clear explanations of receiving entities (SEBI, Exchange, Government), and disclaimer regarding static demo schedules. |
| **T20** | Config-Driven Fee Engine | All charge calculations driven purely by `FeeRateConfig` without hardcoded rates; modifying config updates UI without component changes. | Automated Unit Test (`calculateCharges.test.ts`) | **PASS** | Tested with custom test configuration (`customConfig` with 0.2% STT and ₹15 flat brokerage). `calculateCharges` dynamically scales all lines, GST, and net payable/receivable purely from the passed config. |

---

## Automated Test Suites

```
 RUN  v2.1.9 D:/genz groww

 ✓ src/lib/options/options.test.ts (7 tests)
 ✓ src/lib/fees/calculateCharges.test.ts (5 tests)
 ✓ src/lib/format.test.ts (8 tests)
 ✓ src/state/tradeGuard.test.ts (8 tests)
 ✓ src/data/data.test.ts (5 tests)

 Test Files  5 passed (5)
      Tests  33 passed (33)
   Duration  2.21s
```

### Breakdown of Automated Test Coverage:
1. **Fee Engine (`calculateCharges.test.ts`):**
   - Delivery BUY statutory charge calculation and DP conditional classification (T18).
   - Delivery SELL statutory charge calculation with DP applied and stamp duty excluded (T18).
   - Intraday BUY flat cap brokerage and zero stamp duty handling.
   - Options contract per-order flat brokerage and STT on sell side.
   - Config-driven rate independence without hardcoded UI numbers (T20).

2. **Options Module (`options.test.ts`):**
   - Moneyness assignment for Calls (ITM/ATM/OTM) across spot price boundaries (T11).
   - Moneyness assignment for Puts (ITM/ATM/OTM) across spot price boundaries (T11).
   - Long Call payoff calculation, breakeven, and max loss formula verification (T12).
   - Long Put payoff calculation, breakeven, and max loss formula verification (T12).
   - Out-of-the-money payoff bounding at negative total premium.

3. **Accidental Trade Guard (`tradeGuard.test.ts`):**
   - Reading/dismissing notifications never increments orders array (T5).
   - Exploring watchlist, search, and category selectors never executes orders (T5).
   - Acknowledging educational gates or reporting posts does not create orders.
   - Creating an order draft populates draft state but leaves `simulatedOrders` length at 0.
   - Explicit confirmation creates order, stamps IST timestamp, and clears draft.
   - Demo reset restores simulated orders to an empty list.
   - All mock notifications verified to contain zero direct trade action URLs.
   - Market events verified to enforce neutral exploration with reasons and caveats.

4. **Data Integrity & Relational Verification (`data.test.ts`):**
   - News related instruments resolve to valid instrument records with reasons (T2).
   - Event affected instruments resolve with reasons and risk caveats (T3).
   - Stock financial edge cases (loss-making P/E, no-dividend, bank debt-to-equity) verified (T15).
   - Bond coupon vs YTM independence and unrated bond presence verified (T1).
   - Option chain row count, strikes, lot size, and ATM delta alignment verified (T10, T11).

5. **Formatting & Localization (`format.test.ts`):**
   - Indian rupee formatting (`formatINR`) with Lakhs and Crores grouping (T6, T7).
   - Percentage formatting with explicit `+` / `−` sign and arrow indicators (T7).
   - Indian Standard Time (IST) formatting (`formatDateIST`) for timestamps and regulatory as-of dates.

---

## Known Scope Exclusions & Architectural Boundaries

As defined in `SPEC.md` §2 (P2 non-goals) and §14 (Fully Functional vs Simulated):
1. **Live Exchange Feeds:** Live prices, order books, and real exchange connectivity are intentionally omitted. All instruments use realistic illustrative figures.
2. **Shorting / Option Writing:** Selling options is blocked by design in this educational prototype. Young investors are restricted to Buy Call / Buy Put to cap maximum risk strictly at the premium paid.
3. **Real Push Notifications:** Notifications are triggered inside the prototype via local state and demo scenarios (RBI Repo Rate, Apex InfoTech earnings, Brent Crude surge).
4. **Social & Copy Trading:** User leaderboards, trade sharing, and copy-trading features are omitted by design to adhere to anti-FOMO ethical guidelines.

---

## Verification Sign-Off

- **Product Acceptance Tests:** 20/20 PASSED
- **TypeScript Strict Compilation:** PASSED (0 errors)
- **Production Build:** PASSED (`dist/` generated cleanly)
- **ESLint Code Quality:** PASSED (0 errors, 0 warnings)
- **Status:** **Ready for Evaluation & Demo Review**
