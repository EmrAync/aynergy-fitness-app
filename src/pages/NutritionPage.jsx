// src/pages/NutritionPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import CalorieSummary from '../components/nutrition/CalorieSummary';
import AddMealForm from '../components/nutrition/AddMealForm';
import MealsList from '../components/nutrition/MealsList';
import UserSettings from '../components/profile/ProfileSettings';
import Card from '../components/common/Card';
import SkeletonCard from '../components/common/SkeletonCard'; // Import SkeletonCard

const NutritionPage = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchProfileAndMeals = async () => {
      setLoading(true);
      
      // Setup real-time listener for user profile
      const profileRef = doc(db, `users/${currentUser.uid}/profile`, "data");
      const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log("No such profile document!");
          setUserProfile(null);
        }
        // Only set loading to false after both initial profile and meals are fetched
        // Or manage two separate loading states if they are independent
      }, (error) => {
        console.error("Error fetching profile:", error);
        setUserProfile(null);
      });

      // Setup real-time listener for meals
      const mealsQuery = query(
        collection(db, `users/${currentUser.uid}/meals`),
        orderBy("timestamp", "desc")
      );
      const unsubscribeMeals = onSnapshot(mealsQuery, (snapshot) => {
        const mealsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMeals(mealsData);
        setLoading(false); // Set loading to false once meals are fetched
      }, (error) => {
        console.error("Error fetching meals:", error);
        setMeals([]);
        setLoading(false);
      });

      return () => {
        unsubscribeProfile();
        unsubscribeMeals();
      };
    };

    fetchProfileAndMeals();
  }, [currentUser]);

  const calculateConsumedCalories = () => {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  };

  // Simplified target calories for now
  const targetCalories = { min: 2000, max: 2500 };

  const handleProfileUpdate = async (updatedData) => {
    if (currentUser) {
      const profileRef = doc(db, `users/${currentUser.uid}/profile`, "data");
      await setDoc(profileRef, updatedData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updatedData }));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard className="h-40" /> {/* For CalorieSummary */}
          <SkeletonCard className="h-64" /> {/* For AddMealForm */}
          <SkeletonCard className="h-96" /> {/* For UserSettings */}
        </div>
        {/* Right Column Skeleton */}
        <div className="lg:col-span-1">
          <SkeletonCard className="h-[calc(100vh-180px)]" /> {/* For MealsList */}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {userProfile && <CalorieSummary consumedCalories={calculateConsumedCalories()} targetCalories={targetCalories} />}
        <AddMealForm userId={currentUser?.uid} />
        {userProfile && <UserSettings userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />}
      </div>
      <div className="lg:col-span-1">
        <MealsList meals={meals} userId={currentUser?.uid} />
      </div>
    </div>
  );
};

export default NutritionPage;