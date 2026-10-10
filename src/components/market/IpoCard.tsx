import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Ipo } from '../../types';
import { Card } from '../ui/Card';
import { DemoBadge } from '../ui/DemoBadge';
import { formatINR, formatDate } from '../../lib/format';
import { ChevronRight, Calendar, AlertTriangle } from 'lucide-react';

export const IpoCard: React.FC<{ ipo: Ipo }> = ({ ipo }) => {
  const navigate = useNavigate();

  const statusStyles = {
    Open: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
    Upcoming: 'bg-blue-50 text-blue-800 border-blue-200 font-semibold',
    Closed: 'bg-gray-100 text-gray-700 border-gray-300 font-medium',
  }[ipo.status];

  return (
    <Card
      hoverable
      padding="md"
      onClick={() => navigate(`/instrument/${ipo.id}`)}
      className="space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm md:text-base text-textPrimary hover:text-primary-600 transition-colors">
              {ipo.company}
            </h3>
            <DemoBadge size="xs" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-textMuted mt-1">
            <Calendar size={13} aria-hidden="true" />
            <span>
              {ipo.status === 'Upcoming'
                ? `Opens on ${formatDate(ipo.opens)}`
                : ipo.status === 'Open'
                ? `Closes on ${formatDate(ipo.closes)}`
                : `Closed on ${formatDate(ipo.closes)}`}
            </span>
          </div>
        </div>

        <span className={`text-xs px-2.5 py-1 rounded-full border ${statusStyles}`}>
          {ipo.status}
        </span>
      </div>

      <p className="text-xs text-textSecondary line-clamp-2 leading-relaxed">
        {ipo.overview}
      </p>

      {/* Stats Box: Price Band, Lot Size, Min Investment */}
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-bgSurface rounded-xl border border-border text-xs">
        <div>
          <span className="text-[11px] text-textMuted block">Price Band</span>
          <span className="font-semibold text-textPrimary tabular-nums">
            ₹{ipo.priceBand[0]} – {ipo.priceBand[1]}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-textMuted block">Lot Size</span>
          <span className="font-semibold text-textPrimary tabular-nums">
            {ipo.lotSize} shares
          </span>
        </div>
        <div>
          <span className="text-[11px] text-textMuted block">Min. Investment</span>
          <span className="font-semibold text-textPrimary tabular-nums">
            {formatINR(ipo.minInvestment)}
          </span>
        </div>
      </div>

      {/* Risks preview */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60 text-textMuted">
        <span className="inline-flex items-center gap-1 text-[11px] text-amber-800">
          <AlertTriangle size={13} className="text-amber-600" aria-hidden="true" />
          <span>{ipo.keyRisks.length} key business risks outlined</span>
        </span>
        <span className="text-primary-600 font-semibold inline-flex items-center gap-0.5">
          Explore IPO <ChevronRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
};
