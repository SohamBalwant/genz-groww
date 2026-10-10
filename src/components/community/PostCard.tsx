import React, { useState } from 'react';
import type { Post } from '../../types';
import { Card } from '../ui/Card';
import { DemoBadge } from '../ui/DemoBadge';
import { ReportDialog } from './ReportDialog';
import { useApp } from '../../state/AppContext';
import { formatDate } from '../../lib/format';
import { Flag, ExternalLink } from 'lucide-react';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const { state } = useApp();
  const [showReport, setShowReport] = useState<boolean>(false);
  const isReported = state.reportedPosts.includes(post.id);

  return (
    <Card padding="md" className="space-y-3.5 bg-white border-border shadow-2xs rounded-2xl px-5 sm:px-6">
      {/* 1. Author Row & Metadata Header */}
      <div className="space-y-1.5 pb-2.5 border-b border-border/70">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-textPrimary leading-tight">
                {post.author.name}
              </span>
              <DemoBadge size="xs" />
            </div>
            <p className="text-[11px] text-textMuted leading-tight">{post.author.credentials}</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-textMuted shrink-0 pt-0.5">
            <span>{formatDate(post.publishedAt, { relative: true })}</span>
          </div>
        </div>
      </div>

      {/* 2. Sponsored Label if present */}
      {post.sponsored && (
        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-0.5">
          <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
            Sponsored by {post.sponsored.sponsor}
          </span>
          <p className="text-[11px] text-amber-950 leading-snug">{post.sponsored.disclosure}</p>
        </div>
      )}

      {/* 3. Post Title & Body */}
      <h3 className="font-bold text-base sm:text-lg text-textPrimary leading-snug tracking-tight">
        {post.title}
      </h3>
      <p className="text-xs sm:text-sm text-textSecondary leading-relaxed whitespace-pre-line">
        {post.body}
      </p>

      {/* 4. Conflict of Interest Disclosure */}
      <div className="p-3 bg-slate-50/80 rounded-xl border border-border text-[11px] text-textMuted space-y-1">
        <span className="font-semibold text-textSecondary block text-[10px] uppercase tracking-wider">
          Conflict of Interest Disclosure:
        </span>
        <p className="text-xs text-textSecondary leading-relaxed">
          {post.conflictsDisclosure || 'No disclosures provided.'}
        </p>
      </div>

      {/* 5. External Source Links */}
      {post.sources && post.sources.length > 0 && (
        <div className="space-y-1.5 text-xs pt-0.5">
          <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">
            Author Sources & References:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {post.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200 transition-colors"
              >
                <span>{src.label}</span>
                <ExternalLink size={10} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tags & Report Button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200/60"
            >
              #{t}
            </span>
          ))}
        </div>

        <div>
          {isReported ? (
            <span className="text-[11px] text-loss font-semibold inline-flex items-center gap-1">
              <Flag size={12} /> You reported this
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="text-[11px] text-textMuted hover:text-loss transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              <Flag size={12} />
              <span>Report</span>
            </button>
          )}
        </div>
      </div>

      <ReportDialog
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        postId={post.id}
      />
    </Card>
  );
};
