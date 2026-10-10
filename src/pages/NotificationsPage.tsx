import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { dataService } from '../services/dataService';
import { DemoBadge } from '../components/ui/DemoBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate24h } from '../lib/format';
import { CheckCheck, ArrowRight } from 'lucide-react';
import type { Notification } from '../types';

const getNotificationBadgeConfig = (type: string) => {
  switch (type.toUpperCase()) {
    case 'EVENT':
      return {
        classes: 'bg-purple-50 text-purple-700 border-purple-200',
        dotColor: 'bg-purple-500',
      };
    case 'RESULT':
      return {
        classes: 'bg-amber-50 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'WATCHLIST':
      return {
        classes: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-500',
      };
    case 'COMPANY':
    default:
      return {
        classes: 'bg-teal-50 text-teal-700 border-teal-200',
        dotColor: 'bg-teal-500',
      };
  }
};

export const NotificationsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'event' | 'watchlist' | 'result'>('All');

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

  const filteredList = useMemo(() => {
    if (activeFilter === 'All') return notifications;
    return notifications.filter((n) => n.type.toLowerCase() === activeFilter.toLowerCase());
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter((n) => !isRead(n.id)).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              Notification Centre
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-textPrimary tracking-tight">
            Market Updates & Alerts
          </h1>
          <p className="text-xs text-textSecondary">
            Objective notifications without FOMO, urgency, or sensational headlines.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold transition-all whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer shadow-2xs"
          >
            <CheckCheck size={14} className="text-primary-600 shrink-0" />
            <span>Mark all read</span>
          </button>
        )}
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
            const badgeConfig = getNotificationBadgeConfig(notif.type);

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
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Unread indicator dot */}
                    <div className="pt-1 shrink-0">
                      <span
                        className={`block w-2.5 h-2.5 rounded-full ${
                          read ? 'bg-transparent border border-border' : 'bg-primary-500'
                        }`}
                        title={read ? 'Read' : 'Unread'}
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${badgeConfig.classes}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dotColor} shrink-0`} />
                          <span>{notif.type}</span>
                        </span>
                        <span className="text-xs text-textMuted font-medium">
                          {formatDate24h(notif.createdAt || notif.timestamp || '')}
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
                      <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <button
                          type="button"
                          onClick={() => handleOpenNotification(notif)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer"
                        >
                          <span>Explore Analysis & Details</span>
                          <ArrowRight size={13} />
                        </button>

                        {instId && (
                          <button
                            type="button"
                            onClick={() => {
                              dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id });
                              navigate(`/instrument/${instId}`);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer"
                          >
                            <span>View Instrument Profile</span>
                            <ArrowRight size={13} />
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
