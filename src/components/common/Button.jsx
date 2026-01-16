// src/components/common/Button.jsx
import React from 'react';

const variants = {
  primary: `
    bg-gradient-to-r from-primary-600 to-primary-500 text-white
    hover:from-primary-700 hover:to-primary-600
    shadow-md hover:shadow-lg hover:shadow-primary-500/25
    focus:ring-4 focus:ring-primary-200
  `,
  secondary: `
    bg-white text-primary-600 border-2 border-primary-200
    hover:bg-primary-50 hover:border-primary-300
    focus:ring-4 focus:ring-primary-100
  `,
  accent: `
    bg-gradient-to-r from-accent-500 to-accent-400 text-white
    hover:from-accent-600 hover:to-accent-500
    shadow-md hover:shadow-lg hover:shadow-accent-500/25
    focus:ring-4 focus:ring-accent-200
  `,
  success: `
    bg-gradient-to-r from-success-600 to-success-500 text-white
    hover:from-success-700 hover:to-success-600
    shadow-md hover:shadow-lg hover:shadow-success-500/25
    focus:ring-4 focus:ring-success-200
  `,
  danger: `
    bg-gradient-to-r from-danger-600 to-danger-500 text-white
    hover:from-danger-700 hover:to-danger-600
    shadow-md hover:shadow-lg hover:shadow-danger-500/25
    focus:ring-4 focus:ring-danger-200
  `,
  ghost: `
    bg-transparent text-neutral-600
    hover:bg-neutral-100 hover:text-neutral-900
    focus:ring-4 focus:ring-neutral-200
  `,
  outline: `
    bg-transparent text-neutral-700 border-2 border-neutral-300
    hover:bg-neutral-50 hover:border-neutral-400
    focus:ring-4 focus:ring-neutral-200
  `,
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3.5 text-lg rounded-xl',
  xl: 'px-8 py-4 text-xl rounded-2xl',
};

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = true,
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold
    active:scale-[0.98] transition-all duration-200
    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
    outline-none
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
