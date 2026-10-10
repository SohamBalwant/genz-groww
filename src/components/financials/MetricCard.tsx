import React from 'react';
import { Card } from '../ui/Card';
import { InfoPopover } from '../ui/InfoPopover';
import { GLOSSARY_TERMS } from '../../lib/glossary';

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  periodLabel?: string;
  deltaText?: string;
  isPositiveDelta?: boolean;
  glossaryId?: string;
  customExplanation?: string;
  customRupeeExample?: string;
  customLimitation?: string;
  sectorMedian?: number | null;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  periodLabel = 'TTM',
  deltaText,
  isPositiveDelta,
  glossaryId,
  customExplanation,
  customRupeeExample,
  customLimitation,
  sectorMedian,
  className = '',
}) => {
  const glossary = glossaryId ? GLOSSARY_TERMS.find((t) => t.id === glossaryId) : null;
  const explanation = customExplanation || glossary?.shortDef || 'Financial metric explanation';
  const rupeeExample = customRupeeExample || glossary?.rupeeExample;
  const limitation = customLimitation || glossary?.limitation;

  return (
    <Card padding="md" className={`space-y-2 bg-white ${className}`}>
      <div className="flex items-center justify-between gap-1 text-xs text-textMuted">
        <span className="font-semibold text-textSecondary truncate">{label}</span>
        <InfoPopover
          term={label}
          content={explanation}
          rupeeExample={rupeeExample}
          limitation={limitation}
        />
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-base sm:text-lg font-extrabold text-textPrimary tabular-nums">
          {value}
        </div>
        {periodLabel && (
          <span className="text-[10px] font-medium text-textMuted uppercase bg-bgSurface px-1.5 py-0.5 rounded border border-border">
            {periodLabel}
          </span>
        )}
      </div>

      {deltaText && (
        <div className="text-[11px] leading-tight">
          <span className={isPositiveDelta ? 'text-gain font-semibold' : 'text-loss font-semibold'}>
            {isPositiveDelta ? '▲ ' : '▼ '}
            {deltaText}
          </span>
          <span className="text-textMuted ml-1">vs prior period</span>
        </div>
      )}

      {sectorMedian !== undefined && sectorMedian !== null && (
        <div className="text-[10px] text-textMuted pt-1 border-t border-border/60">
          Sector median: <strong className="text-textSecondary">{sectorMedian}x</strong>
        </div>
      )}
    </Card>
  );
};
