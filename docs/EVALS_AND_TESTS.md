# Evals & Testing Framework — Groww for Gen Z Prototype

**Document:** Complete Testing, Evaluation & QA Specification  
**Project:** Groww for Gen Z Investor Experience  
**Test Suite Status:** 11 Test Files · 67 Tests Passed (100% Pass Rate) · 0 Failures  
**Build & Typecheck:** `npx tsc --noEmit` (0 errors) · `npm run build` (Clean production bundle)  

---

## 1. Evaluation Methodology (Overview)

To evaluate whether the prototype genuinely solves the problem for Gen Z (ages 20–26), we established a three-tier evaluation methodology:

1. **Safety & Regulatory Evals (Anti-FOMO & Accidental Order Prevention):**
   Verifying that notifications, news stories, and event pages never trigger unverified trades or display coercive "Buy Now" prompts.
2. **Mathematical & Statutory Evals (Fee Engine & Black-Scholes Precision):**
   Validating dynamic, multi-tier statutory fee schedules (Brokerage, STT, GST, SEBI, Stamp Duty, DP charges) and European Black-Scholes Greeks calculations.
3. **Ergonomic & Educational Evals (Mobile Usability & Plain-English Comprehension):**
   Verifying responsive mobile swipe gestures, directional arrow controls, visual non-color-only cues, and plain-English financial definitions with rupee examples.

---

## 2. The 20-Point Product Acceptance Matrix (T1 – T20)

| Eval ID | Category | Target Experience Evaluated | Verification Method | Status |
|---|---|---|---|---|
| **T1** | Multi-Asset Discovery | Switch across 5 asset classes (MFs, Stocks, Bonds, ETFs, IPOs). Verify category-specific cards: 6-tier Riskometer, Coupon vs YTM, IPO lot size. | Manual UI Audit + `data.test.ts` | **PASS** |
| **T2** | News & Interpretation | Distinct visual separation between *Confirmed Facts* and *Market Interpretation*. Uncertainty callouts and linked securities with specific rationales. | Manual UI Audit + `News.test.tsx` | **PASS** |
| **T3** | Event to Instrument | Macroeconomic event deep-dive (RBI, Earnings, Oil). Explains "Why it matters" with rupee examples, caveats, and neutral "View details" buttons. | Manual UI Audit + `EventPage.test.tsx` | **PASS** |
| **T4** | Safe Simulated Trade | Complete funnel: Instrument -> Order Ticket -> Itemized Review -> Mandatory Checkbox -> Simulated Order Result. | Manual Flow Audit + `tradeGuard.test.ts` | **PASS** |
| **T5** | Accidental Trade Guard | Tapping/dismissing notifications, viewing events, or navigating back from review NEVER creates or executes an order. | Automated Suite (`tradeGuard.test.ts`, 8 tests) | **PASS** |
| **T6** | Beginner Comprehension | Plain-English glossary definitions (P/E, YTM, Delta, Theta, etc.) with real-world rupee examples and zero return guarantees. | `InfoPopover` + `format.test.ts` | **PASS** |
| **T7** | Responsive Layout | Tested across 360px, 390px, 768px, and 1440px viewports. No horizontal page overflow; touch targets >= 44px; bottom nav on mobile. | Responsive Browser Testing | **PASS** |
| **T8** | Empty & Error States | Graceful empty states when filters yield 0 results. Missing or unrated values show "Unrated" or "Not available", never default to 0. | `data.test.ts` + `EmptyState` | **PASS** |
| **T9** | Code & Build Health | TypeScript strict compilation exits with 0 errors; Vite production build passes with 0 bundle warnings. | `npx tsc` & `npm run build` | **PASS** |
| **T10** | Options Education Gate | Mandatory SEBI 90% loss warning modal blocking first-time access to options. Requires user acknowledgment before chain displays. | `OptionsLabPage.test.tsx` | **PASS** |
| **T11** | Moneyness Assignment | Calls & Puts correctly assigned ITM, ATM, and OTM based on spot price, rendered as explicit text badges (never color alone). | Automated Unit Test (`options.test.ts`) | **PASS** |
| **T12** | Options Payoff Engine | Long Call / Long Put breakeven points, maximum loss (capped at premium), and payoff curve calculated accurately. | Automated Unit Test (`options.test.ts`) | **PASS** |
| **T13** | Options Safe Order Ticket | Pre-filled lot sizes, premium, and total capital outlay. Selling/writing options is disabled to protect beginners from unlimited liability. | Manual Flow Audit + `ContractPanel` | **PASS** |
| **T14** | Stock Financials Tab | 7 core fundamental ratios with annual/quarterly toggles, interactive Recharts trend charts, and definition popovers. | UI Audit + `FinancialsTab` | **PASS** |
| **T15** | Financial Edge Cases | Loss-making stocks display P/E as "Not meaningful"; banks omit Debt-to-Equity; zero dividend shows "No dividend declared". | Automated Unit Test (`data.test.ts`) | **PASS** |
| **T16** | Community Compliance | Expert posts feature verified credentials (SEBI/CFA), source links, and commercial conflict disclosures. No stock tips or leaderboards. | `LearnPage.test.tsx` | **PASS** |
| **T17** | Community Safety Guard | Reporting flow updates state and displays confirmation. Milestone sharing form validates text using regex to block numeric rupee figures. | `LearnPage.test.tsx` + `tradeGuard` | **PASS** |
| **T18** | Delivery Buy vs Sell Fees | Delivery BUY applies stamp duty and excludes DP charges. Delivery SELL applies DP charges (₹15.93) and excludes stamp duty. | Automated Unit Test (`calculateCharges.test.ts`) | **PASS** |
| **T19** | Charges Transparency | Single-click expandable breakdown displaying mathematical formulas, regulatory recipients, and statutory disclaimer. | UI Audit + `ChargesBreakdown` | **PASS** |
| **T20** | Config-Driven Fee Engine | All charge calculations driven purely by `FeeRateConfig` without hardcoded UI numbers; modifying config updates output dynamically. | Automated Unit Test (`calculateCharges.test.ts`) | **PASS** |

