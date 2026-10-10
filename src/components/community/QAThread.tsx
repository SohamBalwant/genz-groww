import React, { useState } from 'react';
import type { Thread } from '../../types';
import { Card } from '../ui/Card';
import { DemoBadge } from '../ui/DemoBadge';
import { formatDate } from '../../lib/format';
import { MessageSquare, ThumbsUp, ShieldCheck, ExternalLink } from 'lucide-react';

export const QAThread: React.FC<{ thread: Thread }> = ({ thread }) => {
  const [helpfulCount, setHelpfulCount] = useState<number>(3);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount((c) => c + 1);
      setHasVoted(true);
    }
  };

  return (
    <Card padding="md" className="space-y-3.5 bg-white border-border shadow-2xs rounded-2xl">
      {/* Question Header */}
      <div className="space-y-1.5 pb-2 border-b border-border/70">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-primary-50 text-primary-700 rounded-md">
              <MessageSquare size={14} aria-hidden="true" />
            </span>
            <span className="text-xs text-textMuted">
              Asked by <span className="font-semibold text-textSecondary">{thread.askedBy}</span> · {formatDate(thread.askedAt, { relative: true })}
            </span>
            <DemoBadge size="xs" />
          </div>
        </div>
        <h3 className="font-bold text-base sm:text-lg text-textPrimary leading-snug tracking-tight">
          {thread.question}
        </h3>
      </div>

      {/* Answers List */}
      <div className="space-y-3 pt-1">
        {thread.answers.map((ans) => (
          <div key={ans.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-border space-y-2 text-xs">
            {/* Author row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-textPrimary">{ans.author.name}</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary-700 bg-primary-100 px-1.5 py-0.5 rounded">
                  <ShieldCheck size={11} aria-hidden="true" /> Verified Expert
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed whitespace-pre-line">
              {ans.body}
            </p>

            {ans.sources && ans.sources.length > 0 && (
              <div className="flex items-center gap-2 pt-1 border-t border-border/60 text-[11px]">
                <span className="text-textMuted font-medium">Source:</span>
                {ans.sources.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>{s.label}</span>
                    <ExternalLink size={10} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer: Tags & Helpful Button */}
      <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {thread.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200/60"
            >
              #{t}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors min-h-[32px] cursor-pointer ${
            hasVoted
              ? 'bg-primary-50 text-primary-700 border-primary-200'
              : 'bg-white hover:bg-slate-50 text-textSecondary border-border'
          }`}
        >
          <ThumbsUp size={12} aria-hidden="true" />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </Card>
  );
};
