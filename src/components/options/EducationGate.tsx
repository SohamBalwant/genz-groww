import React, { useState } from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface EducationGateProps {
  onAcknowledge: () => void;
  onCancel: () => void;
}

export const EducationGate: React.FC<EducationGateProps> = ({
  onAcknowledge,
  onCancel,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="card p-6 md:p-8 max-w-xl mx-auto space-y-6 border-amber-200 bg-amber-50/20 shadow-md">
      {/* Warning Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={22} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-textPrimary">
            Before You Look at Options (F&O)
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Derivatives education gate · Understanding risk before exploring contracts
          </p>
        </div>
      </div>

      {/* Structured Educational Bullets */}
      <div className="space-y-3 text-xs md:text-sm text-textSecondary leading-relaxed bg-white p-4 rounded-xl border border-border">
        <div className="flex items-start gap-2.5">
          <span className="text-primary-600 font-bold">•</span>
          <p>
            <strong className="text-textPrimary">What an option is:</strong> A contract giving you the right, but not the obligation, to buy (Call) or sell (Put) an underlying asset at a specified strike price on or before expiry.
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="text-primary-600 font-bold">•</span>
          <p>
            <strong className="text-textPrimary">Fixed lot size:</strong> You trade in fixed lots (e.g., 250 shares per lot for this company), never individual single shares. This magnifies total rupee exposure.
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="text-primary-600 font-bold">•</span>
          <p>
            <strong className="text-textPrimary">Time decay (Theta):</strong> Options lose value as expiration approaches, even if the stock price remains unchanged.
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="text-primary-600 font-bold">•</span>
          <p>
            <strong className="text-textPrimary">Capital loss risk:</strong> Long options can lose up to 100% of the premium paid if they expire out of the money.
          </p>
        </div>
      </div>

      {/* Regulatory Context Warning */}
      <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-loss space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <AlertCircle size={15} aria-hidden="true" />
          <span>Statutory Warning on Derivative Trading</span>
        </div>
        <p className="text-[11px] text-red-900 leading-relaxed">
          According to regulatory findings, over 90% of individual retail traders in equity derivatives incur net financial losses. Derivatives are designed for institutional hedging, not guaranteed quick returns.
        </p>
      </div>

      {/* Mandatory Checkbox Gate */}
      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-borderMd text-primary-600 focus:ring-primary-500"
        />
        <span className="text-xs text-textPrimary font-medium leading-snug">
          I understand that options can lose the entire premium paid in a short time. I am reviewing this illustrative data for educational understanding.
        </span>
      </label>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          variant="primary"
          fullWidth
          disabled={!isChecked}
          onClick={onAcknowledge}
        >
          Proceed to Option Chain
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onClick={onCancel}
        >
          Take Me Back
        </Button>
      </div>
    </div>
  );
};
