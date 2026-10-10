# Groww for Gen Z — PM Assignment Submission

**Candidate Submission**  
**Role:** Product Manager / Associate Product Manager Assignment  
**Problem Statement:** Designing Groww for the GenZ Investor (Ages 20–26)  
**Submission Repository:** `genz-groww`  

---

# SECTION 1: 1-Page Core Submission (~600 Words)

### a. My Take on the Problem Statement
India's 20–26 cohort represents a tectonic shift in retail investing. Entering the markets armed with their first salary, internship stipends, or freelance income, Gen Z investors are digitally native yet financially vulnerable. They suffer not from a lack of information, but from **information pollution**—algorithmic social media feeds, viral fin-influencer tips, and gamified apps that equate investing with mobile gaming. 

Traditional platforms present two extremes: sterile, complex brokerage terminals that intimidate beginners, or hyper-gamified apps with confetti animations, streak counters, and FOMO alerts that encourage impulsive trading. Gen Z users experience high anxiety around three hidden pitfalls:
1. **Hidden Costs:** Wondering why a ₹50 gain resulted in a net loss after unlisted statutory deductions.
2. **Context Deficit:** Inability to connect macro headlines (e.g., RBI repo rate hike) to their specific portfolio instruments.
3. **Downside Illiteracy:** Misunderstanding derivatives (F&O) as "lottery tickets," leading to the 93% retail loss statistic highlighted by SEBI.

Our mandate is not merely to lower transaction friction, but to build **"Friction as an Intentional Feature"**—converting ambient anxiety into sustainable, informed investing habits without patronizing the user.

---

### b. What is in Scope
1. **Live News Tracking & Macro Event Impact Engine:** Real-time categorized news feed (Markets, Economy, Stocks, Bonds) featuring a strict visual split between *Confirmed Facts* and *Market Interpretation*. Each macro story (e.g., RBI repo rate cut, crude oil surge) includes an **Event Impact Deep-Dive** translating headlines into asset-class ripple effects with concrete rupee examples, risk caveats, and linked securities—eliminating speculative guessing.
2. **Notification-to-Trade Guided Workflow:** Interactive in-app notification center alerting users to market-moving events. Users can seamlessly transition from notification $\rightarrow$ event impact breakdown $\rightarrow$ affected instrument details $\rightarrow$ order ticket $\rightarrow$ itemized fee review $\rightarrow$ simulated trade execution, keeping the journey action-oriented yet deliberate.
3. **Options Lab Simplification for Beginners:** Complete demystification of derivatives for first-time Gen Z traders:
   - Mandatory **Education Gate** with SEBI risk comprehension check before first access.
   - "How Options Work" primer breaking down derivatives into 5 foundational answers.
   - Visual Moneyness badges (`ITM`, `ATM`, `OTM`) avoiding reliance on color alone.
   - **Greeks Terminal** translating Delta, Gamma, Theta, Vega, and Rho into plain-English rupee impacts.
   - **1-Click Market Scenarios Carousel:** Swipeable cards (`Bullish Rally`, `Market Pullback`, `Weekend Decay`, `Vol Spike`, `Vol Crush`) testing realistic market shocks with direction arrows.
   - **What-If Sliders:** Real-time Black-Scholes recalculation across spot, days-to-expiry, and implied volatility.
   - **Paper Trading Simulator:** Visual payoff chart, breakeven indicator, and a dedicated card clearly separating per-share option premium from total lot capital outlay. Restricted to Buy-only to prevent unlimited downside.
4. **Community Q&A Discussions & Learn Curriculum:** Interactive Q&A discussion threads where beginners ask questions and learn from accredited contributors (SEBI/CFA) with transparent conflict disclosures, helpful voting, structured learning paths with rupee quizzes, and milestone sharing with strict regex masking of numerical wealth figures.
5. **Pre-Trade Dynamic Statutory Fee Engine:** Pure calculation engine revealing exact Brokerage, STT, Exchange Turnover, SEBI, GST (18%), Stamp Duty, and DP charges before committing capital, separating applicable deductions from conditional levies.
6. **Unified Multi-Asset Discovery & Deep Financials:** Category-specific discovery for 5 asset classes (Mutual Funds, Stocks, Bonds, ETFs, IPOs) with tailored cards (6-tier Riskometer, Coupon vs. YTM, IPO lots) and 7 core fundamental ratios with edge-case handling (loss-making P/Es, bank leverage rules).

---

