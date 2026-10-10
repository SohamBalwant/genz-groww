import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { FactVsAnalysis } from '../components/news/FactVsAnalysis';
import { SourceBlock } from '../components/news/SourceBlock';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import { formatDateIST } from '../lib/format';
import type { NewsStory, Instrument } from '../types';

export const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<NewsStory | null>(null);
  const [relatedInstruments, setRelatedInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const item = await dataService.getNewsStoryById(id);
        if (mounted && item) {
          setStory(item);
          // Fetch related instruments
          if (item.relatedInstrumentIds && item.relatedInstrumentIds.length > 0) {
            const instList = await Promise.all(
              item.relatedInstrumentIds.map((instId) => dataService.getInstrumentById(instId))
            );
            if (mounted) {
              setRelatedInstruments(instList.filter(Boolean) as Instrument[]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load story:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-textPrimary">Story Not Found</h2>
        <p className="text-sm text-textSecondary">
          The requested article could not be loaded or may be part of an expired simulation session.
        </p>
        <Button onClick={() => navigate('/news')}>Back to News Feed</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top back navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to previous
        </button>
      </div>

      {/* Main article header */}
      <header className="space-y-3 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800">
            {story.category}
          </span>
          <span className="text-xs text-textMuted">·</span>
          <span className="text-xs text-textMuted capitalize">
            {story.level} friendly
          </span>
          <DemoBadge size="xs" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-textPrimary tracking-tight leading-snug">
          {story.headline.replace(/\s*\(Demo\)/gi, '')}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-textMuted pt-1">
          <span>By {story.source.publisher.replace(/\s*\(Demo\)/gi, '').replace(/\bDemo\s+/gi, '').trim()}</span>
          <span>•</span>
          <span>{formatDateIST(story.source.publishedAt)}</span>
        </div>
      </header>

      {/* Associated Market Event Link (if tied to RBI/Results/Oil event) */}
      {story.eventId && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Part of Broader Market Event
            </span>
            <p className="text-xs text-blue-900 font-medium">
              This announcement has multi-asset implications across banking, equity, and debt markets.
            </p>
          </div>
          <Link
            to={`/event/${story.eventId}`}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
          >
            Explore Full Event
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Executive Summary */}
      <div className="bg-bgSurface border border-border rounded-xl p-4 md:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-2">
          Plain-English Summary
        </h2>
        <p className="text-sm md:text-base text-textPrimary leading-relaxed">
          {story.summary}
        </p>
      </div>

      {/* Structured Fact vs Analysis Component */}
      <section aria-label="Facts vs Interpretation">
        <FactVsAnalysis
          facts={[story.summary]}
          analysis={[story.whyItMatters]}
        />
      </section>

      {/* Could Be Relevant To: Linked Instruments */}
      {relatedInstruments.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-primary-600" />
            <h2 className="text-base font-bold text-textPrimary">
              Instruments Linked to This Development
            </h2>
          </div>
          <p className="text-xs text-textSecondary">
            Review these securities with balanced context. Past performance or event sensitivity is not a guarantee of future movement.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {relatedInstruments.map((inst) => {
              const reason = story.relevanceReasons[inst.id] || 'Sector sensitivity';

              return (
                <div
                  key={inst.id}
                  className="bg-white border border-border hover:border-primary-300 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-textMuted uppercase">
                        {inst.assetClass}
                      </span>
                      <DemoBadge size="xs" />
                    </div>
                    <h3 className="font-bold text-sm text-textPrimary mt-0.5">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-textSecondary mt-1 leading-snug">
                      <strong>Relevance: </strong>
                      {reason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-textPrimary">
                      {'price' in inst
                        ? `₹${inst.price}`
                        : 'nav' in inst
                        ? `₹${inst.nav}`
                        : 'minInvestment' in inst
                        ? `₹${inst.minInvestment}`
                        : ''}
                    </span>
                    <Link
                      to={`/instrument/${inst.id}`}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Source block */}
      <div className="pt-4">
        <SourceBlock source={story.source} />
      </div>
    </div>
  );
};
