import React, { useEffect, useState } from 'react';
import { dataService, type MarketOverviewData } from '../../services/dataService';
import { PriceChange } from '../ui/PriceChange';
import { DemoBadge } from '../ui/DemoBadge';

export const MarketOverview: React.FC = () => {
  const [data, setData] = useState<MarketOverviewData | null>(null);

  useEffect(() => {
    dataService.getMarketOverview().then(setData);
  }, []);

  if (!data) return null;

  return (
    <section aria-label="Market Overview" className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
          <span>Market Indices (Illustrative)</span>
          <DemoBadge size="xs" />
        </h2>
        <span className="text-[11px] text-textMuted">As of 15 Mar 15:30 IST</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {data.indices.map((idx) => (
          <div
            key={idx.name}
            className="flex-shrink-0 bg-white p-3 rounded-xl border border-border min-w-[150px] shadow-2xs space-y-1 select-none"
          >
            <span className="text-xs font-medium text-textSecondary block truncate">
              {idx.name}
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-textPrimary tabular-nums">
                {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <PriceChange changePct={idx.changePct} period="" size="sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
