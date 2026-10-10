# Design Notes — Groww-Inspired Gen Z Investment Prototype

## 1. Context & Design Study Boundaries
- **Product:** "Groww for Gen Z" — an independent PM internship prototype concept for young Indian investors (ages 20–26).
- **Status:** Independent research & design study. NOT an official Groww product. All market data is illustrative/mock; all transactions are simulated.
- **Goal:** Move young investors through a disciplined journey:
  `Discover -> Understand -> Explore relevant instruments -> Review risks and costs -> Make their own decision`

## 2. Visual Architecture & Tokens
- **Backgrounds:** Clean, bright canvas (`#FFFFFF` default card/surface, `#F8F8FA` muted page canvas, `#F0F0F4` pill/track fills). Generous whitespace with an 8px base rhythm.
- **Primary Color:** Groww-inspired signature mint emerald (`#00B386`), with hover (`#009970`) and active (`#007A58`) variants. Never use fluorescent or neon gaming hues.
- **Directional Signals (WCAG & Accessibility compliant):**
  - **Gain:** `#00B386` accompanied ALWAYS by positive sign and arrow (`▲ +1.24%`).
  - **Loss:** `#EB5B3C` accompanied ALWAYS by negative sign and arrow (`▼ −0.82%`).
  - **Caution:** `#F5A623` for amber warnings and risk flags.
  - **Information:** `#3B82F6` for interpretations, explainers, and links.
  - *Hard requirement:* Color is never the sole carrier of status or meaning.
- **Typography:**
  - Modern, crisp geometric sans (`Inter` / system-ui).
  - High-legibility scale: 10px (micro tag), 12px (secondary captions), 14px (body/label), 16px (subhead), 20px (card titles), 24px/32px (display numbers).
  - Strict `tabular-nums` for all asset prices, percentages, Greeks, and fee calculations.
  - Indian numbering conventions (`₹1,23,456.78`, Lakhs, Crores).

## 3. Navigation & Mobile-App First Architecture
- **Primary Form Factor:** Mobile App Native UX.
- **On Mobile Devices (<768px):**
  - Edge-to-edge 100% full-screen mobile app canvas.
  - Sticky mobile TopBar: Wordmark ("Groww · Gen Z"), persistent DEMO indicator, Search button, Notification bell with unread badge counter, Settings.
  - Permanent Bottom Navigation Bar (5 primary tabs: Home, News, Learn, Watchlist, Orders) with touch-safe insets.
  - Native gesture-friendly bottom sheets and sticky action bars.
- **On Desktop Screens (≥768px):**
  - Centered Smartphone Simulator Shell (`420 × 890px` iPhone/Android chassis with titanium bezel, dynamic island, and simulated status bar showing time, 5G, Wi-Fi, and battery).
  - Studio Environment Toolbar with Viewport Mode Switcher:
    - **Phone Frame**: Realistic smartphone mockup with bezel, notch & status bar (default).
    - **Frameless**: Clean 420px mobile column without device chassis.
    - **Expanded**: Fluid responsive view for presentation versatility.

## 4. Card Hierarchy & Progressive Disclosure
- **Mutual Fund Cards:** Name, AMC, category, Riskometer level tag, Expense ratio (with embedded NAV note), 1Y/3Y/5Y returns with mandatory "Past performance is not a guide to future returns" caption.
- **Stock Cards:** Ticker, company name, 1D price change with explicit period label, P/E, market-cap bucket, sector, and latest headline tag.
- **Bond Cards:** Distinct separation of Coupon rate vs Yield-to-Maturity (YTM), maturity year, credit rating & agency (or "Unrated"), minimum investment, and clear liquidity/rate-risk chips.
- **ETF Cards:** Benchmark tracked, expense ratio, liquidity notes.
- **IPO Cards:** Status badge (Upcoming/Open/Closed), price band, lot size, minimum investment, and neutral risk factors without FOMO or GMP (grey market premium) hype.

## 5. Anti-Dark-Pattern Rules
- NO countdown timers, fake scarcity, or "X people bought today" prompts.
- NO auto-order placement from notifications, news feeds, or deep links.
- NO copy-trading, gamified leaderboards, or trade streak rewards.
- All news cards strictly partition **Confirmed Facts** from **Analysis & Interpretation**.
- Every single mock item carries a visible `Demo` badge.
