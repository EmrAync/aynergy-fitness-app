// src/components/common/Card.jsx
import React from 'react';

const variants = {
  default: 'bg-white border border-neutral-100',
  elevated: 'bg-white shadow-soft-lg',
  glass: 'bg-white/80 backdrop-blur-lg border border-white/20',
  gradient: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white',
  outlined: 'bg-transparent border-2 border-neutral-200',
  success: 'bg-success-50 border border-success-200',
  warning: 'bg-warning-50 border border-warning-200',
  danger: 'bg-danger-50 border border-danger-200',
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'lg',
  hover = false,
  onClick = null,
  animate = false,
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const hoverStyles = hover
    ? 'hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer'
    : '';

  const animateStyles = animate ? 'animate-fade-in' : '';

  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${animateStyles}
        ${clickableStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Sub-components for better composition
Card.Header = ({ children, className = '' }) => (
  <div className={`mb-4 pb-4 border-b border-neutral-100 ${className}`}>
    {children}
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-neutral-900 ${className}`}>
    {children}
  </h3>
);

Card.Subtitle = ({ children, className = '' }) => (
  <p className={`text-neutral-500 text-sm mt-1 ${className}`}>
    {children}
  </p>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-neutral-100 ${className}`}>
    {children}
  </div>
);

// Stat Card variant
Card.Stat = ({ icon, label, value, change, changeType = 'neutral', className = '' }) => {
  const changeColors = {
    positive: 'text-success-600 bg-success-50',
    negative: 'text-danger-600 bg-danger-50',
    neutral: 'text-neutral-600 bg-neutral-100',
  };

  return (
    <Card className={`${className}`} hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
          {change && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${changeColors[changeType]}`}>
              {changeType === 'positive' && '+'}{change}
            </span>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
