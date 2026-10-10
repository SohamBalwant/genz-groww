import React, { useState, useMemo } from 'react';
import type { OptionContract, SimulatedOrder } from '../../types';
import { useApp } from '../../state/AppContext';
import { PayoffChart } from '../charts/PayoffChart';
import {
  getBreakeven,
  getMaxLoss,
  getMaxProfit,
  calculatePayoffPoints,
} from '../../lib/options/payoff';
import { Button } from '../ui/Button';
import { DemoBadge } from '../ui/DemoBadge';
import { formatINR } from '../../lib/format';
import { calculateCharges } from '../../lib/fees/calculateCharges';
import { DEMO_FEE_CONFIG } from '../../lib/fees/feeConfig';
import {
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  BookmarkPlus,
  Info,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export interface PaperTradingSimulatorProps {
  contract: OptionContract;
  underlyingTicker: string;
  underlyingId: string;
  spot: number;
  lotSize: number;
  expiry: string;
  onClose?: () => void;
}

export const PaperTradingSimulator: React.FC<PaperTradingSimulatorProps> = ({
  contract,
  underlyingTicker,
  underlyingId,
  spot,
  lotSize,
  expiry,
  onClose,
}) => {
  const { dispatch } = useApp();

  // Side: BUY (Long) vs SELL (Short)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  // Number of Lots
  const [lots, setLots] = useState<number>(1);
  // Entry Premium per share (defaults to contract.ltp)
  const [entryPremium, setEntryPremium] = useState<number>(contract.ltp);
  // Hypothetical Expiry Settlement Price Slider
  const [scenarioExpiryPrice, setScenarioExpiryPrice] = useState<number>(spot);
  // Save notification toast state
  const [savedOrder, setSavedOrder] = useState<SimulatedOrder | null>(null);

  const totalShares = lots * lotSize;
  const totalOutlay = Math.round(entryPremium * totalShares * 100) / 100;

  // Payoff calculations
  const breakeven = getBreakeven(contract.strike, entryPremium, contract.type, side);
  const maxLoss = getMaxLoss(entryPremium, lotSize, lots, side, contract.type, contract.strike);
  const maxProfit = getMaxProfit(contract.strike, entryPremium, lotSize, lots, contract.type, side);

  // Payoff Points for chart
  const minChartPrice = Math.round(spot * 0.85);
  const maxChartPrice = Math.round(spot * 1.15);
  const payoffPoints = useMemo(() => {
    return calculatePayoffPoints(
      contract.strike,
      entryPremium,
      lotSize,
      lots,
      contract.type,
      side,
      minChartPrice,
      maxChartPrice,
      35
    );
  }, [contract.strike, entryPremium, lotSize, lots, contract.type, side, minChartPrice, maxChartPrice]);

  // Current scenario PnL at expiry
  const currentPnl = useMemo(() => {
    let intrinsicValue = 0;
    if (contract.type === 'CE') {
      intrinsicValue = Math.max(0, scenarioExpiryPrice - contract.strike) * totalShares;
    } else {
      intrinsicValue = Math.max(0, contract.strike - scenarioExpiryPrice) * totalShares;
    }

    if (side === 'BUY') {
      return Math.round((intrinsicValue - totalOutlay) * 100) / 100;
    } else {
      return Math.round((totalOutlay - intrinsicValue) * 100) / 100;
    }
  }, [contract.type, contract.strike, scenarioExpiryPrice, totalShares, side, totalOutlay]);

  const pnlPercent =
    totalOutlay > 0 ? Math.round((currentPnl / totalOutlay) * 100 * 10) / 10 : 0;

  // Save as Simulated Paper Trade
  const handleSavePaperTrade = () => {
    const orderId = `paper-opt-${Date.now()}`;
    const newSimOrder: SimulatedOrder = {
      id: orderId,
      instrumentId: underlyingId,
      instrumentName: `${underlyingTicker} ${contract.strike} ${contract.type} (${expiry})`,
      assetClass: 'OPTION',
      side,
      product: 'OPTION',
      quantity: totalShares,
      lots,
      price: entryPremium,
      orderType: 'LIMIT',
      status: 'EXECUTED',
      timestamp: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      source: 'options',
      charges: calculateCharges(
        {
          assetClass: 'OPTION',
          product: 'OPTION',
          side,
          price: entryPremium,
          quantity: totalShares,
          exchange: 'NSE',
          premiumBased: true,
        },
        DEMO_FEE_CONFIG
      ),
    };

    dispatch({ type: 'ADD_SIMULATED_ORDER', payload: newSimOrder });
    setSavedOrder(newSimOrder);
  };

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-border shadow-xs space-y-5 select-none">
      {/* Header */}
      <div className="space-y-2 pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Paper-Trading Simulator
            </span>
            <DemoBadge size="xs" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-textSecondary bg-bgSurface px-2.5 py-1 rounded-full border border-border whitespace-nowrap shrink-0 font-medium">
            <Calendar size={12} className="text-primary-600" />
            <span>Expiry: <strong className="text-textPrimary font-bold">{expiry.replace(/-/g, ' ')}</strong></span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-textPrimary tracking-tight">
          Simulate Position: {underlyingTicker} {contract.strike} {contract.type}
        </h3>
        <p className="text-xs text-textSecondary leading-relaxed">
          Zero-risk simulation. Learn payoff curves, breakeven thresholds, and lot sizes before putting capital at risk.
        </p>
      </div>

      {/* Side Selector (BUY vs SELL) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-textPrimary">Position Side</span>
          {side === 'SELL' && (
            <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
              <AlertTriangle size={13} />
              <span>High-Risk Option Writing</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-bgSurface rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              side === 'BUY'
                ? 'bg-primary-600 text-white shadow-2xs'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <span>BUY ({contract.type === 'CE' ? 'Long Call' : 'Long Put'})</span>
          </button>

          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              side === 'SELL'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <span>SELL ({contract.type === 'CE' ? 'Short Call' : 'Short Put'})</span>
          </button>
        </div>

        {side === 'SELL' && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold">Short Option Risk Notice:</strong> Writing (selling) options exposes the trader to substantial, potentially unbounded losses if the market moves against the position. In live markets, exchanges mandate hefty margin deposits.
            </p>
          </div>
        )}
      </div>

      {/* Inputs: Lots & Entry Price */}
      <div className="space-y-3">
        {/* Card 1: Lots Stepper */}
        <div className="p-3.5 bg-bgSurface rounded-xl border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary">Number of Lots</span>
            <span className="text-textMuted font-medium text-[11px] bg-white px-2 py-0.5 rounded border border-border/80">
              1 Lot = {lotSize} shares
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={lots <= 1}
              onClick={() => setLots(Math.max(1, lots - 1))}
              className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-textPrimary hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
              aria-label="Decrease lots"
            >
              <Minus size={15} />
            </button>

            <div className="flex-1 text-center py-2 bg-white border border-border rounded-lg shadow-2xs">
              <span className="text-base font-extrabold text-textPrimary tabular-nums">
                {lots} {lots === 1 ? 'Lot' : 'Lots'}
              </span>
              <span className="text-[11px] text-textMuted block font-medium">
                ({totalShares} total units)
              </span>
            </div>

            <button
              type="button"
              disabled={lots >= 10}
              onClick={() => setLots(Math.min(10, lots + 1))}
              className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-textPrimary hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
              aria-label="Increase lots"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Card 2: Entry Price */}
        <div className="p-3.5 bg-bgSurface rounded-xl border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary">Entry Premium (Per Share)</span>
            <button
              type="button"
              onClick={() => setEntryPremium(contract.ltp)}
              className="text-[11px] text-primary-600 hover:underline font-semibold cursor-pointer"
            >
              Reset to LTP (₹{contract.ltp.toFixed(2)})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3 text-sm font-bold text-textMuted">₹</span>
              <input
                type="number"
                step="0.05"
                min="0.05"
                value={entryPremium}
                onChange={(e) => setEntryPremium(Math.max(0.05, parseFloat(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-2 bg-white border border-border rounded-lg text-sm font-extrabold text-textPrimary tabular-nums focus:outline-none focus:border-primary-500 shadow-2xs"
                aria-label="Entry premium per share"
              />
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border border-border text-right shrink-0 shadow-2xs">
              <span className="text-[10px] text-textMuted block font-medium">Market LTP</span>
              <span className="text-xs font-bold text-textSecondary tabular-nums">
                ₹{contract.ltp.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Distinction Card: Per Share vs Total Contract Premium */}
      <div className="p-3.5 bg-primary-50/70 rounded-xl border border-primary-200/80 space-y-2.5 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded-md bg-primary-100 text-primary-700 shrink-0 mt-0.5">
            <Info size={14} />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-primary-950 block">
              Per Share vs Total Outlay Distinction:
            </span>
            <p className="text-[11px] text-primary-900/90 leading-relaxed">
              Options trade on a per-share price (<strong className="font-semibold text-primary-950">₹{entryPremium.toFixed(2)}</strong>), but must be purchased in full lots (<strong className="font-semibold text-primary-950">{lotSize} shares/lot</strong>).
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 px-3 bg-white rounded-lg border border-primary-200 shadow-2xs">
          <div>
            <span className="text-[10px] text-textMuted uppercase font-bold tracking-wider block">
              Total Capital Outlay
            </span>
            <span className="text-[10px] text-textSecondary font-medium">
              {lots} lot{lots > 1 ? 's' : ''} ({totalShares} shares)
            </span>
          </div>
          <span className="font-black text-base sm:text-lg text-primary-800 tabular-nums">
            {formatINR(totalOutlay)}
          </span>
        </div>
      </div>

      {/* Hypothetical Expiry Settlement Price Slider */}
      <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Simulate Settlement Price At Expiry
            </span>
            <span className="text-sm font-black text-white tabular-nums">
              ₹{scenarioExpiryPrice.toLocaleString('en-IN')}{' '}
              <span className="text-xs text-slate-400 font-normal">
                ({scenarioExpiryPrice >= spot ? '+' : ''}
                {Math.round(((scenarioExpiryPrice - spot) / spot) * 100 * 10) / 10}%)
              </span>
            </span>
          </div>

          {/* Current PnL Pill */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Simulated Expiry P&L
            </span>
            <div
              className={`text-base sm:text-lg font-black tabular-nums ${
                currentPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {currentPnl >= 0 ? '+' : '−'}
              {formatINR(Math.abs(currentPnl))}{' '}
              <span className="text-xs font-bold">
                ({pnlPercent >= 0 ? '+' : ''}
                {pnlPercent}%)
              </span>
            </div>
          </div>
        </div>

        <input
          type="range"
          min={minChartPrice}
          max={maxChartPrice}
          step={lotSize <= 25 ? 10 : 2}
          value={scenarioExpiryPrice}
          onChange={(e) => setScenarioExpiryPrice(parseFloat(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
          aria-label="Simulate settlement price at expiry"
        />

        <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
          <span>Min (₹{minChartPrice})</span>
          <button
            type="button"
            onClick={() => setScenarioExpiryPrice(spot)}
            className="text-slate-300 hover:text-white underline font-semibold cursor-pointer"
          >
            Snap to Current Spot (₹{spot.toFixed(0)})
          </button>
          <span>Max (₹{maxChartPrice})</span>
        </div>
      </div>

      {/* Payoff Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs sm:text-sm text-textPrimary">
            Expiry Payoff Curve ({side} {contract.type})
          </h4>
          <span className="text-[11px] text-textMuted font-medium">
            {lots} Lot ({totalShares} units)
          </span>
        </div>

        <PayoffChart
          points={payoffPoints}
          strike={contract.strike}
          breakeven={breakeven}
          spot={spot}
          maxLoss={maxLoss}
          maxProfit={maxProfit}
          type={contract.type}
          side={side}
          currentScenarioPrice={scenarioExpiryPrice}
        />
      </div>

      {/* Save Simulation Action & Feedback Toast */}
      <div className="pt-3 border-t border-border space-y-2.5">
        <div className="flex items-center justify-end gap-2 w-full">
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold"
              onClick={onClose}
            >
              Close
            </Button>
          )}

          {savedOrder ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 animate-fadeIn">
              <CheckCircle2 size={16} />
              <span>Simulated Trade Saved! (View in Orders)</span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-bold flex-1 sm:flex-initial"
              onClick={handleSavePaperTrade}
            >
              <BookmarkPlus size={14} />
              <span>Save to Paper Portfolio</span>
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-textMuted">
          <ShieldCheck size={14} className="text-primary-600 shrink-0" />
          <span>Paper simulator. Real orders are never submitted.</span>
        </div>
      </div>
    </div>
  );
};
