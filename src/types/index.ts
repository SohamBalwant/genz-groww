// ─── Core Types ───────────────────────────────────────────────────────────────

export type AssetClass = 'STOCK' | 'MF' | 'ETF' | 'BOND' | 'IPO';

export interface Source {
  publisher: string;
  url: string;
  publishedAt: string; // ISO, IST
  isDemo: true;
}

// ─── News ─────────────────────────────────────────────────────────────────────

export type NewsCategory = 'Markets' | 'Stocks' | 'Companies' | 'Economy' | 'Bonds';

export interface PossibleEffect {
  assetCategory: string;
  description: string;
  direction: 'mixed' | 'depends' | 'uncertain';
}

export interface NewsStory {
  id: string;
  headline: string;
  source: Source;
  category: NewsCategory;
  eventLabel: string;
  summary: string;          // confirmed facts only
  whyItMatters: string;     // interpretation
  possibleEffects: PossibleEffect[];
  uncertainties: string[];
  relatedInstrumentIds: string[];
  relevanceReasons: Record<string, string>; // instrumentId -> why linked
  eventId?: string;
  mediaType?: 'article' | 'video-placeholder';
  level: 'beginner' | 'intermediate';
  isDemo: true;
}

// ─── Market Events ────────────────────────────────────────────────────────────

export type EventType = 'RBI_POLICY' | 'EARNINGS' | 'COMMODITY' | 'INFLATION' | 'GOVT' | 'GLOBAL';

export interface AssetImpact {
  assetCategory: string;
  explanation: string;
  caveat: string;
}

export interface AffectedInstrument {
  instrumentId: string;
  reason: string;
  caveat: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  type: EventType;
  occurredAt: string;
  confirmedFacts: string[];
  whyItMatters: string[];
  assetImpacts: AssetImpact[];
  affectedInstruments: AffectedInstrument[];
  risks: string[];
  glossaryTermIds: string[];
  sources: Source[];
  relatedStoryIds: string[];
  isDemo: true;
}

// ─── Instruments ──────────────────────────────────────────────────────────────

export interface BaseInstrument {
  id: string;
  assetClass: AssetClass;
  name: string;
  isin?: string;
  isDemo: true;
  asOf: string;
}

export interface FinancialsData {
  asOf: string;
  source: string;
  basis: 'Consolidated' | 'Standalone';
  currency: 'INR';
  unit: 'Cr';
  annual: { period: string; revenue: number | null; profit: number | null; eps: number | null }[];
  quarterly: { period: string; revenue: number | null; profit: number | null; eps: number | null }[];
  metrics: {
    pe: number | null;
    eps: number | null;
    roe: number | null;
    debtToEquity: number | null;
    dividendYield: number | null;
    revenueGrowthYoY: number | null;
    profitGrowthYoY: number | null;
    sectorMedianPe?: number | null;
    isBank?: boolean;
  };
}

export interface Stock extends BaseInstrument {
  assetClass: 'STOCK';
  ticker: string;
  sector: string;
  price: number;
  changePct: number;
  changePeriod: '1D';
  description: string;
  mcapBucket: 'Large' | 'Mid' | 'Small';
  ratios: Partial<Record<'pe' | 'eps' | 'roe' | 'de' | 'divYield', number | null>>;
  priceSeries: { t: string; p: number }[];
  financials: FinancialsData;
  hasOptions: boolean;
  lotSize?: number;
  recentStoryIds: string[];
}

export interface MutualFund extends BaseInstrument {
  assetClass: 'MF';
  amc: string;
  category: string;
  riskLevel: 1 | 2 | 3 | 4 | 5 | 6;
  expenseRatio: number;
  minSip: number;
  minLumpsum: number;
  returns: { period: '1Y' | '3Y' | '5Y'; pct: number | null; annualised: boolean }[];
  categoryExplainer: string;
  plan: 'Direct' | 'Regular';
  nav: number;
}

export interface Bond extends BaseInstrument {
  assetClass: 'BOND';
  issuer: string;
  coupon: number;
  ytm: number;
  maturity: string;
  rating: string | null;
  ratingAgency: string | null;
  minInvestment: number;
  faceValue: number;
  liquidityNote: string;
  creditRiskNote: string;
  rateRiskNote: string;
  type: 'G-Sec' | 'SDL' | 'Corporate' | 'T-Bill';
}

export interface Etf extends BaseInstrument {
  assetClass: 'ETF';
  ticker: string;
  tracks: string;
  expenseRatio: number;
  returns: { period: string; pct: number | null }[];
  risks: string[];
  price: number;
  changePct: number;
  trackingNote: string;
}

