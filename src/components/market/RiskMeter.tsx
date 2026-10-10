import React from 'react';

interface RiskMeterProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  showText?: boolean;
  showBars?: boolean;
  size?: 'sm' | 'md';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  level,
  showText = true,
  showBars = false,
  size = 'sm',
}) => {
  const labels: Record<number, string> = {
    1: 'Low',
    2: 'Low to Moderate',
    3: 'Moderate',
    4: 'Moderately High',
    5: 'High',
    6: 'Very High',
  };

  const label = labels[level] || 'Moderate';

  const segmentColors = [
    'bg-emerald-400',
    'bg-emerald-500',
    'bg-amber-400',
    'bg-amber-500',
    'bg-orange-500',
    'bg-red-500',
  ];

  return (
    <div
      className="inline-flex items-center gap-1.5"
      aria-label={`SEBI Riskometer level ${level} of 6: ${label}`}
      title={`SEBI Riskometer Level: ${label}`}
    >
      {showBars && (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const isActive = i <= level;
            return (
              <div
                key={i}
                className={`rounded-xs transition-colors ${
                  size === 'sm' ? 'w-1.5 h-3' : 'w-2 h-4'
                } ${isActive ? segmentColors[i - 1] : 'bg-bgMuted'}`}
              />
            );
          })}
        </div>
      )}
      {showText && (
        <span className="text-xs font-semibold text-textPrimary leading-tight">
          {label}
        </span>
      )}
    </div>
  );
};
