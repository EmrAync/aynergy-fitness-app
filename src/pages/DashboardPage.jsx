// src/pages/DashboardPage.jsx
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Spinner from '../components/common/Spinner';

// Lazy load the content pages
const NutritionPage = lazy(() => import('./NutritionPage'));
const WorkoutPage = lazy(() => import('./WorkoutPage'));
const ProgressPage = lazy(() => import('./ProgressPage'));
const CommunityPage = lazy(() => import('./CommunityPage'));

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('nutrition');
  const { t } = useLanguage();
  
  // Preload non-active tabs after a delay
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      console.log("Preloading other tab components...");
      import('./WorkoutPage');
      import('./ProgressPage');
      import('./CommunityPage');
    }, 2000); // Wait 2 seconds before preloading

    return () => clearTimeout(preloadTimer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'nutrition':
        return <NutritionPage />;
      case 'workout':
        return <WorkoutPage />;
      case 'progress':
        return <ProgressPage />;
      case 'community':
        return <CommunityPage />;
      default:
        return <NutritionPage />;
    }
  };

  const tabs = ['nutrition', 'workout', 'progress', 'community'];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 font-medium text-lg transition-all duration-300 ease-in-out ${
                  activeTab === tab
                    ? 'border-b-4 border-blue-500 text-blue-600'
                    : 'border-b-4 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`)}
              </button>
            ))}
          </nav>
        </div>
        <main>
          <Suspense fallback={
            <div className="flex items-center justify-center h-96">
              <Spinner />
            </div>
          }>
            {renderContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;