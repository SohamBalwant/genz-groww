import React, { useState, useMemo, useCallback } from 'react';
import type { OptionContract } from '../../types';
import { calculateFromDte, type BlackScholesResult } from '../../lib/options/blackScholes';
import { Button } from '../ui/Button';
import { DemoBadge } from '../ui/DemoBadge';
import { formatINR } from '../../lib/format';
import {
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

interface PresetScenario {
  id: string;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  headline: string;
  headlineColor: string;
  description: string;
  spotShift: number;
  days: number;
  ivShift: number;
  accentBg: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'bull-rally',
    title: 'Bullish Rally',
    icon: TrendingUp,
    iconColor: 'text-emerald-600',
    headline: 'Spot Rallies +1.5%',
    headlineColor: 'text-emerald-700',
    description: 'Stock price jumps',
    spotShift: 1.5,
    days: 0,
    ivShift: 0,
    accentBg: 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs',
  },
  {
    id: 'market-pullback',
    title: 'Market Pullback',
    icon: TrendingDown,
    iconColor: 'text-red-600',
    headline: 'Spot Drops −1.5%',
    headlineColor: 'text-red-700',
    description: 'Stock price drops',
    spotShift: -1.5,
    days: 0,
    ivShift: 0,
    accentBg: 'bg-red-50/80 border-red-500 ring-1 ring-red-500 shadow-2xs',
  },
  {
    id: 'weekend-decay',
    title: 'Weekend Decay',
    icon: Clock,
    iconColor: 'text-amber-600',
    headline: '3 Days Pass',
    headlineColor: 'text-amber-700',
    description: 'Theta erodes premium',
    spotShift: 0,
    days: 3,
    ivShift: 0,
    accentBg: 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-500 shadow-2xs',
  },
  {
    id: 'vol-spike',
    title: 'Vol Spike',
    icon: Zap,
    iconColor: 'text-indigo-600',
    headline: 'IV Spikes +3%',
    headlineColor: 'text-indigo-700',
    description: 'Pre-news rush',
    spotShift: 0,
    days: 0,
    ivShift: 3,
    accentBg: 'bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-500 shadow-2xs',
  },
  {
    id: 'vol-crush',
    title: 'Vol Crush',
    icon: Zap,
    iconColor: 'text-slate-600',
    headline: 'IV Crushes −3%',
    headlineColor: 'text-slate-700',
    description: 'Post-event calm',
    spotShift: 0,
    days: 0,
    ivShift: -3,
    accentBg: 'bg-slate-100 border-slate-500 ring-1 ring-slate-500 shadow-2xs',
  },
];

export interface ScenarioExplorerProps {
  contract: OptionContract;
  underlyingTicker: string;
  spot: number;
  lotSize: number;
  dte: number;
  expiry: string;
  onOpenSimulator?: () => void;
}

