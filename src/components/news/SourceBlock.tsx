import React from 'react';
import type { Source } from '../../types';
import { formatDate } from '../../lib/format';
import { ExternalLink } from 'lucide-react';

export const SourceBlock: React.FC<{
  source?: Source;
  className?: string;
}> = ({ source, className = '' }) => {
  if (!source || !source.publisher) {
    return (
      <div className={`p-3 bg-bgSurface rounded-xl border border-border text-xs text-textMuted ${className}`}>
        Source information not available for this record.
      </div>
    );
  }

  return (
    <div
      className={`p-3 bg-bgSurface rounded-xl border border-border flex items-center justify-between text-xs text-textSecondary ${className}`}
    >
      <div>
        <span className="font-semibold text-textPrimary block">
          {source.publisher.replace(/\s*\(Demo\)/gi, '').replace(/\bDemo\s+/gi, '').trim()}
        </span>
        <span className="text-textMuted text-[11px]">
          Published: {formatDate(source.publishedAt, { includeTime: true })}
        </span>
      </div>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 hover:underline font-medium inline-flex items-center gap-1"
        aria-label={`View external source from ${source.publisher}`}
      >
        <span>View source</span>
        <ExternalLink size={13} aria-hidden="true" />
      </a>
    </div>
  );
};
