import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useApp } from '../state/AppContext';
import { calculateCharges } from '../lib/fees/calculateCharges';
import { DEMO_FEE_CONFIG } from '../lib/fees/feeConfig';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDateIST, formatINR } from '../lib/format';
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calculator,
  BrainCircuit,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
} from 'lucide-react';
import type { MarketEvent, Instrument } from '../types';

interface ResolvedAffected {
  instrument: Instrument;
  reason: string;
  caveat: string;
}

const getInstrumentPrice = (inst: Instrument | null | undefined): number => {
  if (!inst) return 100;
  if ('price' in inst && typeof inst.price === 'number') return inst.price;
  if ('nav' in inst && typeof inst.nav === 'number') return inst.nav;
  if ('faceValue' in inst && typeof inst.faceValue === 'number') return inst.faceValue;
  if ('minInvestment' in inst && typeof inst.minInvestment === 'number') return inst.minInvestment;
  return 100;
};

const getInstrumentSymbol = (inst: Instrument | null | undefined): string => {
  if (!inst) return 'Instrument';
  if ('ticker' in inst && typeof inst.ticker === 'string') return inst.ticker;
  if ('issuer' in inst && typeof inst.issuer === 'string') return inst.issuer;
  if ('amc' in inst && typeof inst.amc === 'string') return inst.amc;
  return inst.name;
};

