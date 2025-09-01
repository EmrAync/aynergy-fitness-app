// src/components/common/Card.jsx
import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-8 border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;