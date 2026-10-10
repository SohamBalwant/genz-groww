import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { NewsCard } from '../components/news/NewsCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { Play, BookOpen, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import type { NewsStory, NewsCategory } from '../types';

export const News: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate'>('all');

  // Instagram-style Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await dataService.getNewsStories();
        // Remove any articles/news which don't have an option of exploring event impact
        const storiesWithEventImpact = data.filter((story) => Boolean(story.eventId));
        if (mounted) setStories(storiesWithEventImpact);
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNews();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const presentCategories = Array.from(
      new Set(stories.filter((s) => Boolean(s.eventId)).map((s) => s.category))
    );
    return ['All', ...presentCategories] as (NewsCategory | 'All')[];
  }, [stories]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      // Remove any articles/news which don't have an option of exploring event impact
      if (!story.eventId) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && story.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && story.level !== selectedLevel) {
        return false;
      }
      return true;
    });
  }, [stories, selectedCategory, selectedLevel]);

  // Keep selectedCategory valid if categories change
  useEffect(() => {
    if (selectedCategory !== 'All' && !categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  // Reset to first story whenever filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, selectedLevel]);

  // Clamped active index
  const safeIndex =
    filteredStories.length > 0
      ? Math.min(Math.max(0, currentIndex), filteredStories.length - 1)
      : 0;

  // Directional navigation states
  const hasLeft = safeIndex > 0;
  const hasRight = safeIndex < filteredStories.length - 1;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(filteredStories.length - 1, prev + 1));
  }, [filteredStories.length]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      if (e.key === 'ArrowRight' && hasRight) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && hasLeft) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasLeft, hasRight, handleNext, handlePrev]);

  // Touch Swipe Handlers (Instagram-style finger tracking)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setTouchDeltaX(0);
    setIsSwiping(false);
    setIsHorizontalSwipe(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;

    if (!isHorizontalSwipe && !isSwiping) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        setIsHorizontalSwipe(true);
        setIsSwiping(true);
      } else if (Math.abs(deltaY) > 8) {
        // Vertical scroll - let browser scroll
        return;
      }
    }

    if (isHorizontalSwipe) {
      // Elastic resistance at carousel boundaries
      if ((safeIndex === 0 && deltaX > 0) || (safeIndex === filteredStories.length - 1 && deltaX < 0)) {
        setTouchDeltaX(deltaX * 0.25);
      } else {
        setTouchDeltaX(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe && touchStartX !== null) {
      const threshold = 40;
      if (touchDeltaX < -threshold && hasRight) {
        handleNext();
      } else if (touchDeltaX > threshold && hasLeft) {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchDeltaX(0);
    setIsSwiping(false);
    setIsHorizontalSwipe(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              News & Market Intelligence
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
            Understand Market Developments
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Every story separates confirmed facts from expert interpretations. Possibilities, never certainties.
          </p>
        </div>
      </div>

      {/* Video Explainer Feature Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30">
              5-Min Educational Video Explainer
            </span>
            <DemoBadge size="xs" />
          </div>
          <h2 className="text-lg md:text-xl font-bold leading-tight">
            How RBI Repo Rate Decisions Flow Into Your Fixed Deposits & Stock Holdings
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            A step-by-step visual walkthrough illustrating why bond prices move inversely to interest rates, and why bank net interest margins compress during rate easing.
          </p>
          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={() => navigate('/event/evt-rbi-001')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Play size={14} className="fill-slate-950" />
              Watch Video Explainer
            </button>
          </div>
        </div>
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <BookOpen size={180} />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-border shadow-2xs">
        {/* Category Dropdown */}
        <div className="relative min-w-[135px] max-w-[170px] flex-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as NewsCategory | 'All')}
            aria-label="Filter news by category"
            className="w-full appearance-none bg-bgSurface hover:bg-bgMuted border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs font-semibold text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Topics' : cat}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Level Dropdown */}
        <div className="relative min-w-[130px] max-w-[160px] flex-1">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as 'all' | 'beginner' | 'intermediate')}
            aria-label="Filter news by level"
            className="w-full appearance-none bg-bgSurface hover:bg-bgMuted border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs font-semibold text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Stories Carousel (Instagram-style single story per page) */}
      {loading ? (
        <div className="p-5 bg-white border border-border rounded-2xl space-y-3 shadow-2xs">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : filteredStories.length === 0 ? (
        <EmptyState
          title="No stories match your selected filters"
          description="Try switching categories or clearing the level filter to see all market stories."
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('all');
              }}
            >
              Reset all filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {/* Instagram-style Carousel Story Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-textSecondary font-semibold">
                {filteredStories[safeIndex]?.category}
              </span>
            </div>

            {/* Instagram Pill Badge Counter */}
            <div
              aria-label={`Story ${safeIndex + 1} of ${filteredStories.length}`}
              className="flex items-center gap-1 bg-slate-900/90 text-white px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider shadow-2xs backdrop-blur-sm"
            >
              <span>{safeIndex + 1}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-300 font-semibold">{filteredStories.length}</span>
            </div>
          </div>

          {/* Instagram-style Post Swiping Carousel */}
          <div className="relative">
            {/* Left Direction Icon: Shown ONLY when there are articles to the left */}
            {hasLeft && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous article"
                title="Previous article"
                className="absolute left-1 sm:left-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-primary-600 shadow-md border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
              >
                <ChevronLeft
                  size={15}
                  className="stroke-[2.5] -translate-x-0.5 group-hover:-translate-x-1 transition-transform"
                />
              </button>
            )}

            {/* Viewport: Exactly ONE story visible at a time */}
            <div
              className="w-full overflow-hidden rounded-2xl select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex items-start"
                style={{
                  transform: `translateX(calc(-${safeIndex * 100}% + ${touchDeltaX}px))`,
                  transition: isSwiping ? 'none' : 'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {filteredStories.map((story) => (
                  <div key={story.id} className="w-full shrink-0">
                    <NewsCard story={story} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Direction Icon: Shown ONLY when there are articles to the right */}
            {hasRight && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next article"
                title="Next article"
                className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-primary-600 shadow-md border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
              >
                <ChevronRight
                  size={15}
                  className="stroke-[2.5] translate-x-0.5 group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>

          {/* Instagram-style Pagination Dots & Navigation Hints */}
          <div className="flex flex-col items-center gap-2 pt-1 pb-2">
            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Stories navigation">
              {filteredStories.map((story, idx) => (
                <button
                  key={story.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === safeIndex}
                  aria-label={`Go to story ${idx + 1}: ${story.headline}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-200 cursor-pointer ${
                    idx === safeIndex
                      ? 'w-6 h-1.5 bg-primary-600 rounded-full shadow-2xs'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full'
                  }`}
                />
              ))}
            </div>

            {/* Visual Navigation Hint */}
            <div className="flex items-center justify-between w-full px-2 text-[11px] text-textMuted font-medium">
              <span>{hasLeft ? '← Swipe for previous' : '• First story'}</span>
              <span className="hidden sm:inline text-[10px]">Use arrows or swipe</span>
              <span>{hasRight ? 'Swipe for next →' : '• All caught up'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
