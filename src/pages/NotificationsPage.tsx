import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { dataService } from '../services/dataService';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDateIST } from '../lib/format';
import { CheckCheck, Zap, ArrowRight } from 'lucide-react';
import type { Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'event' | 'watchlist' | 'result'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchNotifs = async () => {
      try {
        const list = await dataService.getNotifications();
        if (mounted) setNotifications(list);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };
    fetchNotifs();
    return () => {
      mounted = false;
    };
  }, []);

  const isRead = (id: string) => {
    return !!state.notificationReadState[id];
  };

  const handleOpenNotification = (notif: Notification) => {
    // 1. Mark as read
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id });

    // 2. Navigate to appropriate analysis screen (never auto-buy!)
    const targetInstId = notif.instrumentId || notif.relatedInstrumentId;
    if (notif.eventId) {
      navigate(`/event/${notif.eventId}`);
    } else if (targetInstId) {
      navigate(`/instrument/${targetInstId}`);
    } else {
      navigate('/news');
    }
  };

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  // Scenario Simulator Triggers
  const handleSimulateScenario = (
    title: string,
    targetUrl: string,
    _notifId?: string
  ) => {
    setToastMessage(`Simulated notification received: "${title}"`);
    setTimeout(() => {
      setToastMessage(null);
      navigate(targetUrl);
    }, 900);
  };

  const filteredList = useMemo(() => {
    if (activeFilter === 'All') return notifications;
    return notifications.filter((n) => n.type.toLowerCase() === activeFilter.toLowerCase());
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter((n) => !isRead(n.id)).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert for Simulation */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              Notification Centre
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
            Market Updates & Alerts
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Objective notifications without FOMO, urgency, or sensational headlines.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            className="text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck size={14} />
            Mark all read
          </Button>
        )}
      </div>

      {/* 3 Interactive Scenarios Sandbox Bar */}
      <div className="bg-gradient-to-r from-primary-50/70 via-white to-blue-50/50 border border-primary-200 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-500 fill-amber-500" />
            <h2 className="text-xs font-bold text-primary-950 uppercase tracking-wider">
              Simulate Core Market Scenarios (Demo Sandbox)
            </h2>
          </div>
          <span className="text-[11px] text-textMuted hidden sm:inline">
            Click to test full flow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() =>
              handleSimulateScenario(
                'RBI Repo Rate Cut (-25 bps)',
                '/event/evt-rbi-001',
                'n1'
              )
            }
            className="p-3 bg-white hover:bg-primary-50/80 border border-border hover:border-primary-300 rounded-xl text-left transition-all shadow-2xs group"
          >
            <span className="text-xs font-bold text-textPrimary group-hover:text-primary-700 block">
              1. RBI Rate Cut
            </span>
            <span className="text-[11px] text-textMuted leading-tight block mt-0.5">
              Debt, banking margin & G-Sec impacts
            </span>
          </button>

          <button
            onClick={() =>
              handleSimulateScenario(
                'Apex InfoTech Q3 Financial Results',
                '/instrument/stock-apxinf?tab=financials',
                'n3'
              )
            }
            className="p-3 bg-white hover:bg-primary-50/80 border border-border hover:border-primary-300 rounded-xl text-left transition-all shadow-2xs group"
          >
            <span className="text-xs font-bold text-textPrimary group-hover:text-primary-700 block">
              2. Q3 Earnings Surprise
            </span>
            <span className="text-[11px] text-textMuted leading-tight block mt-0.5">
              Why shares can fall after good results
            </span>
          </button>

          <button
            onClick={() =>
              handleSimulateScenario(
                'Brent Crude Oil Spike (+7.5%)',
                '/event/evt-oil-001',
                'n2'
              )
            }
            className="p-3 bg-white hover:bg-primary-50/80 border border-border hover:border-primary-300 rounded-xl text-left transition-all shadow-2xs group"
          >
            <span className="text-xs font-bold text-textPrimary group-hover:text-primary-700 block">
              3. Crude Oil Surge
            </span>
            <span className="text-[11px] text-textMuted leading-tight block mt-0.5">
              OMC margins & import costs
            </span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(
          [
            { id: 'All', label: 'All Alerts' },
            { id: 'event', label: 'Market Events' },
            { id: 'watchlist', label: 'Watchlist Updates' },
            { id: 'result', label: 'Earnings & Results' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeFilter === tab.id
                ? 'bg-textPrimary text-white'
                : 'bg-white text-textSecondary hover:bg-bgSurface border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <EmptyState
            title="No notifications in this category"
            description="You are completely up to date with market developments."
          />
        ) : (
          filteredList.map((notif) => {
            const read = isRead(notif.id);
            const instId = notif.instrumentId || notif.relatedInstrumentId;

            return (
              <div
                key={notif.id}
                className={`p-4 md:p-5 rounded-2xl border transition-all ${
                  read
                    ? 'bg-white border-border text-textSecondary'
                    : 'bg-primary-50/20 border-primary-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Unread indicator dot */}
                    <div className="pt-1">
                      <span
                        className={`block w-2.5 h-2.5 rounded-full ${
                          read ? 'bg-transparent border border-border' : 'bg-primary-500'
                        }`}
                        title={read ? 'Read' : 'Unread'}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-bgSurface text-textMuted border border-border">
                          {notif.type}
                        </span>
                        <span className="text-xs text-textMuted">
                          {formatDateIST(notif.createdAt || notif.timestamp || '')}
                        </span>
                        <DemoBadge size="xs" />
                      </div>

                      <h3
                        className={`text-sm md:text-base font-bold leading-snug ${
                          read ? 'text-textPrimary' : 'text-textPrimary font-extrabold'
                        }`}
                      >
                        {notif.title}
                      </h3>

                      <p className="text-xs text-textSecondary leading-relaxed pt-0.5">
                        {notif.body || notif.message}
                      </p>

                      {/* CTAs strictly non-impulsive: View event or instrument only! */}
                      <div className="pt-2 flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => handleOpenNotification(notif)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          Explore Analysis & Details
                          <ArrowRight size={13} />
                        </button>

                        {instId && (
                          <button
                            onClick={() => {
                              dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id });
                              navigate(`/instrument/${instId}`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-textMuted hover:text-textPrimary bg-bgSurface px-2 py-1 rounded border border-border"
                          >
                            View Instrument Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
