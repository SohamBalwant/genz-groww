import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { dataService } from '../services/dataService';
import { StockCard } from '../components/market/StockCard';
import { FundCard } from '../components/market/FundCard';
import { BondCard } from '../components/market/BondCard';
import { EtfCard } from '../components/market/EtfCard';
import { IpoCard } from '../components/market/IpoCard';
import { NewsCard } from '../components/news/NewsCard';
import { EmptyState } from '../components/ui/EmptyState';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Bookmark, Newspaper, Filter } from 'lucide-react';
import type { Instrument, Stock, MutualFund, Bond, Etf, Ipo, NewsStory } from '../types';

export const WatchlistPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [news, setNews] = useState<NewsStory[]>([]);
  const [activeTab, setActiveTab] = useState<'instruments' | 'news'>('instruments');
  const [assetFilter, setAssetFilter] = useState<string>('All');

  useEffect(() => {
    let mounted = true;
    const fetchWatchlistItems = async () => {
      setLoading(true);
      try {
        const [instList, allNews] = await Promise.all([
          Promise.all(state.watchlist.map((id) => dataService.getInstrumentById(id))),
          dataService.getNewsStories(),
        ]);

        if (mounted) {
          const resolved = instList.filter(Boolean) as Instrument[];
          setInstruments(resolved);

          // News related to watchlist
          const related = allNews.filter((n) =>
            n.relatedInstrumentIds.some((id) => state.watchlist.includes(id))
          );
          setNews(related);
        }
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchWatchlistItems();
    return () => {
      mounted = false;
    };
  }, [state.watchlist]);

  const filteredInstruments = useMemo(() => {
    if (assetFilter === 'All') return instruments;
    return instruments.filter((i) => i.assetClass === assetFilter);
  }, [instruments, assetFilter]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              Personal Tracking
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
            My Watchlist ({state.watchlist.length})
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Monitor asset movements and filtered market announcements without distraction.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-bgSurface p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('instruments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'instruments'
                ? 'bg-primary-500 text-white shadow-2xs'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Bookmark size={13} />
            <span>Saved Securities</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'news'
                ? 'bg-primary-500 text-white shadow-2xs'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Newspaper size={13} />
            <span>Watchlist News ({news.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white border border-border rounded-xl space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : activeTab === 'instruments' ? (
        <div className="space-y-4">
          {/* Asset Class Filter */}
          {instruments.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-textMuted flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
              {['All', 'STOCK', 'MF', 'BOND', 'ETF'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setAssetFilter(cls)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap shrink-0 ${
                    assetFilter === cls
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-textSecondary border-border hover:bg-bgSurface'
                  }`}
                >
                  {cls === 'All' ? 'All Assets' : cls}
                </button>
              ))}
            </div>
          )}

          {filteredInstruments.length === 0 ? (
            <EmptyState
              title="Your watchlist is empty"
              description="Save stocks, mutual funds, or government bonds from the Discover screen to track their developments here."
              action={
                <Button size="sm" onClick={() => navigate('/')}>
                  Explore Instruments
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col gap-3.5">
              {filteredInstruments.map((item) => {
                if (item.assetClass === 'STOCK') {
                  return <StockCard key={item.id} stock={item as Stock} />;
                }
                if (item.assetClass === 'MF') {
                  return <FundCard key={item.id} fund={item as MutualFund} />;
                }
                if (item.assetClass === 'BOND') {
                  return <BondCard key={item.id} bond={item as Bond} />;
                }
                if (item.assetClass === 'ETF') {
                  return <EtfCard key={item.id} etf={item as Etf} />;
                }
                if (item.assetClass === 'IPO') {
                  return <IpoCard key={item.id} ipo={item as Ipo} />;
                }
                return null;
              })}
            </div>
          )}
        </div>
      ) : (
        /* Watchlist-Filtered News */
        <div className="space-y-4">
          {news.length === 0 ? (
            <EmptyState
              title="No news touching your saved instruments"
              description="When a market event or quarterly report touches securities on your watchlist, it will appear here."
            />
          ) : (
            <div className="flex flex-col gap-3.5">
              {news.map((story) => (
                <NewsCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
