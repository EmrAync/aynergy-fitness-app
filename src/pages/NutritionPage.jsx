// src/pages/NutritionPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection, query, orderBy, addDoc } from 'firebase/firestore';
import CalorieSummary from '../components/nutrition/CalorieSummary';
import AddMealForm from '../components/nutrition/AddMealForm';
import MealsList from '../components/nutrition/MealsList';
import UserSettings from '../components/profile/ProfileSettings';
import Card from '../components/common/Card';
import SkeletonCard from '../components/common/SkeletonCard';

const NutritionPage = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const profileRef = doc(db, `users/${currentUser.uid}/profile`, "data");
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        setUserProfile(null);
      }
    });

    const mealsQuery = query(collection(db, `users/${currentUser.uid}/meals`), orderBy("timestamp", "desc"));
    const unsubscribeMeals = onSnapshot(mealsQuery, (snapshot) => {
      const mealsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMeals(mealsData);
      setLoading(false);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeMeals();
    };
  }, [currentUser]);

  const handleAddMeal = async (mealData) => {
    if (!currentUser) return;
    await addDoc(collection(db, `users/${currentUser.uid}/meals`), {
      ...mealData,
      timestamp: new Date(),
    });
  };

  const calculateConsumedMacros = () => {
    return meals.reduce((total, meal) => {
      total.calories += meal.totalCalories || 0;
      total.protein += meal.totalProtein || 0;
      total.carbs += meal.totalCarbs || 0;
      total.fat += meal.totalFat || 0;
      return total;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Bu hedefler gelecekte kullanıcının profiline göre dinamik olarak hesaplanabilir.
  const targetMacros = { calories: 2500, protein: 150, carbs: 300, fat: 70 };
  const consumedMacros = calculateConsumedMacros();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard className="h-48" /> {/* CalorieSummary */}
          <SkeletonCard className="h-64" /> {/* AddMealForm */}
        </div>
        <div className="lg:col-span-1">
          <SkeletonCard className="h-96" /> {/* MealsList */}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CalorieSummary consumedData={consumedMacros} targetData={targetMacros} />
        <AddMealForm onAddMeal={handleAddMeal} />
        {/* UserSettings component'i burada veya ayrı bir profil sayfasında olabilir */}
      </div>
      <div className="lg:col-span-1">
        <MealsList meals={meals} userId={currentUser?.uid} />
      </div>
    </div>
  );
};

export default NutritionPage;