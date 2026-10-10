import React, { useState } from 'react';
import type { FinancialsData } from '../../types';
import { MetricCard } from './MetricCard';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { DemoBadge } from '../ui/DemoBadge';
import { Table, BarChart3, AlertCircle } from 'lucide-react';

interface FinancialsTabProps {
  financials: FinancialsData;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ financials }) => {
  const [periodType, setPeriodType] = useState<'annual' | 'quarterly'>('annual');
  const [viewMode, setViewMode] = useState<'charts' | 'table'>('charts');

  const { metrics } = financials;
  const series = periodType === 'annual' ? financials.annual : financials.quarterly;

  // Chart datasets
  const revenueData = series.map((s) => ({ period: s.period, value: s.revenue }));
  const profitData = series.map((s) => ({ period: s.period, value: s.profit }));
  const epsData = series.map((s) => ({ period: s.period, value: s.eps }));

  return (
    <div className="space-y-6">
      {/* 1. Sub-Header with Metadata & Toggles */}
      <div className="p-3.5 bg-white rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-textPrimary">
              Financial Disclosures ({financials.basis})
            </span>
            <DemoBadge size="xs" />
          </div>
          <p className="text-[11px] text-textMuted">
            Source: {financials.source} · Unit: {financials.unit} ({financials.currency}) · As of {financials.asOf}
          </p>
        </div>

        {/* Controls: Annual/Quarterly + View As Table Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Annual/Quarterly switch */}
          <div className="p-1 bg-bgSurface rounded-lg border border-border flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPeriodType('annual')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors min-h-[32px] ${
                periodType === 'annual'
                  ? 'bg-white text-textPrimary shadow-xs'
                  : 'text-textMuted hover:text-textPrimary'
              }`}
            >
              Annual (FY)
            </button>
            <button
              type="button"
              onClick={() => setPeriodType('quarterly')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors min-h-[32px] ${
                periodType === 'quarterly'
                  ? 'bg-white text-textPrimary shadow-xs'
                  : 'text-textMuted hover:text-textPrimary'
              }`}
            >
              Quarterly
            </button>
          </div>

          {/* Table / Chart Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'charts' ? 'table' : 'charts')}
            aria-label={viewMode === 'charts' ? 'View financial data as table' : 'View financial data as charts'}
            className="p-1.5 bg-white hover:bg-bgSurface rounded-lg border border-border text-textSecondary min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
            title={viewMode === 'charts' ? 'Switch to accessible table view' : 'Switch to chart view'}
          >
            {viewMode === 'charts' ? <Table size={16} /> : <BarChart3 size={16} />}
          </button>
        </div>
      </div>

      {/* 2. Seven Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: P/E */}
        <MetricCard
          label="P/E Ratio"
          glossaryId="pe-ratio"
          value={
            metrics.pe !== null && metrics.pe !== undefined
              ? `${metrics.pe.toFixed(1)}x`
              : 'Not meaningful (loss-making)'
          }
          sectorMedian={metrics.sectorMedianPe}
        />

        {/* Metric 2: EPS */}
        <MetricCard
          label="Earnings Per Share"
          glossaryId="eps"
          value={
            metrics.eps !== null && metrics.eps !== undefined
              ? `₹${metrics.eps.toFixed(2)}`
              : 'Not available'
          }
          deltaText={metrics.profitGrowthYoY ? `${Math.abs(metrics.profitGrowthYoY)}% YoY` : undefined}
          isPositiveDelta={(metrics.profitGrowthYoY ?? 0) >= 0}
        />

        {/* Metric 3: ROE */}
        <MetricCard
          label="Return on Equity"
          glossaryId="roe"
          value={
            metrics.roe !== null && metrics.roe !== undefined
              ? `${metrics.roe.toFixed(1)}%`
              : 'Not available'
          }
        />

        {/* Metric 4: Debt to Equity (Banks Edge Case) */}
        <MetricCard
          label="Debt to Equity"
          glossaryId="de-ratio"
          value={
            metrics.isBank
              ? 'Not comparable for banks'
              : metrics.debtToEquity !== null && metrics.debtToEquity !== undefined
              ? `${metrics.debtToEquity.toFixed(2)}x`
              : 'Not available'
          }
          customLimitation={
            metrics.isBank
              ? 'Banks and financial institutions fund operations through deposits, making classic debt-to-equity ratios uninformative. Focus on Capital Adequacy (CAR) instead.'
              : undefined
          }
        />

        {/* Metric 5: Dividend Yield (No Dividend Edge Case) */}
        <MetricCard
          label="Dividend Yield"
          glossaryId="dividend-yield"
          value={
            metrics.dividendYield !== null && metrics.dividendYield !== undefined
              ? `${metrics.dividendYield.toFixed(2)}%`
              : 'No dividend declared'
          }
        />

        {/* Metric 6: Revenue Growth YoY */}
        <MetricCard
          label="Revenue Growth (YoY)"
          value={
            metrics.revenueGrowthYoY !== null && metrics.revenueGrowthYoY !== undefined
              ? `${metrics.revenueGrowthYoY > 0 ? '+' : ''}${metrics.revenueGrowthYoY.toFixed(1)}%`
              : 'Not available'
          }
          isPositiveDelta={(metrics.revenueGrowthYoY ?? 0) >= 0}
          deltaText={metrics.revenueGrowthYoY ? `${metrics.revenueGrowthYoY}%` : undefined}
        />

        {/* Metric 7: Profit Growth YoY (Base Negative Edge Case) */}
        <MetricCard
          label="Profit Growth (YoY)"
          value={
            metrics.profitGrowthYoY !== null && metrics.profitGrowthYoY !== undefined
              ? `${metrics.profitGrowthYoY > 0 ? '+' : ''}${metrics.profitGrowthYoY.toFixed(1)}%`
              : 'n/m (base period loss)'
          }
          isPositiveDelta={(metrics.profitGrowthYoY ?? 0) >= 0}
          deltaText={metrics.profitGrowthYoY ? `${metrics.profitGrowthYoY}%` : undefined}
        />
      </div>

      {/* 3. Charts OR Accessible Table View */}
      {viewMode === 'charts' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-textPrimary">Revenue Trend ({financials.unit})</h4>
                <span className="text-textMuted uppercase">{periodType}</span>
              </div>
              <BarChart data={revenueData} unit={financials.unit} color="#00B386" />
            </div>

            {/* Profit Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-textPrimary">Net Profit Trend ({financials.unit})</h4>
                <span className="text-textMuted uppercase">{periodType}</span>
              </div>
              <BarChart data={profitData} unit={financials.unit} color="#3B82F6" />
            </div>
          </div>

          {/* EPS Line Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold text-textPrimary">Earnings Per Share (EPS) Trend (₹)</h4>
              <span className="text-textMuted uppercase">{periodType}</span>
            </div>
            <LineChart data={epsData} unit="₹" color="#00B386" />
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative */
        <div className="bg-white rounded-2xl border border-border p-4 overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs text-left">
            <caption className="sr-only">Financial performance numbers over time</caption>
            <thead>
              <tr className="border-b border-border text-textMuted uppercase text-[11px]">
                <th scope="col" className="p-3">Period</th>
                <th scope="col" className="p-3 text-right">Revenue ({financials.unit})</th>
                <th scope="col" className="p-3 text-right">Net Profit ({financials.unit})</th>
                <th scope="col" className="p-3 text-right">EPS (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {series.map((row) => (
                <tr key={row.period} className="hover:bg-bgSurface">
                  <th scope="row" className="p-3 font-semibold text-textPrimary">
                    {row.period}
                  </th>
                  <td className="p-3 text-right tabular-nums text-textPrimary">
                    {row.revenue !== null ? row.revenue.toLocaleString('en-IN') : 'Not available'}
                  </td>
                  <td className={`p-3 text-right tabular-nums font-medium ${
                    row.profit !== null && row.profit < 0 ? 'text-loss' : 'text-textPrimary'
                  }`}>
                    {row.profit !== null ? row.profit.toLocaleString('en-IN') : 'Not available'}
                  </td>
                  <td className={`p-3 text-right tabular-nums font-medium ${
                    row.eps !== null && row.eps < 0 ? 'text-loss' : 'text-textPrimary'
                  }`}>
                    {row.eps !== null ? `₹${row.eps.toFixed(2)}` : 'Not available'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Mandatory Educational Footer */}
      <div className="p-4 bg-bgSurface rounded-xl border border-border flex items-start gap-3 text-xs text-textSecondary">
        <AlertCircle size={16} className="text-primary-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="text-textPrimary">Investor Prudence Rule:</strong> No single financial ratio indicates whether a company is an appropriate investment. Always compare metrics across peer companies operating within the identical sector over multi-year business cycles.
        </p>
      </div>
    </div>
  );
};
