export interface Chapter {
  id: string;
  title: string;
  duration: string; // e.g. "3 min read"
  summary: string;
  keyTakeaways: string[];
  content: string[];
  rupeeExample?: {
    title: string;
    description: string;
    calc: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface LearningModule {
  id: string;
  title: string;
  slug: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDuration: string;
  description: string;
  colorScheme: 'emerald' | 'blue' | 'purple' | 'amber';
  chapters: Chapter[];
  quiz: ModuleQuiz;
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-foundations',
    title: '1. Foundations of Wealth & Compounding',
    slug: 'foundations-of-wealth',
    level: 'Beginner',
    totalDuration: '10 min',
    description:
      'Learn why holding uninvested cash guarantees purchasing power erosion, how the Rule of 72 works, and how to match your investment horizon to the SEBI Riskometer.',
    colorScheme: 'emerald',
    chapters: [
      {
        id: 'chap-1-1',
        title: 'Saving vs. Investing: The Inflation Invisible Tax',
        duration: '3 min read',
        summary:
          'Keeping money in regular bank savings accounts feels risk-free, but persistent inflation quietly erodes what that money can buy over time.',
        content: [
          'Most first-time earners equate financial safety with leaving their money in a savings account or short-term fixed deposit (FD). However, safety is relative: while nominal rupees are preserved, their real purchasing power diminishes relentlessly every year.',
          'In India, average consumer price inflation (CPI) historically hovers between 5% and 6.5%. If your bank fixed deposit yields 6.5% pre-tax and you fall in the 20% or 30% tax bracket, your post-tax return is merely 4.5% to 5.2%. In real terms, your net real return is negative.',
          'Investing is not about quick wealth or beating market day-traders; it is the discipline of deploying capital into productive commercial assets (corporate equity, sovereign debt, real estate) that generate economic value above the inflation hurdle rate.',
        ],
        keyTakeaways: [
          'Nominal safety is not real safety: cash and low-yield deposits lose purchasing power over time.',
          'Real return = Nominal Return − Inflation Rate − Applicable Tax.',
          'To compound wealth, your portfolio must earn a post-tax yield exceeding annual CPI inflation.',
        ],
        rupeeExample: {
          title: 'The ₹1,00,000 Purchasing Power Test',
          description:
            'At 6% annual inflation, ₹1,00,000 kept in a savings account earning 3% will buy what ₹74,500 buys today after only 10 years.',
          calc: 'Real loss of ₹25,500 in purchasing capacity despite nominal balance increasing.',
        },
      },
      {
        id: 'chap-1-2',
        title: 'The Compounding Engine: Rule of 72 & Starting Early',
        duration: '3 min read',
        summary:
          'Albert Einstein famously called compounding the eighth wonder of the world. Time in the market is vastly more powerful than timing the market.',
        content: [
          'Compound interest is interest calculated on the initial principal, which also includes all the accumulated interest from previous periods. In simple words, your interest starts earning its own interest.',
          'The Rule of 72 is a mental shortcut to estimate how many years it takes for an investment to double at a given annual rate of return: divide 72 by your expected annual return rate. For example, at an 8% annual return, your capital doubles in roughly 9 years (72 / 8 = 9). At a 12% return, it doubles in 6 years (72 / 12 = 6).',
          'The biggest asset a student or young professional possesses is not capital size, but years of compounding runway. Starting a modest ₹2,000 monthly SIP at age 21 creates far greater wealth by retirement than a ₹10,000 SIP started at age 35, because the early money enjoys 14 extra years of exponential doubling.',
        ],
        keyTakeaways: [
          'Rule of 72: Years to Double = 72 ÷ Annual Return Percentage.',
          'Exponential growth occurs in the later decades of your investing timeline; patience is mandatory.',
          'A smaller SIP started in your early 20s can outperform a 5x larger SIP started in your mid-30s.',
        ],
        rupeeExample: {
          title: '₹2,500/Month SIP Over 20 Years',
          description:
            'Investing ₹2,500 monthly (₹6 Lakh total invested capital over 20 years) at a conservative 12% equity CAGR grows into approximately ₹25 Lakhs.',
          calc: 'Invested: ₹6,00,000 | Wealth Created: ~₹19,00,000 (3.1x wealth creation multiple).',
        },
      },
      {
        id: 'chap-1-3',
        title: 'Asset Allocation & The SEBI Riskometer',
        duration: '4 min read',
        summary:
          'Match your financial time horizon to appropriate risk tiers rather than taking impulsive gambles on single volatile instruments.',
        content: [
          'Every investment vehicle under SEBI regulations carries a standardized Riskometer classification ranging from Low to Very High. This label is not a stamp of quality; it reflects the short-term price volatility and potential for capital drawdown.',
          'The golden rule of asset allocation is matching time horizon to instrument maturity. If you need money within 6 months (for college tuition or rent deposits), equity is unsuitable because short-term market drops can temporarily cut value by 15–20%. Liquid mutual funds or Treasury Bills are appropriate here.',
          'Conversely, for goals 5 to 10+ years away (retirement, early financial independence), placing funds in conservative fixed deposits guarantees purchasing power loss. Long-term goals demand equity index funds and balanced asset allocation to capture economic GDP expansion.',
        ],
        keyTakeaways: [
          'Never invest short-term capital (< 12 months) in high-beta equity instruments.',
          'Diversify across non-correlated asset classes: Equities (growth), Debt (stability), and Gold (crisis hedge).',
          'Respect SEBI Riskometer disclosures to prevent sudden liquidity or drawdown shocks.',
        ],
        rupeeExample: {
          title: 'The 3-Bucket Rule for Young Earners',
          description:
            'Allocate emergency buffer (3–6 months expenses) in Liquid Funds, medium-term goals (2–3 years) in Short Duration Debt, and long-term goals (5+ years) in Broad Market Equity Index Funds.',
          calc: 'Reduces portfolio drawdowns without sacrificing long-term compounding growth.',
        },
      },
    ],
    quiz: {
      id: 'quiz-foundations',
      title: 'Module 1 Knowledge Check',
      passingScore: 2,
      questions: [
        {
          id: 'q1-1',
          question:
            'If average inflation is 6% and a Fixed Deposit pays 6.5% pre-tax (yielding 5.2% post-tax in your tax slab), what is happening to your wealth?',
          options: [
            'Your money is growing steadily and beating the market.',
            'Your purchasing power is shrinking because your post-tax return is lower than inflation.',
            'You are earning a zero risk-free arbitrage spread.',
            'Taxes have no effect on compounding returns.',
          ],
          correctIndex: 1,
          explanation:
            'Real return = Nominal post-tax yield (5.2%) minus inflation (6.0%) = -0.8%. Despite nominal bank balances showing an increase, your rupees buy fewer goods every year.',
        },
        {
          id: 'q1-2',
          question:
            'According to the Rule of 72, approximately how many years will it take for an investment to double at a 12% annual compounding rate?',
          options: ['12 years', '8.5 years', '6 years', '4 years'],
          correctIndex: 2,
          explanation:
            'The Rule of 72 divides 72 by the rate of return: 72 ÷ 12 = 6 years. At 12% CAGR, your capital doubles roughly every 6 years.',
        },
        {
          id: 'q1-3',
          question:
            'Which asset class is appropriate for an emergency fund you may need to access within 30 days?',
          options: [
            'Nifty Midcap 100 Equity ETF',
            'Liquid Mutual Fund or Overnight Debt Fund',
            'Out-of-the-money Call Options',
            'Cryptocurrency tokens',
          ],
          correctIndex: 1,
          explanation:
            'Short-term liquidity must be held in ultra-low volatility instruments like Liquid or Overnight Debt funds that prioritize capital preservation over speculative returns.',
        },
      ],
    },
  },
  {
    id: 'mod-indexing',
    title: '2. Mastering Index Funds & Mutual Funds',
    slug: 'index-funds-mutual-funds',
    level: 'Beginner',
    totalDuration: '12 min',
    description:
      'Understand how the Nifty 50 works, why direct index funds outperform costly active funds over decades, and how Rupee Cost Averaging via SIP eliminates market timing anxiety.',
    colorScheme: 'blue',
    chapters: [
      {
        id: 'chap-2-1',
        title: 'Passive vs. Active: Why Broad Indexing Wins',
        duration: '4 min read',
        summary:
          'Passive index investing eliminates stock-picking anxiety and management biases by owning the entire top tier of the Indian economy.',
        content: [
          'A stock index, like the Nifty 50 or BSE Sensex, represents a rules-based basket of India’s largest, most liquid companies across diverse sectors including banking, technology, energy, and consumer goods.',
          'An active fund manager attempts to beat the benchmark index by guessing which individual stocks will outperform and timing entry and exit points. However, global SPIVA research demonstrates that over 10-year horizons, more than 75% of actively managed large-cap funds in India fail to beat their benchmark after accounting for management fees.',
          'Passive index funds simply replicate the index weights. When you buy a Nifty 50 index fund, you instantly own a slice of the top 50 corporate leaders in the country with zero single-company failure risk.',
        ],
        keyTakeaways: [
          'An index fund owns the market benchmark directly rather than relying on a fund manager’s hunches.',
          'Underperforming firms are automatically dropped from the index during semi-annual rebalancing and replaced by rising leaders.',
          'Over long horizons, low-cost broad-market index funds outperform the vast majority of active mutual funds.',
        ],
        rupeeExample: {
          title: 'The Self-Cleaning Portfolio',
          description:
            'In 2005, mobile service providers and textile firms held large Nifty 50 weights; today, enterprise software and private banks dominate. The index evolved automatically without investor intervention.',
          calc: 'Zero capital gains tax triggered when companies rotate out of the benchmark index.',
        },
      },
      {
        id: 'chap-2-2',
        title: 'Expense Ratios & The Direct Plan Advantage',
        duration: '4 min read',
        summary:
          'Learn how a seemingly small 1% difference in Total Expense Ratio (TER) can quietly drain lakhs of rupees from your long-term retirement corpus.',
        content: [
          'Mutual funds charge an annual fee called the Total Expense Ratio (TER) to cover operational, administrative, and portfolio management costs. This fee is not billed directly to your bank account; it is deducted daily from the fund’s Net Asset Value (NAV).',
          'Every mutual fund in India exists in two formats: Regular Plan and Direct Plan. In a Regular Plan, the fund house pays an annual commission (often 0.5% to 1.25%) to brokers or distributors. In a Direct Plan, there is no intermediary commission, so the TER is significantly lower.',
          'Because compounding operates on both returns and fees, losing 1% annually to distributor commissions over a 25-year compounding period reduces your final accumulated wealth by 18% to 25%. Always select Direct Plans when investing through self-directed platforms.',
        ],
        keyTakeaways: [
          'TER is deducted automatically from NAV every business day.',
          'Direct Plans have lower expense ratios than Regular Plans because no distributor commissions are paid.',
          'Over multi-decade timelines, a 1% fee difference compounds into lakhs of lost rupees.',
        ],
        rupeeExample: {
          title: 'Direct vs. Regular Over 25 Years',
          description:
            'Investing ₹10,000/month for 25 years at 12% in a Direct Plan (0.2% TER) yields ~₹1.82 Crore. The exact same fund in a Regular Plan (1.2% TER) yields ~₹1.48 Crore.',
          calc: 'Difference of ₹34 Lakhs lost solely to distributor intermediary commissions.',
        },
      },
      {
        id: 'chap-2-3',
        title: 'Rupee Cost Averaging: Why SIPs Outperform Timing',
        duration: '4 min read',
        summary:
          'Systematic Investment Plans (SIP) convert market volatility into an advantage by automatically acquiring more units when prices fall.',
        content: [
          'Trying to time market bottoms is a proven trap, even for institutional Wall Street hedge funds. First-time investors who wait on the sidelines for "the right dip" often miss the few explosive recovery days that generate the bulk of long-term returns.',
          'A Systematic Investment Plan (SIP) automates investing by deducting a fixed rupee amount on a recurring date each month. This activates Rupee Cost Averaging.',
          'When market prices crash, your fixed ₹2,000 monthly contribution buys more fund units at a discounted NAV. When market prices rise, your ₹2,000 buys fewer units. Over full market cycles, your average cost per unit is substantially lower than the peak price.',
        ],
        keyTakeaways: [
          'Market downturns are not losses for SIP investors; they are seasonal discounts on future compounding units.',
          'Automating monthly deductions eliminates psychological biases like fear and FOMO.',
          'Consistency and automated habit trump brilliant market predictions every single time.',
        ],
        rupeeExample: {
          title: 'Rupee Cost Averaging in a Correction',
          description:
            'Month 1: NAV ₹100 → ₹5,000 buys 50 units. Month 2: Market drops 20% to NAV ₹80 → ₹5,000 buys 62.5 units. Month 3: Market rebounds to ₹100 → Your 112.5 units are now worth ₹11,250 on a ₹10,000 investment.',
          calc: 'Profit of ₹1,250 (+12.5%) even though the index merely returned to its starting price.',
        },
      },
    ],
    quiz: {
      id: 'quiz-indexing',
      title: 'Module 2 Knowledge Check',
      passingScore: 2,
      questions: [
        {
          id: 'q2-1',
          question: 'What is the primary difference between a Direct Plan and a Regular Plan in an Indian mutual fund?',
          options: [
            'Direct plans have higher minimum SIP requirements.',
            'Direct plans have lower expense ratios because no distributor commissions are deducted from your NAV.',
            'Regular plans have guaranteed capital protection backstopped by SEBI.',
            'Direct plans are only available to accredited institutional corporations.',
          ],
          correctIndex: 1,
          explanation:
            'Direct plans bypass distributors and agents. Because no recurring trail commissions are paid out, the Total Expense Ratio (TER) is lower, allowing more of your capital to compound.',
        },
        {
          id: 'q2-2',
          question: 'How does Rupee Cost Averaging benefit a monthly SIP investor during a market correction?',
          options: [
            'It locks your money so you cannot withdraw during a panic.',
            'It automatically buys more units at lower NAVs, reducing your average cost per unit over time.',
            'It hedges your portfolio with short derivative futures contracts.',
            'It converts your equity units into sovereign gold bonds.',
          ],
          correctIndex: 1,
          explanation:
            'When prices fall, a fixed monthly rupee allocation buys a higher number of mutual fund units. When the market eventually recovers, those discounted units accelerate your portfolio growth.',
        },
        {
          id: 'q2-3',
          question: 'What does "Tracking Error" measure in an Index Fund or ETF?',
          options: [
            'The delay in processing redemption proceeds to your bank account.',
            'The divergence between the fund’s performance and the benchmark index it tracks.',
            'The percentage of fraudulent trades identified by compliance.',
            'The difference between a company’s revenue and its reported net profit.',
          ],
          correctIndex: 1,
          explanation:
            'Tracking error quantifies how closely an index fund replicates its benchmark index. Lower tracking error indicates higher operational efficiency in index replication.',
        },
      ],
    },
  },
  {
    id: 'mod-debt',
    title: '3. Fixed Income, Bonds & Debt Instruments',
    slug: 'fixed-income-bonds-debt',
    level: 'Intermediate',
    totalDuration: '14 min',
    description:
      'Master Government G-Secs, Treasury Bills, and Corporate Debentures. Discover the inverse seesaw between interest rates and bond prices, and understand Yield to Maturity (YTM).',
    colorScheme: 'purple',
    chapters: [
      {
        id: 'chap-3-1',
        title: 'Sovereign Debt vs. Corporate Debentures',
        duration: '4 min read',
        summary:
          'Understand how bonds work as tradable loans, why Government of India securities carry zero credit default risk, and how corporate credit spreads are determined.',
        content: [
          'A bond is fundamentally a tradable IOU. When you buy a bond, you are lending capital to the issuer (the Government of India, state governments, or corporations). In exchange, the issuer commits to paying you fixed regular interest (the coupon) and returning your principal at maturity.',
          'Government Securities (G-Secs) and Treasury Bills (T-Bills) carry sovereign backing, meaning they have near-zero default risk because the sovereign authority has taxing power and currency issuance capacity.',
          'Corporate bonds, by contrast, carry credit default risk. Credit rating agencies like CRISIL, ICRA, and CARE evaluate corporate balance sheets and assign ratings from AAA (highest safety) down to D (in default). High-grade corporate bonds pay a yield premium (credit spread) above sovereign G-Secs to compensate investors for this credit risk.',
        ],
        keyTakeaways: [
          'Bonds are fixed-income debt instruments where investors act as lenders.',
          'Sovereign G-Secs have zero credit risk; corporate debentures require credit rating diligence.',
          'Higher yields on corporate bonds always reflect higher default or liquidity risk.',
        ],
        rupeeExample: {
          title: 'The Credit Spread Calculation',
          description:
            'If a 10-year G-Sec yields 7.15% and an REC AAA Corporate Bond yields 7.75%, the 60 bps (0.60%) difference is the credit spread.',
          calc: 'An extra ₹60 annual interest per ₹10,000 invested to compensate for corporate credit risk.',
        },
      },
      {
        id: 'chap-3-2',
        title: 'The Inverse Seesaw: Bond Prices vs. Interest Rates',
        duration: '5 min read',
        summary:
          'When central bank policy rates decline, existing bond prices appreciate; when policy rates increase, bond prices drop.',
        content: [
          'The most critical fundamental law in debt markets is the inverse relationship between market interest rates and bond prices. Think of them as sitting on opposite sides of a playground seesaw.',
          'Suppose you purchase a 10-year G-Sec bond today with a face value of ₹10,000 paying an 8% annual coupon (₹800/year). Six months later, the RBI slashes policy repo rates, and newly issued bonds only offer a 7% coupon (₹700/year).',
          'Your existing bond paying ₹800/year is now significantly more attractive than any new bond issued in the market. Investors will bid up the secondary market trading price of your bond above its ₹10,000 face value (trading at a premium) until its effective yield matches current market levels.',
          'Conversely, if interest rates climb to 9%, your 8% bond becomes less attractive, and its market price drops below face value (trading at a discount).',
        ],
        keyTakeaways: [
          'Bond Price ↑ when Interest Rates ↓ (Capital gains).',
          'Bond Price ↓ when Interest Rates ↑ (Capital losses).',
          'If you hold a bond to full maturity, price fluctuations along the way do not prevent you from receiving 100% of your promised principal.',
        ],
        rupeeExample: {
          title: 'Rate Cut Capital Appreciation',
          description:
            'A 25 bps rate reduction across sovereign yield curves can boost a 10-year G-Sec market value by approximately 1.5% to 2.2% in capital appreciation.',
          calc: 'Adds capital gains on top of the regular semi-annual coupon payouts.',
        },
      },
      {
        id: 'chap-3-3',
        title: 'Yield to Maturity (YTM) & Duration Risk',
        duration: '5 min read',
        summary:
          'Coupon rate is what a bond pays on face value; YTM is your total annualized internal rate of return if held to maturity.',
        content: [
          'Novice investors frequently confuse Coupon Rate with Yield to Maturity (YTM). The coupon rate is a static percentage stated on the bond certificate. YTM, however, factors in the current market price of the bond, all future coupon cash flows, and any capital gain or loss when the bond matures at face value.',
          'Duration measures a bond’s price sensitivity to interest rate moves. A bond with a Modified Duration of 7 years will roughly fall by 7% in market price if interest rates rise by 100 basis points (1%).',
          'This is why conservative investors who need stability choose Short Duration Funds or Target Maturity Funds that match their financial deadline, insulating themselves from interest rate swings.',
        ],
        keyTakeaways: [
          'YTM reflects total expected annualized return including capital price appreciation or discount amortisation.',
          'Duration measures sensitivity: longer tenure bonds carry higher duration volatility than short-term paper.',
          'Target Maturity Index Funds eliminate duration risk if held until the targeted fund maturity year.',
        ],
        rupeeExample: {
          title: 'Discount Bond YTM Boost',
          description:
            'Buying an 8% coupon bond for ₹9,500 that matures at ₹10,000 in 3 years yields both the annual ₹800 coupon PLUS a ₹500 capital gain at maturity.',
          calc: 'Effective YTM is ~10.0%, significantly higher than the 8.0% nominal coupon rate.',
        },
      },
    ],
    quiz: {
      id: 'quiz-debt',
      title: 'Module 3 Knowledge Check',
      passingScore: 2,
      questions: [
        {
          id: 'q3-1',
          question: 'When the Reserve Bank of India cuts benchmark interest rates, what typically happens to existing bonds in the secondary market?',
          options: [
            'Their market price rises because their higher fixed coupon is more valuable than new issues.',
            'Their market price falls because their issuer becomes insolvent.',
            'Their coupon rate is automatically recalculated downward by SEBI.',
            'Nothing happens; bond prices never change once issued.',
          ],
          correctIndex: 0,
          explanation:
            'Bond prices move inversely to interest rates. When interest rates fall, older bonds paying higher fixed coupons trade at a premium, generating capital appreciation for bondholders.',
        },
        {
          id: 'q3-2',
          question: 'What does a "AAA" credit rating from CRISIL or ICRA signify for a corporate debenture?',
          options: [
            'The bond has guaranteed 20% annual equity upside.',
            'The issuer has the highest degree of safety regarding timely debt servicing.',
            'The bond is exempt from all capital gains taxes.',
            'The company is owned directly by the President of India.',
          ],
          correctIndex: 1,
          explanation:
            'A AAA rating is the highest domestic credit grade, indicating minimal credit default risk and strong balance sheet liquidity to service coupon and principal obligations.',
        },
        {
          id: 'q3-3',
          question: 'Which instrument has the HIGHEST sensitivity (duration risk) to changing interest rates?',
          options: [
            'A 91-Day Sovereign Treasury Bill (T-Bill)',
            'A 10-Year Government of India G-Sec Bond',
            'A 14-Day Overnight Liquid Mutual Fund',
            'A 6-Month Commercial Paper',
          ],
          correctIndex: 1,
          explanation:
            'Duration risk increases with maturity horizon. A 10-year G-Sec has a much higher modified duration (~6-7 years) than short-term money market paper, causing larger price swings when yields move.',
        },
      ],
    },
  },
  {
    id: 'mod-fundamentals',
    title: '4. Fundamental Stock Analysis & Financials',
    slug: 'fundamental-stock-analysis',
    level: 'Intermediate',
    totalDuration: '15 min',
    description:
      'Learn how to read corporate annual reports, differentiate revenue growth from margin quality, evaluate valuation multiples like P/E and Debt-to-Equity, and spot red flags.',
    colorScheme: 'amber',
    chapters: [
      {
        id: 'chap-4-1',
        title: 'Decoding the P&L and Balance Sheet',
        duration: '5 min read',
        summary:
          'Revenue is vanity, profit is sanity, but cash flow is reality. Learn how to interpret the core financial statements.',
        content: [
          'When analyzing an individual company, the Income Statement (Profit & Loss) and the Balance Sheet are your primary diagnostic tools. A company’s top line represents total revenue (gross sales). However, high revenue growth means little if operating costs consume all the proceeds.',
          'Operating Profit Margin (EBITDA margin) reveals operating efficiency: how much profit remains after paying raw material costs, factory wages, and power expenses before deducting interest, taxes, and depreciation.',
          'The Balance Sheet shows what a company owns (Assets) and what it owes (Liabilities) at a specific date. A healthy company sustains modest financial leverage and maintains strong working capital liquidity to survive economic slowdowns.',
        ],
        keyTakeaways: [
          'Top line = Total Revenue; Bottom line = Profit After Tax (PAT).',
          'Operating Margin reveals true pricing power: can the company pass on raw material inflation to customers?',
          'Always verify whether reported accounting profits actually translate into positive Operating Cash Flow (OCF).',
        ],
        rupeeExample: {
          title: 'The Cash Flow Reality Check',
          description:
            'Company A reports ₹100 Crore net profit, but Operating Cash Flow is -₹20 Crore because clients haven’t paid invoices. Company B reports ₹60 Crore profit, but generates ₹80 Crore in actual cash flow.',
          calc: 'Company B has far higher earnings quality and resilience against insolvency.',
        },
      },
      {
        id: 'chap-4-2',
        title: 'Valuation Multiples: P/E, P/B & Debt-to-Equity',
        duration: '5 min read',
        summary:
          'A fantastic company can be an awful investment if you overpay. Learn how to contextualize Price-to-Earnings and debt leverage.',
        content: [
          'Price-to-Earnings (P/E) ratio compares a company’s current stock price to its annual Earnings Per Share (EPS). It answers: "How many rupees are investors willing to pay for every ₹1 of current annual profit?"',
          'A high P/E ratio (e.g. 60x) reflects market expectations of rapid future earnings growth. If the company fails to deliver that growth, its stock price can collapse even if profits increase. A low P/E (e.g. 10x) might indicate an undervalued bargain—or a declining value trap in a sunset industry.',
          'The Debt-to-Equity (D/E) ratio evaluates solvency. In capital-intensive sectors, high debt multiplies profits during economic booms, but turns catastrophic during recessions when fixed interest obligations must be serviced regardless of sales.',
        ],
        keyTakeaways: [
          'P/E = Current Share Price ÷ Annual Earnings Per Share (EPS).',
          'Never compare P/E across different sectors: an IT software exporter naturally carries different multiples than a capital-heavy steel manufacturer.',
          'A Debt-to-Equity ratio under 0.5 indicates conservative financial risk for non-banking companies.',
        ],
        rupeeExample: {
          title: 'P/E Valuation Multiple in Action',
          description:
            'Stock A trades at ₹500 with EPS ₹25 (P/E = 20x). Sector median P/E is 28x. If Stock A matches peer valuations, its target price is ₹700 (₹25 × 28).',
          calc: 'Contextual benchmarking against historical and industry peer medians is essential.',
        },
      },
      {
        id: 'chap-4-3',
        title: 'Capital Efficiency: ROE, ROIC & Competitive Moats',
        duration: '5 min read',
        summary:
          'Long-term stock compounders are businesses that generate consistently high returns on shareholders’ capital without excessive financial debt.',
        content: [
          'Return on Equity (ROE) measures how efficiently management converts shareholders’ equity capital into net profits: Net Profit ÷ Shareholders’ Equity. Consistent ROE above 15–18% indicates high operational quality.',
          'However, watch out for the leverage trick: a company with tiny equity and massive bank loans can artificially inflate its ROE because the denominator is tiny! That is why prudent analysts cross-check with Return on Invested Capital (ROIC), which evaluates returns across both equity and debt capital.',
          'Sustainable high ROIC requires a "competitive moat"—an enduring business advantage such as high switching costs, network effects, proprietary patents, or strong consumer brand loyalty that prevents competitors from eroding margins.',
        ],
        keyTakeaways: [
          'ROE > 15% sustained over 5–10 years highlights exceptional capital allocation efficiency.',
          'Beware of debt-fueled ROE: always confirm that Return on Invested Capital (ROIC) is equally strong.',
          'Economic moats protect pricing power and prevent competitors from replicating profitability.',
        ],
        rupeeExample: {
          title: 'The Compounding Power of 20% ROIC',
          description:
            'A company that reinvests ₹100 Crore at 20% ROIC generates ₹20 Crore in new annual earnings every year without needing external bank loans or equity dilution.',
          calc: 'Self-funding internal compounding engine driven by high return on capital.',
        },
      },
    ],
    quiz: {
      id: 'quiz-fundamentals',
      title: 'Module 4 Knowledge Check',
      passingScore: 2,
      questions: [
        {
          id: 'q4-1',
          question: 'What does a Price-to-Earnings (P/E) ratio of 25x indicate about a stock?',
          options: [
            'The stock is guaranteed to pay a 25% annual cash dividend.',
            'Investors are paying ₹25 for every ₹1 of annual company earnings.',
            'The company has 25 outstanding bank loans.',
            'The stock price will drop by 25% in the next quarter.',
          ],
          correctIndex: 1,
          explanation:
            'The P/E ratio indicates market valuation: a 25x multiple means the market price is 25 times the annual earnings per share.',
        },
        {
          id: 'q4-2',
          question: 'Why can comparing the P/E ratio of a public sector bank to a SaaS IT company be misleading?',
          options: [
            'Banks do not report financial statements under SEBI rules.',
            'Different industries have completely different capital structures, risk profiles, and margin economics.',
            'IT companies are not allowed to issue equity shares.',
            'P/E ratios only apply to mutual funds and ETFs.',
          ],
          correctIndex: 1,
          explanation:
            'P/E comparisons must be conducted within the same industry sector or against a company’s own historical multiple, because capital intensity and balance sheet mechanics vary drastically across sectors.',
        },
        {
          id: 'q4-3',
          question: 'What is a major warning sign when analyzing a company’s financial health?',
          options: [
            'Operating Cash Flow consistently exceeds reported accounting net profit.',
            'Debt-to-Equity ratio is under 0.2 with zero promoter pledged shares.',
            'Reported accounting profits are rising rapidly while Operating Cash Flow is persistently negative.',
            'Return on Equity (ROE) has remained above 18% for five consecutive years.',
          ],
          correctIndex: 2,
          explanation:
            'If a company reports rising accounting profits but cannot generate cash from its operations, it may be inflating revenues with uncollected receivables or aggressive accounting choices.',
        },
      ],
    },
  },
];
