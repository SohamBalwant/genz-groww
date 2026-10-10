import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { dataService } from '../services/dataService';
import { DemoBadge } from '../components/ui/DemoBadge';
import { PriceChange } from '../components/ui/PriceChange';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { RiskMeter } from '../components/market/RiskMeter';
import { FinancialsTab } from '../components/financials/FinancialsTab';
import { OptionChain } from '../components/options/OptionChain';
import { EducationGate } from '../components/options/EducationGate';
import { NewsCard } from '../components/news/NewsCard';
import { formatINR } from '../lib/format';
import {
  Bookmark,
  ShieldAlert,
  Layers,
  Percent,
  Calculator,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import type {
  Instrument,
  Stock,
  MutualFund,
  Bond,
  Etf,
  Ipo,
  NewsStory,
  OptionChainData,
} from '../types';

export const InstrumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsStory[]>([]);
  const [optionChain, setOptionChain] = useState<OptionChainData | null>(null);

  // Selected Chart Period
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1Y');

  // SIP Calculator State (for MF)
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipYears, setSipYears] = useState<number>(5);
  const [sipReturnRate, setSipReturnRate] = useState<number>(12);

  // Active Tab from query param or default
  const activeTab = searchParams.get('tab') || 'overview';

  const isWatchlisted = instrument ? state.watchlist.includes(instrument.id) : false;

  useEffect(() => {
    let mounted = true;
    const fetchInstrument = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const item = await dataService.getInstrumentById(id);
        if (mounted && item) {
          setInstrument(item);

          // Fetch related news
          const allNews = await dataService.getNewsStories();
          const linked = allNews.filter((n) => n.relatedInstrumentIds.includes(item.id));
          if (mounted) setRelatedNews(linked);

          // Fetch option chain if stock with options
          if (item.assetClass === 'STOCK' && (item as Stock).hasOptions) {
            const chain = await dataService.getOptionChain(item.id);
            if (mounted) setOptionChain(chain);
          }
        }
      } catch (err) {
        console.error('Failed to load instrument:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInstrument();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleToggleWatchlist = () => {
    if (instrument) {
      dispatch({ type: 'TOGGLE_WATCHLIST', payload: instrument.id });
    }
  };

  // SIP calculation (Compound monthly)
  const sipResult = useMemo(() => {
    const monthlyRate = sipReturnRate / 12 / 100;
    const months = sipYears * 12;
    const totalInvested = sipMonthly * months;
    const futureValue =
      sipMonthly *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);
    const estimatedReturns = Math.max(0, futureValue - totalInvested);
    return {
      totalInvested,
      futureValue,
      estimatedReturns,
    };
  }, [sipMonthly, sipYears, sipReturnRate]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!instrument) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-textPrimary">Instrument Not Found</h2>
        <p className="text-sm text-textSecondary">
          The requested security could not be found in our mock database.
        </p>
        <Button onClick={() => navigate('/')}>Return to Discover</Button>
      </div>
    );
  }

  // Type assertions
  const stock = instrument.assetClass === 'STOCK' ? (instrument as Stock) : null;
  const mf = instrument.assetClass === 'MF' ? (instrument as MutualFund) : null;
  const bond = instrument.assetClass === 'BOND' ? (instrument as Bond) : null;
  const etf = instrument.assetClass === 'ETF' ? (instrument as Etf) : null;
  const ipo = instrument.assetClass === 'IPO' ? (instrument as Ipo) : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 0. Mobile Back Button Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-textPrimary bg-white hover:bg-bgSurface px-3 py-1.5 rounded-full border border-border shadow-2xs transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back</span>
        </button>
        <span className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
          {instrument.assetClass} Detail
        </span>
      </div>

      {/* 1. Header Banner */}
      <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        {/* Top Badges & Watchlist Action Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-bgSurface text-textMuted border border-border">
              {instrument.assetClass}
            </span>
            <DemoBadge size="xs" />
            {stock?.hasOptions && (
              <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                F&O Enabled
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleWatchlist}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
              isWatchlisted
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'bg-white border-border text-textSecondary hover:text-textPrimary hover:bg-bgSurface'
            }`}
            aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark
              size={14}
              className={`shrink-0 ${isWatchlisted ? 'fill-primary-600 text-primary-600' : ''}`}
            />
            <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight">
            {instrument.name}
          </h1>
          <p className="text-xs text-textMuted">
            {stock?.ticker || mf?.amc || bond?.issuer || etf?.ticker || ipo?.company}
            {instrument.isin ? ` · ${instrument.isin}` : ''}
          </p>
        </div>

        {/* Pricing & Key Metrics Row */}
        <div className="flex flex-wrap items-baseline gap-4 pt-2 border-t border-border">
          {stock && (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-textPrimary tabular-nums">
                {formatINR(stock.price)}
              </span>
              <PriceChange changePct={stock.changePct} />
              <span className="text-xs text-textMuted">Today</span>
            </div>
          )}

          {mf && (
            <div className="flex items-baseline gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-textMuted">NAV:</span>
                <span className="text-3xl font-extrabold text-textPrimary tabular-nums">
                  {formatINR(mf.nav)}
                </span>
              </div>
              <PriceChange changePct={mf.returns[0]?.pct || 1.2} />
              <span className="text-xs text-textMuted">({mf.category})</span>
            </div>
          )}

          {bond && (
            <div className="flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-xs text-textMuted block">Yield to Maturity (YTM)</span>
                <span className="text-2xl font-extrabold text-primary-600 tabular-nums">
                  {bond.ytm.toFixed(2)}%
                </span>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-xs text-textMuted block">Annual Coupon Rate</span>
                <span className="text-xl font-bold text-textPrimary tabular-nums">
                  {bond.coupon.toFixed(2)}%
                </span>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-xs text-textMuted block">Min Investment</span>
                <span className="text-lg font-semibold text-textPrimary tabular-nums">
                  {formatINR(bond.minInvestment)}
                </span>
              </div>
            </div>
          )}

          {etf && (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-textPrimary tabular-nums">
                {formatINR(etf.price)}
              </span>
              <PriceChange changePct={etf.changePct} />
              <span className="text-xs text-textMuted">Tracking {etf.tracks}</span>
            </div>
          )}


          {ipo && (
            <div className="flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-xs text-textMuted block">Price Band</span>
                <span className="text-2xl font-extrabold text-textPrimary tabular-nums">
                  ₹{ipo.priceBand[0]} - ₹{ipo.priceBand[1]}
                </span>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-xs text-textMuted block">Lot Size</span>
                <span className="text-xl font-bold text-textPrimary tabular-nums">
                  {ipo.lotSize} shares
                </span>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-xs text-textMuted block">Min Investment</span>
                <span className="text-lg font-semibold text-textPrimary tabular-nums">
                  {formatINR(ipo.minInvestment)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive SVG Trend Chart & Timeframe Selector */}
      <div className="bg-white border border-border rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">
            Price History & Trajectory
          </span>
          <div className="flex items-center gap-1 bg-bgSurface p-1 rounded-xl border border-border">
            {['1D', '1W', '1M', '1Y', '3Y', '5Y'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  selectedPeriod === p
                    ? 'bg-primary-500 text-white shadow-2xs'
                    : 'text-textMuted hover:text-textPrimary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Graphic Area */}
        <div className="h-44 w-full flex items-end justify-between gap-1 pt-6 pb-2 px-2 border-b border-border">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
            <polyline
              fill="none"
              stroke="#00B386"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,35 15,30 30,38 45,22 60,28 75,15 90,18 100,8"
            />
          </svg>
        </div>
        <p className="text-[11px] text-textMuted text-center">
          Past performance is not an indicator of future results. All figures are simulated.
        </p>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabChange('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-textMuted hover:text-textPrimary'
          }`}
        >
          Overview & Key Stats
        </button>

        {stock && (
          <button
            onClick={() => handleTabChange('financials')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'financials'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-textMuted hover:text-textPrimary'
            }`}
          >
            Financials (Annual & Quarterly)
          </button>
        )}

        {stock?.hasOptions && (
          <button
            onClick={() => handleTabChange('options')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'options'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-textMuted hover:text-textPrimary'
            }`}
          >
            Option Chain (F&O)
          </button>
        )}

        <button
          onClick={() => handleTabChange('news')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'news'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-textMuted hover:text-textPrimary'
          }`}
        >
          News & Events ({relatedNews.length})
        </button>

        <button
          onClick={() => handleTabChange('about')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'about'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-textMuted hover:text-textPrimary'
          }`}
        >
          About & Disclosures
        </button>
      </div>

      {/* 4. Tab Content */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* STOCK OVERVIEW */}
            {stock && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="p-4 bg-white border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted font-medium">Market Cap Category</span>
                      <span className="text-[11px] text-textMuted font-medium">Sector: {stock.sector}</span>
                    </div>
                    <span className="text-base font-bold text-textPrimary mt-1 block">
                      {stock.mcapBucket} Cap
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted font-medium">P/E Ratio</span>
                      {stock.ratios.pe === null && (
                        <span className="text-[11px] text-loss font-semibold">Loss-making</span>
                      )}
                    </div>
                    <span className="text-base font-bold text-textPrimary mt-1 block tabular-nums">
                      {stock.ratios.pe ? stock.ratios.pe.toFixed(2) : 'Not meaningful'}
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted font-medium">Return on Equity (ROE)</span>
                    </div>
                    <span className="text-base font-bold text-textPrimary mt-1 block tabular-nums">
                      {stock.ratios.roe ? `${stock.ratios.roe.toFixed(1)}%` : 'Not available'}
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted font-medium">Dividend Yield</span>
                    </div>
                    <span className="text-base font-bold text-textPrimary mt-1 block tabular-nums">
                      {stock.ratios.divYield !== null && stock.ratios.divYield !== undefined
                        ? `${stock.ratios.divYield}%`
                        : 'No dividend'}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-border rounded-xl p-5 space-y-2">
                  <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider">
                    Company Profile
                  </h3>
                  <p className="text-sm text-textPrimary leading-relaxed">
                    {stock.description}
                  </p>
                </div>
              </div>
            )}

            {/* MUTUAL FUND OVERVIEW */}
            {mf && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Riskometer */}
                  <div className="p-5 bg-white border border-border rounded-xl space-y-3">
                    <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
                      SEBI Riskometer
                    </span>
                    <RiskMeter level={mf.riskLevel} />
                    <p className="text-xs text-textSecondary">
                      Principal will be at {mf.riskLevel >= 5 ? 'Very High' : mf.riskLevel >= 3 ? 'Moderate' : 'Low'} risk.
                    </p>
                  </div>

                  {/* Expense Ratio Card */}
                  <div className="p-5 bg-white border border-border rounded-xl space-y-2">
                    <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
                      Expense Ratio ({mf.plan} Plan)
                    </span>
                    <span className="text-2xl font-bold text-textPrimary block mt-1">
                      {mf.expenseRatio.toFixed(2)}%
                    </span>
                    <p className="text-xs text-textSecondary mt-1">
                      On ₹10,000 invested, approximately ₹{(mf.expenseRatio * 100).toFixed(0)} is deducted annually for fund management.
                    </p>
                    <span className="text-[10px] text-textMuted block pt-1">
                      Category: {mf.category}
                    </span>
                  </div>
                </div>

                {/* Trailing Returns Table - Stacked */}
                <div className="p-5 bg-white border border-border rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-textPrimary">
                      Historical Compound Annualized Returns
                    </h3>
                    <span className="text-[11px] text-textMuted">Compounded Annual Growth</span>
                  </div>

                  <div className="space-y-2.5">
                    {mf.returns.map((ret) => (
                      <div key={ret.period} className="p-3.5 bg-bgSurface rounded-xl border border-border flex items-center justify-between">
                        <span className="text-xs font-semibold text-textMuted">{ret.period} Return</span>
                        <span className="text-base font-bold text-primary-600 tabular-nums">
                          {ret.pct !== null ? `+${ret.pct.toFixed(2)}%` : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive SIP Calculator */}
                <div className="p-5 bg-gradient-to-br from-primary-50/50 to-white border border-primary-200 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-primary-800">
                    <Calculator size={18} />
                    <h3 className="text-sm font-bold">
                      Interactive SIP Wealth Estimator (Illustrative)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Monthly SIP</span>
                        <span>₹{sipMonthly.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="25000"
                        step="500"
                        value={sipMonthly}
                        onChange={(e) => setSipMonthly(Number(e.target.value))}
                        className="w-full accent-primary-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Duration</span>
                        <span>{sipYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={sipYears}
                        onChange={(e) => setSipYears(Number(e.target.value))}
                        className="w-full accent-primary-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Expected Return</span>
                        <span>{sipReturnRate}% p.a.</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="18"
                        step="0.5"
                        value={sipReturnRate}
                        onChange={(e) => setSipReturnRate(Number(e.target.value))}
                        className="w-full accent-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-3.5 bg-white rounded-xl border border-primary-100">
                    <div className="flex items-center justify-between py-1 border-b border-primary-50">
                      <span className="text-xs text-textMuted">Total Invested</span>
                      <span className="text-sm font-semibold text-textPrimary tabular-nums">
                        {formatINR(sipResult.totalInvested)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-primary-50">
                      <span className="text-xs text-textMuted">Est. Growth</span>
                      <span className="text-sm font-semibold text-primary-600 tabular-nums">
                        {formatINR(sipResult.estimatedReturns)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs text-textMuted font-semibold">Future Value</span>
                      <span className="text-base font-bold text-primary-700 tabular-nums">
                        {formatINR(sipResult.futureValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOND OVERVIEW */}
            {bond && (
              <div className="space-y-6">
                {/* Bond Specifications - Stacked */}
                <div className="space-y-3">
                  <div className="p-4 bg-white border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted font-medium">Credit Rating</span>
                      <span className="text-[11px] text-textMuted">
                        {bond.ratingAgency ? `Rated by ${bond.ratingAgency}` : 'Higher credit risk'}
                      </span>
                    </div>
                    <span className="text-base font-bold text-textPrimary mt-1 block">
                      {bond.rating || 'Unrated'}
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted font-medium">Maturity Date</span>
                      <span className="text-[11px] text-textMuted">Face Value: ₹{bond.faceValue.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-base font-bold text-textPrimary mt-1 block tabular-nums">
                      {bond.maturity}
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted font-medium">Bond Category</span>
                      <span className="text-[11px] text-textMuted">Direct to linked Demat</span>
                    </div>
                    <span className="text-base font-bold text-textPrimary mt-1 block">
                      {bond.type}
                    </span>
                  </div>
                </div>

                {/* Key Risk Pillars - Stacked One Below Another */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-textPrimary">
                    Key Risk Pillars for this Bond
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-white border border-border rounded-xl space-y-1.5">
                      <span className="text-xs sm:text-sm font-bold text-textPrimary flex items-center gap-2">
                        <ShieldAlert size={16} className="text-blue-600 shrink-0" />
                        <span>Credit Risk</span>
                      </span>
                      <p className="text-xs text-textSecondary leading-relaxed">
                        {bond.creditRiskNote}
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-border rounded-xl space-y-1.5">
                      <span className="text-xs sm:text-sm font-bold text-textPrimary flex items-center gap-2">
                        <Percent size={16} className="text-amber-600 shrink-0" />
                        <span>Interest Rate Risk</span>
                      </span>
                      <p className="text-xs text-textSecondary leading-relaxed">
                        {bond.rateRiskNote}
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-border rounded-xl space-y-1.5">
                      <span className="text-xs sm:text-sm font-bold text-textPrimary flex items-center gap-2">
                        <Layers size={16} className="text-purple-600 shrink-0" />
                        <span>Liquidity Risk</span>
                      </span>
                      <p className="text-xs text-textSecondary leading-relaxed">
                        {bond.liquidityNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ETF OVERVIEW */}
            {etf && (
              <div className="space-y-3">
                <div className="p-4 bg-white border border-border rounded-xl">
                  <span className="text-xs text-textMuted font-medium block">Tracking Index</span>
                  <span className="text-base font-bold text-textPrimary mt-1 block">{etf.tracks}</span>
                </div>
                <div className="p-4 bg-white border border-border rounded-xl">
                  <span className="text-xs text-textMuted font-medium block">Expense Ratio</span>
                  <span className="text-base font-bold text-textPrimary mt-1 block tabular-nums">{etf.expenseRatio.toFixed(2)}%</span>
                </div>
                <div className="p-4 bg-white border border-border rounded-xl">
                  <span className="text-xs text-textMuted font-medium block">Tracking Note</span>
                  <span className="text-sm font-semibold text-textPrimary mt-1 block leading-relaxed">{etf.trackingNote}</span>
                </div>
              </div>
            )}

            {/* IPO OVERVIEW */}
            {ipo && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-white border border-border rounded-xl">
                    <span className="text-xs text-textMuted font-medium block">Issue Open</span>
                    <span className="text-base font-bold text-textPrimary mt-1 block">{ipo.opens}</span>
                  </div>
                  <div className="p-4 bg-white border border-border rounded-xl">
                    <span className="text-xs text-textMuted font-medium block">Issue Close</span>
                    <span className="text-base font-bold text-textPrimary mt-1 block">{ipo.closes}</span>
                  </div>
                  <div className="p-4 bg-white border border-border rounded-xl">
                    <span className="text-xs text-textMuted font-medium block">Lot Size</span>
                    <span className="text-base font-bold text-textPrimary mt-1 block">{ipo.lotSize} shares</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-700" /> Key IPO Risks to Consider
                  </span>
                  <ul className="text-xs text-amber-950 list-disc pl-5 space-y-1">
                    {ipo.keyRisks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FINANCIALS TAB (Stocks Only) */}
        {activeTab === 'financials' && stock && (
          <FinancialsTab financials={stock.financials} />
        )}

        {/* OPTIONS TAB (Stocks Only) */}
        {activeTab === 'options' && stock?.hasOptions && (
          <div>
            {!state.optionsGateAcknowledged ? (
              <EducationGate
                onAcknowledge={() => dispatch({ type: 'ACKNOWLEDGE_OPTIONS_GATE' })}
                onCancel={() => handleTabChange('overview')}
              />
            ) : optionChain ? (
              <OptionChain chain={optionChain} underlyingTicker={stock.ticker} />
            ) : (
              <div className="text-center py-12 text-textMuted">
                No active option chain data available for this contract.
              </div>
            )}
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            {relatedNews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-border space-y-2">
                <p className="text-sm font-semibold text-textPrimary">No recent news stories</p>
                <p className="text-xs text-textSecondary">
                  There are no active headlines touching {instrument.name} in this session.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {relatedNews.map((story) => (
                  <NewsCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="bg-white border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-textPrimary">About {instrument.name}</h3>
            <p className="text-xs md:text-sm text-textSecondary leading-relaxed">
              {stock?.description || mf?.amc || bond?.issuer || ipo?.overview || 'Regulated financial instrument in Indian financial markets.'}
            </p>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-textMuted">
              <span>Security ISIN: {instrument.isin || 'N/A'}</span>
              <DemoBadge size="xs" />
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Action Bar (Trading CTAs - In-flow at end of page) */}
      <div className="pt-4 border-t border-border flex items-center justify-end">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {stock && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/order/${stock.id}?side=SELL`)}
                className="flex-1 sm:flex-initial"
              >
                Sell
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/order/${stock.id}?side=BUY`)}
                className="flex-1 sm:flex-initial"
              >
                Buy
              </Button>
            </>
          )}

          {mf && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/order/${mf.id}?side=BUY&product=MF&mode=ONETIME`)}
                className="flex-1 sm:flex-initial"
              >
                One-time Lumpsum
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/order/${mf.id}?side=BUY&product=MF&mode=SIP`)}
                className="flex-1 sm:flex-initial"
              >
                Start SIP
              </Button>
            </>
          )}

          {bond && (
            <Button
              variant="primary"
              onClick={() => navigate(`/order/${bond.id}?side=BUY&product=BOND`)}
              className="w-full sm:w-auto"
            >
              Invest in Bond
            </Button>
          )}

          {etf && (
            <Button
              variant="primary"
              onClick={() => navigate(`/order/${etf.id}?side=BUY&product=DELIVERY`)}
              className="w-full sm:w-auto"
            >
              Buy ETF
            </Button>
          )}

          {ipo && (
            <Button
              variant="primary"
              disabled={ipo.status === 'Closed'}
              onClick={() => navigate(`/order/${ipo.id}?side=BUY&product=IPO`)}
              className="w-full sm:w-auto"
            >
              {ipo.status === 'Closed' ? 'Issue Closed' : 'Apply for IPO'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
