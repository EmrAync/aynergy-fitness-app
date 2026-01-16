// src/components/common/Spinner.jsx
import React from 'react';

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const variants = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  accent: 'text-accent-600',
  white: 'text-white',
  neutral: 'text-neutral-400',
};

const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  label = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        {/* Outer ring (static) */}
        <div className={`${sizes[size]} rounded-full border-4 border-neutral-200`}></div>

        {/* Spinning ring */}
        <div
          className={`absolute inset-0 ${sizes[size]} rounded-full border-4 border-transparent animate-spin ${variants[variant]}`}
          style={{
            borderTopColor: 'currentColor',
            borderRightColor: 'transparent',
          }}
        ></div>

        {/* Gradient glow effect */}
        <div
          className={`absolute inset-0 ${sizes[size]} rounded-full animate-pulse-slow opacity-30 blur-md ${variants[variant]}`}
          style={{ backgroundColor: 'currentColor' }}
        ></div>
      </div>

      {label && (
        <p className="text-neutral-600 text-sm font-medium animate-pulse">{label}</p>
      )}
    </div>
  );
};

// Full page loading overlay
Spinner.Overlay = ({ label = 'Loading...', variant = 'primary' }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-soft-lg p-8 flex flex-col items-center gap-4">
      <Spinner size="lg" variant={variant} />
      <p className="text-neutral-700 font-medium">{label}</p>
    </div>
  </div>
);

// Inline skeleton loader
Spinner.Skeleton = ({ className = '', rounded = 'lg' }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] rounded-${rounded} ${className}`}
    style={{
      animation: 'shimmer 1.5s ease-in-out infinite',
    }}
  ></div>
);

// Dots spinner variant
Spinner.Dots = ({ variant = 'primary', className = '' }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${variants[variant]} animate-bounce`}
        style={{
          backgroundColor: 'currentColor',
          animationDelay: `${i * 0.15}s`,
        }}
      ></div>
    ))}
  </div>
);

// Progress bar spinner
Spinner.Progress = ({ progress = 0, variant = 'primary', className = '' }) => (
  <div className={`w-full ${className}`}>
    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${variants[variant]} rounded-full transition-all duration-300 ease-out`}
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: 'currentColor',
        }}
      ></div>
    </div>
  </div>
);

export default Spinner;
