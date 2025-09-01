// src/pages/NutritionPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import CalorieSummary from '../components/nutrition/CalorieSummary';
import AddMealForm from '../components/nutrition/AddMealForm';
import MealsList from '../components/nutrition/MealsList';
import ProfileSettings from '../components/profile/ProfileSettings';
import Spinner from '../components/common/Spinner';

const NutritionPage = () => {
  const { currentUser, userProfile } = useAuth();
  const [meals, setMeals] = useState([]);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMeals = async () => {
      if (!currentUser) return;
      
      const mealsRef = collection(db, `users/${currentUser.uid}/meals/${today}/log`);
      const q = query(mealsRef, orderBy("timestamp", "asc"));
      const querySnapshot = await getDocs(q);
      const mealsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMeals(mealsData);
      
      const total = mealsData.reduce((sum, meal) => sum + meal.totalCalories, 0);
      setConsumedCalories(total);
      setLoading(false);
    };

    fetchMeals();
  }, [currentUser, today]);

  const handleAddMeal = async (newMeal) => {
    if (!currentUser) return;
    const mealsRef = collection(db, `users/${currentUser.uid}/meals/${today}/log`);
    await addDoc(mealsRef, { ...newMeal, timestamp: new Date() });
  };

  const handleProfileUpdate = async (updatedData) => {
    if (!currentUser) return;
    const profileRef = doc(db, `users/${currentUser.uid}/profile`, "data");
    await updateDoc(profileRef, updatedData);
    
    if (updatedData.weight && userProfile.weight !== updatedData.weight) {
      const weightLogRef = collection(db, `users/${currentUser.uid}/weightLogs`);
      await addDoc(weightLogRef, {
        weight: updatedData.weight,
        date: today,
        timestamp: new Date()
      });
    }
  };

  const targetCalories = { min: 1950, max: 2200 };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <CalorieSummary 
          consumedCalories={consumedCalories} 
          targetCalories={targetCalories}
        />
        <AddMealForm onAddMeal={handleAddMeal} />
        <MealsList meals={meals} />
      </div>
      <div className="md:col-span-1">
        <ProfileSettings userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />
      </div>
    </div>
  );
};

export default NutritionPage;