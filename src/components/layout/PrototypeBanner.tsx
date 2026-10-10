import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export const PrototypeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('genz_groww_banner_dismissed') === 'true';
      if (isDismissed) setDismissed(true);
    } catch {
      // ignore sessionStorage issues
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('genz_groww_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Prototype notice"
      className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 text-xs text-amber-900 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-700 flex-shrink-0" aria-hidden="true" />
          <p className="leading-tight text-[11px] sm:text-xs">
            <span className="font-bold">Prototype · Demo Data & Simulated Trades:</span> Not real
            market data. Not financial advice. Independent PM internship case study, not an official
            Groww product.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss prototype banner"
          className="p-1 text-amber-750 hover:text-amber-950 rounded hover:bg-amber-100 flex-shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-amber-600"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
