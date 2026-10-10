import React from 'react';
import { Card } from '../ui/Card';
import { ShieldCheck } from 'lucide-react';

export const GuidelinesCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card padding="md" className={`bg-white border-border rounded-2xl shadow-2xs space-y-3.5 ${className}`}>
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-primary-600" aria-hidden="true" />
        <h3 className="font-bold text-sm sm:text-base text-textPrimary">Community Standards & Rules</h3>
      </div>

      <ul className="space-y-2 text-xs sm:text-sm text-textSecondary leading-relaxed list-disc pl-5">
        <li>
          <strong className="text-textPrimary">No stock tips or return promises:</strong> Never present price directions as certainties.
        </li>
        <li>
          <strong className="text-textPrimary">No sharing financial values:</strong> Keep personal balances, net worth, and exact rupee portfolio figures private.
        </li>
        <li>
          <strong className="text-textPrimary">Disclose affiliations:</strong> Any commercial sponsorship or personal holding must be prominently stated.
        </li>
        <li>
          <strong className="text-textPrimary">Zero solicitation:</strong> No advisory groups, WhatsApp channels, or copy-trading links permitted.
        </li>
      </ul>
    </Card>
  );
};
