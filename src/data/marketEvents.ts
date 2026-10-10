import type { MarketEvent } from '../types';

export const MOCK_EVENTS: MarketEvent[] = [
  {
    id: 'evt-rbi-001',
    title: 'RBI Monetary Policy Committee Cuts Repo Rate by 25 bps',
    type: 'RBI_POLICY',
    occurredAt: '2025-03-14T10:00:00.000Z',
    isDemo: true,
    confirmedFacts: [
      'The RBI Monetary Policy Committee voted 4–2 to reduce the benchmark policy repo rate by 25 basis points to 6.25% (Demo illustrative announcement).',
      'The Standing Deposit Facility (SDF) rate was automatically adjusted to 6.00%, and the Marginal Standing Facility (MSF) rate to 6.50%.',
      'RBI retained its monetary policy stance as "Neutral", signaling that future decisions will remain strictly data-dependent.',
      'CPI inflation forecast for FY26 was projected at 4.5%, down from 4.8% previously.',
    ],
    whyItMatters: [
      'The repo rate is the benchmark interest rate at which commercial banks borrow short-term funds from the Reserve Bank of India.',
      'When repo rate falls, banks generally face lower cost of funds, which gradually transmits into lower interest rates on consumer home loans, car loans, and working capital for corporations.',
      'Bond prices move inversely to interest rates. When new bonds yield lower rates, existing bonds with higher fixed coupons tend to rise in market value (all else being equal).',
      'For equity markets, lower borrowing costs reduce corporate financing interest burden and lower the discount rate applied in stock valuation models.',
    ],
    assetImpacts: [
      {
        assetCategory: 'Government & Corporate Bonds',
        explanation: 'Existing bonds with longer durations may experience capital appreciation as benchmark yields decline.',
        caveat: 'The magnitude of price movement depends heavily on how much of the rate cut had already been priced in by bond markets prior to the meeting.',
      },
      {
        assetCategory: 'Banking & Financial Stocks',
        explanation: 'Loan demand may expand with cheaper credit; however, Net Interest Margins (NIM) could face temporary compression if loan assets reprice downward faster than fixed deposits.',
        caveat: 'Banks with high proportions of floating-rate loans often reprice immediate assets quicker than term liabilities.',
      },
      {
        assetCategory: 'Rate-Sensitive Equities (Infra / Realty)',
        explanation: 'Capital-heavy sectors like renewable power, real estate, and construction may see lower debt servicing expenses.',
        caveat: 'Lower interest expense is only one business driver; macroeconomic demand, raw material costs, and project execution risks remain dominant.',
      },
      {
        assetCategory: 'Debt Mutual Funds',
        explanation: 'Short-to-medium duration debt funds may report a one-off mark-to-market NAV boost as underlying bond prices rise.',
        caveat: 'Future reinvestment yield for debt funds will gradually adjust to the prevailing lower interest rate environment.',
      },
    ],
    affectedInstruments: [
      {
        instrumentId: 'bond-gsec-001',
        reason: 'Long-duration sovereign 10-year G-Sec benchmark prices typically rise as policy rates ease.',
        caveat: 'If future inflation rebounds, bond yields could surge back, erasing short-term gains.',
      },
      {
        instrumentId: 'stock-ifbl',
        reason: 'Commercial bank with extensive retail and corporate lending exposure influenced by RBI repo transmission.',
        caveat: 'Impact on net earnings depends on the speed of deposit repricing relative to asset yield changes.',
      },
      {
        instrumentId: 'stock-grpwi',
        reason: 'Infrastructure firm with substantial project debt that benefits when borrowing costs soften.',
        caveat: 'Requires successful power purchase agreement execution and grid connectivity, which matter more than rate swings.',
      },
      {
        instrumentId: 'bond-corp-001',
        reason: 'High-grade corporate debenture whose yield spread tracks sovereign rate expectations.',
        caveat: 'Corporate credit spreads can widen during broader economic slowdowns even if repo rate falls.',
      },
    ],
    risks: [
      'Inflation resurgence driven by unseasonal food price shocks could force the RBI to pause or reverse rate cuts.',
      'Global central bank rate differentials could cause foreign portfolio capital outflows and currency volatility.',
      'Banks may delay passing on rate cuts to end borrowers if deposit competition remains fierce.',
    ],
    glossaryTermIds: ['coupon', 'ytm', 'bond-price-vs-rates', 'de-ratio'],
    sources: [
      {
        publisher: 'Reserve Bank of India (Demo Notice)',
        url: 'https://rbi.org.in',
        publishedAt: '2025-03-14T10:30:00.000Z',
        isDemo: true,
      },
      {
        publisher: 'Demo Financial Wire',
        url: 'https://example.com/demo-wire',
        publishedAt: '2025-03-14T10:45:00.000Z',
        isDemo: true,
      },
    ],
    relatedStoryIds: ['news-rbi-001', 'news-rbi-002', 'news-macro-001'],
  },
  {
    id: 'evt-earnings-001',
    title: 'Apex InfoTech Reports Q3 FY25 Financial Results & Guidance',
    type: 'EARNINGS',
    occurredAt: '2025-03-12T16:00:00.000Z',
    isDemo: true,
    confirmedFacts: [
      'Apex InfoTech Ltd reported Q3 FY25 Consolidated Revenue of ₹42,500 Crore, up 11.2% YoY.',
      'Net Profit after Tax rose 13.8% YoY to ₹8,250 Crore, surpassing consensus estimates of ₹8,050 Crore.',
      'Operating margin (EBIT margin) expanded by 40 basis points sequentially to 21.4%.',
      'Management guided for full-year FY26 constant-currency revenue growth between 10% and 13%.',
    ],
    whyItMatters: [
      'Quarterly results reveal the actual health of corporate order books, client spending, and operating efficiencies.',
      'When earnings beat consensus analyst estimates, investor sentiment usually turns positive in the immediate term.',
      'However, forward guidance matters far more than trailing numbers: if a company reports strong quarterly profit but issues cautious future commentary, the stock price can fall.',
    ],
    assetImpacts: [
      {
        assetCategory: 'IT Services Sector',
        explanation: 'Positive earnings beat can lift sector valuations across peer software exporters.',
        caveat: 'Client discretionary IT budgets in North America and Europe remain sensitive to global interest rate cycles.',
      },
      {
        assetCategory: 'Index Mutual Funds & ETFs',
        explanation: 'Large IT firms hold significant weight (~10-14%) in benchmark indices like Nifty 50.',
        caveat: 'Diversified indices balance IT moves against opposing swings in banking or commodities.',
      },
    ],
    affectedInstruments: [
      {
        instrumentId: 'stock-apxinf',
        reason: 'Direct reporting corporate issuer of the quarterly financial statement.',
        caveat: 'Share price reaction depends on whether the market had already priced in an earnings beat.',
      },
      {
        instrumentId: 'etf-005',
        reason: 'Bharat IT ETF holds Apex InfoTech as one of its top portfolio holdings.',
        caveat: 'Results from other IT companies in the same week can offset or amplify the sector ETF movement.',
      },
    ],
    risks: [
      'Slowdown in US banking and retail client tech renewal contracts.',
      'Cross-currency volatility between USD, EUR, and INR impacting reported operating margins.',
    ],
    glossaryTermIds: ['pe-ratio', 'eps', 'earnings-surprise'],
    sources: [
      {
        publisher: 'Apex InfoTech Investor Relations',
        url: 'https://example.com/ir',
        publishedAt: '2025-03-12T16:15:00.000Z',
        isDemo: true,
      },
    ],
    relatedStoryIds: ['news-results-001', 'news-tech-002'],
  },
  {
    id: 'evt-oil-001',
    title: 'Brent Crude Oil Surges 7.5% on Supply Disruptions',
    type: 'COMMODITY',
    occurredAt: '2025-03-10T14:00:00.000Z',
    isDemo: true,
    confirmedFacts: [
      'Brent crude oil benchmark price rose by 7.5% over three trading sessions to $88.50 per barrel (Demo illustrative).',
      'OPEC+ announced an extension of voluntary crude output cuts of 2.2 million barrels per day through the upcoming quarter.',
      'Shipping freight rates on key Red Sea and Persian Gulf tanker routes rose by 14% due to security detours.',
    ],
    whyItMatters: [
      'India imports over 85% of its crude oil requirements. A sustained rise in crude oil prices directly increases the national import bill.',
      'Higher crude prices can impact downstream oil marketing companies (OMCs) if retail petrol and diesel pump prices are not increased proportionally.',
      'Can feed into higher logistics costs across consumer goods, transport, and manufacturing, potentially putting upward pressure on domestic inflation.',
    ],
    assetImpacts: [
      {
        assetCategory: 'Oil & Gas Marketing Companies',
        explanation: 'Refining margins and retail fuel marketing margins can fluctuate sharply.',
        caveat: 'Government policy, fuel excise duty adjustments, and inventory gains can significantly alter net profitability.',
      },
      {
        assetCategory: 'Aviation, Paint & Chemical Equities',
        explanation: 'Crude oil derivatives are primary raw materials; margins can compress if input costs rise.',
        caveat: 'Companies with strong brand pricing power can pass on cost increases to end consumers.',
      },
    ],
    affectedInstruments: [
      {
        instrumentId: 'stock-bpcl',
        reason: 'Bharat Petrochem relies on crude import processing and domestic fuel distribution.',
        caveat: 'Inventory gains from existing crude reserves can temporarily boost quarterly earnings.',
      },
    ],
    risks: [
      'Macroeconomic fiscal deficit widening and rupee currency depreciation against the US Dollar.',
      'Retail inflation spillover into broader food and consumer items.',
    ],
    glossaryTermIds: ['investing-vs-trading'],
    sources: [
      {
        publisher: 'Demo Commodity Pulse',
        url: 'https://example.com/demo-oil',
        publishedAt: '2025-03-10T14:30:00.000Z',
        isDemo: true,
      },
    ],
    relatedStoryIds: ['news-oil-001'],
  },
  {
    id: 'evt-inflation-001',
    title: 'Consumer Price Index (CPI) Inflation Moderates to 4.6%',
    type: 'INFLATION',
    occurredAt: '2025-03-08T17:30:00.000Z',
    isDemo: true,
    confirmedFacts: [
      'National Consumer Price Index (CPI) inflation eased to 4.6% year-on-year for the latest demo reporting month.',
      'Food inflation cooled from 6.8% to 5.2%, aided by winter vegetable arrivals and stable cereal reserves.',
      'Core inflation (excluding food and fuel) remained anchored at 3.9%.',
    ],
    whyItMatters: [
      'Inflation directly erodes the purchasing power of money over time.',
      'A moderating inflation trajectory gives the central bank greater leeway to support economic growth without triggering runaway price spirals.',
    ],
    assetImpacts: [
      {
        assetCategory: 'Equities and Fixed Income',
        explanation: 'Low and stable inflation provides a favorable macroeconomic backdrop for corporate earnings and bond yields.',
        caveat: 'Monsoon rainfall distribution and international commodity prices remain key forward uncertainties.',
      },
    ],
    affectedInstruments: [
      {
        instrumentId: 'bond-gsec-001',
        reason: 'Sovereign bonds benefit when inflation expectations decline.',
        caveat: 'Government market borrowing calendar supply also dictates bond yields.',
      },
    ],
    risks: ['Climate disruptions and heatwaves affecting summer crop yields.'],
    glossaryTermIds: ['bond-price-vs-rates'],
    sources: [
      {
        publisher: 'Ministry of Statistics & Programme Implementation',
        url: 'https://mospi.gov.in',
        publishedAt: '2025-03-08T18:00:00.000Z',
        isDemo: true,
      },
    ],
    relatedStoryIds: ['news-macro-001'],
  },
];
