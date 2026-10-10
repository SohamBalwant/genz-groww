import React from 'react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  count,
  icon,
  children,
  className = '',
  ...props
}) => {
  const activeStyles = active
    ? 'bg-primary-50 text-primary-700 border-primary-500 font-semibold shadow-xs'
    : 'bg-white text-textSecondary hover:bg-bgSurface hover:text-textPrimary border-border font-medium';

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors border select-none min-h-[36px] focus-visible:outline-2 focus-visible:outline-primary-500 ${activeStyles} ${className}`}
      aria-pressed={active}
      {...props}
    >
      {icon && <span aria-hidden="true" className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
            active ? 'bg-primary-200 text-primary-800' : 'bg-bgMuted text-textMuted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
