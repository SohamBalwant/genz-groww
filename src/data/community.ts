import type { Post, Thread, ConceptCard } from '../types';

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-001',
    title: 'Why Timing the Market Matters Less Than Time in the Market for 20-Somethings',
    author: {
      name: 'Aditi Sharma, CFA',
      credentials: 'SEBI-Registered Research Analyst (INH00000000)',
      verifiedBy: 'Verified Market Educator',
      isDemo: true,
    },
    publishedAt: '2025-03-11T10:00:00.000Z',
    readTime: '3 min read',
    body: 'When starting your investment journey between ages 20 and 26, the urge to predict next week’s market bottom or top is powerful. However, historical simulation demonstrates that missing the 10 best trading days across a decade can cut compound portfolio returns in half. Consistent Systematic Investment Plans (SIPs) capture market volatility constructively through rupee-cost averaging, purchasing more mutual fund units when markets dip and fewer when markets surge.',
    tags: ['Investing Basics', 'SIP', 'Compounding', 'Beginner'],
    sources: [
      { label: 'AMFI Investor Education Portal', url: 'https://www.amfiindia.com' },
      { label: 'SEBI Investor Awareness', url: 'https://investor.sebi.gov.in' },
    ],
    conflictsDisclosure: 'No disclosures provided. Author does not hold personal or commercial positions in any specific securities mentioned.',
    isDemo: true,
  },
  {
    id: 'post-002',
    title: 'How Bond Prices Move When the RBI Changes the Repo Rate: A Rupee Example',
    author: {
      name: 'Vikramaditya Rao',
      credentials: 'Fixed Income Treasury Specialist',
      verifiedBy: 'Verified Market Educator',
      isDemo: true,
    },
    publishedAt: '2025-03-09T14:30:00.000Z',
    readTime: '4 min read',
    body: 'Most beginners assume bonds only pay interest and never change in market price. In reality, existing bond prices swing in the opposite direction of interest rate cycles. If you purchase a 10-year bond paying an 8% coupon (₹8,000/year on ₹1,00,000 face value), and interest rates subsequently decline so new bonds only pay 7%, your 8% bond becomes more attractive to other investors. They will gladly pay a premium—say ₹1,06,000—to acquire your higher-paying income stream.',
    tags: ['Bonds', 'RBI Policy', 'Interest Rates', 'Fixed Income'],
    sources: [
      { label: 'RBI Retail Direct Education', url: 'https://rbiretaildirect.org.in' },
    ],
    conflictsDisclosure: 'No disclosures provided.',
    isDemo: true,
  },
  {
    id: 'post-003',
    title: 'Sponsored Guide: Understanding Index Funds vs Active Equity Funds',
    author: {
      name: 'Rajesh Menon',
      credentials: 'Chief Investment Strategist, Premier Asset Management',
      verifiedBy: 'Verified Corporate Contributor',
      isDemo: true,
    },
    publishedAt: '2025-03-07T12:00:00.000Z',
    readTime: '4 min read',
    body: 'Index funds replicate a market benchmark like the Nifty 50 or Sensex without active fund manager bias. Because they do not require large research analyst teams or frequent portfolio turnover, their expense ratios are typically between 0.10% and 0.25%, compared to 0.70% to 1.50% for actively managed funds. Over a 15-to-20-year horizon, saving 0.75% annually in fund management fees compounds into a meaningful difference in your net accumulated wealth.',
    tags: ['Index Funds', 'Passive Investing', 'Expense Ratio'],
    sources: [
      { label: 'SPIVA India Scorecard Reference', url: 'https://www.spglobal.com' },
    ],
    sponsored: {
      sponsor: 'Premier Asset Management Pvt Ltd',
      disclosure: 'This educational explainer is sponsored by Premier Asset Management. Content reviewed for educational neutrality.',
    },
    conflictsDisclosure: 'Author is employed by an asset management company that offers index fund and ETF products.',
    isDemo: true,
  },
  {
    id: 'post-004',
    title: 'Options 101: Why Buying Cheap Out-of-the-Money Options Often Results in 100% Losses',
    author: {
      name: 'Neha Kulkarni',
      credentials: 'SEBI-Registered Derivative Analyst',
      verifiedBy: 'Verified Market Educator',
      isDemo: true,
    },
    publishedAt: '2025-03-05T09:15:00.000Z',
    readTime: '5 min read',
    body: 'Young traders frequently get attracted to ₹2 or ₹5 option premiums because the upfront rupee outlay appears tiny. What social media finfluencers rarely explain is Theta (time decay). Every single day you hold an option, it loses a portion of its value simply from time expiring, even if the underlying stock price does not move. Out-of-the-Money (OTM) options carry a statistically low probability of expiring with intrinsic value. Buying options is not an alternative to equity investing—it is a leveraged derivative structure where total loss of premium is common.',
    tags: ['Options', 'Risk Warning', 'Theta', 'F&O'],
    sources: [
      { label: 'NSE India Investor Protection Knowledge Base', url: 'https://www.nseindia.com' },
      { label: 'SEBI Study on Retail F&O Losses', url: 'https://www.sebi.gov.in' },
    ],
    conflictsDisclosure: 'No disclosures provided.',
    isDemo: true,
  },
  {
    id: 'post-005',
    title: 'The Real Meaning of Diversification: Why Holding 10 Large Cap Funds Is Not Diversified',
    author: {
      name: 'Karan Mehra',
      credentials: 'Wealth Coach & Financial Educator',
      verifiedBy: 'Verified Market Educator',
      isDemo: true,
    },
    publishedAt: '2025-03-01T15:00:00.000Z',
    readTime: '3 min read',
    body: 'Many novice investors believe holding ten different mutual funds creates strong diversification. If all ten funds are large-cap equity funds, examining their underlying factsheets reveals that 8 out of 10 hold the exact same top 15 banking, IT, and energy corporations. Real diversification involves spreading capital across distinct asset classes whose returns do not move in lockstep: domestic equities, sovereign fixed income/debt, emergency liquid funds, and gold.',
    tags: ['Portfolio Construction', 'Diversification', 'Asset Allocation'],
    sources: [
      { label: 'AMFI Mutual Fund Guidelines', url: 'https://www.amfiindia.com' },
    ],
    conflictsDisclosure: 'No disclosures provided.',
    isDemo: true,
  },
];

