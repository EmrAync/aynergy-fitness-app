// src/components/nutrition/CalorieSummary.jsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';

const CalorieSummary = ({ consumedCalories, targetCalories }) => {
  const { t } = useLanguage();
  const progressPercentage = (consumedCalories / targetCalories.min) * 100;
  const progressStyle = { width: `${Math.min(100, progressPercentage)}%` };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('dailyCalorieTracking')}</h3>
      <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-2">
        <span>{t('consumed')}: <span className="text-gray-900 font-bold">{consumedCalories}</span></span>
        <span>{t('target')}: <span className="text-gray-900 font-bold">{targetCalories.min} - {targetCalories.max}</span> kcal</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={progressStyle}
        ></div>
      </div>
    </Card>
  );
};

export default CalorieSummary;