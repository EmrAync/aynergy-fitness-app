// src/pages/DashboardPage.jsx
import React, { useState, Suspense, lazy } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import HomePage from './HomePage';
import AiAssistant from '../components/ai/AiAssistant';

// Lazy load the other pages
const NutritionPage = lazy(() => import('./NutritionPage'));
const WorkoutPage = lazy(() => import('./WorkoutPage'));
const ProgressPage = lazy(() => import('./ProgressPage'));
const CommunityPage = lazy(() => import('./CommunityPage'));
const AdminPage = lazy(() => import('./AdminPage'));

// Tab Icons
const tabIcons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  nutrition: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  workout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h3v12H4zM17 6h3v12h-3zM7 10h10v4H7z" />
    </svg>
  ),
  progress: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  community: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  admin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useLanguage();
  const { userProfile } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'nutrition':
        return <NutritionPage />;
      case 'workout':
        return <WorkoutPage />;
      case 'progress':
        return <ProgressPage />;
      case 'community':
        return <CommunityPage />;
      case 'admin':
        return userProfile?.role === 'admin' ? <AdminPage /> : <HomePage onNavigate={setActiveTab} />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  const initialTabs = ['home', 'nutrition', 'workout', 'progress', 'community'];
  if (userProfile && userProfile.role === 'admin') {
    initialTabs.push('admin');
  }
  const tabs = initialTabs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl shadow-soft border border-neutral-100">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200 ease-out
                  ${activeTab === tab
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/30'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }
                `}
              >
                <span className={activeTab === tab ? 'text-white' : 'text-neutral-400'}>
                  {tabIcons[tab]}
                </span>
                <span className="hidden sm:inline">
                  {t(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`)}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="animate-fade-in">
          <Suspense fallback={
            <div className="flex items-center justify-center h-96">
              <Spinner size="lg" label="Loading..." />
            </div>
          }>
            {renderContent()}
          </Suspense>
        </main>

        {/* AI Assistant */}
        <AiAssistant pageContext={activeTab} />
      </div>
    </div>
  );
};

export default DashboardPage;
