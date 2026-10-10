import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  subtitle?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`divide-y divide-border border-y border-border ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);
        return (
          <div key={item.id} className="py-1">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
              className="w-full py-3.5 px-2 flex items-center justify-between text-left transition-colors hover:bg-bgSurface/60 rounded-lg min-h-[44px] focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              <div>
                <span className="font-medium text-sm text-textPrimary block">{item.title}</span>
                {item.subtitle && (
                  <span className="text-xs text-textMuted mt-0.5 block">{item.subtitle}</span>
                )}
              </div>
              <ChevronDown
                size={18}
                className={`text-textMuted transition-transform duration-150 flex-shrink-0 ml-2 ${
                  isExpanded ? 'rotate-180 text-primary-600' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {isExpanded && (
              <div
                id={`accordion-content-${item.id}`}
                role="region"
                className="px-2 pt-1 pb-4 text-xs text-textSecondary leading-relaxed animate-in fade-in duration-150"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