export const MOCK_THREADS: Thread[] = [
  {
    id: 'qa-001',
    question: 'What is the practical difference between a SIP and investing a lumpsum?',
    askedBy: 'Anonymous',
    askedAt: '2025-03-12T11:00:00.000Z',
    tags: ['SIP', 'Mutual Funds', 'Beginner'],
    isDemo: true,
    answers: [
      {
        id: 'ans-001',
        author: {
          name: 'Aditi Sharma, CFA',
          credentials: 'SEBI-Registered Research Analyst',
          verifiedBy: 'Verified Market Educator',
          isDemo: true,
        },
        body: 'A Systematic Investment Plan (SIP) invests a fixed rupee amount (e.g., ₹1,000) on a set day every month, automating your financial discipline and averaging your purchase cost over market peaks and valleys. A lumpsum investment deposits your entire sum at once, which performs better if markets enter a long continuous bull run immediately after, but carries higher emotional regret if markets drop the next week.',
        sources: [{ label: 'AMFI Investor Guide', url: 'https://www.amfiindia.com' }],
      },
    ],
  },
  {
    id: 'qa-002',
    question: 'Why did my mutual fund NAV fall on a day when the stock market index rose?',
    askedBy: 'Anonymous',
    askedAt: '2025-03-10T14:15:00.000Z',
    tags: ['Mutual Funds', 'NAV', 'Equities'],
    isDemo: true,
    answers: [
      {
        id: 'ans-002',
        author: {
          name: 'Karan Mehra',
          credentials: 'Wealth Coach',
          verifiedBy: 'Verified Market Educator',
          isDemo: true,
        },
        body: 'Broad benchmark indices like the Nifty 50 or Sensex represent only 50 or 30 massive companies. If your mutual fund is a mid-cap, small-cap, or thematic fund, its underlying portfolio holdings may have experienced profit-taking even while large-cap heavyweights like banks pushed the headline index upward.',
      },
    ],
  },
  {
    id: 'qa-003',
    question: 'Are sovereign gold bonds or Gold ETFs better for a 22-year-old beginner?',
    askedBy: 'Anonymous',
    askedAt: '2025-03-06T09:40:00.000Z',
    tags: ['Gold', 'ETF', 'Asset Allocation'],
    isDemo: true,
    answers: [
      {
        id: 'ans-003',
        author: {
          name: 'Vikramaditya Rao',
          credentials: 'Fixed Income Treasury Specialist',
          verifiedBy: 'Verified Market Educator',
          isDemo: true,
        },
        body: 'Gold ETFs offer superior liquidity: you can buy and sell 1 unit (~₹75–80) instantly on stock exchanges during market hours. Sovereign Gold Bonds (SGBs) carry an annual coupon interest payment (2.5%) and capital gains tax exemptions if held for the full 8 years, but have lower secondary market liquidity.',
      },
    ],
  },
  {
    id: 'qa-004',
    question: 'What does "Direct Plan" vs "Regular Plan" mean in mutual funds?',
    askedBy: 'Anonymous',
    askedAt: '2025-03-02T16:20:00.000Z',
    tags: ['Expense Ratio', 'Direct Plan', 'Mutual Funds'],
    isDemo: true,
    answers: [
      {
        id: 'ans-004',
        author: {
          name: 'Rajesh Menon',
          credentials: 'Investment Strategist',
          verifiedBy: 'Verified Corporate Contributor',
          isDemo: true,
        },
        body: 'A Direct Plan is purchased directly from the mutual fund AMC (or modern execution platforms like Groww) without a third-party intermediary or distributor. A Regular Plan includes an ongoing distributor commission (0.5%–1.2% annually) that is paid out from the fund NAV every year. Always choose Direct plans if you make your own investment choices.',
      },
    ],
  },
];

