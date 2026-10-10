import React, { useState, useMemo, useRef } from 'react';
import type { OptionChainData, OptionContract } from '../../types';
import { ContractPanel } from './ContractPanel';
import { getMoneyness, getMoneynessBadgeClass } from '../../lib/options/moneyness';
import {
  LocateFixed,
  Filter,
} from 'lucide-react';

export type OptionChainMetricView = 'price' | 'oi' | 'greeks' | 'iv';

export interface OptionChainProps {
  chain: OptionChainData;
  underlyingTicker: string;
  selectedExpiry?: string;
  onExpiryChange?: (expiry: string) => void;
  isBeginnerMode?: boolean;
}

export const OptionChain: React.FC<OptionChainProps> = ({
  chain,
  underlyingTicker,
  selectedExpiry: externalExpiry,
  onExpiryChange: _onExpiryChange,
  isBeginnerMode: _isBeginnerMode = false,
}) => {
  const [internalExpiry] = useState<string>(chain.expiries[0]);
  const activeExpiry = externalExpiry || internalExpiry;

  // Metric View: 'price' | 'oi' | 'greeks' | 'iv'
  const [metricView, setMetricView] = useState<OptionChainMetricView>('price');

  // Filter strikes: 'focus' (around ATM) vs 'all'
  const [strikeRange, setStrikeRange] = useState<'focus' | 'all'>('focus');

  // Active Selected Contract for Bottom Sheet Panel
  const [activeContract, setActiveContract] = useState<OptionContract | null>(null);

  // Table container ref for smooth jump to ATM
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const atmRowRef = useRef<HTMLTableRowElement>(null);

  // Calculate max OI for relative visual bar scaling
  const maxOi = useMemo(() => {
    let max = 1;
    for (const r of chain.rows) {
      if (r.ce.oi > max) max = r.ce.oi;
      if (r.pe.oi > max) max = r.pe.oi;
    }
    return max;
  }, [chain.rows]);

  // Find nearest ATM strike
  const atmStrike = useMemo(() => {
    let nearest = chain.rows[0]?.strike ?? 0;
    let minDiff = Infinity;
    for (const r of chain.rows) {
      const diff = Math.abs(r.strike - chain.spot);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = r.strike;
      }
    }
    return nearest;
  }, [chain.rows, chain.spot]);

  // Filtered rows (focus ±6 around ATM vs all)
  const displayedRows = useMemo(() => {
    if (strikeRange === 'all') return chain.rows;
    const atmIdx = chain.rows.findIndex((r) => r.strike === atmStrike);
    if (atmIdx === -1) return chain.rows;
    const start = Math.max(0, atmIdx - 6);
    const end = Math.min(chain.rows.length, atmIdx + 7);
    return chain.rows.slice(start, end);
  }, [chain.rows, strikeRange, atmStrike]);

  // Jump to ATM handler
  const handleJumpToAtm = () => {
    if (atmRowRef.current) {
      atmRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-3.5 select-none">

      {/* 1. Chain Controls Bar */}
      <div className="flex flex-col gap-2.5 p-3 bg-white rounded-2xl border border-border shadow-2xs">
        {/* Line 1: Primary Metric Views (Price & 1D, Open Interest, Greeks) */}
        <div className="grid grid-cols-3 gap-1 bg-bgSurface p-1 rounded-xl border border-border w-full">
          {(
            [
              { id: 'price', label: 'Price & 1D' },
              { id: 'oi', label: 'Open Interest' },
              { id: 'greeks', label: 'Greeks (Δ,Γ,Θ,ν)' },
            ] as const
          ).map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setMetricView(view.id)}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center justify-center flex items-center ${
                metricView === view.id
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Line 2: Options on the right of Greeks (Implied Vol, Jump to ATM, Strike Filter) */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => setMetricView('iv')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              metricView === 'iv'
                ? 'bg-primary-600 text-white border-primary-600 shadow-2xs'
                : 'bg-bgSurface hover:bg-slate-100 text-textSecondary border-border'
            }`}
          >
            <span>Implied Vol (IV)</span>
          </button>

          <button
            type="button"
            onClick={handleJumpToAtm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100/70 text-primary-800 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Center table around At-The-Money strike"
          >
            <LocateFixed size={13} className="text-primary-700 shrink-0" />
            <span className="whitespace-nowrap">Jump to ATM (₹{atmStrike})</span>
          </button>

          <button
            type="button"
            onClick={() => setStrikeRange(strikeRange === 'focus' ? 'all' : 'focus')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-white hover:bg-bgSurface text-textSecondary text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Filter size={13} className="shrink-0" />
            <span className="whitespace-nowrap">{strikeRange === 'focus' ? 'Show All Strikes' : '±6 ATM Focus'}</span>
          </button>
        </div>
      </div>

      {/* 2. The Responsive Option Chain Table with Sticky Strike */}
      <div
        ref={tableContainerRef}
        className="w-full overflow-x-auto rounded-2xl border border-border bg-white shadow-2xs scrollbar-thin max-h-[650px] overflow-y-auto"
      >
        <table className="w-full text-xs text-left border-collapse select-none">
          {/* Header */}
          <thead className="sticky top-0 z-30 bg-bgSurface shadow-2xs">
            <tr className="text-[11px] uppercase tracking-wider border-b border-border">
              {/* Call Side Header */}
              <th
                scope="col"
                colSpan={metricView === 'greeks' ? 4 : metricView === 'oi' ? 3 : 2}
                className="text-center py-2 px-3 border-r border-border text-primary-800 bg-primary-50/70 font-bold"
              >
                Calls (CE) — Bullish
              </th>

              {/* Sticky Strike Header */}
              <th
                scope="col"
                className="text-center py-2 px-4 font-black text-slate-900 bg-slate-100 sticky left-0 z-40 border-x border-border shadow-2xs"
              >
                Strike Price
              </th>

              {/* Put Side Header */}
              <th
                scope="col"
                colSpan={metricView === 'greeks' ? 4 : metricView === 'oi' ? 3 : 2}
                className="text-center py-2 px-3 border-l border-border text-rose-800 bg-red-50/70 font-bold"
              >
                Puts (PE) — Bearish
              </th>
            </tr>

            {/* Column Subheaders based on selected metricView */}
            <tr className="bg-bgSurface/90 text-[10px] text-textMuted border-b border-border">
              {/* Call subheaders */}
              {metricView === 'price' && (
                <>
                  <th className="p-2 text-right">1D Change %</th>
                  <th className="p-2 text-right border-r border-border font-bold text-textPrimary">LTP (₹)</th>
                </>
              )}
              {metricView === 'oi' && (
                <>
                  <th className="p-2 text-right">Volume</th>
                  <th className="p-2 text-right">OI Distribution</th>
                  <th className="p-2 text-right border-r border-border font-bold text-textPrimary">LTP (₹)</th>
                </>
              )}
              {metricView === 'greeks' && (
                <>
                  <th className="p-2 text-right font-semibold">Theta (Θ)</th>
                  <th className="p-2 text-right font-semibold">Vega (ν)</th>
                  <th className="p-2 text-right font-semibold">Delta (Δ)</th>
                  <th className="p-2 text-right border-r border-border font-bold text-textPrimary">LTP (₹)</th>
                </>
              )}
              {metricView === 'iv' && (
                <>
                  <th className="p-2 text-right">IV (%)</th>
                  <th className="p-2 text-right border-r border-border font-bold text-textPrimary">LTP (₹)</th>
                </>
              )}

              {/* Sticky Strike Column Subheader */}
              <th className="p-2 text-center bg-slate-100 sticky left-0 z-40 font-extrabold text-slate-800 border-x border-border">
                Strike
              </th>

              {/* Put subheaders */}
              {metricView === 'price' && (
                <>
                  <th className="p-2 text-left border-l border-border font-bold text-textPrimary">LTP (₹)</th>
                  <th className="p-2 text-left">1D Change %</th>
                </>
              )}
              {metricView === 'oi' && (
                <>
                  <th className="p-2 text-left border-l border-border font-bold text-textPrimary">LTP (₹)</th>
                  <th className="p-2 text-left">OI Distribution</th>
                  <th className="p-2 text-left">Volume</th>
                </>
              )}
              {metricView === 'greeks' && (
                <>
                  <th className="p-2 text-left border-l border-border font-bold text-textPrimary">LTP (₹)</th>
                  <th className="p-2 text-left font-semibold">Delta (Δ)</th>
                  <th className="p-2 text-left font-semibold">Vega (ν)</th>
                  <th className="p-2 text-left font-semibold">Theta (Θ)</th>
                </>
              )}
              {metricView === 'iv' && (
                <>
                  <th className="p-2 text-left border-l border-border font-bold text-textPrimary">LTP (₹)</th>
                  <th className="p-2 text-left">IV (%)</th>
                </>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/60">
            {displayedRows.map((row) => {
              const isAtm = row.strike === atmStrike;
              const ceMoneyness = getMoneyness(row.strike, chain.spot, 'CE', isAtm);
              const peMoneyness = getMoneyness(row.strike, chain.spot, 'PE', isAtm);

              const ceBg = isAtm
                ? 'bg-primary-100/70 hover:bg-primary-200/60 font-semibold'
                : ceMoneyness === 'ITM'
                ? 'bg-amber-50/50 hover:bg-amber-100/70'
                : 'hover:bg-slate-50';

              const peBg = isAtm
                ? 'bg-primary-100/70 hover:bg-primary-200/60 font-semibold'
                : peMoneyness === 'ITM'
                ? 'bg-amber-50/50 hover:bg-amber-100/70'
                : 'hover:bg-slate-50';

              const isCeSelected =
                activeContract?.strike === row.strike && activeContract?.type === 'CE';
              const isPeSelected =
                activeContract?.strike === row.strike && activeContract?.type === 'PE';

              return (
                <tr
                  key={row.strike}
                  ref={isAtm ? atmRowRef : undefined}
                  className={`transition-colors ${isAtm ? 'font-bold' : ''}`}
                >
                  {/* CALL CONTRACT CELLS */}
                  {metricView === 'price' && (
                    <td
                      onClick={() => setActiveContract(row.ce)}
                      className={`p-2.5 text-right tabular-nums cursor-pointer ${
                        row.ce.changePct >= 0 ? 'text-gain' : 'text-loss'
                      } ${ceBg}`}
                    >
                      {row.ce.changePct > 0 ? '+' : ''}
                      {row.ce.changePct}%
                    </td>
                  )}

                  {metricView === 'oi' && (
                    <>
                      <td
                        onClick={() => setActiveContract(row.ce)}
                        className={`p-2 text-right tabular-nums text-textMuted cursor-pointer ${ceBg}`}
                      >
                        {row.ce.volume.toLocaleString('en-IN')}
                      </td>
                      <td
                        onClick={() => setActiveContract(row.ce)}
                        className={`p-2 text-right cursor-pointer ${ceBg}`}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.min(100, (row.ce.oi / maxOi) * 100)}%` }}
                            />
                          </div>
                          <span className="tabular-nums text-textMuted text-[11px]">
                            {row.ce.oi >= 100000
                              ? `${(row.ce.oi / 100000).toFixed(1)}L`
                              : `${(row.ce.oi / 1000).toFixed(0)}k`}
                          </span>
                        </div>
                      </td>
                    </>
                  )}

                  {metricView === 'greeks' && (
                    <>
                      <td
                        onClick={() => setActiveContract(row.ce)}
                        className={`p-2 text-right tabular-nums text-loss cursor-pointer ${ceBg}`}
                      >
                        {row.ce.theta.toFixed(1)}
                      </td>
                      <td
                        onClick={() => setActiveContract(row.ce)}
                        className={`p-2 text-right tabular-nums text-indigo-700 cursor-pointer ${ceBg}`}
                      >
                        +{row.ce.vega?.toFixed(1) ?? '12.4'}
                      </td>
                      <td
                        onClick={() => setActiveContract(row.ce)}
                        className={`p-2 text-right tabular-nums font-bold text-gain cursor-pointer ${ceBg}`}
                      >
                        +{row.ce.delta.toFixed(2)}
                      </td>
                    </>
                  )}

                  {metricView === 'iv' && (
                    <td
                      onClick={() => setActiveContract(row.ce)}
                      className={`p-2.5 text-right tabular-nums font-semibold text-indigo-700 cursor-pointer ${ceBg}`}
                    >
                      {row.ce.iv ? `${row.ce.iv}%` : '14.5%'}
                    </td>
                  )}

                  {/* CALL LTP CELL */}
                  <td
                    onClick={() => setActiveContract(row.ce)}
                    className={`p-2.5 text-right tabular-nums font-black text-textPrimary border-r border-border cursor-pointer ${ceBg} ${
                      isCeSelected ? 'ring-2 ring-primary-500 ring-inset' : ''
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded border ${getMoneynessBadgeClass(
                          ceMoneyness
                        )}`}
                      >
                        {ceMoneyness}
                      </span>
                      <span>₹{row.ce.ltp.toFixed(2)}</span>
                    </div>
                  </td>

                  {/* STRIKE PRICE COLUMN (STICKY & CENTERED) */}
                  <td
                    className={`p-2.5 text-center font-black border-x border-border tabular-nums sticky left-0 z-20 shadow-xs ${
                      isAtm
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{row.strike}</span>
                      {isAtm && (
                        <span className="text-[9px] font-extrabold uppercase bg-white/20 px-1 rounded">
                          ATM
                        </span>
                      )}
                    </div>
                  </td>

                  {/* PUT LTP CELL */}
                  <td
                    onClick={() => setActiveContract(row.pe)}
                    className={`p-2.5 text-left tabular-nums font-black text-textPrimary border-l border-border cursor-pointer ${peBg} ${
                      isPeSelected ? 'ring-2 ring-rose-500 ring-inset' : ''
                    }`}
                  >
                    <div className="flex items-center justify-start gap-1.5">
                      <span>₹{row.pe.ltp.toFixed(2)}</span>
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded border ${getMoneynessBadgeClass(
                          peMoneyness
                        )}`}
                      >
                        {peMoneyness}
                      </span>
                    </div>
                  </td>

                  {/* PUT CONTRACT CELLS */}
                  {metricView === 'price' && (
                    <td
                      onClick={() => setActiveContract(row.pe)}
                      className={`p-2.5 text-left tabular-nums cursor-pointer ${
                        row.pe.changePct >= 0 ? 'text-gain' : 'text-loss'
                      } ${peBg}`}
                    >
                      {row.pe.changePct > 0 ? '+' : ''}
                      {row.pe.changePct}%
                    </td>
                  )}

                  {metricView === 'oi' && (
                    <>
                      <td
                        onClick={() => setActiveContract(row.pe)}
                        className={`p-2 text-left cursor-pointer ${peBg}`}
                      >
                        <div className="flex items-center justify-start gap-1.5">
                          <span className="tabular-nums text-textMuted text-[11px]">
                            {row.pe.oi >= 100000
                              ? `${(row.pe.oi / 100000).toFixed(1)}L`
                              : `${(row.pe.oi / 1000).toFixed(0)}k`}
                          </span>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: `${Math.min(100, (row.pe.oi / maxOi) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td
                        onClick={() => setActiveContract(row.pe)}
                        className={`p-2 text-left tabular-nums text-textMuted cursor-pointer ${peBg}`}
                      >
                        {row.pe.volume.toLocaleString('en-IN')}
                      </td>
                    </>
                  )}

                  {metricView === 'greeks' && (
                    <>
                      <td
                        onClick={() => setActiveContract(row.pe)}
                        className={`p-2 text-left tabular-nums font-bold text-loss cursor-pointer ${peBg}`}
                      >
                        {row.pe.delta.toFixed(2)}
                      </td>
                      <td
                        onClick={() => setActiveContract(row.pe)}
                        className={`p-2 text-left tabular-nums text-indigo-700 cursor-pointer ${peBg}`}
                      >
                        +{row.pe.vega?.toFixed(1) ?? '12.4'}
                      </td>
                      <td
                        onClick={() => setActiveContract(row.pe)}
                        className={`p-2 text-left tabular-nums text-loss cursor-pointer ${peBg}`}
                      >
                        {row.pe.theta.toFixed(1)}
                      </td>
                    </>
                  )}

                  {metricView === 'iv' && (
                    <td
                      onClick={() => setActiveContract(row.pe)}
                      className={`p-2.5 text-left tabular-nums font-semibold text-indigo-700 cursor-pointer ${peBg}`}
                    >
                      {row.pe.iv ? `${row.pe.iv}%` : '14.5%'}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Moneyness Legend & ATM Status Indicator (Below Table) */}
      <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-border shadow-2xs text-xs text-textSecondary">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3.5 flex-wrap">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-xs bg-amber-100 border border-amber-300 shrink-0" />
              <span className="font-medium text-textPrimary">ITM (In the Money)</span>
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-xs bg-primary-200 border border-primary-400 shrink-0" />
              <span className="font-semibold text-primary-900">ATM Strike</span>
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-xs bg-white border border-border shrink-0" />
              <span className="font-medium text-textPrimary">OTM (Out of the Money)</span>
            </span>
          </div>

          <span className="font-bold text-xs text-textPrimary bg-bgSurface px-2 py-0.5 rounded border border-border whitespace-nowrap self-start">
            Lot: {chain.lotSize}
          </span>
        </div>

        <div className="text-left pt-1 border-t border-slate-100">
          <span className="text-[11px] text-textMuted block text-left">
            Tap any Call or Put to view Greeks & Simulator
          </span>
        </div>
      </div>

      {/* Contract Detail Bottom Sheet Panel */}
      <ContractPanel
        isOpen={activeContract !== null}
        onClose={() => setActiveContract(null)}
        contract={activeContract}
        underlyingTicker={underlyingTicker}
        underlyingId={chain.underlyingId}
        spot={chain.spot}
        lotSize={chain.lotSize}
        expiry={activeExpiry}
      />
    </div>
  );
};
