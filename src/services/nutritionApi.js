// src/services/nutritionApi.js
const foodDatabase = [
  { name: 'Chicken Breast', caloriesPer100g: 165 },
  { name: 'Salmon Fillet', caloriesPer100g: 208 },
  { name: 'Avocado', caloriesPer100g: 160 },
  { name: 'Brown Rice', caloriesPer100g: 123 },
  { name: 'Sweet Potato', caloriesPer100g: 86 },
  { name: 'Broccoli', caloriesPer100g: 34 },
  { name: 'Greek Yogurt', caloriesPer100g: 97 },
  { name: 'Oats', caloriesPer100g: 389 },
  { name: 'Apple', caloriesPer100g: 52 }
];

export const searchFoods = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = foodDatabase.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 500); // Simulate network delay
  });
};