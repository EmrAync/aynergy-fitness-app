// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { calculateTargetMacros } from '../services/healthService';
import Card from '../components/common/Card';
import StreakTracker from '../components/dashboard/StreakTracker';
import CalorieSummary from '../components/nutrition/CalorieSummary';
import Spinner from '../components/common/Spinner';

// Icons
const WorkoutIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h3v12H4zM17 6h3v12h-3zM7 10h10v4H7z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const NutritionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CommunityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

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

    if (userProfile) {
      const targets = calculateTargetMacros(userProfile);
      setTargetMacros(targets);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
        <Spinner size="lg" label="Loading your dashboard..." />
      </div>
    );
  }

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Quick action cards
  const quickActions = [
    {
      icon: <WorkoutIcon />,
      title: t('todaysWorkout'),
      description: t('todaysWorkoutDesc'),
      action: () => onNavigate('workout'),
      gradient: 'from-primary-500 to-primary-600',
      shadowColor: 'shadow-primary-500/30',
    },
    {
      icon: <NutritionIcon />,
      title: 'Track Meal',
      description: 'Log your food intake',
      action: () => onNavigate('nutrition'),
      gradient: 'from-secondary-500 to-secondary-600',
      shadowColor: 'shadow-secondary-500/30',
    },
    {
      icon: <CommunityIcon />,
      title: 'Community',
      description: 'Connect with others',
      action: () => onNavigate('community'),
      gradient: 'from-accent-500 to-accent-600',
      shadowColor: 'shadow-accent-500/30',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <Card className="lg:col-span-2" variant="gradient" padding="lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">{getGreeting()}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {userProfile?.name || 'Athlete'}
              </h2>
              <p className="text-primary-100 max-w-md">
                {t('homeGreeting') || "Let's make today count! Check your progress and crush your goals."}
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-5xl">🏆</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Streak Tracker */}
        <div className="lg:col-span-1">
          <StreakTracker />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`
                group relative overflow-hidden rounded-2xl p-6 text-left
                bg-gradient-to-br ${action.gradient} text-white
                shadow-lg ${action.shadowColor}
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
              `}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4
                            group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h4 className="font-semibold text-lg mb-1">{action.title}</h4>
                <p className="text-white/80 text-sm">{action.description}</p>
              </div>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRightIcon />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Workout Card */}
        <Card hover onClick={() => onNavigate('workout')}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">{t('todaysWorkout')}</h3>
              <p className="text-neutral-500 text-sm mt-1">{t('todaysWorkoutDesc')}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl text-primary-600">
              <WorkoutIcon />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">View your workout plan</span>
            <div className="flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
              {t('goToWorkout')}
              <ArrowRightIcon />
            </div>
          </div>
        </Card>

        {/* Calorie Summary */}
        <CalorieSummary consumedData={consumedMacros} targetData={targetMacros} />
      </div>
    </div>
  );
};

export default HomePage;
