import React from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';

export const FactVsAnalysis: React.FC<{
  facts: string[];
  analysis: string[];
  caveats?: string[];
}> = ({ facts, analysis, caveats }) => {
  return (
    <div className="space-y-4">
      {/* 1. Confirmed Facts Section */}
      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2.5">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
          <CheckCircle2 size={16} className="text-primary-600" aria-hidden="true" />
          <span>What Happened</span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-950/90 leading-relaxed list-disc list-inside">
          {facts.map((fact, i) => (
            <li key={i}>{fact}</li>
          ))}
        </ul>
      </div>

      {/* 2. Analysis / Why It Matters Section */}
      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-2.5">
        <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
          <HelpCircle size={16} className="text-blue-600" aria-hidden="true" />
          <span>Why It Matters (Possibilities, not guarantees)</span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-blue-950/90 leading-relaxed list-disc list-inside">
          {analysis.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* 3. Caveats / Uncertainties if provided */}
      {caveats && caveats.length > 0 && (
        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <span className="font-semibold block text-amber-800">Uncertainties to keep in mind:</span>
          <ul className="list-disc list-inside space-y-1 leading-relaxed text-[11px]">
            {caveats.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
