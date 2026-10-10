# Product & Design Assumptions

## 1. Prototype Scope & Nature
- **Independent Design Study:** This prototype is an academic/PM portfolio concept and is NOT an official Groww application. All data is mock/illustrative, and no connection to any live brokerage, depository, or exchange exists.
- **Fictional Entity Names:** To eliminate any misconception of presenting real market performance or leaking insider figures, companies are given plausible fictional names (e.g., "Bharat Petrochem Ltd", "IndiaFirst Bank Ltd", "Apex InfoTech Ltd", "NovaBharat FMCG Ltd", "Zenith Steel Ltd", "SunRise Pharma Ltd").
- **IST Timezone & Currency:** All financial figures are denominated in Indian Rupees (₹) with Lakh/Crore compact formatting or standard Indian comma grouping (`₹1,23,456.78`). Timestamps are formatted in Indian Standard Time (IST).

## 2. Trading & Order Flow
- **Simulated Order Model:** Placing an order records a local simulated order in browser `localStorage`. No actual financial commitments or API calls to clearing houses occur.
- **No Immediate or Accidental Orders:** Tapping on any notification, news story, or deep link NEVER creates or submits an order. The order funnel requires deliberate progression: `Event -> Instrument Details -> Initiate Order -> Configure Ticket -> Review Itemised Charges -> Check Acknowledgment -> Confirm Simulated Order`.
- **Options Limitation (Buy Only):** The options module strictly permits buying Call and Put contracts (`CE` and `PE`). Writing/selling options is deliberately disabled because shorting options carries theoretically unlimited downside, conflicting with the educational safety posture for young investors.
- **Friction as an Intentional Feature:** First-time access to derivatives requires completing an educational risk gate. Confirmation checkboxes are mandatory on all simulated order reviews to reinforce conscious evaluation.

## 3. Financials & Ratios Logic
- **Loss-making Edge Case:** Companies with negative net income (such as Zenith Steel Ltd) display P/E as `"Not meaningful (loss-making)"` rather than a misleading negative numeric value.
- **Banking / Financial Institutions:** Debt-to-Equity is not an informative ratio for banks whose primary business model relies on deposits/leverage. Such institutions show an industry note: `"Not comparable for banks/NBFCs"`.
- **Missing or Zero Metrics:** Zero dividends are labelled `"No dividend declared"`. Unknown or unreleased metrics show `"Not available"` with explanatory tooltips, never defaulted to 0.

## 4. Community & Social Features
- **No Copy-Trading or Leaderboards:** Gamification, trade streaks, follower rankings, and copy-trading are strictly omitted as they incentivize reckless imitation among novice investors.
- **Non-Financial Milestones:** Community milestones permit sharing qualitative learning achievements (e.g., "Started my first SIP", "Completed beginner debt guide"). Any numerical rupee amounts are rejected by client validation to safeguard user privacy.
- **Disclosures:** Any post that is sponsored or where an author maintains an interest must prominently display disclosures. If missing, it explicitly reads `"No disclosures provided"`.

## 5. Cost Engine & Rates
- **Demo Fee Schedule:** The rates configured in `feeConfig.ts` are labelled DEMO estimates (e.g., 0.10% delivery brokerage, 18% GST on charges, ₹15.93 DP charge on delivery sells). They serve to educate users on the multi-layered breakdown of statutory and brokerage deductions before committing capital.
