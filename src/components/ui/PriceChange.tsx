import React from 'react';

interface PriceChangeProps {
  changePct: number | null | undefined;
  period?: string;
  size?: 'sm' | 'base' | 'lg';
  className?: string;
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  changePct,
  period = '1D',
  size = 'base',
  className = '',
}) => {
  if (changePct === null || changePct === undefined || isNaN(changePct)) {
    return <span className={`text-textMuted text-xs ${className}`}>–</span>;
  }

  const isPositive = changePct > 0;
  const isNegative = changePct < 0;
  const absValue = Math.abs(changePct).toFixed(2);

  const sizeStyles =
    size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base font-semibold' : 'text-sm font-medium';

  const colorStyles = isPositive
    ? 'text-gain'
    : isNegative
    ? 'text-loss'
    : 'text-textSecondary';

  const ariaDescription = isPositive
    ? `Up by ${absValue} percent ${period}`
    : isNegative
    ? `Down by ${absValue} percent ${period}`
    : `Unchanged ${period}`;

  return (
    <span
      className={`inline-flex items-center gap-1 tabular-nums ${colorStyles} ${sizeStyles} ${className}`}
      aria-label={ariaDescription}
    >
      <span aria-hidden="true">{isPositive ? '▲ +' : isNegative ? '▼ −' : ''}</span>
      <span>{absValue}%</span>
      {period && <span className="text-textMuted text-[11px] font-normal">({period})</span>}
    </span>
  );
};
