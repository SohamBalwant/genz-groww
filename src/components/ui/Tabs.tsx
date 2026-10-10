import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className = '',
  variant = 'underline',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      onChange(items[nextIndex].id);
      const tabElement = document.getElementById(`tab-${items[nextIndex].id}`);
      tabElement?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`flex items-center gap-1 overflow-x-auto no-scrollbar ${
        variant === 'underline' ? 'border-b border-border' : 'p-1 bg-bgMuted rounded-xl'
      } ${className}`}
    >
      {items.map((item, index) => {
        const isActive = item.id === activeId;

        const tabStyles =
          variant === 'underline'
            ? `px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap shrink-0 min-h-[44px] flex items-center gap-2 ${
                isActive
                  ? 'border-primary-500 text-primary-600 font-semibold'
                  : 'border-transparent text-textSecondary hover:text-textPrimary hover:border-borderMd'
              }`
            : `px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 min-h-[36px] flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white text-textPrimary shadow-sm font-semibold'
                  : 'text-textSecondary hover:text-textPrimary'
              }`;

        return (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${item.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`focus-visible:outline-2 focus-visible:outline-primary-500 select-none ${tabStyles}`}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-normal ${
                  isActive ? 'bg-primary-100 text-primary-800' : 'bg-bgMuted text-textMuted'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
