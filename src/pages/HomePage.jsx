// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { calculateTargetMacros } from '../services/healthService'; // Yeni servisimizi import ediyoruz
import Card from '../components/common/Card';
import StreakTracker from '../components/dashboard/StreakTracker';
import CalorieSummary from '../components/nutrition/CalorieSummary';
import Spinner from '../components/common/Spinner';

const HomePage = ({ onNavigate }) => {
  const { currentUser, userProfile } = useAuth();
  const { t } = useLanguage();

  const [consumedMacros, setConsumedMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [targetMacros, setTargetMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
        setLoading(false);
        return;
    }

    // 1. Kullanıcının profiline göre akıllı hedefleri hesapla
    if (userProfile) {
        const targets = calculateTargetMacros(userProfile);
        setTargetMacros(targets);
    }

    // 2. Sadece "bugün" eklenen yemekleri Firestore'dan dinle
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Günün başlangıcı

    const mealsQuery = query(
      collection(db, `users/${currentUser.uid}/meals`),
      where("timestamp", ">=", today)
    );

    const unsubscribe = onSnapshot(mealsQuery, (snapshot) => {
      const todayConsumed = snapshot.docs.reduce((total, doc) => {
        const meal = doc.data();
        total.calories += meal.totalCalories || 0;
        total.protein += meal.totalProtein || 0;
        total.carbs += meal.totalCarbs || 0;
        total.fat += meal.totalFat || 0;
        return total;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

      setConsumedMacros(todayConsumed);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, userProfile]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Spinner />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800">{t('welcome')}, {userProfile?.name}!</h2>
          <p className="text-gray-500">{t('homeGreeting')}</p>
        </Card>
        <StreakTracker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-2">{t('todaysWorkout')}</h3>
          <p className="text-gray-500 mb-4">{t('todaysWorkoutDesc')}</p>
          <div 
            onClick={() => onNavigate('workout')}
            className="p-4 bg-blue-50 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <span className="font-bold text-blue-700">{t('goToWorkout')} &rarr;</span>
          </div>
        </Card>

        {/* Artık CalorieSummary canlı ve kişisel verilerle çalışıyor */}
        <CalorieSummary consumedData={consumedMacros} targetData={targetMacros} />
      </div>
    </div>
  );
};

export default HomePage;