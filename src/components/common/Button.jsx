// src/components/common/Button.jsx
import React from 'react';

const Button = ({ children, onClick, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;