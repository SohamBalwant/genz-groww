import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { DemoBadge } from '../ui/DemoBadge';
import {
  X,
  BookOpen,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

export interface HowOptionsWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowOptionsWorkModal: React.FC<HowOptionsWorkModalProps> = ({ isOpen, onClose }) => {
  const [openQuestions, setOpenQuestions] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  if (!isOpen) return null;

  const toggleQuestion = (qNum: number) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [qNum]: !prev[qNum],
    }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How Options Work Beginner Guide"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-full sm:max-w-[420px] w-full p-4 sm:p-5 space-y-4 shadow-2xl border-t sm:border border-border animate-slideUp sm:animate-scaleIn max-h-[88vh] sm:max-h-[85vh] overflow-y-auto scrollbar-thin"
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden -mt-1 mb-1" aria-hidden="true" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                Beginner Primer
              </span>
              <DemoBadge size="xs" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-textPrimary leading-snug">
              Demystifying Options: 5 Core Questions
            </h3>
            <p className="text-[11px] sm:text-xs text-textSecondary">
              A plain-English breakdown of contracts, chains, Greeks, and risks for young investors.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-textMuted hover:text-textPrimary hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close options guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* 5 Questions Expandable Accordion Cards */}
        <div className="space-y-3 text-xs">
          {/* Question 1 */}
          <div className="p-3 bg-bgSurface rounded-xl border border-border space-y-2">
            <button
              type="button"
              onClick={() => toggleQuestion(1)}
              className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-textPrimary cursor-pointer gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] shrink-0">
                  1
                </span>
                <h4 className="leading-snug">What is actually happening in the options market?</h4>
              </div>
              <ChevronDown
                size={16}
                className={`text-textMuted shrink-0 transition-transform duration-200 ${
                  openQuestions[1] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openQuestions[1] && (
              <div className="space-y-2 pt-1 text-xs">
                <p className="text-textSecondary leading-relaxed">
                  An <strong>Option</strong> is a financial contract that gives the buyer the <em>right</em> (but not the obligation) to buy or sell an underlying stock or index at a set price (the <strong>Strike</strong>) before a deadline (the <strong>Expiry</strong>).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-white rounded-lg border border-border">
                    <strong className="text-emerald-700 block text-xs">Calls (CE):</strong>
                    <span className="text-[11px] text-textSecondary">Right to BUY. Used when you anticipate the stock will rise above the strike + premium paid.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-border">
                    <strong className="text-rose-700 block text-xs">Puts (PE):</strong>
                    <span className="text-[11px] text-textSecondary">Right to SELL. Used when you anticipate the stock will drop below the strike − premium paid.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="p-3 bg-bgSurface rounded-xl border border-border space-y-2">
            <button
              type="button"
              onClick={() => toggleQuestion(2)}
              className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-textPrimary cursor-pointer gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] shrink-0">
                  2
                </span>
                <h4 className="leading-snug">How do I read an Option Chain?</h4>
              </div>
              <ChevronDown
                size={16}
                className={`text-textMuted shrink-0 transition-transform duration-200 ${
                  openQuestions[2] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openQuestions[2] && (
              <div className="space-y-2 pt-1 text-xs">
                <p className="text-textSecondary leading-relaxed">
                  The Option Chain arranges all active strike prices down the center column:
                </p>
                <ul className="pl-4 space-y-1 text-textSecondary text-[11px] sm:text-xs list-disc">
                  <li>
                    <strong>Left Side (Calls):</strong> Shows Call prices, trading volume, and open interest.
                  </li>
                  <li>
                    <strong>Center Column (Strike):</strong> The target exercise price. Highlighted row is <strong>ATM (At-The-Money)</strong>, nearest to spot market price.
                  </li>
                  <li>
                    <strong>Right Side (Puts):</strong> Shows Put prices, trading volume, and open interest.
                  </li>
                  <li>
                    <strong>In-The-Money (ITM):</strong> Shaded rows that already possess intrinsic value.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="p-3 bg-bgSurface rounded-xl border border-border space-y-2">
            <button
              type="button"
              onClick={() => toggleQuestion(3)}
              className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-textPrimary cursor-pointer gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] shrink-0">
                  3
                </span>
                <h4 className="leading-snug">What do Delta, Gamma, Theta, and Vega actually mean?</h4>
              </div>
              <ChevronDown
                size={16}
                className={`text-textMuted shrink-0 transition-transform duration-200 ${
                  openQuestions[3] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openQuestions[3] && (
              <div className="space-y-2 pt-1 text-xs">
                <p className="text-textSecondary leading-relaxed">
                  Option "Greeks" are sensitivity meters estimating how your premium moves when market conditions change:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-border">
                    <strong className="text-primary-700 block text-xs">Delta (Δ): Direction</strong>
                    <span className="text-[11px] text-textSecondary">Estimated ₹ change in premium for a ₹1 move in the stock.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-border">
                    <strong className="text-amber-700 block text-xs">Gamma (Γ): Acceleration</strong>
                    <span className="text-[11px] text-textSecondary">How quickly Delta changes when the stock moves.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-border">
                    <strong className="text-rose-700 block text-xs">Theta (Θ): Time Decay</strong>
                    <span className="text-[11px] text-textSecondary">Daily erosion in premium value just from the passage of time.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-border">
                    <strong className="text-indigo-700 block text-xs">Vega (ν): Volatility</strong>
                    <span className="text-[11px] text-textSecondary">Sensitivity to a 1% shift in market implied volatility.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question 4 */}
          <div className="p-3 bg-bgSurface rounded-xl border border-border space-y-2">
            <button
              type="button"
              onClick={() => toggleQuestion(4)}
              className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-textPrimary cursor-pointer gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] shrink-0">
                  4
                </span>
                <h4 className="leading-snug">How might an option behave under different market scenarios?</h4>
              </div>
              <ChevronDown
                size={16}
                className={`text-textMuted shrink-0 transition-transform duration-200 ${
                  openQuestions[4] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openQuestions[4] && (
              <div className="pt-1 text-xs">
                <p className="text-textSecondary leading-relaxed">
                  An option's price is not driven by the stock price alone. If you buy a Call and the stock moves up by ₹5, but 5 days have passed and market volatility drops, your option premium might actually <em>decline</em>! Use the <strong>Scenario Explorer</strong> to test these three interactive forces simultaneously before putting on any trade.
                </p>
              </div>
            )}
          </div>

          {/* Question 5 */}
          <div className="p-3 bg-bgSurface rounded-xl border border-border space-y-2">
            <button
              type="button"
              onClick={() => toggleQuestion(5)}
              className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-textPrimary cursor-pointer gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] shrink-0">
                  5
                </span>
                <h4 className="leading-snug">What could I gain or lose if I simulate a trade?</h4>
              </div>
              <ChevronDown
                size={16}
                className={`text-textMuted shrink-0 transition-transform duration-200 ${
                  openQuestions[5] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openQuestions[5] && (
              <div className="pt-1 text-xs space-y-1.5">
                <p className="text-textSecondary leading-relaxed">
                  <strong>Buyers:</strong> Maximum loss is capped strictly at the premium paid (outlay). Upside can be large if the stock makes an explosive move beyond your breakeven.
                </p>
                <p className="text-textSecondary leading-relaxed">
                  <strong>Sellers:</strong> Maximum profit is capped at the premium collected, but risk is mathematically unbounded. That is why our Options Lab provides a sandbox <strong>Paper-Trading Simulator</strong> to explore both sides safely.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Responsible Risk Warning */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong className="font-bold">SEBI Regulatory Fact:</strong> 9 out of 10 individual traders in equity futures and options incur net losses. Never trade derivatives with money you cannot afford to lose.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-border">
          <Link
            to="/learn?tab=paths"
            onClick={onClose}
            className="text-xs font-semibold text-primary-600 hover:underline flex items-center justify-center sm:justify-start gap-1.5 py-1"
          >
            <BookOpen size={14} />
            <span>Go to Structured Learn Modules</span>
          </Link>

          <Button size="sm" variant="primary" onClick={onClose} className="w-full sm:w-auto">
            <span>Got it, Open Options Lab</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
