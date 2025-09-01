// src/components/nutrition/AddMealForm.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import FoodSearch from './FoodSearch';

const AddMealForm = ({ onAddMeal }) => {
  const [mealName, setMealName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [grams, setGrams] = useState('');
  const { t } = useLanguage();

  const handleFoodSelect = (food) => {
    setMealName(food.name);
    setCaloriesPer100g(food.caloriesPer100g);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mealName || !caloriesPer100g || !grams) return;

    const totalCalories = (parseFloat(caloriesPer100g) / 100) * parseFloat(grams);
    onAddMeal({
      name: mealName,
      totalCalories: totalCalories
    });
    
    setMealName('');
    setCaloriesPer100g('');
    setGrams('');
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('addMealForm')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FoodSearch onFoodSelect={handleFoodSelect} />
        <Input 
          label={t('caloriesPer100g')} 
          type="number" 
          value={caloriesPer100g} 
          onChange={(e) => setCaloriesPer100g(e.target.value)} 
          placeholder="e.g., 165"
          readOnly
        />
        <Input 
          label={t('grams')} 
          type="number" 
          value={grams} 
          onChange={(e) => setGrams(e.target.value)} 
          placeholder="e.g., 200"
        />
        <Button type="submit">{t('addMeal')}</Button>
      </form>
    </Card>
  );
};

export default AddMealForm;