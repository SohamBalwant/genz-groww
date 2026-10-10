import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap';

  const sizeStyles =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs min-h-[32px]'
      : size === 'lg'
      ? 'px-6 py-3 text-base min-h-[48px]'
      : 'px-4 py-2 text-sm min-h-[44px] min-w-[44px]';

  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm',
    secondary: 'bg-bgSurface hover:bg-bgMuted text-textPrimary border border-border',
    outline: 'border border-primary-500 text-primary-600 hover:bg-primary-50 bg-transparent',
    ghost: 'text-textSecondary hover:bg-bgMuted hover:text-textPrimary bg-transparent',
    danger: 'bg-loss hover:bg-red-600 text-white shadow-sm',
  }[variant];

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <svg
            className="animate-spin h-4 w-4 text-current shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
          <span className="whitespace-nowrap inline-flex items-center justify-center gap-1.5">{children}</span>
          {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
        </span>
      )}
    </button>
  );
};