---

## 3. Automated Test Suite Breakdown (67 Tests across 11 Files)

### Suite 1: Accidental Trade Guard (`src/state/tradeGuard.test.ts` — 8 Tests)
- `dismissing or reading notifications does NOT create or increment simulated orders`
- `tapping a market event notification does NOT create an order`
- `browsing watchlist and category selectors does NOT create an order`
- `acknowledging the options education gate does NOT create an order`
- `reporting a community post does NOT create an order`
- `creating an order draft populates draft state but leaves simulatedOrders length at 0`
- `explicit user confirmation creates order, stamps IST timestamp, and clears draft`
- `demo reset action completely resets simulated orders to empty array`

### Suite 2: Pure Statutory Fee Engine (`src/lib/fees/calculateCharges.test.ts` — 5 Tests)
- `Delivery BUY: correctly applies brokerage, STT, exchange, GST, SEBI, stamp duty; DP marked conditional`
- `Delivery SELL: applies DP charges, excludes stamp duty, calculates net receivable`
- `Intraday BUY: applies capped flat brokerage and zero stamp duty on delivery`
- `Options BUY: calculates turnover from premium, applies flat brokerage, and excludes STT on buy`
- `Config-driven: dynamically recalculates all charges when passed a custom rate configuration`

### Suite 3: Black-Scholes Formula Engine (`src/lib/options/blackScholes.test.ts` — 6 Tests)
- `computes valid Call option price and Greeks for standard inputs`
- `computes valid Put option price with negative delta`
- `handles zero days to expiry (DTE = 0) gracefully returning intrinsic value`
- `verifies Gamma is always positive for long options`
- `verifies Theta is negative reflecting time decay`
- `verifies Vega increases with volatility sensitivity`

### Suite 4: Options Moneyness & Payoff Engine (`src/lib/options/options.test.ts` — 7 Tests)
- `assigns ITM, ATM, and OTM correctly for Call options relative to spot`
- `assigns ITM, ATM, and OTM correctly for Put options relative to spot`
- `calculates Long Call breakeven price as strike + premium`
- `calculates Long Put breakeven price as strike - premium`
- `bounds maximum potential loss strictly at total premium paid (lot size * premium)`
- `calculates positive payoff points beyond breakeven`
- `bounds out-of-the-money expiration payoff at negative total premium`

