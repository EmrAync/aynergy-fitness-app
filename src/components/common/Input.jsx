// src/components/common/Input.jsx
import React, { forwardRef, useState } from 'react';

const variants = {
  default: `
    bg-neutral-50 border-2 border-neutral-200
    focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white
  `,
  filled: `
    bg-neutral-100 border-2 border-transparent
    focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white
  `,
  outlined: `
    bg-transparent border-2 border-neutral-300
    focus:border-primary-500 focus:ring-4 focus:ring-primary-100
  `,
  error: `
    bg-danger-50 border-2 border-danger-300
    focus:border-danger-500 focus:ring-4 focus:ring-danger-100
  `,
  success: `
    bg-success-50 border-2 border-success-300
    focus:border-success-500 focus:ring-4 focus:ring-success-100
  `,
};

const sizes = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-base',
  lg: 'py-4 px-5 text-lg',
};

const Input = forwardRef(({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  variant = 'default',
  size = 'md',
  error = '',
  hint = '',
  disabled = false,
  required = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseInputStyles = `
    w-full rounded-xl transition-all duration-200
    text-neutral-900 placeholder-neutral-400
    disabled:opacity-60 disabled:cursor-not-allowed
    outline-none
  `;

  const actualType = type === 'password' && showPassword ? 'text' : type;
  const actualVariant = error ? 'error' : variant;

  const hasLeftIcon = icon && iconPosition === 'left';
  const hasRightIcon = (icon && iconPosition === 'right') || type === 'password';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {hasLeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-neutral-400">{icon}</span>
          </div>
        )}

        <input
          ref={ref}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${baseInputStyles}
            ${variants[actualVariant]}
            ${sizes[size]}
            ${hasLeftIcon ? 'pl-12' : ''}
            ${hasRightIcon ? 'pr-12' : ''}
            ${inputClassName}
          `}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400
                     hover:text-neutral-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        )}

        {hasRightIcon && type !== 'password' && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-neutral-400">{icon}</span>
          </div>
        )}
      </div>

      {(error || hint) && (
        <p className={`mt-2 text-sm ${error ? 'text-danger-600' : 'text-neutral-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea variant
export const Textarea = forwardRef(({
  label,
  value,
  onChange,
  placeholder = '',
  variant = 'default',
  error = '',
  hint = '',
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const baseStyles = `
    w-full rounded-xl transition-all duration-200 py-3 px-4
    text-neutral-900 placeholder-neutral-400
    disabled:opacity-60 disabled:cursor-not-allowed
    outline-none resize-none
  `;

  const actualVariant = error ? 'error' : variant;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`${baseStyles} ${variants[actualVariant]}`}
        {...props}
      />

      {(error || hint) && (
        <p className={`mt-2 text-sm ${error ? 'text-danger-600' : 'text-neutral-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
