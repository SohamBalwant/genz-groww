import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export interface LineChartProps {
  data: { period: string; value: number | null }[];
  unit?: string;
  color?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  unit = '₹',
  color = '#00B386',
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-64 bg-white p-2 rounded-xl border border-border">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8EB" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: '#44475B' }}
            axisLine={{ stroke: '#E8E8EB' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8B8FA8' }}
            axisLine={{ stroke: '#E8E8EB' }}
          />
          <ReferenceLine y={0} stroke="#8B8FA8" strokeDasharray="3 3" />
          <Tooltip
            formatter={(value: any) => [
              value !== null ? `${Number(value).toFixed(2)} ${unit}` : 'Not available',
              'EPS',
            ]}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E8E8EB',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
