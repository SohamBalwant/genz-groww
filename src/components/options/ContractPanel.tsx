import React, { useState } from 'react';
import type { OptionContract } from '../../types';
import { Sheet } from '../ui/Sheet';
import { DemoBadge } from '../ui/DemoBadge';
import { PayoffChart } from '../charts/PayoffChart';
import { GreeksExplorationModal } from './GreeksExplorationModal';
import { ScenarioExplorer } from './ScenarioExplorer';
import { PaperTradingSimulator } from './PaperTradingSimulator';
import { getMoneyness, getMoneynessLabel, getMoneynessBadgeClass } from '../../lib/options/moneyness';
import { getBreakeven, getMaxLoss, longCallPayoff, longPutPayoff } from '../../lib/options/payoff';
import { formatINR } from '../../lib/format';
import {
  Sparkles,
  BarChart2,
  Compass,
} from 'lucide-react';

interface ContractPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contract: OptionContract | null;
  underlyingTicker: string;
  underlyingId: string;
  spot: number;
  lotSize: number;
  expiry: string;
  dte?: number;
}

export const ContractPanel: React.FC<ContractPanelProps> = ({
  isOpen,
  onClose,
  contract,
  underlyingTicker,
  underlyingId,
  spot,
  lotSize,
  expiry,
  dte = 12,
}) => {
  const [showGreeksModal, setShowGreeksModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'simulator'>('overview');

  if (!contract) return null;

  const isNearestStrike = Math.abs(contract.strike - spot) <= 5;
  const moneyness = getMoneyness(contract.strike, spot, contract.type, isNearestStrike);
  const breakeven = getBreakeven(contract.strike, contract.ltp, contract.type);
  const maxLoss = getMaxLoss(contract.ltp, lotSize, 1);
  const totalPremium = contract.ltp * lotSize;

  const payoffPoints =
    contract.type === 'CE'
      ? longCallPayoff(contract.strike, contract.ltp, lotSize, 1, spot * 0.85, spot * 1.15, 25)
      : longPutPayoff(contract.strike, contract.ltp, lotSize, 1, spot * 0.85, spot * 1.15, 25);

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={onClose}
        maxHeight="max-h-[92vh]"
        title={
          <div className="flex items-center gap-2">
            <span>{`${underlyingTicker} ${contract.strike} ${contract.type}`}</span>
            <span className="text-xs font-normal text-textMuted">({expiry})</span>
            <DemoBadge size="xs" />
          </div>
        }
      >
        <div className="space-y-4 text-textPrimary pb-4">
          {/* Subheader Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-bgSurface rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Overview & Payoff
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scenarios')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'scenarios'
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Compass size={13} />
              <span>Explore Scenarios</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <BarChart2 size={13} />
              <span>Paper Simulator</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Top Summary Card */}
              <div className="p-3.5 bg-white rounded-2xl border border-border shadow-2xs space-y-3">
                {/* Upper tier: Premium & Moneyness */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] text-textMuted uppercase tracking-wider block font-bold">
                      Option Premium (LTP)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-black text-textPrimary tabular-nums tracking-tight">
                        ₹{contract.ltp.toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          contract.changePct >= 0 ? 'text-gain' : 'text-loss'
                        }`}
                      >
                        {contract.changePct >= 0 ? '+' : ''}
                        {contract.changePct}%
                      </span>
                      <span className="text-xs text-textMuted font-medium">/ share</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap shadow-2xs ${getMoneynessBadgeClass(
                        moneyness
                      )}`}
                    >
                      {getMoneynessLabel(moneyness)}
                    </span>
                    <span className="text-[11px] text-textMuted font-medium mt-1 tabular-nums whitespace-nowrap">
                      Spot: ₹{spot.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Lower tier: Lot Size & Total Outlay */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-textSecondary">
                  <span className="text-textMuted font-medium">
                    1 Lot = <strong className="text-textPrimary font-bold">{lotSize} shares</strong>
                  </span>
                  <span className="text-textMuted font-medium">
                    Total Outlay: <strong className="text-textPrimary font-black tabular-nums">{formatINR(totalPremium)}</strong>
                  </span>
                </div>
              </div>

              {/* Market Metrics Strip (IV, OI, Volume, Bid/Ask) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-border">
                  <span className="text-[10px] text-textMuted block font-semibold">Implied Volatility</span>
                  <span className="font-extrabold text-sm text-indigo-700 tabular-nums">
                    {contract.iv ? `${contract.iv}%` : '14.5%'}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-border">
                  <span className="text-[10px] text-textMuted block font-semibold">Open Interest</span>
                  <span className="font-extrabold text-sm text-textPrimary tabular-nums">
                    {contract.oi.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-border">
                  <span className="text-[10px] text-textMuted block font-semibold">Volume (Contracts)</span>
                  <span className="font-extrabold text-sm text-textPrimary tabular-nums">
                    {contract.volume.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-border">
                  <span className="text-[10px] text-textMuted block font-semibold">Bid / Ask Spread</span>
                  <span className="font-bold text-xs text-textPrimary tabular-nums">
                    ₹{contract.bid?.toFixed(2) ?? (contract.ltp - 0.2).toFixed(2)} / ₹
                    {contract.ask?.toFixed(2) ?? (contract.ltp + 0.2).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Option Greeks Grid with "View Greeks" Action */}
              <div className="p-3.5 bg-white rounded-xl border border-border space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary-600" />
                    <span className="font-bold text-textPrimary">Option Greeks Snapshot</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGreeksModal(true)}
                    className="text-[11px] font-bold text-primary-600 hover:underline cursor-pointer"
                  >
                    View All Greeks & Explanations →
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center pt-1 border-t border-border">
                  <div className="p-2 bg-bgSurface rounded-lg">
                    <span className="text-[10px] text-textMuted block">Delta (Δ)</span>
                    <span
                      className={`font-extrabold text-sm tabular-nums ${
                        contract.delta > 0 ? 'text-gain' : 'text-loss'
                      }`}
                    >
                      {contract.delta > 0 ? '+' : ''}
                      {contract.delta.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-textMuted block mt-0.5">₹1 stock move</span>
                  </div>

                  <div className="p-2 bg-bgSurface rounded-lg">
                    <span className="text-[10px] text-textMuted block">Gamma (Γ)</span>
                    <span className="font-extrabold text-sm text-textPrimary tabular-nums">
                      {contract.gamma.toFixed(4)}
                    </span>
                    <span className="text-[9px] text-textMuted block mt-0.5">Acceleration</span>
                  </div>

                  <div className="p-2 bg-bgSurface rounded-lg">
                    <span className="text-[10px] text-textMuted block">Theta (Θ)</span>
                    <span className="font-extrabold text-sm text-loss tabular-nums">
                      {contract.theta.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-textMuted block mt-0.5">₹ / day decay</span>
                  </div>

                  <div className="p-2 bg-bgSurface rounded-lg">
                    <span className="text-[10px] text-textMuted block">Vega (ν)</span>
                    <span className="font-extrabold text-sm text-indigo-700 tabular-nums">
                      +{contract.vega?.toFixed(1) ?? '12.4'}
                    </span>
                    <span className="text-[9px] text-textMuted block mt-0.5">1% IV shift</span>
                  </div>
                </div>
              </div>

              {/* Payoff at Expiration Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-textPrimary">
                    Payoff at Expiration ({contract.type === 'CE' ? 'Long Call' : 'Long Put'})
                  </h4>
                  <span className="text-xs text-textMuted">Per 1 Lot ({lotSize} units)</span>
                </div>

                <PayoffChart
                  points={payoffPoints}
                  strike={contract.strike}
                  breakeven={breakeven}
                  spot={spot}
                  maxLoss={maxLoss}
                  type={contract.type}
                />
              </div>
            </div>
          )}

          {/* TAB 2: SCENARIOS */}
          {activeTab === 'scenarios' && (
            <ScenarioExplorer
              contract={contract}
              underlyingTicker={underlyingTicker}
              spot={spot}
              lotSize={lotSize}
              dte={dte}
              expiry={expiry}
              onOpenSimulator={() => setActiveTab('simulator')}
            />
          )}

          {/* TAB 3: SIMULATOR */}
          {activeTab === 'simulator' && (
            <PaperTradingSimulator
              contract={contract}
              underlyingTicker={underlyingTicker}
              underlyingId={underlyingId}
              spot={spot}
              lotSize={lotSize}
              expiry={expiry}
              onClose={onClose}
            />
          )}
        </div>
      </Sheet>

      {/* Greeks Explorer Modal */}
      <GreeksExplorationModal
        isOpen={showGreeksModal}
        onClose={() => setShowGreeksModal(false)}
        contract={contract}
        underlyingTicker={underlyingTicker}
        underlyingPrice={spot}
        expiry={expiry}
        onOpenSimulator={() => setActiveTab('simulator')}
        onOpenScenarios={() => setActiveTab('scenarios')}
      />
    </>
  );
};
