import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-5 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-bgMuted text-textMuted flex items-center justify-center mx-auto">
        <Compass size={36} />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
            Page Not Found
          </span>
          <DemoBadge size="xs" />
        </div>
        <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">404</h1>
        <p className="text-sm text-textSecondary">
          The page or instrument you are looking for doesn&apos;t exist in this prototype.
        </p>
      </div>

      <div className="pt-2">
        <Button onClick={() => navigate('/')} className="inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Discover Home
        </Button>
      </div>
    </div>
  );
};
