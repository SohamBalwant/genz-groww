import { MOCK_STOCKS } from '../data/stocks';
import { MOCK_MUTUAL_FUNDS } from '../data/mutualFunds';
import { MOCK_BONDS } from '../data/bonds';
import { MOCK_ETFS } from '../data/etfs';
import { MOCK_IPOS } from '../data/ipos';
import { MOCK_NEWS_STORIES } from '../data/newsStories';
import { MOCK_EVENTS } from '../data/marketEvents';
import { MOCK_OPTION_CHAIN } from '../data/optionChain';
import {
  SUPPORTED_OPTION_INSTRUMENTS,
  generateOptionChain,
  type SupportedOptionInstrument,
} from '../data/optionsLabData';
import { MOCK_NOTIFICATIONS } from '../data/notifications';
import { MOCK_POSTS, MOCK_THREADS, MOCK_CONCEPTS } from '../data/community';
import type {
  Stock,
  MutualFund,
  Bond,
  Etf,
  Ipo,
  Instrument,
  NewsStory,
  MarketEvent,
  OptionChainData,
  Notification,
  Post,
  Thread,
  ConceptCard,
  NewsCategory,
} from '../types';


export interface MarketOverviewIndex {
  name: string;
  value: number;
  change: number;
  changePct: number;
  isDemo: true;
}

export interface MarketOverviewData {
  indices: MarketOverviewIndex[];
  asOf: string;
}

export interface StockFilters {
  sector?: string;
  mcapBucket?: 'Large' | 'Mid' | 'Small';
  hasOptions?: boolean;
  sort?: 'change' | 'mcap' | 'pe';
}

export interface MFFilters {
  category?: string;
  riskLevel?: number;
  plan?: 'Direct' | 'Regular';
  sort?: 'returns3y' | 'expenseRatio' | 'risk';
}

export interface BondFilters {
  type?: string;
  rating?: string;
  sort?: 'ytm' | 'maturity' | 'minInvestment';
}

export interface NewsFilters {
  category?: NewsCategory | 'All';
  level?: 'beginner' | 'intermediate' | 'all';
  eventId?: string;
  watchlistIds?: string[];
}

// Simulated latency helper
const delay = (ms: number = 60) => new Promise((resolve) => setTimeout(resolve, ms));

class DataService {
  async getMarketOverview(): Promise<MarketOverviewData> {
    await delay();
    return {
      asOf: '2025-03-15T15:30:00.000Z',
      indices: [
        { name: 'Nifty 50', value: 24850.25, change: 112.40, changePct: 0.45, isDemo: true },
        { name: 'BSE Sensex', value: 81680.50, change: 345.10, changePct: 0.42, isDemo: true },
        { name: 'Bank Nifty', value: 52410.80, change: 480.20, changePct: 0.92, isDemo: true },
        { name: 'Nifty Midcap 100', value: 58240.10, change: -120.30, changePct: -0.21, isDemo: true },
        { name: '10Y G-Sec Yield', value: 7.18, change: -0.04, changePct: -0.55, isDemo: true },
      ],
    };
  }

  async getStocks(filters?: StockFilters): Promise<Stock[]> {
    await delay();
    let result = [...MOCK_STOCKS];

    if (filters?.sector && filters.sector !== 'All') {
      result = result.filter((s) => s.sector === filters.sector);
    }
    if (filters?.mcapBucket) {
      result = result.filter((s) => s.mcapBucket === filters.mcapBucket);
    }
    if (filters?.hasOptions) {
      result = result.filter((s) => s.hasOptions);
    }

    if (filters?.sort) {
      if (filters.sort === 'change') {
        result.sort((a, b) => b.changePct - a.changePct);
      } else if (filters.sort === 'pe') {
        result.sort((a, b) => (a.ratios.pe ?? 999) - (b.ratios.pe ?? 999));
      }
    }

    return result;
  }

  async getMutualFunds(filters?: MFFilters): Promise<MutualFund[]> {
    await delay();
    let result = [...MOCK_MUTUAL_FUNDS];

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((f) => f.category === filters.category);
    }
    if (filters?.riskLevel) {
      result = result.filter((f) => f.riskLevel === filters.riskLevel);
    }

    if (filters?.sort) {
      if (filters.sort === 'returns3y') {
        result.sort((a, b) => {
          const retA = a.returns.find((r) => r.period === '3Y')?.pct ?? -99;
          const retB = b.returns.find((r) => r.period === '3Y')?.pct ?? -99;
          return retB - retA;
        });
      } else if (filters.sort === 'expenseRatio') {
        result.sort((a, b) => a.expenseRatio - b.expenseRatio);
      } else if (filters.sort === 'risk') {
        result.sort((a, b) => a.riskLevel - b.riskLevel);
      }
    }