export interface Ipo extends BaseInstrument {
  assetClass: 'IPO';
  company: string;
  opens: string;
  closes: string;
  status: 'Upcoming' | 'Open' | 'Closed';
  priceBand: [number, number];
  lotSize: number;
  minInvestment: number;
  overview: string;
  keyRisks: string[];
}

export type Instrument = Stock | MutualFund | Bond | Etf | Ipo;

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'EVENT' | 'WATCHLIST' | 'RESULT' | 'COMPANY' | 'event' | 'watchlist' | 'result' | 'company';

export interface Notification {
  id: string;
  title: string;
  body: string;
  message?: string;
  type: NotificationType;
  createdAt: string;
  timestamp?: string;
  read: boolean;
  eventId?: string;
  instrumentId?: string;
  relatedInstrumentId?: string;
  isDemo: true;
}

// ─── Options ──────────────────────────────────────────────────────────────────

export interface OptionContract {
  strike: number;
  type: 'CE' | 'PE';
  ltp: number;
  changePct: number;
  volume: number;
  oi: number;
  iv?: number;
  delta: number;
  gamma: number;
  theta: number;
  vega?: number;
  rho?: number;
  bid?: number;
  ask?: number;
}

export interface OptionChainRow {
  strike: number;
  ce: OptionContract;
  pe: OptionContract;
}

export interface OptionChainData {
  underlyingId: string;
  underlyingSymbol?: string;
  underlyingName?: string;
  spot: number;
  change?: number;
  changePct?: number;
  expiries: string[];
  lotSize: number;
  asOf: string;
  assumptions: string;
  rows: OptionChainRow[];
  isDemo: true;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderProduct = 'DELIVERY' | 'INTRADAY' | 'OPTION' | 'MF' | 'BOND' | 'IPO';
export type TradeProduct = OrderProduct;
export type TradeSide = 'BUY' | 'SELL';
export type OrderSource = 'notification' | 'news' | 'discover' | 'options' | 'direct';

export interface OrderDraft {
  instrumentId: string;
  instrumentName?: string;
  assetClass: AssetClass | 'OPTION';
  side: TradeSide;
  product: OrderProduct;
  quantity: number;
  lots?: number;
  price: number;
  orderType: 'MARKET' | 'LIMIT';
  source?: OrderSource;
  exchange?: string;
  charges?: import('../lib/fees/types').ChargesResult;
  contractDetails?: {
    strike: number;
    expiry: string;
    type: 'CE' | 'PE';
    lotSize: number;
  };
  // For options
  optionStrike?: number;
  optionExpiry?: string;
  optionType?: 'CE' | 'PE';
  premiumPerUnit?: number;
  lotSize?: number;
}

export interface SimulatedOrder extends OrderDraft {
  id: string;
  confirmedAt?: string;
  timestamp: string;
  charges: import('../lib/fees/types').ChargesResult;
  status: 'SIMULATED' | 'EXECUTED';
  instrumentName: string;
}


// ─── Community ────────────────────────────────────────────────────────────────

export interface PostAuthor {
  name: string;
  credentials: string;
  verifiedBy: string;
  isDemo: true;
}

export interface PostSource {
  label: string;
  url: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  title: string;
  body: string;
  sources: PostSource[];
  sponsored?: { sponsor: string; disclosure: string };
  conflictsDisclosure?: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  isDemo: true;
}

export interface ThreadAnswer {
  id: string;
  author: PostAuthor;
  body: string;
  sources?: PostSource[];
}

export interface Thread {
  id: string;
  question: string;
  askedBy: 'Anonymous';
  askedAt: string;
  answers: ThreadAnswer[];
  tags: string[];
  isDemo: true;
}

export interface ConceptCard {
  id: string;
  title: string;
  body: string;
  glossaryTermIds: string[];
  externalLinks: { label: string; url: string }[];
  isDemo: true;
}

// ─── Glossary ─────────────────────────────────────────────────────────────────

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDef: string;    // <= 2 sentences
  rupeeExample?: string;
  limitation?: string;
  externalLink?: { label: string; url: string };
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface AppState {
  watchlist: string[];                   // instrument IDs
  notificationReadState: Record<string, boolean>;
  simulatedOrders: SimulatedOrder[];
  optionsGateAcknowledged: boolean;
  selectedCategory: AssetClass;
  reportedPosts: string[];
  preferences: {
    showBeginnersOnly: boolean;
    notifyEvents: boolean;
    notifyWatchlist: boolean;
    notifyResults: boolean;
  };
}
