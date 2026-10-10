import React, { useState } from 'react';
import type { ChargesResult } from '../../lib/fees/types';
import { formatINR } from '../../lib/format';
import { ChevronDown, ShieldAlert } from 'lucide-react';

interface ChargesBreakdownProps {
  charges: ChargesResult;
  side: 'BUY' | 'SELL';
  defaultExpanded?: boolean;
  className?: string;
}

export const ChargesBreakdown: React.FC<ChargesBreakdownProps> = ({
  charges,
  side,
  defaultExpanded = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const applicableLines = charges.lines.filter((l) => l.applicability === 'APPLIES');
  const conditionalLines = charges.lines.filter((l) => l.applicability === 'CONDITIONAL');

  return (
    <div className={`p-4 bg-bgSurface rounded-2xl border border-border space-y-3 ${className}`}>
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-textMuted block">Estimated Taxes & Charges</span>
          <span className="text-base font-bold text-textPrimary tabular-nums">
            {formatINR(charges.totalApplicable)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 p-1 rounded focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <span>{isExpanded ? 'Hide breakdown' : 'Breakdown'}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Net Amount Highlight */}
      <div className="p-3 bg-white rounded-xl border border-border flex items-center justify-between text-xs">
        <span className="text-textSecondary font-medium">
          {side === 'BUY' ? 'Estimated Net Payable' : 'Estimated Net Receivable'}
        </span>
        <span className="font-extrabold text-sm md:text-base text-textPrimary tabular-nums">
          {side === 'BUY'
            ? formatINR(charges.netPayable)
            : formatINR(charges.netReceivable)}
        </span>
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-border animate-in fade-in duration-150 text-xs">
          {/* Section 1: APPLIES */}
          <div className="space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-textSecondary block">
              Applies to this order
            </span>
            <div className="space-y-1.5 divide-y divide-border/60">
              {applicableLines.map((line) => (
                <div key={line.id} className="pt-1.5 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-textPrimary block">{line.label}</span>
                    {line.formula && (
                      <span className="text-[11px] text-textMuted block font-mono">
                        {line.formula}
                      </span>
                    )}
                    <span className="text-[11px] text-textSecondary block mt-0.5">
                      {line.explanation}
                    </span>
                  </div>
                  <span className="font-semibold text-textPrimary tabular-nums flex-shrink-0">
                    {formatINR(line.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: CONDITIONAL (excluded from total) */}
          {conditionalLines.length > 0 && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                <ShieldAlert size={14} className="text-amber-700 flex-shrink-0" aria-hidden="true" />
                <span>May apply in other situations (Excluded from this order)</span>
              </div>
              <div className="space-y-2 pt-1 text-[11px] text-amber-950">
                {conditionalLines.map((line) => (
                  <div key={line.id}>
                    <span className="font-semibold block">{line.label}:</span>
                    <p className="leading-relaxed">{line.condition}</p>
                    <p className="text-amber-800 italic mt-0.5">{line.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Transparency Disclaimer */}
          <p className="text-[10px] text-textMuted leading-relaxed border-t border-border pt-2 italic">
            * Estimates only. Final charges may vary with the executed market price, order type, exchange, and applicable circulars at the time. All rate calculations use the DEMO rate schedule as of {charges.configAsOf}.
          </p>
        </div>
      )}
    </div>
  );
};
