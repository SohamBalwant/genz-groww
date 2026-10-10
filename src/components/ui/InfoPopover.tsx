import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface InfoPopoverProps {
  title?: string;
  content: React.ReactNode;
  term?: string;
  rupeeExample?: string;
  limitation?: string;
  externalLink?: { label: string; url: string };
  iconSize?: number;
  className?: string;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({
  title,
  content,
  term,
  rupeeExample,
  limitation,
  externalLink,
  iconSize = 15,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const displayTitle = title || term;

  return (
    <span className={`inline-flex items-center relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={displayTitle ? `Explain ${displayTitle}` : 'More information'}
        aria-expanded={isOpen}
        className="p-1 text-textMuted hover:text-primary-600 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 min-h-[28px] min-w-[28px] inline-flex items-center justify-center cursor-pointer"
      >
        <Info size={iconSize} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="region"
          aria-label={displayTitle || 'Information'}
          className="fixed inset-x-4 bottom-4 md:absolute md:inset-auto md:left-1/2 md:-translate-x-1/2 md:bottom-full md:mb-2 z-50 w-auto md:w-80 p-4 bg-white rounded-xl shadow-sheet md:shadow-card-hover border border-border text-xs text-textPrimary animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-border">
            <span className="font-semibold text-sm text-textPrimary">
              {displayTitle || 'Explanation'}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close explanation"
              className="p-1 -mr-1 text-textMuted hover:text-textPrimary rounded-md focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-2.5 text-textSecondary leading-relaxed">
            <div>{content}</div>

            {rupeeExample && (
              <div className="p-2.5 bg-primary-50/60 rounded-lg border border-primary-100 text-textPrimary">
                <span className="font-semibold text-primary-800 block mb-0.5">Rupee Example:</span>
                <span>{rupeeExample}</span>
              </div>
            )}

            {limitation && (
              <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200 text-amber-900">
                <span className="font-semibold text-amber-800 block mb-0.5">Important Limitation:</span>
                <span>{limitation}</span>
              </div>
            )}

            {externalLink && (
              <div className="pt-1 text-[11px]">
                <a
                  href={externalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Learn more at {externalLink.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <span className="text-textMuted ml-1">(External educational link)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
};

export const Tooltip: React.FC<{
  text: string;
  children: React.ReactNode;
  className?: string;
}> = ({ text, children, className = '' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 text-xs font-normal text-white bg-textPrimary rounded-md shadow-md whitespace-nowrap z-50 pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  );
};
