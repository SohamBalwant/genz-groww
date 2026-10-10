import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Bond } from '../../types';
import { Card } from '../ui/Card';
import { DemoBadge } from '../ui/DemoBadge';
import { formatINR, formatDate } from '../../lib/format';
import { ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const BondCard: React.FC<{ bond: Bond }> = ({ bond }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      padding="md"
      onClick={() => navigate(`/instrument/${bond.id}`)}
      className="space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm md:text-base text-textPrimary hover:text-primary-600 transition-colors">
              {bond.name}
            </h3>
            <DemoBadge size="xs" />
          </div>
          <p className="text-xs text-textMuted mt-0.5">
            Issuer: <span className="text-textSecondary font-medium">{bond.issuer}</span> · {bond.type}
          </p>
        </div>

        {/* Rating pill */}
        <div className="flex-shrink-0 text-right">
          {bond.rating ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-800 border border-primary-200">
              <ShieldCheck size={13} aria-hidden="true" />
              {bond.rating}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle size={13} aria-hidden="true" />
              Unrated
            </span>
          )}
          {bond.ratingAgency && (
            <span className="text-[10px] text-textMuted block mt-0.5">{bond.ratingAgency}</span>
          )}
        </div>
      </div>

      {/* Primary Financial Metric Box: Coupon vs YTM shown distinctly */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-bgSurface rounded-xl border border-border">
        <div>
          <span className="text-[11px] text-textMuted font-medium block">
            Annual Coupon Rate
          </span>
          <span className="text-base font-bold text-textPrimary tabular-nums">
            {bond.coupon > 0 ? `${bond.coupon.toFixed(2)}%` : '0% (Zero-coupon)'}
          </span>
          <span className="text-[10px] text-textMuted block leading-none mt-0.5">
            Interest paid on face value
          </span>
        </div>

        <div className="border-l border-border pl-3">
          <span className="text-[11px] text-primary-700 font-semibold block">
            Yield to Maturity (YTM)
          </span>
          <span className="text-base font-bold text-primary-600 tabular-nums">
            {bond.ytm.toFixed(2)}%
          </span>
          <span className="text-[10px] text-textMuted block leading-none mt-0.5">
            Total annualized return
          </span>
        </div>
      </div>

      {/* Footer details: Maturity, Min investment, Risk flag */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60 text-textMuted">
        <div>
          <span>Matures: <strong className="text-textSecondary">{formatDate(bond.maturity)}</strong></span>
          <span className="mx-2">·</span>
          <span>Min: <strong className="text-textSecondary">{formatINR(bond.minInvestment)}</strong></span>
        </div>
        <span className="text-primary-600 font-semibold inline-flex items-center gap-0.5">
          Explore bond <ChevronRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
};
