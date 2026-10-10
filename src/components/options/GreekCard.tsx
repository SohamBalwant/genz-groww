import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, BookOpen, Sparkles } from 'lucide-react';

export interface GreekCardProps {
  greek: 'delta' | 'gamma' | 'theta' | 'vega' | 'rho';
  value: number;
  type: 'CE' | 'PE';
  underlyingPrice?: number;
  strikePrice?: number;
  showLearnLink?: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const GREEK_METADATA = {
  delta: {
    symbol: 'Δ',
    name: 'Delta',
    unit: 'sensitivity per ₹1 move in underlying',
    definition:
      'Delta estimates how much the option premium may change for a ₹1 move in the underlying price, holding all other factors constant.',
    whyItMatters:
      'Call Delta ranges from 0 to +1.0, while Put Delta ranges from -1.0 to 0. Near ATM, Delta is roughly ±0.50. High Delta means the option closely tracks the underlying asset.',
    deepDive:
      'Delta also roughly approximates the statistical probability of the option expiring In The Money (ITM). For example, a Delta of +0.30 indicates roughly a 30% chance of expiring ITM. Remember: Delta changes continuously as the stock moves (this rate of change is measured by Gamma).',
    learnPath: '/learn?tab=paths',
  },
  gamma: {
    symbol: 'Γ',
    name: 'Gamma',
    unit: 'change in Delta per ₹1 move',
    definition:
      'Gamma measures the rate of acceleration of Delta when the underlying stock moves by ₹1.',
    whyItMatters:
      'Gamma is highest for At-The-Money (ATM) options near expiry. When Gamma is high, small stock moves cause dramatic swings in Delta and option premium.',
    deepDive:
      'Think of Delta as velocity and Gamma as acceleration. Option buyers benefit from high positive Gamma because winning positions gain Delta and accelerate profits, while losing positions shed Delta and decelerate losses.',
    learnPath: '/learn?tab=paths',
  },
  theta: {
    symbol: 'Θ',
    name: 'Theta',
    unit: 'decay in ₹ per calendar day',
    definition:
      'Theta measures daily time decay—the amount of premium an option loses each day as expiration approaches, assuming spot price and volatility stay unchanged.',
    whyItMatters:
      'Theta is always negative for long option buyers (time works against you) and positive for option sellers. Decay accelerates exponentially in the final 10-14 days before expiry.',
    deepDive:
      'Time decay is non-linear. An option with 60 days to expiry loses time value slowly, but during the final week, Theta decay spikes sharply. Weekend decay is typically priced in across trading sessions.',
    learnPath: '/learn?tab=paths',
  },
  vega: {
    symbol: 'ν',
    name: 'Vega',
    unit: 'premium change per 1% change in IV',
    definition:
      'Vega measures how much the option premium changes when Implied Volatility (IV) increases or decreases by 1 percentage point.',
    whyItMatters:
      'Rising market uncertainty increases option premiums across both calls and puts. A sudden drop in IV (such as after an earnings announcement or budget) causes an "IV crush," devaluing options even if the underlying moved in your direction.',
    deepDive:
      'Vega is highest for At-The-Money options with longer time to expiry. If an option has a Vega of ₹12.50, a 2% rise in IV will add approximately ₹25.00 to the option premium, independent of stock price movement.',
    learnPath: '/learn?tab=paths',
  },
  rho: {
    symbol: 'ρ',
    name: 'Rho',
    unit: 'premium change per 1% change in risk-free rate',
    definition:
      'Rho measures the option premium sensitivity to a 1 percentage point change in benchmark interest rates (e.g. RBI repo rate).',
    whyItMatters:
      'Calls generally have positive Rho (higher rates increase call values due to the cost of carry), while Puts have negative Rho. For short-dated options, Rho is typically small.',
    deepDive:
      'Because Indian equity options are predominantly short-dated (weekly and monthly), Rho has minimal day-to-day impact compared to Delta, Theta, and Vega. It becomes more noticeable for multi-month LEAPs.',
    learnPath: '/learn?tab=paths',
  },
};

export const GreekCard: React.FC<GreekCardProps> = ({
  greek,
  value,
  type,
  showLearnLink = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const meta = GREEK_METADATA[greek];

  // Visual Gauge logic
  let visualGauge: React.ReactNode = null;

  if (greek === 'delta') {
    // Delta ranges from -1 to +1
    // Map to percentage [0, 100] where 50% is 0
    const pct = ((value + 1) / 2) * 100;
    const isCall = type === 'CE';

    visualGauge = (
      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[10px] text-textMuted">
          <span>-1.0 (Deep Put)</span>
          <span className="font-semibold text-textSecondary">0 (ATM/Neutral)</span>
          <span>+1.0 (Deep Call)</span>
        </div>
        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-border">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 z-10" />
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCall ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            style={{
              width: `${Math.abs(value) * 50}%`,
              marginLeft: value >= 0 ? '50%' : `${pct}%`,
            }}
          />
        </div>
        <div className="text-[10px] text-textMuted flex justify-between">
          <span>{value < 0 ? 'Bearish exposure' : 'Bullish exposure'}</span>
          <span className="font-medium text-textPrimary">
            ~{Math.round(Math.abs(value) * 100)}% stock movement parity
          </span>
        </div>
      </div>
    );
  } else if (greek === 'theta') {
    // Theta decay meter
    visualGauge = (
      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[10px] text-textMuted">
          <span>Slow decay</span>
          <span className="font-semibold text-loss">Daily Erosion Rate</span>
          <span>High decay</span>
        </div>
        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(10, Math.abs(value) * 12))}%` }}
          />
        </div>
        <div className="text-[10px] text-loss font-medium">
          Loses approximately ₹{Math.abs(value).toFixed(2)} per share every calendar day
        </div>
      </div>
    );
  } else if (greek === 'vega') {
    visualGauge = (
      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[10px] text-textMuted">
          <span>Low IV sensitivity</span>
          <span className="font-semibold text-indigo-600">IV Sensitivity</span>
          <span>High sensitivity</span>
        </div>
        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(15, value * 6))}%` }}
          />
        </div>
        <div className="text-[10px] text-indigo-700 font-medium">
          Premium shifts by ±₹{value.toFixed(2)} per 1% change in market volatility
        </div>
      </div>
    );
  } else if (greek === 'gamma') {
    visualGauge = (
      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[10px] text-textMuted">
          <span>Stable Delta</span>
          <span className="font-semibold text-amber-700">Delta Acceleration</span>
          <span>Rapid Delta Shifts</span>
        </div>
        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(15, value * 15000))}%` }}
          />
        </div>
        <div className="text-[10px] text-textMuted">
          Delta accelerates by {value.toFixed(4)} for every ₹1 the stock moves
        </div>
      </div>
    );
  }

  // Formatting display value
  const displayValue =
    greek === 'delta'
      ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
      : greek === 'gamma'
      ? value.toFixed(4)
      : greek === 'theta'
      ? `−₹${Math.abs(value).toFixed(2)}`
      : greek === 'vega'
      ? `+₹${value.toFixed(2)}`
      : `${value >= 0 ? '+' : ''}₹${value.toFixed(2)}`;

  return (
    <div className="p-3.5 bg-white rounded-xl border border-border space-y-2.5 transition-all shadow-2xs hover:border-borderMd">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary-700 font-extrabold flex items-center justify-center text-sm border border-primary-200">
            {meta.symbol}
          </span>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-textPrimary leading-tight flex items-center gap-1.5">
              <span>{meta.name}</span>
              <span className="text-[10px] text-textMuted font-normal">({meta.symbol})</span>
            </h4>
            <span className="text-[10px] text-textMuted block leading-none">{meta.unit}</span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`text-base font-extrabold tabular-nums tracking-tight ${
              greek === 'theta'
                ? 'text-loss'
                : greek === 'delta' && value < 0
                ? 'text-loss'
                : greek === 'delta' && value > 0
                ? 'text-gain'
                : 'text-textPrimary'
            }`}
          >
            {displayValue}
          </span>
        </div>
      </div>

      {/* Visual Gauge */}
      {visualGauge}

      {/* Plain-English Definition */}
      <p className="text-xs text-textSecondary leading-relaxed">{meta.definition}</p>

      {/* Why it Matters Callout */}
      <div className="p-2.5 bg-bgSurface rounded-lg border border-border text-[11px] text-textSecondary space-y-1">
        <div className="font-semibold text-textPrimary flex items-center gap-1">
          <Sparkles size={12} className="text-primary-600" />
          <span>Why this matters for your trade:</span>
        </div>
        <p className="leading-snug">{meta.whyItMatters}</p>
      </div>

      {/* Expandable Deep Dive */}
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer"
        >
          <span>{expanded ? 'Hide Deep Dive' : 'Explore Deep Dive & Intuition'}</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {expanded && (
          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-textSecondary leading-relaxed animate-fadeIn space-y-2">
            <p>{meta.deepDive}</p>
            {showLearnLink && (
              <div className="pt-1 border-t border-slate-200/60">
                <Link
                  to={meta.learnPath}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:underline"
                >
                  <BookOpen size={12} />
                  <span>Learn {meta.name} in Curriculum Module 2 →</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
