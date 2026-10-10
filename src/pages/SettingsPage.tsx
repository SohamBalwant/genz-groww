import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import {
  RotateCcw,
  Bell,
  Sliders,
  Info,
  CheckCircle2,
} from 'lucide-react';


export const SettingsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [resetSuccess, setResetSuccess] = useState(false);

  const { preferences } = state;

  const handleTogglePreference = (key: keyof typeof preferences) => {
    dispatch({
      type: 'UPDATE_PREFERENCES',
      payload: { [key]: !preferences[key] },
    });
  };

  const handleResetDemo = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all demo state? This will clear your simulated orders, watchlist changes, and notification read states.'
      )
    ) {
      dispatch({ type: 'RESET_DEMO' });
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
            Prototype Preferences
          </span>
          <DemoBadge size="xs" />
        </div>
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
          Settings & Demo Controls
        </h1>
        <p className="text-xs text-textSecondary mt-0.5">
          Configure notification filters and reset simulated transaction history.
        </p>
      </div>

      {/* 1. Notification Preferences */}
      <div className="bg-white border border-border rounded-2xl p-5 md:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-primary-600" />
          <h2 className="text-base font-bold text-textPrimary">Notification Preferences</h2>
        </div>

        <div className="space-y-3 divide-y divide-border pt-1">
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-semibold text-textPrimary block">
                Macroeconomic & RBI Events
              </span>
              <span className="text-[11px] text-textMuted">
                Receive notifications for rate cuts, inflation, and policy decisions.
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifyEvents}
              onChange={() => handleTogglePreference('notifyEvents')}
              className="w-4 h-4 rounded text-primary-500 accent-primary-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-semibold text-textPrimary block">
                Watchlist Price & News Updates
              </span>
              <span className="text-[11px] text-textMuted">
                Notify when news directly mentions instruments you have saved.
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifyWatchlist}
              onChange={() => handleTogglePreference('notifyWatchlist')}
              className="w-4 h-4 rounded text-primary-500 accent-primary-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-semibold text-textPrimary block">
                Company Quarterly Results (Q3/Q4)
              </span>
              <span className="text-[11px] text-textMuted">
                Alerts explaining revenue beats and earnings surprises in plain English.
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifyResults}
              onChange={() => handleTogglePreference('notifyResults')}
              className="w-4 h-4 rounded text-primary-500 accent-primary-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Educational Level Filter */}
      <div className="bg-white border border-border rounded-2xl p-5 md:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-primary-600" />
          <h2 className="text-base font-bold text-textPrimary">Learning Experience</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-textPrimary block">
              Prioritize Beginner-Friendly Content
            </span>
            <span className="text-[11px] text-textMuted">
              Highlights simplified explainers and rupee examples on complex instruments.
            </span>
          </div>
          <input
            type="checkbox"
            checked={preferences.showBeginnersOnly}
            onChange={() => handleTogglePreference('showBeginnersOnly')}
            className="w-4 h-4 rounded text-primary-500 accent-primary-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Demo Data Management (Reset Button) */}
      <div className="bg-white border border-border rounded-2xl p-5 md:p-6 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <RotateCcw size={18} className="text-loss" />
          <h2 className="text-base font-bold text-textPrimary">Reset Prototype State</h2>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed">
          Clears all simulated orders from your browser&apos;s localStorage, restores the default 4-item watchlist, resets options education gate acknowledgement, and marks test notifications as unread.
        </p>

        {resetSuccess && (
          <div className="p-3 bg-primary-50 border border-primary-200 text-xs text-primary-700 rounded-xl flex items-center gap-2 font-semibold">
            <CheckCircle2 size={16} /> Demo state has been reset to default!
          </div>
        )}

        <div className="pt-2">
          <Button
            variant="danger"
            onClick={handleResetDemo}
            className="flex items-center gap-2"
          >

            <RotateCcw size={14} />
            Reset Demo Data to Initial State
          </Button>
        </div>
      </div>

      {/* 4. Prototype Attribution & PM Assignment Notice */}
      <div className="bg-bgSurface border border-border rounded-xl p-5 space-y-2 text-xs text-textSecondary">
        <span className="font-bold text-textPrimary flex items-center gap-1.5">
          <Info size={14} className="text-primary-600" /> Prototype Design Study Information
        </span>
        <p className="leading-relaxed">
          &quot;Groww for Gen Z&quot; is an independent design study and product prototype built for a Product Manager internship evaluation. It is not affiliated with, authorized, or operated by Groww (Nextbillion Technology Pvt. Ltd.).
        </p>
        <p className="text-[11px] text-textMuted pt-1">
          All financial figures, news headlines, and option chains are fictional demo datasets created to evaluate user comprehension and ethical UX.
        </p>
      </div>
    </div>
  );
};
