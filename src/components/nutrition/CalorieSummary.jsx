// src/components/nutrition/CalorieSummary.jsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import { Doughnut } from 'react-chartjs-2'; // Chart.js'i kullanacağız
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MacroCircle = ({ label, consumed, target }) => {
  const percentage = target > 0 ? (consumed / target) * 100 : 0;
  const data = {
    datasets: [
      {
        data: [consumed, Math.max(0, target - consumed)],
        backgroundColor: ['#3b82f6', '#e5e7eb'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
        circumference: 270, // Create a semi-circle effect
        rotation: 225,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-24 h-24">
        <Doughnut data={data} options={options} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-800">{Math.round(consumed)}g</span>
        <span className="text-xs text-gray-500">/ {target}g</span>
      </div>
      <span className="mt-2 text-sm font-semibold text-gray-600">{label}</span>
    </div>
  );
};

const CalorieSummary = ({ consumedData, targetData }) => {
  const { t } = useLanguage();
  const calorieProgress = targetData.calories > 0 ? (consumedData.calories / targetData.calories) * 100 : 0;

  return (
    <Card>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('dailyCalorieTracking')}</h3>
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-medium text-gray-600">{t('consumed')}</span>
          <span className="font-bold text-2xl text-gray-800">{Math.round(consumedData.calories)} <span className="text-base font-medium">/ {targetData.calories} kcal</span></span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, calorieProgress)}%` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <MacroCircle label="Protein" consumed={consumedData.protein} target={targetData.protein} />
        <MacroCircle label="Carbs" consumed={consumedData.carbs} target={targetData.carbs} />
        <MacroCircle label="Fat" consumed={consumedData.fat} target={targetData.fat} />
      </div>
    </Card>
  );
};

export default CalorieSummary;