export const ScenarioExplorer: React.FC<ScenarioExplorerProps> = ({
  contract,
  underlyingTicker,
  spot,
  lotSize,
  dte,
  expiry,
  onOpenSimulator,
}) => {
  // Scenario state: shifts relative to base
  // 1. Spot change in percentage (-5% to +5%)
  const [spotShiftPct, setSpotShiftPct] = useState<number>(0);
  // 2. Days passed (0 up to dte)
  const [daysPassed, setDaysPassed] = useState<number>(0);
  // 3. IV shift in percentage points (-8% to +8%)
  const [ivShiftPct, setIvShiftPct] = useState<number>(0);

  // Carousel swipe state for One-Click Market Scenarios
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState<boolean>(false);

  const totalScenarios = PRESET_SCENARIOS.length;
  const safeScenarioIndex = Math.min(Math.max(0, scenarioIndex), totalScenarios - 1);
  const hasLeft = safeScenarioIndex > 0;
  const hasRight = safeScenarioIndex < totalScenarios - 1;

  const handlePrev = useCallback(() => {
    setScenarioIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setScenarioIndex((prev) => Math.min(totalScenarios - 1, prev + 1));
  }, [totalScenarios]);

  // Touch Handlers for horizontal swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setTouchDeltaX(0);
    setIsSwiping(false);
    setIsHorizontalSwipe(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;

    if (!isHorizontalSwipe && !isSwiping) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        setIsHorizontalSwipe(true);
        setIsSwiping(true);
      } else if (Math.abs(deltaY) > 8) {
        return;
      }
    }

    if (isHorizontalSwipe) {
      if ((safeScenarioIndex === 0 && deltaX > 0) || (safeScenarioIndex === totalScenarios - 1 && deltaX < 0)) {
        setTouchDeltaX(deltaX * 0.25);
      } else {
        setTouchDeltaX(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe && touchStartX !== null) {
      const threshold = 40;
      if (touchDeltaX < -threshold && hasRight) {
        handleNext();
      } else if (touchDeltaX > threshold && hasLeft) {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchDeltaX(0);
    setIsSwiping(false);
    setIsHorizontalSwipe(false);
  };

  const baseIv = contract.iv ?? 15.0;

  // Calculate base model result
  const baseResult: BlackScholesResult = useMemo(() => {
    return calculateFromDte(spot, contract.strike, dte, baseIv, contract.type);
  }, [spot, contract.strike, dte, baseIv, contract.type]);

  // Calculate scenario model result
  const scenarioResult: BlackScholesResult = useMemo(() => {
    const scenarioSpot = spot * (1 + spotShiftPct / 100);
    const scenarioDte = Math.max(0, dte - daysPassed);
    const scenarioIv = Math.max(2, baseIv + ivShiftPct);
    return calculateFromDte(scenarioSpot, contract.strike, scenarioDte, scenarioIv, contract.type);
  }, [spot, spotShiftPct, dte, daysPassed, baseIv, ivShiftPct, contract.strike, contract.type]);

  // Difference metrics
  const newSpot = Math.round(spot * (1 + spotShiftPct / 100) * 100) / 100;
  const spotDiff = Math.round((newSpot - spot) * 100) / 100;
  const priceDiff = Math.round((scenarioResult.price - baseResult.price) * 100) / 100;
  const priceDiffPct =
    baseResult.price > 0 ? Math.round((priceDiff / baseResult.price) * 100 * 10) / 10 : 0;

  const lotPnl = Math.round(priceDiff * lotSize * 100) / 100;

  // Reset to initial baseline
  const handleReset = () => {
    setSpotShiftPct(0);
    setDaysPassed(0);
    setIvShiftPct(0);
  };

  const hasChanges = spotShiftPct !== 0 || daysPassed !== 0 || ivShiftPct !== 0;

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-border shadow-xs space-y-5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Interactive Scenario Explorer
            </span>
            <DemoBadge size="xs" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-textPrimary tracking-tight mt-1">
            What-If Simulator: {underlyingTicker} {contract.strike} {contract.type} ({expiry.replace(/-/g, ' ')})
          </h3>
          <p className="text-xs text-textSecondary mt-0.5">
            Simulate how market moves, passing days, and volatility shocks alter this option's premium and Greeks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {hasChanges && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-xs text-textMuted hover:text-textPrimary"
            >
              <RotateCcw size={12} />
              <span>Reset Scenario</span>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Scenario Preset Swiping Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-textMuted uppercase tracking-wider block">
            One-Click Market Scenarios:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-textMuted hidden sm:inline">
              Click to test realistic market conditions
            </span>
            <div
              aria-label={`Scenario ${safeScenarioIndex + 1} of ${totalScenarios}`}
              className="flex items-center gap-1 bg-slate-900/80 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
            >
              <span>{safeScenarioIndex + 1}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-300 font-semibold">{totalScenarios}</span>
            </div>
          </div>
        </div>

        {/* Swipeable Carousel Container */}
        <div className="relative">
          {/* Left Direction Icon: Shown ONLY when there are items to the left */}
          {hasLeft && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous market scenario"
              title="Previous market scenario"
              className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-primary-600 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
            >
              <ChevronLeft
                size={16}
                className="stroke-[2.5] -translate-x-0.5 group-hover:-translate-x-1 transition-transform"
              />
            </button>
          )}

          {/* Viewport: Exactly ONE scenario visible at a time */}
          <div
            className="w-full overflow-hidden rounded-2xl select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex items-start"
              style={{
                transform: `translateX(calc(-${safeScenarioIndex * 100}% + ${touchDeltaX}px))`,
                transition: isSwiping ? 'none' : 'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              {PRESET_SCENARIOS.map((preset) => {
                const IconComponent = preset.icon;
                const isActive =
                  spotShiftPct === preset.spotShift &&
                  daysPassed === preset.days &&
                  ivShiftPct === preset.ivShift;

                return (
                  <div key={preset.id} className="w-full shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSpotShiftPct(preset.spotShift);
                        setDaysPassed(preset.days);
                        setIvShiftPct(preset.ivShift);
                      }}
                      className={`w-full p-3.5 px-9 sm:px-12 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs ${
                        isActive
                          ? preset.accentBg
                          : 'bg-white border-border hover:bg-slate-50/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-bgSurface border border-border/80 ${preset.iconColor}`}>
                            <IconComponent size={15} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-textPrimary block">
                              {preset.title}
                            </span>
                            <span className="text-[10px] text-textMuted block">
                              {preset.description}
                            </span>
                          </div>
                        </div>

                        {isActive ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                            <Check size={12} className="stroke-[3]" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-textMuted bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full border border-slate-200">
                            Click to apply
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-border/60">
                        <span className={`text-xs sm:text-sm font-extrabold ${preset.headlineColor}`}>
                          {preset.headline}
                        </span>
                        <span className="text-[10px] text-textMuted font-medium">
                          Shift: {preset.spotShift > 0 ? `+${preset.spotShift}%` : preset.spotShift < 0 ? `${preset.spotShift}%` : '0%'} spot • {preset.days}d • {preset.ivShift > 0 ? `+${preset.ivShift}%` : preset.ivShift < 0 ? `${preset.ivShift}%` : '0%'} IV
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Direction Icon: Shown ONLY when there are items to the right */}
          {hasRight && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next market scenario"
              title="Next market scenario"
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-primary-600 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
            >
              <ChevronRight
                size={16}
                className="stroke-[2.5] translate-x-0.5 group-hover:translate-x-1 transition-transform"
              />
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5" role="tablist" aria-label="Market scenario slides">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              role="tab"
              aria-selected={idx === safeScenarioIndex}
              aria-label={`Go to ${preset.title}`}
              onClick={() => setScenarioIndex(idx)}
              className={`transition-all duration-200 cursor-pointer ${
                idx === safeScenarioIndex
                  ? 'w-5 h-1.5 bg-primary-600 rounded-full shadow-2xs'
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Controls Sliders (Dedicated spacious cards per parameter) */}
      <div className="space-y-3 p-3.5 bg-bgSurface rounded-2xl border border-border">
        {/* 1. Underlying Spot Price Slider */}
        <div className="p-3.5 bg-white rounded-xl border border-border shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary flex items-center gap-1.5">
              <TrendingUp size={14} className="text-primary-600" />
              <span>Underlying Spot Price</span>
            </span>
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="font-extrabold text-sm text-textPrimary">
                ₹{newSpot.toLocaleString('en-IN')}
              </span>
              <span
                className={`text-xs font-bold ${
                  spotShiftPct > 0 ? 'text-gain' : spotShiftPct < 0 ? 'text-loss' : 'text-textMuted'
                }`}
              >
                ({spotDiff >= 0 ? '+' : ''}₹{spotDiff.toFixed(2)}, {spotShiftPct > 0 ? '+' : ''}
                {spotShiftPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={spotShiftPct}
            onChange={(e) => setSpotShiftPct(parseFloat(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            aria-label="Adjust underlying spot price percentage"
          />

          <div className="flex justify-between text-[11px] text-textMuted font-medium pt-0.5">
            <span>−5% (₹{(spot * 0.95).toFixed(0)})</span>
            <span className="font-bold text-textSecondary">Base: ₹{spot.toFixed(0)}</span>
            <span>+5% (₹{(spot * 1.05).toFixed(0)})</span>
          </div>
        </div>

        {/* 2. Days Passed Slider */}
        <div className="p-3.5 bg-white rounded-xl border border-border shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary flex items-center gap-1.5">
              <Clock size={14} className="text-amber-600" />
              <span>Time Passed (Days Elapsed)</span>
            </span>
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="font-extrabold text-sm text-textPrimary">
                +{daysPassed} days elapsed
              </span>
              <span className="text-xs text-textMuted font-medium">
                ({Math.max(0, dte - daysPassed)} DTE left)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max={dte}
            step="1"
            value={daysPassed}
            onChange={(e) => setDaysPassed(parseInt(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            aria-label="Adjust days elapsed toward expiry"
          />

          <div className="flex justify-between text-[11px] text-textMuted font-medium pt-0.5">
            <span>Today (0d)</span>
            <span className="font-bold text-textSecondary">+{Math.round(dte / 2)}d</span>
            <span>At Expiry ({dte}d)</span>
          </div>
        </div>

        {/* 3. Implied Volatility Shift Slider */}
        <div className="p-3.5 bg-white rounded-xl border border-border shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary flex items-center gap-1.5">
              <Zap size={14} className="text-indigo-600" />
              <span>Implied Volatility (IV)</span>
            </span>
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="font-extrabold text-sm text-textPrimary">
                {(baseIv + ivShiftPct).toFixed(1)}%
              </span>
              <span
                className={`text-xs font-bold ${
                  ivShiftPct > 0 ? 'text-indigo-600' : ivShiftPct < 0 ? 'text-rose-600' : 'text-textMuted'
                }`}
              >
                ({ivShiftPct > 0 ? '+' : ''}{ivShiftPct.toFixed(1)}% IV)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="-8"
            max="8"
            step="1"
            value={ivShiftPct}
            onChange={(e) => setIvShiftPct(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            aria-label="Adjust implied volatility percentage"
          />

          <div className="flex justify-between text-[11px] text-textMuted font-medium pt-0.5">
            <span>−8% IV shock</span>
            <span className="font-bold text-textSecondary">Base: {baseIv}%</span>
            <span>+8% IV spike</span>
          </div>
        </div>
      </div>

      {/* Real-Time Scenario Results Display (Stacked vertically: one below one) */}
      <div className="flex flex-col gap-3">
        {/* Estimated Price Card */}
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
              Projected Premium (Per Share)
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                priceDiff >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {priceDiff >= 0 ? '+' : ''}₹{priceDiff.toFixed(2)} ({priceDiffPct > 0 ? '+' : ''}
              {priceDiffPct}%)
            </span>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight">
              ₹{scenarioResult.price.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              (from baseline ₹{baseResult.price.toFixed(2)})
            </span>
          </div>
        </div>

        {/* 1 Lot PnL Card */}
        <div className="p-3.5 bg-white border border-border rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] text-textMuted uppercase tracking-wider font-bold">
              Estimated Impact per 1 Lot ({lotSize} shares)
            </span>
            <span className="text-xs text-textSecondary font-medium">
              Initial Lot Outlay: {formatINR(baseResult.price * lotSize)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${
                lotPnl >= 0 ? 'text-gain' : 'text-loss'
              }`}
            >
              {lotPnl >= 0 ? '+' : '−'}
              {formatINR(Math.abs(lotPnl))}
            </span>
            <span className="text-xs text-textMuted font-medium">
              net projected P&amp;L
            </span>
          </div>
        </div>

        {/* Updated Greeks Card */}
        <div className="p-3.5 bg-bgSurface border border-border rounded-2xl shadow-2xs space-y-2">
          <span className="text-[11px] text-textMuted uppercase tracking-wider block font-bold">
            Scenario Greeks Snapshot
          </span>
          <div className="grid grid-cols-3 gap-2 pt-0.5 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-border shadow-2xs">
              <span className="text-[10px] text-textMuted font-semibold block">Delta (Δ)</span>
              <span className="font-extrabold text-sm tabular-nums mt-0.5 block">
                {scenarioResult.delta > 0 ? '+' : ''}
                {scenarioResult.delta.toFixed(2)}
              </span>
              <span className="text-[9px] text-textMuted block mt-0.5">₹1 stock move</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-border shadow-2xs">
              <span className="text-[10px] text-textMuted font-semibold block">Theta (Θ)</span>
              <span className="font-extrabold text-sm tabular-nums text-loss mt-0.5 block">
                {scenarioResult.theta.toFixed(1)}
              </span>
              <span className="text-[9px] text-textMuted block mt-0.5">₹ / day decay</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-border shadow-2xs">
              <span className="text-[10px] text-textMuted font-semibold block">Vega (ν)</span>
              <span className="font-extrabold text-sm tabular-nums text-indigo-700 mt-0.5 block">
                {scenarioResult.vega.toFixed(1)}
              </span>
              <span className="text-[9px] text-textMuted block mt-0.5">1% IV shift</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Link Button */}
      {onOpenSimulator && (
        <div className="flex justify-end pt-1">
          <Button
            variant="primary"
            size="sm"
            className="text-xs font-bold"
            onClick={onOpenSimulator}
          >
            <span>Test Position in Paper-Trading Simulator</span>
            <ArrowRight size={13} />
          </Button>
        </div>
      )}
    </div>
  );
};
