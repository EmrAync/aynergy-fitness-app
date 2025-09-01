// src/components/nutrition/FoodSearch.jsx
import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { searchFoods } from '../../services/nutritionApi';
import { useLanguage } from '../../contexts/LanguageContext';
import Input from '../common/Input';

const FoodSearch = ({ onFoodSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFoods = async () => {
      if (debouncedSearchTerm) {
        setLoading(true);
        const foods = await searchFoods(debouncedSearchTerm);
        setResults(foods);
        setLoading(false);
      } else {
        setResults([]);
      }
    };
    fetchFoods();
  }, [debouncedSearchTerm]);

  return (
    <div className="relative">
      <Input
        label={t('mealName')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('searchFoodPlaceholder')}
      />
      {loading && (
        <div className="mt-2 text-center text-gray-500">{t('searching')}</div>
      )}
      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          {results.map((food, index) => (
            <li
              key={index}
              onClick={() => {
                onFoodSelect(food);
                setSearchTerm('');
                setResults([]);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {food.name}
            </li>
          ))}
        </ul>
      )}
      {!loading && searchTerm && results.length === 0 && (
        <div className="mt-2 text-center text-gray-500">{t('noResults')}</div>
      )}
    </div>
  );
};

export default FoodSearch;