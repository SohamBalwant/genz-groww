import React, { useState } from 'react';
import type { OptionContract } from '../../types';
import { GreekCard } from './GreekCard';
import { DemoBadge } from '../ui/DemoBadge';
import { X } from 'lucide-react';

export interface GreeksExplorationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: OptionContract;
  underlyingTicker: string;
  underlyingPrice: number;
  expiry: string;
  onOpenSimulator?: () => void;
  onOpenScenarios?: () => void;
}

export const GreeksExplorationModal: React.FC<GreeksExplorationModalProps> = ({
  isOpen,
  onClose,
  contract,
  underlyingTicker,
  underlyingPrice,
  expiry,
}) => {
  const [selectedGreekTab, setSelectedGreekTab] = useState<'all' | 'delta' | 'gamma' | 'theta' | 'vega' | 'rho'>('all');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Option Greeks Deep Dive"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center overflow-hidden"
    >
      <div className="bg-white rounded-t-3xl w-full p-4 sm:p-5 space-y-4 shadow-2xl border-t border-border animate-in slide-in-from-bottom-6 duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                Option Greeks Terminal
              </span>
              <DemoBadge size="xs" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-textPrimary leading-snug">
              {underlyingTicker} {contract.strike} {contract.type} ({expiry})
            </h3>
            <p className="text-xs text-textSecondary">
              Greeks measure how your option premium is expected to react to price, time, and volatility changes.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-textMuted hover:text-textPrimary hover:bg-slate-100 transition-colors"
            aria-label="Close Greeks explorer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Contract Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-bgSurface rounded-xl border border-border text-xs">
          <div>
            <span className="text-[10px] text-textMuted block">Option Premium (LTP)</span>
            <span className="font-bold text-sm text-textPrimary tabular-nums">
              ₹{contract.ltp.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-textMuted block">Underlying Spot</span>
            <span className="font-bold text-sm text-textPrimary tabular-nums">
              ₹{underlyingPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-textMuted block">Implied Volatility</span>
            <span className="font-bold text-sm text-indigo-600 tabular-nums">
              {contract.iv ? `${contract.iv}%` : '15.0%'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-textMuted block">Moneyness</span>
            <span className="font-bold text-sm text-primary-700">
              {contract.type === 'CE'
                ? contract.strike < underlyingPrice
                  ? 'In the Money (ITM)'
                  : contract.strike === underlyingPrice
                  ? 'At the Money (ATM)'
                  : 'Out of the Money (OTM)'
                : contract.strike > underlyingPrice
                ? 'In the Money (ITM)'
                : contract.strike === underlyingPrice
                ? 'At the Money (ATM)'
                : 'Out of the Money (OTM)'}
            </span>
          </div>
        </div>

        {/* Greek Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-border pb-2">
          {(
            [
              { id: 'all', label: 'All 5 Greeks' },
              { id: 'delta', label: 'Delta (Δ)' },
              { id: 'gamma', label: 'Gamma (Γ)' },
              { id: 'theta', label: 'Theta (Θ)' },
              { id: 'vega', label: 'Vega (ν)' },
              { id: 'rho', label: 'Rho (ρ)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedGreekTab(tab.id)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedGreekTab === tab.id
                  ? 'bg-primary-600 text-white font-bold shadow-2xs'
                  : 'bg-bgSurface text-textSecondary hover:bg-slate-100 border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Greek Cards Grid */}
        <div className="space-y-3">
          {(selectedGreekTab === 'all' || selectedGreekTab === 'delta') && (
            <GreekCard
              greek="delta"
              value={contract.delta}
              type={contract.type}
              underlyingPrice={underlyingPrice}
              strikePrice={contract.strike}
            />
          )}

          {(selectedGreekTab === 'all' || selectedGreekTab === 'gamma') && (
            <GreekCard
              greek="gamma"
              value={contract.gamma}
              type={contract.type}
              underlyingPrice={underlyingPrice}
              strikePrice={contract.strike}
            />
          )}

          {(selectedGreekTab === 'all' || selectedGreekTab === 'theta') && (
            <GreekCard
              greek="theta"
              value={contract.theta}
              type={contract.type}
              underlyingPrice={underlyingPrice}
              strikePrice={contract.strike}
            />
          )}

          {(selectedGreekTab === 'all' || selectedGreekTab === 'vega') && (
            <GreekCard
              greek="vega"
              value={contract.vega ?? 12.4}
              type={contract.type}
              underlyingPrice={underlyingPrice}
              strikePrice={contract.strike}
            />
          )}

          {(selectedGreekTab === 'all' || selectedGreekTab === 'rho') && (
            <GreekCard
              greek="rho"
              value={contract.rho ?? (contract.type === 'CE' ? 2.8 : -2.5)}
              type={contract.type}
              underlyingPrice={underlyingPrice}
              strikePrice={contract.strike}
            />
          )}
        </div>

      </div>
    </div>
  );
};