export const MOCK_CONCEPTS: ConceptCard[] = [
  {
    id: 'concept-001',
    title: 'Investing vs Trading',
    body: 'Investing involves owning fractional shares in growing businesses or lending capital via bonds for years. Trading attempts to profit from short-term price fluctuations over minutes, hours, or days.',
    glossaryTermIds: ['investing-vs-trading'],
    externalLinks: [
      { label: 'SEBI Basics of Capital Markets', url: 'https://investor.sebi.gov.in' },
    ],
    isDemo: true,
  },
  {
    id: 'concept-002',
    title: 'Understanding the Expense Ratio Drag',
    body: 'Every mutual fund and ETF charges an annual management fee called an expense ratio. It is deducted daily from NAV. A 1% difference in fees can reduce your 20-year wealth by over 15%.',
    glossaryTermIds: ['expense-ratio'],
    externalLinks: [
      { label: 'AMFI Fee Structures', url: 'https://www.amfiindia.com' },
    ],
    isDemo: true,
  },
  {
    id: 'concept-003',
    title: 'Why Bond Prices and Interest Rates Move in Opposite Directions',
    body: 'When central bank interest rates fall, newly issued bonds pay lower coupon rates. Existing bonds with older, higher coupon rates become more valuable and rise in price.',
    glossaryTermIds: ['bond-price-vs-rates', 'coupon', 'ytm'],
    externalLinks: [
      { label: 'RBI Monetary Policy Framework', url: 'https://rbi.org.in' },
    ],
    isDemo: true,
  },
  {
    id: 'concept-004',
    title: 'The SEBI Riskometer: 6 Levels of Portfolio Risk',
    body: 'All mutual funds must display a standardized dial rating risk from Low (1) to Very High (6). Liquid debt funds rate 1, while thematic and small-cap equity funds rate 6.',
    glossaryTermIds: ['riskometer'],
    externalLinks: [
      { label: 'SEBI Riskometer Regulations', url: 'https://sebi.gov.in' },
    ],
    isDemo: true,
  },
  {
    id: 'concept-005',
    title: 'What Happens to Options as Expiry Approaches (Theta Decay)',
    body: 'Options derive value from intrinsic value and time value. Time value decays at an accelerating rate during the final 30 days prior to expiry, eroding premium even if the stock price is flat.',
    glossaryTermIds: ['theta', 'moneyness', 'breakeven'],
    externalLinks: [
      { label: 'NSE Derivatives Education', url: 'https://www.nseindia.com' },
    ],
    isDemo: true,
  },
  {
    id: 'concept-006',
    title: 'P/E Ratio: What It Tells You (And What It Doesn’t)',
    body: 'P/E measures how many rupees investors pay per rupee of annual earnings. It cannot be computed for loss-making companies and is meaningless without comparing peers within the exact same sector.',
    glossaryTermIds: ['pe-ratio', 'eps'],
    externalLinks: [
      { label: 'NSE Academy Financial Ratios', url: 'https://www.nseindia.com' },
    ],
    isDemo: true,
  },
  {
    id: 'concept-007',
    title: 'Demystifying Mandatory Taxes: STT, GST, and Stamp Duty',
    body: 'Before placing any trade, understand statutory deductions: Securities Transaction Tax (STT), exchange turnover fees, GST (18% on fees), and State Stamp Duty.',
    glossaryTermIds: ['stt', 'dp-charges'],
    externalLinks: [
      { label: 'Ministry of Finance Securities Rules', url: 'https://finmin.nic.in' },
    ],
    isDemo: true,
  },
  {
    id: 'concept-008',
    title: 'The Power of Rupee-Cost Averaging',
    body: 'By investing a fixed sum every month regardless of market mood, you automatically buy fewer units when prices are high and more units when prices crash, smoothing out your average entry cost.',
    glossaryTermIds: ['riskometer'],
    externalLinks: [
      { label: 'AMFI SIP Benefits', url: 'https://www.amfiindia.com' },
    ],
    isDemo: true,
  },
];