### c. What is Out of Scope
1. **Live Exchange Execution & Demat Broking:** No live depository (CDSL/NSDL) APIs or KYC flows; orders are simulated in persistent local storage.
2. **Unhedged Option Writing:** Naked shorting is omitted due to unlimited downside liability.
3. **Gamification & Social Traps:** No trading streaks, confetti, countdown timers, FOMO push alerts, or copy-trading leaderboards.
4. **Algorithmic Stock Tips:** No black-box automated buy/sell recommendations or "guaranteed returns" claims.

---

### d. The Solution & Why It Works
Our solution is anchored on the **Guided Five-Stage Trust Funnel**:
$$\text{Discover} \longrightarrow \text{Understand} \longrightarrow \text{Explore Instruments} \longrightarrow \text{Review Risks \& Costs} \longrightarrow \text{Decide Consciously}$$

**Why this succeeds for Gen Z:**
1. **Turning News into Actionable Understanding:** Instead of passive headlines or fin-influencer hype, our live news and event impact engine immediately demonstrates *how news affects specific trades and asset classes* with tangible rupee illustrations.
2. **Informed Notification-to-Trade Funnel:** Notifications don't push blind trades; they invite users to understand macroeconomic catalysts first, seamlessly guiding them to explore affected instruments and test simulated orders with complete price and fee clarity.
3. **Demystifying High-Risk Derivatives Safely:** Rather than banning F&O or letting users lose capital blindly, the Options Lab provides an intuitive simulator—translating Black-Scholes Greeks into plain English, simulating 1-click market scenarios, and establishing clear distinction between per-share premium and total outlay.
4. **Peer Learning Without Misinformation:** The community Q&A and curriculum replace toxic stock-tip groups with structured, credentialed discussions and privacy-first milestone sharing.
5. **Radical Cost Transparency:** Itemizing statutory costs and SEBI charges before execution builds lifelong platform loyalty by eliminating "surprise" trade deductions.
6. **Mobile-Native Ergonomics:** Complex institutional features (Greeks terminal, scenario presets, event impacts, news stories) are packaged in intuitive swipeable carousels with directional arrows, matching Gen Z's mobile habits without sacrificing analytical rigor.

---

# SECTION 2: Prompts Used to Create the Tool

The application was built systematically using an agentic, test-driven prompt hierarchy across foundational, functional, and refinement phases:

### 1. Architectural Master Prompt
```text
You are a senior full-stack engineer and fintech UX designer. Build an interactive, 
responsive prototype called "Groww for Gen Z" (ages 20–26). 
Stack: React 18, TypeScript 5, Vite, Tailwind CSS, Lucide React, Recharts, Vitest.

Product Thesis: Help young investors move through:
Discover -> Understand -> Explore relevant instruments -> Review risks and costs -> Decide consciously.
Trust is a core feature; never encourage impulsive trading.

Core Constraints:
1. Mock data only with persistent "Demo" badges.
2. Distinct Fact vs. Analysis visual separation in news and macro events.
3. Pure, config-driven statutory fee engine itemizing Brokerage, STT, Exchange, GST, SEBI, 
   Stamp Duty, and DP charges before order confirmation.
4. Derivative module restricted to Buy-only, protected by a mandatory SEBI risk education gate.
5. Strict Accidental Trade Guard: notifications and events must never link directly to buy orders.
```

### 2. Statutory Fee Engine Prompt
```text
Implement a pure, unit-tested fee engine in `lib/fees/calculateCharges.ts` driven by `feeConfig.ts`.
Calculate exact statutory costs for Equity Delivery (Buy/Sell), Intraday, and Options Buy.
Requirements:
- Classify lines into APPLIES vs CONDITIONAL (e.g., DP charge applies only to delivery sells).
- Compute GST dynamically at 18% over Brokerage, Exchange, and SEBI charges.
- Generate net payable and net receivable calculations with full formula transparency.
- Provide comprehensive unit tests covering trade value variations and rate configurations.
```

### 3. Options Lab & Black-Scholes Greeks Prompt
```text
Build the Options Lab module for stock derivatives:
1. Implement Black-Scholes pricing in `lib/options/blackScholes.ts` computing price, Delta, Gamma, 
   Theta, Vega, and Rho.
2. Create an Option Chain with sticky strike columns, internal scroll, and ITM/ATM/OTM moneyness pills.
3. Build `ScenarioExplorer.tsx` with a What-If simulator adjusting Spot (+/-5%), Days to Expiry, 
   and Implied Volatility (+/-8%).
4. Add 5 One-Click Market Scenarios (Bullish Rally, Market Pullback, Weekend Decay, Vol Spike, 
   Vol Crush) rendered as a mobile-native swipeable carousel with left/right direction buttons.
5. Create `PaperTradingSimulator.tsx` featuring a payoff chart, breakeven indicator, and a dedicated 
   card clearly distinguishing Per Share Premium from Total Capital Outlay.
```

