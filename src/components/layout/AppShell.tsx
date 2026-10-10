import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { PrototypeBanner } from './PrototypeBanner';
import { Smartphone, Monitor, SmartphoneNfc, Wifi, Battery, Sparkles } from 'lucide-react';

type ViewMode = 'phone' | 'frameless' | 'expanded';

export const AppShell: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('phone');
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
    <div className="min-h-screen bg-slate-950 text-textPrimary flex flex-col items-center justify-start antialiased selection:bg-primary-500 selection:text-white">
      {/* ─── Desktop Studio Environment Header (Hidden on actual mobile screens) ─── */}
      <header className="w-full hidden md:flex items-center justify-between px-6 py-3 border-b border-white/10 bg-slate-900/80 backdrop-blur-md z-50 text-white">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight">Groww for Gen Z</span>
              <span className="text-[10px] font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30 px-1.5 py-0.5 rounded-full">
                Mobile Prototype
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Interactive concept for Indian investors (20–26) · All trades simulated
            </p>
          </div>
        </div>

        {/* Viewport Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setMode('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'phone'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Show realistic smartphone chassis with notch and status bar"
          >
            <Smartphone size={14} />
            <span>Phone Frame</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('frameless')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'frameless'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Centered mobile column without device bezel"
          >
            <SmartphoneNfc size={14} />
            <span>Frameless</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('expanded')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'expanded'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Expand container for wider view"
          >
            <Monitor size={14} />
            <span>Expanded</span>
          </button>
        </div>

        {/* Desktop Helper Pill */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles size={14} className="text-primary-400" />
          <span className="hidden lg:inline text-[11px]">
            Mobile-first UX: Bottom Nav · Bottom Sheets · Touch CTAs
          </span>
        </div>
      </header>

      {/* ─── Main Container: Smartphone Frame on Desktop / Full Screen on Mobile ─── */}
      <div className="flex-1 w-full flex items-center justify-center p-0 md:py-6 lg:py-8 overflow-x-hidden">
        <div
          className={`transition-all duration-300 w-full flex flex-col ${
            mode === 'phone'
              ? 'md:w-[420px] md:h-[890px] md:max-h-[92vh] md:rounded-[52px] md:bg-slate-950 md:p-3 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1),0_0_50px_rgba(0,179,134,0.15)] md:ring-1 md:ring-white/15 relative'
              : mode === 'frameless'
              ? 'md:w-[420px] md:h-[890px] md:max-h-[94vh] md:rounded-3xl md:shadow-2xl md:border md:border-border relative overflow-hidden bg-bgSurface'
              : 'max-w-2xl md:h-[90vh] md:rounded-2xl md:shadow-2xl md:border md:border-border relative overflow-hidden bg-bgSurface'
          }`}
        >
          {/* Simulated Physical Smartphone Buttons on Bezel (Phone mode on Desktop only) */}
          {mode === 'phone' && (
            <>
              {/* Volume buttons (Left) */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute -left-[5px] top-28 w-[4px] h-11 bg-slate-750 rounded-l"
              />
              <div
                aria-hidden="true"
                className="hidden md:block absolute -left-[5px] top-42 w-[4px] h-11 bg-slate-750 rounded-l"
              />
              {/* Power button (Right) */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute -right-[5px] top-36 w-[4px] h-16 bg-slate-750 rounded-r"
              />
            </>
          )}

          {/* ─── Inner Mobile Screen Viewport ─── */}
          <div
            className={`w-full h-full min-h-screen md:min-h-0 bg-bgSurface flex flex-col relative overflow-hidden [transform:translateZ(0)] ${
              mode === 'phone' ? 'md:rounded-[42px]' : mode === 'frameless' ? 'md:rounded-3xl' : 'md:rounded-2xl'
            }`}
          >
            {/* 1. Mobile Status Bar (Visible on desktop phone mode) */}
            {mode === 'phone' && (
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
            )}

            {/* 2. Global Prototype Banner */}
            <PrototypeBanner />

            {/* 3. Mobile Top Header */}
            <TopBar />

            {/* 4. Native-feeling Scrollable Page Viewport */}
            <main
              id="app-scroll-viewport"
              className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 sm:p-4 pb-6 transition-all relative scroll-smooth overscroll-contain"
            >
              <Outlet />
            </main>

            {/* 5. Mobile Bottom Navigation (Always pinned at bottom of mobile app) */}
            <BottomNav />

            {/* 6. Mobile Home Indicator Bar (Desktop phone mode only) */}
            {mode === 'phone' && (
              <div
                aria-hidden="true"
                className="hidden md:flex h-4 shrink-0 bg-white items-center justify-center select-none"
              >
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
