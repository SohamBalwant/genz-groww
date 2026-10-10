import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SUPPORTED_OPTION_INSTRUMENTS,
  generateOptionChain,
  getChainAnalytics,
  type SupportedOptionInstrument,
} from '../data/optionsLabData';
import type { OptionChainData } from '../types';
import { OptionChain } from '../components/options/OptionChain';
import { HowOptionsWorkModal } from '../components/options/HowOptionsWorkModal';
import {
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
} from 'lucide-react';

export const OptionsLabPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Help modal
  const [showHowOptionsWork, setShowHowOptionsWork] = useState<boolean>(false);

  // Selected Instrument
  const instrumentParam = searchParams.get('symbol') || 'NIFTY 50';
  const selectedInstrument = useMemo<SupportedOptionInstrument>(() => {
    const found = SUPPORTED_OPTION_INSTRUMENTS.find(
      (i) => i.symbol.toLowerCase() === instrumentParam.toLowerCase() || i.id === instrumentParam
    );
    return found || SUPPORTED_OPTION_INSTRUMENTS[0];
  }, [instrumentParam]);

  // Selected Expiry
  const expiryParam = searchParams.get('expiry');
  const [selectedExpiry, setSelectedExpiry] = useState<string>(
    expiryParam && selectedInstrument.expiries.includes(expiryParam)
      ? expiryParam
      : selectedInstrument.expiries[0]
  );

  // Update expiry when instrument changes
  useEffect(() => {
    if (!selectedInstrument.expiries.includes(selectedExpiry)) {
      setSelectedExpiry(selectedInstrument.expiries[0]);
    }
  }, [selectedInstrument, selectedExpiry]);

  // Generate Option Chain Data
  const optionChainData: OptionChainData = useMemo(() => {
    return generateOptionChain(selectedInstrument, selectedExpiry);
  }, [selectedInstrument, selectedExpiry]);

  // Market Analytics (PCR, Max Pain, ATM)
  const analytics = useMemo(() => {
    return getChainAnalytics(optionChainData);
  }, [optionChainData]);

  // DTE for selected expiry
  const dte = selectedInstrument.expiryDtes[selectedExpiry] ?? 12;

  // Handle instrument change
  const handleSelectInstrument = (inst: SupportedOptionInstrument) => {
    setSearchParams({ symbol: inst.symbol, expiry: inst.expiries[0] });
    setSelectedExpiry(inst.expiries[0]);
  };

  // Handle expiry change
  const handleSelectExpiry = (exp: string) => {
    setSelectedExpiry(exp);
    setSearchParams({ symbol: selectedInstrument.symbol, expiry: exp });
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-20 select-none">
      {/* 1. Header with Page Title & How Options Work Button */}
      <div className="pb-3 border-b border-border space-y-2.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary tracking-tight">
            Options Lab
          </h1>
          <p className="text-xs text-textSecondary mt-1 leading-relaxed">
            Understand the chain. Explore the risk. Simulated educational environment.
          </p>
        </div>

        {/* How options work positioned below the body text */}
        <div>
          <button
            type="button"
            onClick={() => setShowHowOptionsWork(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary-200 bg-primary-50/80 text-primary-700 text-xs font-semibold hover:bg-primary-100 hover:text-primary-800 transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <HelpCircle size={14} className="text-primary-600 shrink-0" />
            <span>How options work</span>
          </button>
        </div>
      </div>


      {/* 3. Underlying Instrument Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-textPrimary px-1">
          <span>Select Underlying Asset</span>
          <span className="text-[11px] text-textMuted font-normal">
            {SUPPORTED_OPTION_INSTRUMENTS.length} available contracts
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {SUPPORTED_OPTION_INSTRUMENTS.map((inst) => {
            const isSelected = inst.id === selectedInstrument.id;
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => handleSelectInstrument(inst)}
                className={`p-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer min-w-[130px] ${
                  isSelected
                    ? 'bg-primary-50/70 border-primary-500 shadow-2xs ring-1 ring-primary-500/30'
                    : 'bg-white border-border hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-extrabold text-xs text-textPrimary">{inst.symbol}</span>
                  <span className="text-[9px] uppercase font-bold text-textMuted px-1 rounded bg-bgSurface">
                    {inst.type}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-black text-xs text-textPrimary tabular-nums">
                    ₹{inst.spot.toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      inst.changePct >= 0 ? 'text-gain' : 'text-loss'
                    }`}
                  >
                    {inst.changePct >= 0 ? '+' : ''}
                    {inst.changePct}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Underlying Summary & Expiry Selector Bar */}
      <div className="p-4 bg-white rounded-2xl border border-border shadow-xs space-y-4">
        {/* Top: Active Instrument Details */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
          <div className="space-y-1 flex-1 min-w-0 pr-2">
            <h2 className="text-lg sm:text-xl font-black text-textPrimary tracking-tight">
              {selectedInstrument.name}
            </h2>
            <p className="text-xs text-textSecondary leading-relaxed">{selectedInstrument.description}</p>
          </div>

          <div className="flex flex-col items-end shrink-0 text-right">
            <div className="text-xl sm:text-2xl font-black text-textPrimary tabular-nums tracking-tight">
              ₹{selectedInstrument.spot.toLocaleString('en-IN')}
            </div>
            <div
              className={`text-xs font-bold flex items-center justify-end gap-1 mt-0.5 ${
                selectedInstrument.changePct >= 0 ? 'text-gain' : 'text-loss'
              }`}
            >
              {selectedInstrument.changePct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>
                {selectedInstrument.change >= 0 ? '+' : ''}₹{selectedInstrument.change.toFixed(2)} (
                {selectedInstrument.changePct >= 0 ? '+' : ''}
                {selectedInstrument.changePct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Expiry Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textPrimary flex items-center gap-1.5">
              <Calendar size={13} className="text-primary-600" />
              <span>Expiry</span>
            </span>
            <span className="text-xs text-textMuted">
              Time to Expiry:{' '}
              <span className="font-semibold text-textPrimary">{dte} days</span>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {selectedInstrument.expiries.map((exp) => {
              const isSelected = exp === selectedExpiry;
              const expDte = selectedInstrument.expiryDtes[exp] ?? 12;
              return (
                <button
                  key={exp}
                  type="button"
                  aria-label={exp}
                  onClick={() => handleSelectExpiry(exp)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-white text-textPrimary hover:bg-slate-50 border border-border shadow-2xs'
                  }`}
                >
                  <span>{exp.replace(/-/g, ' ')}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-textMuted'
                    }`}
                  >
                    {expDte}d left
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Market Overview Cards (One below one) */}
      <div className="flex flex-col gap-3">
        {/* Put / Call Ratio (PCR) Card */}
        <div className="p-3.5 bg-white rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textSecondary flex items-center gap-1.5">
              <span>Put/Call Ratio (PCR)</span>
              <Info size={13} className="text-textMuted" />
            </span>
            <span className="text-[11px] text-textMuted">Open Interest Positioning</span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-black text-textPrimary tabular-nums">
              {analytics.pcr.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
              {analytics.pcrInterpretation}
            </span>
          </div>

          <p className="text-[11px] text-textMuted leading-relaxed">
            PCR = Total Put OI / Total Call OI. Reflects contract positioning, not a guaranteed forecast.
          </p>
        </div>

        {/* Max Pain Indicator Card */}
        <div className="p-3.5 bg-white rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textSecondary flex items-center gap-1.5">
              <span>Max Pain Strike</span>
              <Info size={13} className="text-textMuted" />
            </span>
            <span className="text-[11px] text-textMuted">At Expiration</span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-black text-textPrimary tabular-nums">
              ₹{analytics.maxPainStrike}
            </span>
            <span className="text-xs text-textMuted">
              (Spot: ₹{selectedInstrument.spot.toFixed(0)})
            </span>
          </div>

          <p className="text-[11px] text-textMuted leading-relaxed">
            The strike where option buyers face the greatest combined loss at expiry. Empirical, not a rule.
          </p>
        </div>

        {/* Total Open Interest Breakdown Card */}
        <div className="p-3.5 bg-white rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-textSecondary">Total Open Interest</span>
            <span className="text-[11px] text-textMuted">Calls vs Puts</span>
          </div>

          {/* Visual OI distribution bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-extrabold tabular-nums">
              <span className="text-emerald-700">
                Call: {(analytics.totalCallOi / 100000).toFixed(1)}L
              </span>
              <span className="text-rose-700">
                Put: {(analytics.totalPutOi / 100000).toFixed(1)}L
              </span>
            </div>

            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${
                    (analytics.totalCallOi / (analytics.totalCallOi + analytics.totalPutOi || 1)) *
                    100
                  }%`,
                }}
              />
              <div
                className="bg-rose-500 h-full"
                style={{
                  width: `${
                    (analytics.totalPutOi / (analytics.totalCallOi + analytics.totalPutOi || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-textMuted pt-0.5">
            <span>ATM Strike: ₹{analytics.atmStrike}</span>
            <span>Distance: {analytics.spotDistanceToAtm >= 0 ? '+' : ''}{analytics.spotDistanceToAtm}</span>
          </div>
        </div>
      </div>

      {/* 6. Main Option Chain Table */}
      <div className="space-y-2">
        <OptionChain
          chain={optionChainData}
          underlyingTicker={selectedInstrument.symbol}
          selectedExpiry={selectedExpiry}
          onExpiryChange={handleSelectExpiry}
        />
      </div>

      {/* Beginner Guide Modal */}
      <HowOptionsWorkModal
        isOpen={showHowOptionsWork}
        onClose={() => setShowHowOptionsWork(false)}
      />
    </div>
  );
};