### Suite 5: Relational Data Integrity (`src/data/data.test.ts` — 5 Tests)
- `news relatedInstrumentIds resolve to valid instruments with non-empty reasons`
- `event affectedInstruments resolve with explicit reasons and risk caveats`
- `stock financial edge cases handle loss-making P/E, no-dividend, and bank leverage rules`
- `bond fixtures correctly distinguish coupon rate from Yield-to-Maturity (YTM)`
- `option chain strikes, lot size, and ATM delta alignment are valid and consistent`

### Suite 6: Indian Numbering & Localization (`src/lib/format.test.ts` — 9 Tests)
- `formats zero and falsy numbers gracefully as ₹0.00`
- `formats standard Indian numbers with comma grouping (₹1,23,456.78)`
- `formats compact currency in Thousands (K), Lakhs (L), and Crores (Cr)`
- `formats positive percentage with + sign and green indicator flag`
- `formats negative percentage with − sign and red indicator flag`
- `formats dates in Indian Standard Time (IST) with explicit time`
- `formats 24-hour clean clock dates without AM/PM tags`
- `formats period labels consistently in uppercase`
- `handles invalid date inputs safely without crashing`

### Suite 7: Options Lab Landing & Carousels (`src/pages/OptionsLabPage.test.tsx` — 12 Tests)
- `replaces Watchlist with Options in bottom navigation`
- `renders Options Lab header, subtitle, and how options work button without interactive lab badge or beginner/advanced toggle`
- `opens and closes the "How options work" educational primer modal`
- `displays supported instruments and switches underlying when clicked`
- `updates expiry selector and updates DTE when changing expiry`
- `renders option chain table with strikes, calls, puts, and spot price indicator`
- `switches metric views between Price, Open Interest, Greeks, and IV`
- `opens contract panel bottom sheet when clicking an option strike row`
- `navigates to Explore Scenarios tab and recalculates when moving spot or IV sliders`
- `supports right and left directional navigation in Market Scenarios swiping carousel`
- `navigates to Paper Simulator, allows lot adjustment and saves simulated trade`
- `displays option order in simulated orders tab after saving`

### Suite 8: News Stories & Swipeable Carousel (`src/pages/News.test.tsx` — 4 Tests)
- `renders single news story and shows right arrow but NO left arrow initially`
- `navigates to next story when clicking right arrow, showing both left and right arrows`
- `navigates to the last story and hides the right arrow`
- `filters news feed by category and level without breaking carousel index`

### Suite 9: Macro Event Impact Carousel (`src/pages/EventPage.test.tsx` — 2 Tests)
- `renders single asset impact with right arrow and no left arrow on first slide`
- `renders Section 5 Simulate and Section 6 Decide with AI correctly`

### Suite 10: Learn Curriculum & Q&A Carousel (`src/pages/LearnPage.test.tsx` — 6 Tests)
- `renders progress tracking dashboard and curriculum modules by default`
- `opens chapter reader modal, displays rupee example and takeaways, and marks chapter completed`
- `launches module quiz, provides instant answer feedback, and records score`
- `renders swipeable expert posts carousel with single post at a time and directional arrows`
- `renders swipeable Q&A carousel with single question at a time and directional arrows`
- `filters Q&A threads by tag and search query`

### Suite 11: Notification Center UI (`src/pages/NotificationsPage.test.tsx` — 3 Tests)
- `renders notifications feed with category filter chips`
- `renders EVENT, RESULT, and WATCHLIST badges with updated UI and color coding`
- `renders "View Instrument Profile" with the exact same styling as "Explore Analysis & Details"`

---

## 4. Execution Commands for Reviewers

```bash
# 1. Run all 67 automated tests
npx vitest run

# 2. Run TypeScript strict typecheck (0 errors)
npx tsc --noEmit

# 3. Build production bundle (0 warnings)
npm run build

# 4. Launch local development server
npm run dev
```
