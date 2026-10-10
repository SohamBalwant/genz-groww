import React from 'react';
import { SearchX, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  action,
  className = '',
}) => {
  return (
    <div
      className={`card p-8 text-center flex flex-col items-center justify-center space-y-3 min-h-[220px] ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-bgSurface border border-border flex items-center justify-center text-textMuted">
        {icon || <SearchX size={24} aria-hidden="true" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-textPrimary">{title}</h3>
        {description && (
          <p className="text-xs text-textSecondary leading-relaxed">{description}</p>
        )}
      </div>
      {action ? (
        <div className="mt-2">{action}</div>
      ) : actionLabel && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};


export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  message = 'Failed to load illustrative data. You can retry safely.',
  onRetry,
}) => {
  return (
    <div className="card p-8 text-center flex flex-col items-center justify-center space-y-3 min-h-[220px] border-red-200 bg-red-50/30">
      <div className="w-12 h-12 rounded-full bg-red-100 text-loss flex items-center justify-center">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-loss">{title}</h3>
        <p className="text-xs text-textSecondary leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw size={14} />}
          className="mt-2"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
