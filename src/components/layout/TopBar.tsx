import React from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from 'react-router-dom';
import { Bell, Search, Settings } from 'lucide-react';
import { useApp } from '../../state/AppContext';

export const TopBar: React.FC = () => {
  const { state } = useApp();
  const navigate = useRouterNavigate();

  // Count unread notifications
  const unreadCount = Object.keys(state.notificationReadState).length < 10
    ? 10 - Object.values(state.notificationReadState).filter(Boolean).length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border h-14 px-3.5 sm:px-4 flex items-center justify-between select-none">
      <div className="w-full flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <RouterLink
          to="/"
          className="flex items-center gap-2 shrink-0 group focus-visible:outline-2 focus-visible:outline-primary-500 rounded-lg py-1"
        >
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:bg-primary-600 transition-colors shrink-0">
            G
          </div>
          <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span className="font-extrabold text-base tracking-tight text-textPrimary leading-none">
              Groww
            </span>
            <span className="text-primary-700 bg-primary-50 border border-primary-200 text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              Gen Z
            </span>
          </div>
        </RouterLink>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Search Button */}
          <button
            type="button"
            onClick={() => navigate('/?focus=search')}
            aria-label="Search instruments"
            className="p-2 text-textSecondary hover:text-textPrimary rounded-full hover:bg-bgSurface min-h-[40px] min-w-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-primary-500 transition-colors"
          >
            <Search size={19} aria-hidden="true" />
          </button>

          {/* Notifications Bell */}
          <RouterLink
            to="/notifications"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            className="relative p-2 text-textSecondary hover:text-textPrimary rounded-full hover:bg-bgSurface min-h-[40px] min-w-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-primary-500 transition-colors"
          >
            <Bell size={19} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-loss text-white text-[10px] font-bold flex items-center justify-center border-2 border-white leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </RouterLink>

          {/* Settings Link */}
          <RouterLink
            to="/settings"
            aria-label="Settings and Demo controls"
            className="p-2 text-textSecondary hover:text-textPrimary rounded-full hover:bg-bgSurface min-h-[40px] min-w-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-primary-500 transition-colors"
          >
            <Settings size={19} aria-hidden="true" />
          </RouterLink>
        </div>
      </div>
    </header>
  );
};
