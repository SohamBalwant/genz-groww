import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxHeight?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[85vh]',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-white rounded-t-3xl shadow-sheet border-t border-border p-4 sm:p-5 text-textPrimary relative ${maxHeight} overflow-y-auto scrollbar-thin animate-in slide-in-from-bottom-6 duration-200`}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-borderMd rounded-full mx-auto mb-3" aria-hidden="true" />

        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
          {title ? (
            <h2 className="text-base font-bold text-textPrimary">{title}</h2>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="p-1.5 text-textMuted hover:text-textPrimary rounded-lg focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
