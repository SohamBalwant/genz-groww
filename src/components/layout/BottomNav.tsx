import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Newspaper, BookOpen, CandlestickChart, ReceiptText } from 'lucide-react';
import { useApp } from '../../state/AppContext';

export const BottomNav: React.FC = () => {
  const { state } = useApp();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/learn', label: 'Learn', icon: BookOpen },
    {
      to: '/options',
      label: 'Options',
      icon: CandlestickChart,
    },
    {
      to: '/orders',
      label: 'Orders',
      icon: ReceiptText,
      badge: state.simulatedOrders.length > 0 ? state.simulatedOrders.length : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="shrink-0 sticky bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border bottom-nav-safe shadow-xs"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors relative select-none ${
                  isActive
                    ? 'text-primary-600 font-semibold'
                    : 'text-textMuted hover:text-textPrimary font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-primary-100 text-primary-800 text-[9px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-1 leading-none">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
