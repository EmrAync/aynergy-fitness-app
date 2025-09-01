// src/components/common/SkeletonCard.jsx
import React from 'react';
import Card from './Card'; // Assuming Card component exists and provides basic card styling

const SkeletonCard = ({ className = 'h-32' }) => {
  return (
    <Card className={`animate-pulse bg-gray-200 ${className}`}>
      {/* Content for the skeleton card - can be empty or have subtle lines */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </Card>
  );
};

export default SkeletonCard;