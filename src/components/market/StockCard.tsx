import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Stock } from '../../types';
import { Card } from '../ui/Card';
import { DemoBadge } from '../ui/DemoBadge';
import { PriceChange } from '../ui/PriceChange';
import { formatINR } from '../../lib/format';
import { ChevronRight } from 'lucide-react';

export const StockCard: React.FC<{ stock: Stock }> = ({ stock }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      padding="md"
      onClick={() => navigate(`/instrument/${stock.id}`)}
      className="space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs px-2 py-0.5 rounded bg-bgMuted text-textSecondary border border-border">
              {stock.ticker}
            </span>
            <h3 className="font-semibold text-sm md:text-base text-textPrimary hover:text-primary-600 transition-colors">
              {stock.name}
            </h3>
            <DemoBadge size="xs" />
          </div>
          <p className="text-xs text-textMuted mt-0.5">
            {stock.sector} · {stock.mcapBucket} Cap
            {stock.hasOptions && (
              <span className="ml-1.5 text-[10px] font-bold text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
                F&O
              </span>
            )}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-sm md:text-base font-bold text-textPrimary tabular-nums block">
            {formatINR(stock.price)}
          </span>
          <PriceChange changePct={stock.changePct} period="1D" size="sm" />
        </div>
      </div>

      <p className="text-xs text-textSecondary line-clamp-2 leading-relaxed">
        {stock.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-textMuted">
        <div className="flex items-center gap-3">
          <span>
            P/E:{' '}
            <strong className="text-textPrimary font-semibold">
              {stock.ratios.pe !== null && stock.ratios.pe !== undefined
                ? `${stock.ratios.pe}x`
                : 'Not meaningful'}
            </strong>
          </span>
          {stock.ratios.roe && (
            <span>
              ROE: <strong className="text-textPrimary font-semibold">{stock.ratios.roe}%</strong>
            </span>
          )}
        </div>
        <span className="text-primary-600 font-semibold inline-flex items-center gap-0.5 text-xs">
          View details <ChevronRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
};
