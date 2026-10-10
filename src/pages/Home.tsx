import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { dataService } from '../services/dataService';
import { MarketOverview } from '../components/market/MarketOverview';
import { CategorySelector } from '../components/market/CategorySelector';
import { StockCard } from '../components/market/StockCard';
import { FundCard } from '../components/market/FundCard';
import { BondCard } from '../components/market/BondCard';
import { EtfCard } from '../components/market/EtfCard';
import { IpoCard } from '../components/market/IpoCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Zap, Filter, Search, ArrowUpDown } from 'lucide-react';
import type { Stock, MutualFund, Bond, Etf, Ipo, NewsStory, AssetClass } from '../types';

export const Home: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected Category
  const activeCategory = state.selectedCategory;

  // Data states
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [etfs, setEtfs] = useState<Etf[]>([]);
  const [ipos, setIpos] = useState<Ipo[]>([]);

  // Search input state
  const [localSearch, setLocalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{
    stocks: Stock[];
    mutualFunds: MutualFund[];
    bonds: Bond[];
    etfs: Etf[];
    ipos: Ipo[];
    news: NewsStory[];
  } | null>(null);

  // Filters state
  const [stockSector, setStockSector] = useState<string>('All');
  const [stockSort, setStockSort] = useState<'change' | 'mcap' | 'pe'>('change');
  const [fundCategory, setFundCategory] = useState<string>('All');
  const [fundSort, setFundSort] = useState<'returns3y' | 'expenseRatio' | 'risk'>('returns3y');
  const [bondType, setBondType] = useState<string>('All');
  const [bondSort, setBondSort] = useState<'ytm' | 'minInvestment'>('ytm');

  // Load initial data
  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      setLoading(true);
      try {
        const [st, fu, bo, et, ip] = await Promise.all([
          dataService.getStocks(),
          dataService.getMutualFunds(),
          dataService.getBonds(),
          dataService.getEtfs(),
          dataService.getIpos(),
        ]);
        if (mounted) {
          setStocks(st);
          setFunds(fu);
          setBonds(bo);
          setEtfs(et);
          setIpos(ip);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  // Check URL query parameters for category or search focus
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && ['MF', 'STOCK', 'ETF', 'BOND', 'IPO'].includes(cat)) {
      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: cat as AssetClass });
    }
  }, [searchParams, dispatch]);

  // Handle Search Query
  useEffect(() => {
    if (!localSearch.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await dataService.searchAll(localSearch);
      setSearchResults(res);
    }, 150);
    return () => clearTimeout(timer);
  }, [localSearch]);


  // Filtered & Sorted Lists
  const filteredStocks = useMemo(() => {
    let list = [...stocks];
    if (stockSector !== 'All') {
      list = list.filter((s) => s.sector === stockSector);
    }
    if (stockSort === 'change') {
      list.sort((a, b) => b.changePct - a.changePct);
    } else if (stockSort === 'pe') {
      list.sort((a, b) => (a.ratios.pe ?? 999) - (b.ratios.pe ?? 999));
    }
    return list;
  }, [stocks, stockSector, stockSort]);

  const filteredFunds = useMemo(() => {
    let list = [...funds];
    if (fundCategory !== 'All') {
      list = list.filter((f) => f.category === fundCategory);
    }
    if (fundSort === 'returns3y') {
      list.sort((a, b) => {
        const retA = a.returns.find((r) => r.period === '3Y')?.pct ?? -99;
        const retB = b.returns.find((r) => r.period === '3Y')?.pct ?? -99;
        return retB - retA;
      });
    } else if (fundSort === 'expenseRatio') {
      list.sort((a, b) => a.expenseRatio - b.expenseRatio);
    }
    return list;
  }, [funds, fundCategory, fundSort]);

  const filteredBonds = useMemo(() => {
    let list = [...bonds];
    if (bondType !== 'All') {
      list = list.filter((b) => b.type === bondType);
    }
    if (bondSort === 'ytm') {
      list.sort((a, b) => b.ytm - a.ytm);
    } else if (bondSort === 'minInvestment') {
      list.sort((a, b) => a.minInvestment - b.minInvestment);
    }
    return list;
  }, [bonds, bondType, bondSort]);

  // Demo Market Event Simulators
  const triggerDemoEvent = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Market Overview Strip */}
      <section aria-label="Market Overview">
        <MarketOverview />
      </section>

      {/* 2. Interactive Discovery & Search Header */}
      <section className="bg-gradient-to-br from-primary-50/80 via-white to-primary-50/40 border border-primary-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4 overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 bg-primary-100/80 px-2.5 py-0.5 rounded-full border border-primary-200/50">
              Beginner Friendly Discovery
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary tracking-tight">
            Invest with clarity, not guesswork.
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-1 leading-relaxed max-w-2xl">
            Explore instruments with clear risk metrics, transparent fees, and plain-English insights.
          </p>
        </div>

        {/* Instant Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search any stock, mutual fund, bond, ETF, or news topic..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-borderMd rounded-xl text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-2xs"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-textMuted hover:text-textPrimary px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Demo Event Trigger Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
          <span className="text-textMuted font-medium flex items-center gap-1 text-[11px]">
            <Zap size={13} className="text-amber-500 fill-amber-500 shrink-0" />
            Simulate market events:
          </span>
          <button
            type="button"
            onClick={() => triggerDemoEvent('evt-rbi-001')}
            className="text-xs px-2.5 py-1 bg-white hover:bg-primary-50 text-textSecondary hover:text-primary-700 font-medium rounded-lg border border-border transition-colors shadow-2xs inline-flex items-center gap-1 cursor-pointer"
            title="Simulate RBI Repo Rate Cut"
          >
            <span>RBI Rate Cut</span>
            <span className="text-[10px] text-textMuted">↗</span>
          </button>
          <button
            type="button"
            onClick={() => triggerDemoEvent('evt-oil-001')}
            className="text-xs px-2.5 py-1 bg-white hover:bg-primary-50 text-textSecondary hover:text-primary-700 font-medium rounded-lg border border-border transition-colors shadow-2xs inline-flex items-center gap-1 cursor-pointer"
            title="Simulate Crude Oil Surge"
          >
            <span>Oil Surge</span>
            <span className="text-[10px] text-textMuted">↗</span>
          </button>
        </div>
      </section>

      {/* 3. Search Results Overlay (If user is searching) */}
      {searchResults && (
        <section className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-textPrimary">
              Search Results for &ldquo;{localSearch}&rdquo;
            </h2>
            <button
              onClick={() => setLocalSearch('')}
              className="text-xs text-primary-600 hover:underline font-medium"
            >
              Close Search
            </button>
          </div>

          {searchResults.stocks.length === 0 &&
          searchResults.mutualFunds.length === 0 &&
          searchResults.bonds.length === 0 &&
          searchResults.etfs.length === 0 &&
          searchResults.news.length === 0 ? (
            <EmptyState
              title="No matching instruments found"
              description={`We couldn't find any instruments matching "${localSearch}". Try searching for "Nifty", "Bond", "BPCL", or "RBI".`}
              action={
                <Button size="sm" variant="outline" onClick={() => setLocalSearch('')}>
                  Clear search
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col gap-3.5">
              {searchResults.stocks.map((stock) => (
                <StockCard key={stock.id} stock={stock} />
              ))}
              {searchResults.mutualFunds.map((fund) => (
                <FundCard key={fund.id} fund={fund} />
              ))}
              {searchResults.bonds.map((bond) => (
                <BondCard key={bond.id} bond={bond} />
              ))}
              {searchResults.etfs.map((etf) => (
                <EtfCard key={etf.id} etf={etf} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. Category Selector & Feeds */}
      {!searchResults && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-textPrimary">
                Explore Instruments
              </h2>
              <p className="text-xs text-textSecondary">
                Select an asset class to review opportunities, risk indicators, and simulated fees.
              </p>
            </div>
          </div>

          {/* Category Selector */}
          <CategorySelector />


          {/* Category-specific filter bars */}
          {activeCategory === 'STOCK' && (
            <div className="flex flex-col gap-2.5 p-3.5 bg-bgSurface border border-border rounded-xl">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-textMuted flex items-center gap-1 font-medium">
                  <ArrowUpDown size={12} /> Sort:
                </span>
                <select
                  value={stockSort}
                  onChange={(e) => setStockSort(e.target.value as 'change' | 'mcap' | 'pe')}
                  className="bg-white border border-border rounded-lg px-2.5 py-1 text-xs text-textPrimary focus:outline-none focus:border-primary-500 cursor-pointer shadow-2xs"
                >
                  <option value="change">Price Change</option>
                  <option value="pe">P/E Ratio (Low to High)</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                <span className="text-xs text-textMuted flex items-center gap-1 font-medium mr-1 shrink-0">
                  <Filter size={12} /> Sector:
                </span>
                {['All', 'Technology', 'Banking & Finance', 'Energy & Petroleum', 'Consumer Goods', 'Metals & Mining'].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setStockSector(sec)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                      stockSector === sec
                        ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                        : 'bg-white text-textSecondary border-border hover:bg-bgMuted'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'MF' && (
            <div className="flex flex-col gap-2.5 p-3.5 bg-bgSurface border border-border rounded-xl">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-textMuted flex items-center gap-1 font-medium">
                  <ArrowUpDown size={12} /> Sort:
                </span>
                <select
                  value={fundSort}
                  onChange={(e) => setFundSort(e.target.value as 'returns3y' | 'expenseRatio')}
                  className="bg-white border border-border rounded-lg px-2.5 py-1 text-xs text-textPrimary focus:outline-none focus:border-primary-500 cursor-pointer shadow-2xs"
                >
                  <option value="returns3y">3Y Returns (High to Low)</option>
                  <option value="expenseRatio">Lowest Expense Ratio</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                <span className="text-xs text-textMuted flex items-center gap-1 font-medium mr-1 shrink-0">
                  <Filter size={12} /> Category:
                </span>
                {['All', 'Large Cap Index', 'Flexi Cap', 'Mid Cap', 'Short Duration Debt', 'Corporate Bond', 'ELSS (Tax Saver)'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFundCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                      fundCategory === cat
                        ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                        : 'bg-white text-textSecondary border-border hover:bg-bgMuted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'BOND' && (
            <div className="flex flex-col gap-2.5 p-3.5 bg-bgSurface border border-border rounded-xl">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-textMuted flex items-center gap-1 font-medium">
                  <ArrowUpDown size={12} /> Sort:
                </span>
                <select
                  value={bondSort}
                  onChange={(e) => setBondSort(e.target.value as 'ytm' | 'minInvestment')}
                  className="bg-white border border-border rounded-lg px-2.5 py-1 text-xs text-textPrimary focus:outline-none focus:border-primary-500 cursor-pointer shadow-2xs"
                >
                  <option value="ytm">Highest Yield (YTM)</option>
                  <option value="minInvestment">Lowest Min Investment</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                <span className="text-xs text-textMuted flex items-center gap-1 font-medium mr-1 shrink-0">
                  <Filter size={12} /> Type:
                </span>
                {['All', 'Sovereign (G-Sec)', 'PSU Corporate', 'High Yield Corporate'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setBondType(t)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                      bondType === t
                        ? 'bg-primary-500 text-white border-primary-500 shadow-2xs'
                        : 'bg-white text-textSecondary border-border hover:bg-bgMuted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instrument Cards Grid */}
          {loading ? (
            <div className="flex flex-col gap-3.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 bg-white border border-border rounded-xl space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Mutual Funds Feed */}
              {activeCategory === 'MF' && (
                filteredFunds.length === 0 ? (
                  <EmptyState
                    title="No mutual funds match your filter"
                    description="Try selecting 'All' categories to view available index and active funds."
                    action={<Button size="sm" onClick={() => setFundCategory('All')}>Reset filter</Button>}
                  />
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {filteredFunds.map((fund) => (
                      <FundCard key={fund.id} fund={fund} />
                    ))}
                  </div>
                )
              )}

              {/* Stocks Feed */}
              {activeCategory === 'STOCK' && (
                filteredStocks.length === 0 ? (
                  <EmptyState
                    title="No stocks match your filter"
                    description="Try selecting 'All' sectors to view available large, mid, and small cap equities."
                    action={<Button size="sm" onClick={() => setStockSector('All')}>Reset filter</Button>}
                  />
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {filteredStocks.map((stock) => (
                      <StockCard key={stock.id} stock={stock} />
                    ))}
                  </div>
                )
              )}

              {/* Bonds Feed */}
              {activeCategory === 'BOND' && (
                filteredBonds.length === 0 ? (
                  <EmptyState
                    title="No bonds match your filter"
                    description="Try selecting 'All' bond types to see Sovereign G-Secs, PSU bonds, and corporate debentures."
                    action={<Button size="sm" onClick={() => setBondType('All')}>Reset filter</Button>}
                  />
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {filteredBonds.map((bond) => (
                      <BondCard key={bond.id} bond={bond} />
                    ))}
                  </div>
                )
              )}

              {/* ETFs Feed */}
              {activeCategory === 'ETF' && (
                <div className="flex flex-col gap-3.5">
                  {etfs.map((etf) => (
                    <EtfCard key={etf.id} etf={etf} />
                  ))}
                </div>
              )}

              {/* IPOs Feed */}
              {activeCategory === 'IPO' && (
                <div className="flex flex-col gap-3.5">
                  {ipos.map((ipo) => (
                    <IpoCard key={ipo.id} ipo={ipo} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
