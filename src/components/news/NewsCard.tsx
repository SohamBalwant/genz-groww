import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { NewsStory } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/format';
import { Video, ArrowRight, Info, CheckCircle2, Zap } from 'lucide-react';

export const NewsCard: React.FC<{ story: NewsStory }> = ({ story }) => {
  const navigate = useNavigate();

  const cleanPublisher = story.source.publisher
    .replace(/\s*\(Demo\)/gi, '')
    .replace(/\bDemo\s+/gi, '')
    .trim();

  return (
    <Card padding="md" className="space-y-3.5">
      {/* 1. Header: Publisher, Timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-textMuted">
          <span className="font-semibold text-textSecondary">{cleanPublisher}</span>
          <span>·</span>
          <span>{formatDate(story.source.publishedAt, { relative: true })}</span>
        </div>
      </div>

      {/* 2. Headline */}
      <h3
        onClick={() => navigate(`/news/${story.id}`)}
        className="text-base sm:text-lg font-bold text-textPrimary hover:text-primary-600 cursor-pointer transition-colors leading-snug"
      >
        {story.headline.replace(/\s*\(Demo\)/gi, '')}
      </h3>

      {/* Video placeholder tag if mediaType is video */}
      {story.mediaType === 'video-placeholder' && (
        <div className="p-3 bg-bgSurface rounded-xl border border-border flex items-center gap-2.5 text-xs text-textSecondary">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
            <Video size={16} aria-hidden="true" />
          </div>
          <div>
            <span className="font-semibold text-textPrimary block">Video Explainer</span>
            <span className="text-textMuted text-[11px]">Visual walkthrough and analysis</span>
          </div>
        </div>
      )}

      {/* 3. Confirmed Facts: "What Happened" */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-textPrimary">
          <CheckCircle2 size={14} className="text-primary-600 flex-shrink-0" aria-hidden="true" />
          <span>What happened</span>
        </div>
        <p className="text-xs sm:text-sm text-textSecondary leading-relaxed pl-5 pr-7 sm:pr-2">
          {story.summary}
        </p>
      </div>

      {/* 4. Analysis: "Why It Matters" */}
      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-1 pr-8 sm:pr-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
          <Info size={14} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
          <span>Why it matters</span>
        </div>
        <p className="text-xs text-blue-950/90 leading-relaxed">
          {story.whyItMatters}
        </p>
      </div>

      {/* 5. "Could be relevant to" Chips */}
      {story.relatedInstrumentIds.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-medium text-textMuted block">
            Could be relevant to:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {story.relatedInstrumentIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(`/instrument/${id}`)}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-bgSurface hover:bg-bgMuted border border-border text-textSecondary hover:text-textPrimary transition-colors inline-flex items-center gap-1"
              >
                <span>{id.replace(/^(stock|mf|bond|etf|ipo)-/, '').toUpperCase()}</span>
                <span className="text-[10px] text-textMuted">↗</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Action Buttons: side-by-side next to each other */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/80 overflow-x-auto no-scrollbar">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/news/${story.id}`)}
          rightIcon={<ArrowRight size={13} className="text-textMuted shrink-0" />}
          className="text-textSecondary hover:text-textPrimary border border-border bg-white hover:bg-bgSurface font-medium text-xs px-2.5 sm:px-3 whitespace-nowrap shrink-0"
        >
          Read full story
        </Button>

        {story.eventId && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/event/${story.eventId}`)}
            leftIcon={<Zap size={13} className="fill-white shrink-0" />}
            rightIcon={<ArrowRight size={13} className="shrink-0" />}
            className="font-bold shadow-sm shadow-primary-500/20 bg-primary-500 hover:bg-primary-600 text-white text-xs px-2.5 sm:px-3.5 whitespace-nowrap shrink-0"
          >
            Explore event impact
          </Button>
        )}
      </div>
    </Card>
  );
};
