import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { PrototypeBanner } from './PrototypeBanner';
import { Wifi, Battery } from 'lucide-react';

export const AppShell: React.FC = () => {
  const [time, setTime] = useState<string>('9:41');
  const location = useLocation();

  // Simulated phone clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    const mainEl = document.getElementById('app-scroll-viewport');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="h-screen h-[100dvh] md:h-auto md:min-h-screen bg-bgSurface md:bg-slate-950 text-textPrimary flex flex-col items-center justify-center antialiased selection:bg-primary-500 selection:text-white p-0 md:py-6 lg:py-8 overflow-hidden md:overflow-x-hidden">
      {/* ─── Main Container: Smartphone Frame on Desktop / Full Screen on Mobile ─── */}
      <div className="w-full h-full md:h-auto flex-1 md:flex-initial flex items-center justify-center min-h-0">
        <div className="w-full h-full md:w-[420px] md:h-[890px] md:max-h-[92vh] md:rounded-[52px] md:bg-slate-950 md:p-3 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1),0_0_50px_rgba(0,179,134,0.15)] md:ring-1 md:ring-white/15 relative flex flex-col min-h-0">
          {/* Simulated Physical Smartphone Buttons on Bezel (Desktop only) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute -left-[5px] top-28 w-[4px] h-11 bg-slate-750 rounded-l"
          />
          <div
            aria-hidden="true"
            className="hidden md:block absolute -left-[5px] top-42 w-[4px] h-11 bg-slate-750 rounded-l"
          />
          <div
            aria-hidden="true"
            className="hidden md:block absolute -right-[5px] top-36 w-[4px] h-16 bg-slate-750 rounded-r"
          />

          {/* ─── Inner Mobile Screen Viewport ─── */}
          <div className="w-full h-full bg-bgSurface flex flex-col relative overflow-hidden md:rounded-[42px] md:[transform:translateZ(0)] min-h-0">
            {/* 1. Mobile Status Bar (Visible on desktop phone chassis) */}
            <div
              aria-hidden="true"
              className="hidden md:flex h-11 shrink-0 px-6 pt-2 bg-white/95 backdrop-blur-md items-center justify-between text-xs font-semibold text-textPrimary select-none z-50 border-b border-border/40"
            >
              {/* Time */}
              <span className="font-semibold text-[13px] tracking-tight">{time}</span>

              {/* Dynamic Island Notch */}
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2.5 shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500/30" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-textPrimary">
                {/* Signal bars */}
                <svg className="w-3.5 h-3" viewBox="0 0 17 12" fill="currentColor">
                  <rect x="0" y="9" width="3" height="3" rx="0.5" />
                  <rect x="4.5" y="6" width="3" height="6" rx="0.5" />
                  <rect x="9" y="3" width="3" height="9" rx="0.5" />
                  <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
                </svg>
                <span className="text-[10px] font-bold tracking-tight">5G</span>
                <Wifi size={13} strokeWidth={2.5} />
                <Battery size={15} strokeWidth={2.5} className="text-gain fill-gain" />
              </div>
            </div>

            {/* 2. Global Prototype Banner */}
            <PrototypeBanner />

            {/* 3. Mobile Top Header */}
            <TopBar />

            {/* 4. Native-feeling Scrollable Page Viewport */}
            <main
              id="app-scroll-viewport"
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain no-scrollbar p-3.5 sm:p-4 pb-6 transition-all relative scroll-smooth touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <Outlet />
            </main>

            {/* 5. Mobile Bottom Navigation (Always pinned at bottom of mobile app) */}
            <BottomNav />

            {/* 6. Mobile Home Indicator Bar (Desktop phone frame) */}
            <div
              aria-hidden="true"
              className="hidden md:flex h-4 shrink-0 bg-white items-center justify-center select-none"
            >
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
