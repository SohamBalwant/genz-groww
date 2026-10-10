import React from 'react';
import type { PayoffPoint } from '../../lib/options/payoff';
import { formatINR } from '../../lib/format';

interface PayoffChartProps {
  points: PayoffPoint[];
  strike: number;
  breakeven: number;
  spot: number;
  maxLoss: number | string;
  maxProfit?: number | string;
  type: 'CE' | 'PE';
  side?: 'BUY' | 'SELL';
  currentScenarioPrice?: number;
  className?: string;
}

export const PayoffChart: React.FC<PayoffChartProps> = ({
  points,
  strike,
  breakeven,
  spot,
  maxLoss,
  maxProfit,
  type,
  side = 'BUY',
  currentScenarioPrice,
  className = '',
}) => {
  if (!points || points.length === 0) return null;

  const width = 500;
  const height = 240;
  const padding = { top: 24, right: 30, bottom: 40, left: 60 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const pnls = points.map((p) => p.pnl);
  const rawMinPnl = Math.min(...pnls);
  const rawMaxPnl = Math.max(...pnls);

  // Buffer range around 0
  const absMax = Math.max(Math.abs(rawMinPnl), Math.abs(rawMaxPnl), 100);
  const minPnl = Math.min(rawMinPnl, -absMax * 0.1);
  const maxPnl = Math.max(rawMaxPnl, absMax * 0.1);

  const scaleX = (price: number) =>
    padding.left + ((price - minPrice) / Math.max(1, maxPrice - minPrice)) * innerWidth;

  const scaleY = (pnl: number) =>
    padding.top + innerHeight - ((pnl - minPnl) / Math.max(1, maxPnl - minPnl)) * innerHeight;

  const zeroY = Math.max(padding.top, Math.min(padding.top + innerHeight, scaleY(0)));
  const strikeX = scaleX(strike);
  const breakevenX = scaleX(breakeven);
  const spotX = scaleX(spot);
  const scenarioX = currentScenarioPrice !== undefined ? scaleX(currentScenarioPrice) : null;

  // Find PnL at current scenario price
  const scenarioPoint =
    currentScenarioPrice !== undefined
      ? points.reduce((prev, curr) =>
          Math.abs(curr.price - currentScenarioPrice) < Math.abs(prev.price - currentScenarioPrice)
            ? curr
            : prev
        )
      : null;

  // SVG path for payoff curve
  const pathData = points
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(pt.price)},${scaleY(pt.pnl)}`)
    .join(' ');

  const isBuy = side === 'BUY';

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="w-full overflow-x-auto bg-white p-2 rounded-xl border border-border">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[320px] select-none"
          role="img"
          aria-label={`Options Payoff diagram for ${side} ${type}. Breakeven at ${breakeven}.`}
        >
          <title>{`${side} ${type === 'CE' ? 'Call' : 'Put'} Payoff Diagram at Expiry`}</title>

          {/* Shaded Profit Zone background */}
          <rect
            x={padding.left}
            y={padding.top}
            width={innerWidth}
            height={Math.max(0, zeroY - padding.top)}
            fill="#E6FBF6"
            opacity="0.5"
          />

          {/* Shaded Loss Zone background */}
          <rect
            x={padding.left}
            y={zeroY}
            width={innerWidth}
            height={Math.max(0, padding.top + innerHeight - zeroY)}
            fill="#FEF0ED"
            opacity="0.5"
          />

          {/* Zero PnL Baseline */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={padding.left + innerWidth}
            y2={zeroY}
            stroke="#8B8FA8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={padding.left - 8}
            y={zeroY + 4}
            textAnchor="end"
            fontSize="10"
            fill="#44475B"
            fontWeight="bold"
          >
            ₹0
          </text>

          {/* Strike Reference Line */}
          {strikeX >= padding.left && strikeX <= padding.left + innerWidth && (
            <>
              <line
                x1={strikeX}
                y1={padding.top}
                x2={strikeX}
                y2={padding.top + innerHeight}
                stroke="#6B7280"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x={strikeX}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#4B5563"
              >
                Strike ({strike})
              </text>
            </>
          )}

          {/* Breakeven Reference Line */}
          {breakevenX >= padding.left && breakevenX <= padding.left + innerWidth && (
            <>
              <line
                x1={breakevenX}
                y1={padding.top}
                x2={breakevenX}
                y2={padding.top + innerHeight}
                stroke="#00B386"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={breakevenX}
                y={height - 24}
                textAnchor="middle"
                fontSize="10"
                fill="#007A58"
                fontWeight="bold"
              >
                BE ({Math.round(breakeven)})
              </text>
            </>
          )}

          {/* Spot Price Reference Marker */}
          {spotX >= padding.left && spotX <= padding.left + innerWidth && (
            <>
              <line
                x1={spotX}
                y1={padding.top}
                x2={spotX}
                y2={padding.top + innerHeight}
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="1 3"
              />
              <circle cx={spotX} cy={zeroY} r="3.5" fill="#3B82F6" />
              <text
                x={spotX}
                y={padding.top - 6}
                textAnchor="middle"
                fontSize="9"
                fill="#1D4ED8"
                fontWeight="bold"
              >
                Spot: ₹{spot.toFixed(0)}
              </text>
            </>
          )}

          {/* The Payoff Curve */}
          <path
            d={pathData}
            fill="none"
            stroke={isBuy ? '#007A58' : '#D97706'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Current Scenario Marker */}
          {scenarioX !== null && scenarioPoint !== null && (
            <g>
              <circle
                cx={scenarioX}
                cy={scaleY(scenarioPoint.pnl)}
                r="6"
                fill={scenarioPoint.pnl >= 0 ? '#10B981' : '#EF4444'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Zone Labels */}
          <text x={padding.left + 10} y={padding.top + 16} fill="#007A58" fontSize="11" fontWeight="bold">
            ▲ Profit Zone
          </text>
          <text
            x={padding.left + 10}
            y={padding.top + innerHeight - 10}
            fill="#EB5B3C"
            fontSize="11"
            fontWeight="bold"
          >
            ▼ Loss Zone {typeof maxLoss === 'number' ? `(Capped at −${formatINR(maxLoss)})` : ''}
          </text>
        </svg>
      </div>

      {/* Accessible Text Summary */}
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-bgSurface rounded-xl border border-border text-xs">
        <div>
          <span className="text-textMuted block text-[10px] font-semibold">Breakeven Price</span>
          <span className="font-extrabold text-textPrimary text-xs sm:text-[13px] tabular-nums mt-0.5 block">
            ₹{breakeven.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] text-textMuted block mt-0.5">At expiration</span>
        </div>
        <div>
          <span className="text-textMuted block text-[10px] font-semibold">Maximum Loss</span>
          <span className="font-extrabold text-loss text-xs sm:text-[13px] tabular-nums mt-0.5 block">
            {typeof maxLoss === 'number' ? `−${formatINR(maxLoss)}` : maxLoss}
          </span>
          <span className="text-[9px] text-textMuted block leading-tight mt-0.5">
            {isBuy ? '(Total premium paid)' : '(Under extreme move)'}
          </span>
        </div>
        <div>
          <span className="text-textMuted block text-[10px] font-semibold">Maximum Profit</span>
          <span className="font-extrabold text-gain text-xs sm:text-[13px] block mt-0.5">
            {maxProfit !== undefined
              ? maxProfit
              : isBuy
              ? type === 'CE'
                ? 'Unlimited'
                : `₹${((strike - (breakeven - strike)) * 25).toLocaleString('en-IN')}`
              : 'Capped at premium'}
          </span>
          <span className="text-[9px] text-textMuted block leading-tight mt-0.5">
            {isBuy ? 'Above breakeven' : 'Max return on entry'}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-textMuted text-center italic">
        * Payoff diagram represents the theoretical return <strong>at expiration</strong>. Prior to expiry, market valuation depends heavily on ongoing time decay and implied volatility.
      </p>
    </div>
  );
};
