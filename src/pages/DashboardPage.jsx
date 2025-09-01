// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import NutritionPage from './NutritionPage';
import WorkoutPage from './WorkoutPage';
import ProgressPage from './ProgressPage';
import CommunityPage from './CommunityPage';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('nutrition');
  const { t } = useLanguage();
  
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <Header />
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex -mb-px space-x-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`)}
            </button>
          ))}
        </nav>
      </div>
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardPage;