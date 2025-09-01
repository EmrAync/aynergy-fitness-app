// src/components/nutrition/MealsList.jsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';

const MealsList = ({ meals }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('mealsToday')}</h3>
      {meals.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {meals.map((meal, index) => (
            <li key={index} className="py-2 flex justify-between items-center">
              <span className="font-medium text-gray-900">{meal.name}</span>
              <span className="text-gray-600">{meal.totalCalories.toFixed(2)} kcal</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">{t('noMealsAdded')}</p>
      )}
    </Card>
  );
};

export default MealsList;