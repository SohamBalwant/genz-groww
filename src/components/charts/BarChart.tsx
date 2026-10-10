import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export interface BarChartProps {
  data: { period: string; value: number | null }[];
  unit?: string;
  color?: string;
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  unit = '₹ Cr',
  color = '#00B386',
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-64 bg-white p-2 rounded-xl border border-border">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8EB" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: '#44475B' }}
            axisLine={{ stroke: '#E8E8EB' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8B8FA8' }}
            axisLine={{ stroke: '#E8E8EB' }}
            tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip
            formatter={(value: any) => [
              value !== null ? `${Number(value).toLocaleString('en-IN')} ${unit}` : 'Not available',
              'Amount',
            ]}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E8E8EB',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value !== null && entry.value < 0 ? '#EB5B3C' : color}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
