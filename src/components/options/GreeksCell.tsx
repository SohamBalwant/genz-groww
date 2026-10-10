import React from 'react';

interface GreeksCellProps {
  delta: number;
  gamma: number;
  theta: number;
  compact?: boolean;
}

export const GreeksCell: React.FC<GreeksCellProps> = ({
  delta,
  gamma,
  theta,
  compact = false,
}) => {
  return (
    <div className={`tabular-nums text-[10px] text-textMuted ${compact ? 'flex items-center gap-1.5' : 'space-y-0.5'}`}>
      <span title="Delta: Estimated premium change for ₹1 underlying move">
        <strong className="text-textSecondary font-semibold">Δ:</strong> {delta.toFixed(2)}
      </span>
      <span title="Gamma: Rate of change of Delta">
        <strong className="text-textSecondary font-semibold">Γ:</strong> {gamma.toFixed(4)}
      </span>
      <span title="Theta: Daily time decay lost per share">
        <strong className="text-textSecondary font-semibold">Θ:</strong> {theta.toFixed(1)}
      </span>
    </div>
  );
};
