import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Newspaper,
  BookOpen,
  CandlestickChart,
  ReceiptText,
  Bell,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';

export const SideNav: React.FC = () => {
  const { state } = useApp();

  const unreadCount = 10 - Object.values(state.notificationReadState).filter(Boolean).length;

  const links = [
    { to: '/', label: 'Discover & Explore', icon: Home },
    { to: '/news', label: 'News & Events', icon: Newspaper },
    { to: '/learn', label: 'Learn & Community', icon: BookOpen },
    {
      to: '/options',
      label: 'Options Lab',
      icon: CandlestickChart,
    },
    {
      to: '/orders',
      label: 'Simulated Orders',
      icon: ReceiptText,
      badge: state.simulatedOrders.length > 0 ? state.simulatedOrders.length : undefined,
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { to: '/settings', label: 'Settings & Demo Tools', icon: Settings },
  ];

  return (
    <aside
      aria-label="Desktop Sidebar Navigation"
      className="hidden md:flex flex-col w-60 lg:w-64 border-r border-border bg-white fixed top-14 md:top-16 bottom-0 left-0 z-30 p-4 overflow-y-auto scrollbar-thin"
    >
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-textSecondary hover:bg-bgSurface hover:text-textPrimary'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={18} aria-hidden="true" />
                <span>{link.label}</span>
              </span>
              {link.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-bgMuted text-textSecondary">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Educational notice in sidebar footer */}
      <div className="mt-auto pt-6 border-t border-border">
        <div className="p-3 bg-bgSurface rounded-xl border border-border text-xs text-textSecondary space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-textPrimary">
            <HelpCircle size={14} className="text-primary-600" aria-hidden="true" />
            <span>Gen Z Principle</span>
          </div>
          <p className="text-[11px] leading-relaxed text-textMuted">
            Review risks & costs before committing capital. No FOMO. No auto-trades.
          </p>
        </div>
      </div>
    </aside>
  );
};