    return result;
  }

  async getBonds(filters?: BondFilters): Promise<Bond[]> {
    await delay();
    let result = [...MOCK_BONDS];

    if (filters?.type && filters.type !== 'All') {
      result = result.filter((b) => b.type === filters.type);
    }

    if (filters?.sort) {
      if (filters.sort === 'ytm') {
        result.sort((a, b) => b.ytm - a.ytm);
      } else if (filters.sort === 'minInvestment') {
        result.sort((a, b) => a.minInvestment - b.minInvestment);
      }
    }

    return result;
  }

  async getEtfs(): Promise<Etf[]> {
    await delay();
    return [...MOCK_ETFS];
  }

  async getIpos(): Promise<Ipo[]> {
    await delay();
    return [...MOCK_IPOS];
  }

  async getInstrumentById(id: string): Promise<Instrument | null> {
    await delay();
    const stock = MOCK_STOCKS.find((s) => s.id === id);
    if (stock) return stock;
    const mf = MOCK_MUTUAL_FUNDS.find((m) => m.id === id);
    if (mf) return mf;
    const bond = MOCK_BONDS.find((b) => b.id === id);
    if (bond) return bond;
    const etf = MOCK_ETFS.find((e) => e.id === id);
    if (etf) return etf;
    const ipo = MOCK_IPOS.find((i) => i.id === id);
    if (ipo) return ipo;
    return null;
  }

  async getNewsStories(filters?: NewsFilters): Promise<NewsStory[]> {
    await delay();
    let result = [...MOCK_NEWS_STORIES];

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((s) => s.category === filters.category);
    }
    if (filters?.level && filters.level !== 'all') {
      result = result.filter((s) => s.level === filters.level);
    }
    if (filters?.eventId) {
      result = result.filter((s) => s.eventId === filters.eventId);
    }
    if (filters?.watchlistIds && filters.watchlistIds.length > 0) {
      result = result.filter((s) =>
        s.relatedInstrumentIds.some((id) => filters.watchlistIds!.includes(id))
      );
    }

    return result;
  }

  async getNewsStoryById(id: string): Promise<NewsStory | null> {
    await delay();
    return MOCK_NEWS_STORIES.find((s) => s.id === id) || null;
  }

  async getMarketEventById(id: string): Promise<MarketEvent | null> {
    await delay();
    return MOCK_EVENTS.find((e) => e.id === id) || null;
  }

  async getOptionInstruments(): Promise<SupportedOptionInstrument[]> {
    await delay(20);
    return [...SUPPORTED_OPTION_INSTRUMENTS];
  }

  async getOptionChain(underlyingId: string, expiry?: string): Promise<OptionChainData | null> {
    await delay(40);
    const instrument = SUPPORTED_OPTION_INSTRUMENTS.find(
      (i) => i.id === underlyingId || i.symbol.toLowerCase() === underlyingId.toLowerCase()
    );

    if (instrument) {
      const targetExpiry = expiry && instrument.expiries.includes(expiry) ? expiry : instrument.expiries[0];
      return generateOptionChain(instrument, targetExpiry);
    }

    if (MOCK_OPTION_CHAIN.underlyingId === underlyingId) {
      return MOCK_OPTION_CHAIN;
    }
    return null;
  }

  async getNotifications(): Promise<Notification[]> {
    await delay();
    return [...MOCK_NOTIFICATIONS];
  }

  async getCommunityPosts(): Promise<Post[]> {
    await delay();
    return [...MOCK_POSTS];
  }

  async getQAThreads(): Promise<Thread[]> {
    await delay();
    return [...MOCK_THREADS];
  }

  async getConcepts(): Promise<ConceptCard[]> {
    await delay();
    return [...MOCK_CONCEPTS];
  }

  async searchAll(query: string): Promise<{
    stocks: Stock[];
    mutualFunds: MutualFund[];
    bonds: Bond[];
    etfs: Etf[];
    ipos: Ipo[];
    news: NewsStory[];
  }> {
    await delay(30);
    const q = query.toLowerCase().trim();
    if (!q) {
      return { stocks: [], mutualFunds: [], bonds: [], etfs: [], ipos: [], news: [] };
    }

    return {
      stocks: MOCK_STOCKS.filter(
        (s) => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
      ),
      mutualFunds: MOCK_MUTUAL_FUNDS.filter(
        (m) => m.name.toLowerCase().includes(q) || m.amc.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
      ),
      bonds: MOCK_BONDS.filter(
        (b) => b.name.toLowerCase().includes(q) || b.issuer.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)
      ),
      etfs: MOCK_ETFS.filter(
        (e) => e.name.toLowerCase().includes(q) || e.ticker.toLowerCase().includes(q)
      ),
      ipos: MOCK_IPOS.filter(
        (i) => i.name.toLowerCase().includes(q) || i.company.toLowerCase().includes(q)
      ),
      news: MOCK_NEWS_STORIES.filter(
        (n) => n.headline.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
      ),
    };
  }
}

export const dataService = new DataService();
