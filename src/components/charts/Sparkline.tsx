import React from 'react';

interface SparklineProps {
  data: { t: string; p: number }[] | number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 36,
  color,
  className = '',
}) => {
  if (!data || data.length < 2) {
    return <div className="h-8 w-24 bg-bgMuted rounded" aria-hidden="true" />;
  }

  const values = typeof data[0] === 'number'
    ? (data as number[])
    : (data as { t: string; p: number }[]).map((d) => d.p);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const isUp = values[values.length - 1] >= values[0];
  const strokeColor = color || (isUp ? '#00B386' : '#EB5B3C');

  const padding = 2;
  const drawWidth = width - padding * 2;
  const drawHeight = height - padding * 2;

  const points = values.map((val, idx) => {
    const x = padding + (idx / (values.length - 1)) * drawWidth;
    const y = padding + drawHeight - ((val - min) / range) * drawHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
      aria-label={`Price trend sparkline: from ${values[0]} to ${values[values.length - 1]}`}
      role="img"
    >
      <title>Historical Price Movement</title>
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
