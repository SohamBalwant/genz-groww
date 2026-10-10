import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

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
          <h3 className="text-base sm:text-lg font-bold text-textPrimary tracking-tight mt-0.5">
            What-If Simulator: {underlyingTicker} {contract.strike} {contract.type} ({expiry})
          </h3>
          <p className="text-xs text-textSecondary">
            Simulate how market moves, passing days, and volatility shocks alter this option's premium and Greeks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
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

      {/* Quick Scenario Preset Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-textMuted uppercase tracking-wider block">
          One-Click Market Scenarios:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => {
              setSpotShiftPct(1.5);
              setDaysPassed(0);
              setIvShiftPct(0);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <TrendingUp size={13} />
            <span>Spot Rallies +1.5%</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSpotShiftPct(-1.5);
              setDaysPassed(0);
              setIvShiftPct(0);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <TrendingDown size={13} />
            <span>Spot Drops −1.5%</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSpotShiftPct(0);
              setDaysPassed(3);
              setIvShiftPct(0);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Clock size={13} />
            <span>3 Days Pass</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSpotShiftPct(0);
              setDaysPassed(0);
              setIvShiftPct(3);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Zap size={13} />
            <span>IV Spikes +3%</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSpotShiftPct(0);
              setDaysPassed(0);
              setIvShiftPct(-3);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Zap size={13} />
            <span>IV Crushes −3%</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-3.5 bg-bgSurface rounded-xl border border-border">
        {/* 1. Underlying Spot Price Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary flex items-center gap-1">
              <TrendingUp size={13} className="text-primary-600" />
              <span>Underlying Price</span>
            </span>
            <span className="font-extrabold text-textPrimary tabular-nums">
              ₹{newSpot.toLocaleString('en-IN')}{' '}
              <span
                className={`text-[11px] ${
                  spotShiftPct > 0 ? 'text-gain' : spotShiftPct < 0 ? 'text-loss' : 'text-textMuted'
                }`}
              >
                ({spotDiff >= 0 ? '+' : ''}₹{spotDiff.toFixed(2)}, {spotShiftPct > 0 ? '+' : ''}
                {spotShiftPct.toFixed(1)}%)
              </span>
            </span>
          </div>

          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={spotShiftPct}
            onChange={(e) => setSpotShiftPct(parseFloat(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
            aria-label="Adjust underlying spot price percentage"
          />

          <div className="flex justify-between text-[10px] text-textMuted">
            <span>−5% (₹{(spot * 0.95).toFixed(0)})</span>
            <span>Base (₹{spot.toFixed(0)})</span>
            <span>+5% (₹{(spot * 1.05).toFixed(0)})</span>
          </div>
        </div>

        {/* 2. Days Passed Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary flex items-center gap-1">
              <Clock size={13} className="text-amber-600" />
              <span>Time Passed</span>
            </span>
            <span className="font-extrabold text-textPrimary tabular-nums">
              +{daysPassed} days{' '}
              <span className="text-[11px] text-textMuted">
                ({Math.max(0, dte - daysPassed)} DTE left)
              </span>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={dte}
            step="1"
            value={daysPassed}
            onChange={(e) => setDaysPassed(parseInt(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
            aria-label="Adjust days elapsed toward expiry"
          />

          <div className="flex justify-between text-[10px] text-textMuted">
            <span>Today (0d)</span>
            <span>+{Math.round(dte / 2)}d</span>
            <span>At Expiry ({dte}d)</span>
          </div>
        </div>

        {/* 3. Implied Volatility Shift Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary flex items-center gap-1">
              <Zap size={13} className="text-indigo-600" />
              <span>Implied Volatility</span>
            </span>
            <span className="font-extrabold text-textPrimary tabular-nums">
              {(baseIv + ivShiftPct).toFixed(1)}%{' '}
              <span
                className={`text-[11px] ${
                  ivShiftPct > 0 ? 'text-indigo-600' : ivShiftPct < 0 ? 'text-rose-600' : 'text-textMuted'
                }`}
              >
                ({ivShiftPct > 0 ? '+' : ''}
                {ivShiftPct.toFixed(1)}% IV)
              </span>
            </span>
          </div>

          <input
            type="range"
            min="-8"
            max="8"
            step="1"
            value={ivShiftPct}
            onChange={(e) => setIvShiftPct(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
            aria-label="Adjust implied volatility percentage"
          />

          <div className="flex justify-between text-[10px] text-textMuted">
            <span>−8% IV</span>
            <span>Base ({baseIv}%)</span>
            <span>+8% IV</span>
          </div>
        </div>
      </div>

      {/* Real-Time Scenario Results Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Estimated Price Card */}
        <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            Projected Premium (Per Share)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tabular-nums">
              ₹{scenarioResult.price.toFixed(2)}
            </span>
            <span className="text-xs text-slate-300">
              (from ₹{baseResult.price.toFixed(2)})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold pt-1">
            <span
              className={`px-2 py-0.5 rounded ${
                priceDiff >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {priceDiff >= 0 ? '+' : ''}₹{priceDiff.toFixed(2)} ({priceDiffPct > 0 ? '+' : ''}
              {priceDiffPct}%)
            </span>
          </div>
        </div>

        {/* 1 Lot PnL Card */}
        <div className="p-3.5 bg-white border border-border rounded-xl space-y-1">
          <span className="text-[10px] text-textMuted uppercase tracking-wider block font-semibold">
            Estimated Impact per 1 Lot ({lotSize} shares)
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-black tabular-nums ${
                lotPnl >= 0 ? 'text-gain' : 'text-loss'
              }`}
            >
              {lotPnl >= 0 ? '+' : '−'}
              {formatINR(Math.abs(lotPnl))}
            </span>
          </div>
          <span className="text-xs text-textSecondary block">
            Initial Lot Outlay: {formatINR(baseResult.price * lotSize)}
          </span>
        </div>

        {/* Updated Greeks Card */}
        <div className="p-3.5 bg-bgSurface border border-border rounded-xl space-y-1">
          <span className="text-[10px] text-textMuted uppercase tracking-wider block font-semibold">
            Scenario Greeks Snapshot
          </span>
          <div className="grid grid-cols-3 gap-1 pt-0.5 text-center text-xs">
            <div className="p-1 rounded bg-white border border-border">
              <span className="text-[9px] text-textMuted block">Delta (Δ)</span>
              <span className="font-bold tabular-nums">
                {scenarioResult.delta > 0 ? '+' : ''}
                {scenarioResult.delta.toFixed(2)}
              </span>
            </div>
            <div className="p-1 rounded bg-white border border-border">
              <span className="text-[9px] text-textMuted block">Theta (Θ)</span>
              <span className="font-bold tabular-nums text-loss">
                {scenarioResult.theta.toFixed(1)}
              </span>
            </div>
            <div className="p-1 rounded bg-white border border-border">
              <span className="text-[9px] text-textMuted block">Vega (ν)</span>
              <span className="font-bold tabular-nums text-indigo-700">
                {scenarioResult.vega.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
        <ShieldAlert size={15} className="text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold">Educational Modeling Disclosure:</strong> Projected values are calculated using the European Black-Scholes formula with static interest rates. Real market prices fluctuate with changing bid-ask liquidity, volatility skew, and execution slippage.
        </p>
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
