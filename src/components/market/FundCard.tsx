import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { MutualFund } from '../../types';
import { Card } from '../ui/Card';
import { RiskMeter } from './RiskMeter';
import { formatINR } from '../../lib/format';
import { ChevronRight } from 'lucide-react';

export const FundCard: React.FC<{ fund: MutualFund }> = ({ fund }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      padding="md"
      onClick={() => navigate(`/instrument/${fund.id}`)}
      className="space-y-3 cursor-pointer"
    >
      {/* Header: Name, AMC, Category */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-sm md:text-base text-textPrimary hover:text-primary-600 transition-colors">
            {fund.name}
          </h3>
          <p className="text-xs text-textMuted mt-0.5">
            {fund.amc} · <span className="font-medium text-textSecondary">{fund.category}</span> · {fund.plan} Plan
          </p>
        </div>
        <ChevronRight size={18} className="text-textMuted flex-shrink-0 mt-1" aria-hidden="true" />
      </div>

      {/* Category explainer */}
      <p className="text-xs text-textSecondary italic bg-bgSurface/70 px-2.5 py-2 rounded-lg border border-border/70 leading-relaxed">
        {fund.categoryExplainer}
      </p>

      {/* Key Stats Row: Risk Profile, Expense ratio, Min SIP */}
      <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-border/60 text-xs">
        <div>
          <span className="text-[11px] text-textMuted block font-medium">Risk Profile</span>
          <div className="mt-0.5">
            <RiskMeter level={fund.riskLevel} />
          </div>
        </div>
        <div>
          <span className="text-[11px] text-textMuted block font-medium">Expense Ratio</span>
          <span className="font-semibold text-textPrimary tabular-nums block mt-0.5">
            {fund.expenseRatio}%
          </span>
          <span className="text-[10px] text-textMuted block leading-none mt-0.5">(in NAV)</span>
        </div>
        <div>
          <span className="text-[11px] text-textMuted block font-medium">Min. SIP</span>
          <span className="font-semibold text-textPrimary tabular-nums block mt-0.5">
            {formatINR(fund.minSip)}
          </span>
        </div>
      </div>

      {/* Returns Row */}
      <div className="bg-bgSurface/80 px-3 py-2 rounded-lg border border-border flex items-center justify-between text-xs">
        <span className="font-medium text-textSecondary">Historical Returns</span>
        <div className="flex items-center gap-4 tabular-nums">
          {fund.returns.map((ret) => (
            <span key={ret.period} className="text-center">
              <span className="text-[10px] text-textMuted block font-medium">{ret.period}</span>
              <span className="font-semibold text-gain text-xs">
                {ret.pct !== null ? `${ret.pct > 0 ? '+' : ''}${ret.pct}%` : 'N/A'}
              </span>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
