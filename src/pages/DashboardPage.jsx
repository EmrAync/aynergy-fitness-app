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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;