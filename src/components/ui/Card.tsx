import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  padding = 'md',
  as: Component = 'div',
  children,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6',
  }[padding];

  const hoverStyles = hoverable
    ? 'transition-all duration-150 hover:shadow-card-hover hover:border-borderMd cursor-pointer'
    : '';

  return (
    <Component
      className={`card ${paddingStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
