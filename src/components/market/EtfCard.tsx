import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Etf } from '../../types';
import { Card } from '../ui/Card';
import { DemoBadge } from '../ui/DemoBadge';
import { PriceChange } from '../ui/PriceChange';
import { formatINR } from '../../lib/format';
import { ChevronRight } from 'lucide-react';

export const EtfCard: React.FC<{ etf: Etf }> = ({ etf }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      padding="md"
      onClick={() => navigate(`/instrument/${etf.id}`)}
      className="space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs px-2 py-0.5 rounded bg-bgMuted text-textSecondary border border-border">
              {etf.ticker}
            </span>
            <h3 className="font-semibold text-sm md:text-base text-textPrimary hover:text-primary-600 transition-colors">
              {etf.name}
            </h3>
            <DemoBadge size="xs" />
          </div>
          <p className="text-xs text-textMuted mt-0.5">
            Tracks: <span className="text-textSecondary font-medium">{etf.tracks}</span>
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-sm md:text-base font-bold text-textPrimary tabular-nums block">
            {formatINR(etf.price)}
          </span>
          <PriceChange changePct={etf.changePct} period="1D" size="sm" />
        </div>
      </div>

      <p className="text-xs text-textSecondary italic bg-bgSurface p-2 rounded-lg border border-border">
        {etf.trackingNote}
      </p>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60 text-textMuted">
        <div>
          <span>Expense: <strong className="text-textPrimary font-semibold">{etf.expenseRatio}%</strong></span>
          <span className="mx-2">·</span>
          <span>1Y Return: <strong className="text-gain font-semibold">+{etf.returns.find(r => r.period === '1Y')?.pct}%</strong></span>
        </div>
        <span className="text-primary-600 font-semibold inline-flex items-center gap-0.5">
          View details <ChevronRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
};