### 4. UI Refinement & Form Factor Prompt
```text
Refine mobile formatting and layout ergonomics across all cards:
- Stack overview and key stats vertically one below another to prevent column squishing on mobile.
- In `PaperTradingSimulator.tsx`, format the "Per Share vs Total Outlay Distinction" card: anchor the 
  info icon to the top of the title and place the Total Capital Outlay box in a dedicated full-width 
  summary container below the text.
- Ensure all interactive carousels support touch swipe tracking (onTouchStart/Move/End) and directional 
  chevron buttons with boundary hiding.
```

---

# SECTION 3: Evals Used to Test the Solution

The prototype was validated against a 20-point Acceptance Testing Matrix (**T1–T20**) combined with **67 automated unit and integration tests** in Vitest:

| Eval Category | Criteria Tested | Verification Method | Result |
|---|---|---|---|
| **E1: Accidental Order Guard** | Opening a notification, reading news, or browsing events must NEVER increment orders or trigger trades. | `tradeGuard.test.ts` (8 automated tests) | **100% Pass** |
| **E2: Fee Engine Precision** | Delivery Buy applies stamp duty, excludes DP; Delivery Sell applies DP, excludes stamp duty; 18% GST correctly levied. | `calculateCharges.test.ts` (5 automated tests) | **100% Pass** |
| **E3: Moneyness & Greeks Math** | Calls < spot are ITM, > spot are OTM; Puts inverted; Black-Scholes Delta, Gamma, Theta match benchmark formulas. | `blackScholes.test.ts`, `options.test.ts` (13 automated tests) | **100% Pass** |
| **E4: Edge-Case Financials** | Loss-making firms display P/E as "Not meaningful"; Banks omit Debt-to-Equity; missing metrics show "Not available". | `data.test.ts` (5 automated tests) | **100% Pass** |
| **E5: Mobile Carousel Usability** | Market scenarios, News stories, Event impacts, and Learn posts navigate smoothly via swipe & left/right buttons; boundary arrows hide properly. | `OptionsLabPage.test.tsx`, `News.test.tsx`, `EventPage.test.tsx`, `LearnPage.test.tsx` (24 tests) | **100% Pass** |
| **E6: Localization & Formatting** | Rupee amounts formatted in Indian numbering (`₹1,23,456.78` / Lakhs / Crores); dates rendered in IST. | `format.test.ts` (9 automated tests) | **100% Pass** |
| **E7: Educational Comprehension** | Glossary terms, popovers, and rupee examples provide plain-English clarity without return promises. | Component audits & `InfoPopover` checks | **100% Pass** |
| **E8: Type & Bundle Integrity** | Zero TypeScript compilation errors and clean Vite production bundle. | `npx tsc --noEmit` & `npm run build` | **0 Errors** |

### Automated Test Suite Run:
```text
 RUN  v2.1.9 D:/genz groww

 ✓ src/lib/options/blackScholes.test.ts (6 tests)
 ✓ src/lib/fees/calculateCharges.test.ts (5 tests)
 ✓ src/lib/format.test.ts (9 tests)
 ✓ src/lib/options/options.test.ts (7 tests)
 ✓ src/state/tradeGuard.test.ts (8 tests)
 ✓ src/data/data.test.ts (5 tests)
 ✓ src/pages/NotificationsPage.test.tsx (3 tests)
 ✓ src/pages/OptionsLabPage.test.tsx (12 tests)
 ✓ src/pages/News.test.tsx (4 tests)
 ✓ src/pages/EventPage.test.tsx (2 tests)
 ✓ src/pages/LearnPage.test.tsx (6 tests)

 Test Files  11 passed (11)
      Tests  67 passed (67)
```

---

# SECTION 4: Application Links & How to Run

### Local Execution:
```bash
# Clone the repository
git clone https://github.com/SohamBalwant/genz-groww.git
cd genz-groww

# Install dependencies
npm install

# Start local dev server
npm run dev
# -> Runs at http://localhost:5173/

# Run automated test suite
npx vitest run
# -> 67 tests passing across 11 suites

# Verify TypeScript type check
npx tsc --noEmit
# -> 0 errors
```

### Live Tool Links (Artifact 4):
- **Live Deployed Web App (Vercel):** [https://genz-groww.vercel.app/](https://genz-groww.vercel.app/)
- **GitHub Repository:** [https://github.com/SohamBalwant/genz-groww](https://github.com/SohamBalwant/genz-groww)
- **Local Dev Server:** Runs locally at `http://localhost:5173/` via `npm run dev`
- **Automated QA & Evals:** 67 passed across 11 test suites via `npx vitest run`