export const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: appState, dispatch: appDispatch } = useApp();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<MarketEvent | null>(null);
  const [affectedList, setAffectedList] = useState<ResolvedAffected[]>([]);

  // Asset Impacts Swiping Carousel State
  const [impactIndex, setImpactIndex] = useState(0);
  const [impactTouchStartX, setImpactTouchStartX] = useState<number | null>(null);
  const [impactTouchStartY, setImpactTouchStartY] = useState<number | null>(null);
  const [impactTouchDeltaX, setImpactTouchDeltaX] = useState<number>(0);
  const [isImpactSwiping, setIsImpactSwiping] = useState(false);
  const [isImpactHorizontalSwipe, setIsImpactHorizontalSwipe] = useState(false);

  // Section 5 & 6 (Simulate & Decide with AI) State
  const [selectedSimInstId, setSelectedSimInstId] = useState<string>('');
  const [simAmount, setSimAmount] = useState<number>(10000);
  const [simPrice, setSimPrice] = useState<number>(100);
  const [simHoldingPeriod, setSimHoldingPeriod] = useState<'3M' | '6M' | '1Y' | '3Y' | '5Y'>('1Y');
  const [simScenario, setSimScenario] = useState<'conservative' | 'base' | 'optimistic'>('base');
  const [showFeeDetails, setShowFeeDetails] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const item = await dataService.getMarketEventById(id);
        if (mounted && item) {
          setEvent(item);
          // Resolve affected instruments
          const resolved = await Promise.all(
            item.affectedInstruments.map(async (aff) => {
              const inst = await dataService.getInstrumentById(aff.instrumentId);
              if (!inst) return null;
              return {
                instrument: inst,
                reason: aff.reason,
                caveat: aff.caveat,
              };
            })
          );
          if (mounted) {
            const list = resolved.filter(Boolean) as ResolvedAffected[];
            setAffectedList(list);
            if (list.length > 0) {
              setSelectedSimInstId(list[0].instrument.id);
              setSimPrice(getInstrumentPrice(list[0].instrument));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load market event:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEvent();
    return () => {
      mounted = false;
    };
  }, [id]);

  const totalImpacts = event?.assetImpacts?.length || 0;
  const safeImpactIndex =
    totalImpacts > 0 ? Math.min(Math.max(0, impactIndex), totalImpacts - 1) : 0;

  const hasImpactLeft = safeImpactIndex > 0;
  const hasImpactRight = safeImpactIndex < totalImpacts - 1;

  const handleImpactPrev = useCallback(() => {
    setImpactIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleImpactNext = useCallback(() => {
    setImpactIndex((prev) => Math.min(totalImpacts - 1, prev + 1));
  }, [totalImpacts]);

  // Touch Handlers for Asset Impacts Swiping
  const handleImpactTouchStart = (e: React.TouchEvent) => {
    setImpactTouchStartX(e.touches[0].clientX);
    setImpactTouchStartY(e.touches[0].clientY);
    setImpactTouchDeltaX(0);
    setIsImpactSwiping(false);
    setIsImpactHorizontalSwipe(false);
  };

  const handleImpactTouchMove = (e: React.TouchEvent) => {
    if (impactTouchStartX === null || impactTouchStartY === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - impactTouchStartX;
    const deltaY = currentY - impactTouchStartY;

    if (!isImpactHorizontalSwipe && !isImpactSwiping) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        setIsImpactHorizontalSwipe(true);
        setIsImpactSwiping(true);
      } else if (Math.abs(deltaY) > 8) {
        return;
      }
    }

    if (isImpactHorizontalSwipe) {
      if ((safeImpactIndex === 0 && deltaX > 0) || (safeImpactIndex === totalImpacts - 1 && deltaX < 0)) {
        setImpactTouchDeltaX(deltaX * 0.25);
      } else {
        setImpactTouchDeltaX(deltaX);
      }
    }
  };

  const handleImpactTouchEnd = () => {
    if (isImpactHorizontalSwipe && impactTouchStartX !== null) {
      const threshold = 40;
      if (impactTouchDeltaX < -threshold && hasImpactRight) {
        handleImpactNext();
      } else if (impactTouchDeltaX > threshold && hasImpactLeft) {
        handleImpactPrev();
      }
    }
    setImpactTouchStartX(null);
    setImpactTouchStartY(null);
    setImpactTouchDeltaX(0);
    setIsImpactSwiping(false);
    setIsImpactHorizontalSwipe(false);
  };

  // Section 5 & 6 Calculations
  const handleSelectSimInstrument = (instId: string) => {
    setSelectedSimInstId(instId);
    const found = affectedList.find((a) => a.instrument.id === instId);
    if (found?.instrument) {
      setSimPrice(getInstrumentPrice(found.instrument));
    }
  };

  const activeSimulated = useMemo(() => {
    return (
      affectedList.find((a) => a.instrument.id === selectedSimInstId) ||
      affectedList[0] ||
      null
    );
  }, [affectedList, selectedSimInstId]);

  const activeInstrument = activeSimulated?.instrument;
  const isInWatchlist = activeInstrument ? appState.watchlist.includes(activeInstrument.id) : false;

  const simQuantity = Math.max(1, Math.floor(simAmount / (simPrice > 0 ? simPrice : 1)));
  const simInvestedCapital = simQuantity * simPrice;

  const scenarioAnnualRates = {
    conservative: 0.05,
    base: 0.085,
    optimistic: 0.125,
  };

  const periodYears = {
    '3M': 0.25,
    '6M': 0.5,
    '1Y': 1.0,
    '3Y': 3.0,
    '5Y': 5.0,
  }[simHoldingPeriod];

  const estimatedGrowthPct = scenarioAnnualRates[simScenario] * periodYears;
  const projectedGrossValue = Math.round(simInvestedCapital * (1 + estimatedGrowthPct));
  const projectedGrossProfit = projectedGrossValue - simInvestedCapital;

  const feeOutput = useMemo(() => {
    if (!activeInstrument) return null;
    try {
      return calculateCharges(
        {
          assetClass: activeInstrument.assetClass,
          product: 'DELIVERY',
          side: 'BUY',
          price: simPrice,
          quantity: simQuantity,
          exchange: 'NSE',
        },
        DEMO_FEE_CONFIG
      );
    } catch {
      return null;
    }
  }, [activeInstrument, simPrice, simQuantity]);

  const totalCharges = feeOutput?.totalApplicable || 0;
  const projectedNetProfit = projectedGrossProfit - totalCharges;
  const netReturnPct = simInvestedCapital > 0 ? (projectedNetProfit / simInvestedCapital) * 100 : 0;

  const handleToggleWatchlist = () => {
    if (activeInstrument) {
      appDispatch({ type: 'TOGGLE_WATCHLIST', payload: activeInstrument.id });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-textPrimary">Market Event Not Found</h2>
        <p className="text-sm text-textSecondary">
          This event analysis could not be retrieved from the prototype session.
        </p>
        <Button onClick={() => navigate('/')}>Return to Discover</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top back navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to previous screen
        </button>
      </div>

      {/* 1. Header Banner */}
      <header className="space-y-3 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {event.type}
          </span>
          <span className="text-xs text-textMuted">•</span>
          <span className="text-xs text-textMuted flex items-center gap-1">
            <Clock size={13} /> {formatDateIST(event.occurredAt)}
          </span>
          <DemoBadge size="xs" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight leading-snug">
          {event.title}
        </h1>

        <p className="text-xs md:text-sm text-textSecondary max-w-3xl">
          A contextual guide breaking down the macroeconomic impact across stocks, mutual funds, and fixed-income debt.
        </p>
      </header>

      {/* 2. Confirmed Facts (What Happened) */}
      <section className="bg-white border border-border rounded-2xl p-5 md:p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-primary-700">
          <Layers size={18} />
          <h2 className="text-base font-bold text-textPrimary uppercase tracking-wide text-xs">
            1. What Happened
          </h2>
        </div>
        <ul className="space-y-2 list-disc pl-5 text-sm md:text-base text-textPrimary leading-relaxed">
          {event.confirmedFacts.map((fact, idx) => (
            <li key={idx}>{fact}</li>
          ))}
        </ul>
      </section>

      {/* 3. Why It Matters (Plain English) */}
      <section className="bg-gradient-to-br from-primary-50/60 via-white to-blue-50/40 border border-primary-200/80 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-primary-800">
          <Sparkles size={18} className="text-primary-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-900">
            2. Why It Matters
          </h2>
        </div>
        <div className="space-y-2">
          {event.whyItMatters.map((point, idx) => (
            <p key={idx} className="text-sm md:text-base text-textPrimary leading-relaxed">
              {point}
            </p>
          ))}
        </div>

        {/* Concrete Rupee Example */}
        <div className="bg-white border border-primary-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 flex items-center gap-1">
            ₹ Concrete Rupee Perspective
          </span>
          <p className="text-xs md:text-sm text-textPrimary font-medium leading-relaxed">
            On a ₹10,000 corporate bond investment yielding 8.5%, a 25 bps rate decline increases secondary market bond capital value by roughly ₹150–₹250 depending on duration, while new FDs renew at lower annual yields.
          </p>
        </div>
      </section>

      {/* 4. Asset Category Impacts with Caveats (Swipeable Instagram-style Carousel) */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">
              3. Asset Class Impacts & Inherent Caveats
            </h2>
            <p className="text-xs text-textSecondary mt-0.5">
              Different instruments react differently based on credit duration, sector exposures, and market sentiment.
            </p>
          </div>

          {/* Pill Counter */}
          {totalImpacts > 1 && (
            <div className="shrink-0 flex items-center gap-1 bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-2xs backdrop-blur-sm mt-1">
              <span>{safeImpactIndex + 1}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-300 font-semibold">{totalImpacts}</span>
            </div>
          )}
        </div>

        {/* Swipeable Carousel Container */}
        <div className="relative">
          {/* Left Direction Icon: Shown ONLY when there are items to the left */}
          {hasImpactLeft && (
            <button
              type="button"
              onClick={handleImpactPrev}
              aria-label="Previous asset impact"
              title="Previous asset impact"
              className="absolute left-1 sm:left-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-primary-600 shadow-md border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
            >
              <ChevronLeft
                size={15}
                className="stroke-[2.5] -translate-x-0.5 group-hover:-translate-x-1 transition-transform"
              />
            </button>
          )}

          {/* Viewport: Exactly ONE impact card visible at a time */}
          <div
            className="w-full overflow-hidden rounded-2xl select-none"
            onTouchStart={handleImpactTouchStart}
            onTouchMove={handleImpactTouchMove}
            onTouchEnd={handleImpactTouchEnd}
          >
            <div
              className="flex items-start"
              style={{
                transform: `translateX(calc(-${safeImpactIndex * 100}% + ${impactTouchDeltaX}px))`,
                transition: isImpactSwiping ? 'none' : 'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              {event.assetImpacts.map((impact, idx) => (
                <div key={idx} className="w-full shrink-0">
                  <div className="bg-white border border-border rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-textPrimary bg-bgSurface px-3 py-1 rounded-md border border-border">
                          {impact.assetCategory}
                        </span>
                        <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200/50">
                          Class {idx + 1} of {totalImpacts}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-textPrimary font-medium leading-relaxed">
                        {impact.explanation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border bg-amber-50/50 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3 sm:p-3.5 rounded-b-xl border-t-amber-100">
                      <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                        <AlertCircle size={13} className="shrink-0 text-amber-600" /> Important Caveat:
                      </span>
                      <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                        {impact.caveat}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Direction Icon: Shown ONLY when there are items to the right */}
          {hasImpactRight && (
            <button
              type="button"
              onClick={handleImpactNext}
              aria-label="Next asset impact"
              title="Next asset impact"
              className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-primary-600 shadow-md border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
            >
              <ChevronRight
                size={15}
                className="stroke-[2.5] translate-x-0.5 group-hover:translate-x-1 transition-transform"
              />
            </button>
          )}
        </div>

        {/* Pagination Dots & Navigation Hints */}
        {totalImpacts > 1 && (
          <div className="flex flex-col items-center gap-2 pt-1">
            <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Asset class impact slides">
              {event.assetImpacts.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === safeImpactIndex}
                  aria-label={`Go to impact ${idx + 1}`}
                  onClick={() => setImpactIndex(idx)}
                  className={`transition-all duration-200 cursor-pointer ${
                    idx === safeImpactIndex
                      ? 'w-6 h-1.5 bg-primary-600 rounded-full shadow-2xs'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between w-full px-2 text-[11px] text-textMuted font-medium">
              <span>{hasImpactLeft ? '← Swipe for previous class' : '• First asset class'}</span>
              <span>{hasImpactRight ? 'Swipe for next class →' : '• End of asset classes'}</span>
            </div>
          </div>
        )}
      </section>

      {/* 5. Long-term vs Short-term Perspective */}
      <section className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <TrendingUp size={18} />
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            4. Long-Term vs Short-Term Perspective
          </h2>
        </div>

        <div className="flex flex-col gap-3.5 pt-1 w-full">
          <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Short-Term Noise (Days to Weeks)
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Immediate market knee-jerk moves often reflect speculative positioning, algorithmic liquidity adjustments, and options hedging rather than underlying company earnings changes.
            </p>
          </div>

          <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              Long-Term Fundamentals (3 to 5+ Years)
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Over multi-year horizons, investment compounding is driven by corporate capital allocation, return on invested capital (ROIC), and balance sheet discipline, which transcend single-session policy rate moves.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Simulate */}
      <section className="bg-white border border-border rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
        <div className="space-y-1 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-primary-700">
            <Calculator size={18} />
            <h2 className="text-base font-bold text-textPrimary tracking-tight">
              5. Simulate
            </h2>
          </div>
          <p className="text-xs md:text-sm text-textSecondary leading-relaxed">
            Test an amount, holding period and hypothetical entry price, including estimated charges.
          </p>
        </div>

        {/* Instrument Selector */}
        {affectedList.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-textPrimary flex items-center justify-between">
              <span>Select Impacted Instrument to Test</span>
              {activeInstrument && (
                <span className="text-[11px] text-textMuted font-normal">
                  CMP: {formatINR(getInstrumentPrice(activeInstrument))}
                </span>
              )}
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {affectedList.map(({ instrument }) => {
                const isSelected = instrument.id === (activeInstrument?.id || selectedSimInstId);
                return (
                  <button
                    key={instrument.id}
                    type="button"
                    onClick={() => handleSelectSimInstrument(instrument.id)}
                    className={`min-w-[145px] flex-1 p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/60 shadow-2xs ring-1 ring-primary-500'
                        : 'border-border bg-bgSurface hover:bg-white hover:border-borderMd'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">
                        {instrument.assetClass}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-primary-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-textPrimary truncate" title={instrument.name}>
                      {instrument.name}
                    </span>
                    <span className="text-xs font-semibold text-textSecondary">
                      {formatINR(getInstrumentPrice(instrument))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Parameters */}
        <div className="space-y-4 pt-1">
          {/* Test Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-textPrimary">
                Test Amount (₹)
              </label>
              <span className="text-[11px] text-textMuted font-medium">
                Min ₹100
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-textMuted">
                ₹
              </span>
              <input
                type="number"
                min="100"
                step="500"
                value={simAmount || ''}
                onChange={(e) => setSimAmount(Math.max(100, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-2.5 text-sm font-semibold text-textPrimary bg-bgSurface border border-border rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                placeholder="Amount"
              />
            </div>
            {/* Quick chips in single clean row */}
            <div className="flex items-center gap-1.5">
              {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSimAmount(amt)}
                  className={`flex-1 text-xs font-semibold py-1.5 px-1 rounded-lg border text-center transition-colors cursor-pointer ${
                    simAmount === amt
                      ? 'bg-primary-600 text-white border-primary-600 shadow-2xs'
                      : 'bg-bgSurface text-textSecondary border-border hover:bg-slate-100'
                  }`}
                >
                  ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Hypothetical Entry Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-textPrimary">
                Hypothetical Entry Price (₹)
              </label>
              <button
                type="button"
                onClick={() => setSimPrice(getInstrumentPrice(activeInstrument))}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold cursor-pointer flex items-center gap-1 hover:underline"
              >
                <span>Reset to CMP</span>
                <span className="text-[10px] text-textMuted font-normal">
                  ({formatINR(getInstrumentPrice(activeInstrument))})
                </span>
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-textMuted">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={simPrice || ''}
                onChange={(e) => setSimPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-2.5 text-sm font-semibold text-textPrimary bg-bgSurface border border-border rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                placeholder="Entry Price"
              />
            </div>
            <p className="text-[11px] text-textMuted">
              Current market price: <span className="font-semibold text-textSecondary">{formatINR(getInstrumentPrice(activeInstrument))}</span>
            </p>
          </div>

          {/* Holding Period Horizon */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-textPrimary">
              Holding Period Horizon
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['3M', '6M', '1Y', '3Y', '5Y'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSimHoldingPeriod(period)}
                  className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    simHoldingPeriod === period
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-bgSurface text-textSecondary border-border hover:bg-white hover:border-borderMd'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission Scenario */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-textPrimary">
              Transmission Scenario
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: 'conservative', label: 'Conservative', pct: '+5.0%/yr' },
                  { key: 'base', label: 'Base Case', pct: '+8.5%/yr' },
                  { key: 'optimistic', label: 'Optimistic', pct: '+12.5%/yr' },
                ] as const
              ).map(({ key, label, pct }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSimScenario(key)}
                  className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    simScenario === key
                      ? 'bg-primary-50 text-primary-900 border-primary-500 font-bold shadow-2xs ring-1 ring-primary-500'
                      : 'bg-bgSurface text-textSecondary border-border hover:bg-white hover:border-borderMd'
                  }`}
                >
                  <span className="text-xs leading-tight font-semibold">{label}</span>
                  <span className="text-[11px] text-primary-700 font-bold">{pct}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Result Dashboard */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted">
                Simulated Allocation
              </span>
              <p className="text-sm font-bold text-textPrimary">
                {simQuantity} {simQuantity === 1 ? 'unit' : 'units'} of {getInstrumentSymbol(activeInstrument)}
              </p>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted">
                Capital Required
              </span>
              <p className="text-sm font-bold text-textPrimary">
                {formatINR(simInvestedCapital)}
              </p>
            </div>
          </div>

          {/* Metrics Grid: 2 blocks on top, 2 blocks below */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Gross Projected</span>
              <p className="text-base font-extrabold text-textPrimary tabular-nums">
                {formatINR(projectedGrossValue)}
              </p>
              <span className="text-[11px] text-emerald-600 font-bold">
                +{formatINR(projectedGrossProfit)}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Estimated Charges</span>
              <p className="text-base font-extrabold text-amber-700 tabular-nums">
                {formatINR(totalCharges)}
              </p>
              <button
                type="button"
                onClick={() => setShowFeeDetails(!showFeeDetails)}
                className="text-[11px] text-primary-600 hover:text-primary-700 font-bold flex items-center gap-0.5 cursor-pointer mt-auto"
              >
                <span>{showFeeDetails ? 'Hide breakdown' : 'View breakdown'}</span>
                {showFeeDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Net Estimated Profit</span>
              <p className={`text-base font-extrabold tabular-nums ${projectedNetProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {projectedNetProfit >= 0 ? '+' : ''}{formatINR(projectedNetProfit)}
              </p>
              <span className="text-[10px] text-textMuted leading-tight">
                After all statutory fees
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Net Horizon Return</span>
              <p className="text-base font-extrabold text-primary-700 tabular-nums">
                {netReturnPct >= 0 ? '+' : ''}{netReturnPct.toFixed(1)}%
              </p>
              <span className="text-[10px] text-textMuted leading-tight">
                Over {simHoldingPeriod} holding period
              </span>
            </div>
          </div>

          {/* Expandable Statutory Fee Breakdown */}
          {showFeeDetails && feeOutput && (
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                  <Info size={13} className="text-primary-600" />
                  Estimated Statutory & Regulatory Charges
                </span>
                <span className="text-xs font-bold text-textPrimary">
                  Total: {formatINR(feeOutput.totalApplicable)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                {feeOutput.lines.map((line, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-50">
                    <span className="text-textSecondary">{line.label}</span>
                    <span className="font-semibold text-textPrimary">{formatINR(line.amount)}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-textMuted pt-1">
                Includes STT/CTT, Exchange turnover, SEBI charges, Stamp duty, and 18% GST per official Indian regulatory tariffs.
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 text-[11px] text-textMuted pt-1">
            <Info size={13} className="shrink-0 mt-0.5 text-textMuted" />
            <p>
              Disclaimer: Simulation results are based on hypothetical compounding scenarios and historical rate transmission patterns. Capital markets carry risk; actual post-event pricing fluctuates based on ongoing macro developments.
            </p>
          </div>
        </div>
      </section>

      {/* 06. Decide with AI */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md space-y-6">
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <BrainCircuit size={20} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              06. Decide with AI
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Review risks and evidence before choosing to research more, add to a watchlist or proceed to the normal order flow.
          </p>
        </div>

        {/* Evidence & Risk Synthesis Matrix: Stacked vertically (Evidences above, Risks below) */}
        <div className="flex flex-col gap-3.5">
          {/* Confirmed Catalysts */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Confirmed Evidence & Tailwinds
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed list-disc pl-4">
              <li>
                Official policy rate reduction lowers marginal borrowing costs across debt capital markets.
              </li>
              <li>
                High-quality balance sheets with strong credit ratings gain borrowing headroom.
              </li>
              <li>
                Yield curve adjustments provide secondary market capital appreciation for fixed coupon assets.
              </li>
            </ul>
          </div>

          {/* Inherent Caveats & Vulnerabilities */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldAlert size={14} /> Inherent Risks & Counter-Factors
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed list-disc pl-4">
              <li>
                Commercial bank transmission takes 1–2 quarters before lending rate cuts reach end consumers.
              </li>
              <li>
                Persistent inflation in food or crude oil may halt further easing cycles.
              </li>
              <li>
                Knee-jerk rally could already be fully priced into current secondary market multiples.
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Explicit Action Pathways */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Choose Your Next Action Pathway
          </span>

          <div className="flex flex-col gap-3.5">
            {/* Pathway 1: Research More */}
            <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen size={16} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-bold text-white">1. Research More</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Inspect balance sheets, debt-to-equity ratios, sector peers, and SEBI riskometer ratings.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-slate-700/60 hover:bg-slate-700 text-white border-slate-600 text-xs font-bold"
                onClick={() => {
                  if (activeInstrument) {
                    navigate(`/instrument/${activeInstrument.id}`);
                  }
                }}
              >
                Research Instrument
              </Button>
            </div>

            {/* Pathway 2: Add to Watchlist */}
            <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Star size={16} className={isInWatchlist ? 'fill-amber-400 text-amber-400' : ''} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-bold text-white">2. Add to Watchlist</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Monitor upcoming quarterly earnings, management commentary, and price movements over time.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={`w-full text-xs font-bold transition-colors ${
                  isInWatchlist
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                    : 'bg-slate-700/60 hover:bg-slate-700 text-white border-slate-600'
                }`}
                onClick={handleToggleWatchlist}
              >
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </Button>
            </div>

            {/* Pathway 3: Proceed to Normal Order Flow */}
            <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight size={16} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-bold text-white">3. Normal Order Flow</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Proceed to standard verified order ticket with mandatory risk checklist and statutory charges acknowledgment.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                onClick={() => {
                  if (activeInstrument) {
                    navigate(`/order/${activeInstrument.id}`);
                  }
                }}
              >
                Proceed to Order Ticket
              </Button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-2">
            Informed Consent Notice: No trades can ever be placed directly from news screens. Selecting order flow opens the standard ticket requiring explicit review.
          </p>
        </div>
      </section>

      {/* 7. Affected Instruments (NO impulsive Buy/Sell buttons!) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">
              7. Instruments Touched by This Event
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {affectedList.map(({ instrument, reason, caveat }) => (
            <div
              key={instrument.id}
              className="bg-white border border-border hover:border-primary-400 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xs transition-all"
            >
              {/* Badge row */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-bgSurface text-textSecondary px-2.5 py-0.5 rounded-full border border-border">
                  {instrument.assetClass}
                </span>
                <DemoBadge size="xs" />
              </div>

              {/* Title row - full width */}
              <h3 className="font-bold text-sm sm:text-base text-textPrimary leading-snug">
                {instrument.name}
              </h3>

              {/* Why affected */}
              <p className="text-xs sm:text-sm text-textPrimary leading-relaxed">
                <strong className="text-textSecondary font-semibold">Why affected: </strong>
                {reason}
              </p>

              {/* Caveat callout */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-0.5">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0 text-amber-600" /> Important Caveat:
                </span>
                <p className="text-[11px] text-amber-900/90 leading-relaxed pl-4">
                  {caveat}
                </p>
              </div>

              {/* View details CTA button - full width at bottom */}
              <div className="pt-1">
                <Link
                  to={`/instrument/${instrument.id}`}
                  className="w-full py-2.5 px-4 bg-bgSurface hover:bg-primary-50 text-textPrimary hover:text-primary-700 text-xs font-bold rounded-xl border border-borderMd hover:border-primary-300 transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Details & Financials</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Risks & What to Watch */}
      {event.risks && event.risks.length > 0 && (
        <section className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <ShieldAlert size={18} className="text-amber-600" />
            <span>8. Risks & Factors to Monitor Next</span>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-xs md:text-sm text-amber-950/90 leading-relaxed">
            {event.risks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 9. Sources & Attribution */}
      <footer className="bg-bgSurface border border-border rounded-xl p-4 space-y-2">
        <span className="text-[11px] font-bold text-textMuted uppercase tracking-wider">
          9. Sources & Reference Material
        </span>
        <div className="flex flex-wrap items-center gap-4 text-xs text-textSecondary">
          {event.sources.map((src, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span>{src.publisher}</span>
              <span className="text-textMuted">({formatDateIST(src.publishedAt)})</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-textMuted pt-1">
          Demo data only. All macroeconomic narratives are designed to teach analytical principles for a PM internship prototype.
        </p>
      </footer>
    </div>
  );
};
