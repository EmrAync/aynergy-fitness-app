// src/components/nutrition/AddMealForm.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import FoodSearch from './FoodSearch';

const AddMealForm = ({ onAddMeal }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState('');
  const { t } = useLanguage();

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFood || !grams) return;

    const multiplier = parseFloat(grams) / 100;
    
    onAddMeal({
      name: selectedFood.name,
      totalCalories: selectedFood.caloriesPer100g * multiplier,
      totalProtein: selectedFood.proteinPer100g * multiplier,
      totalCarbs: selectedFood.carbsPer100g * multiplier,
      totalFat: selectedFood.fatPer100g * multiplier,
    });
    
    setSelectedFood(null);
    setGrams('');
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('addMealForm')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FoodSearch onFoodSelect={handleFoodSelect} />
        
        {selectedFood && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold">{selectedFood.name}</h4>
            <p className="text-sm text-gray-600">
              Per 100g: {Math.round(selectedFood.caloriesPer100g)} kcal, 
              Protein: {Math.round(selectedFood.proteinPer100g)}g, 
              Carbs: {Math.round(selectedFood.carbsPer100g)}g, 
              Fat: {Math.round(selectedFood.fatPer100g)}g
            </p>
          </div>
        )}

        <Input 
          label={t('grams')} 
          type="number" 
          value={grams} 
          onChange={(e) => setGrams(e.target.value)} 
          placeholder="e.g., 150"
        />
        <Button type="submit" disabled={!selectedFood || !grams}>{t('addMeal')}</Button>
      </form>
    </Card>
  );
};

export default AddMealForm;