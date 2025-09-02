// src/pages/DashboardPage.jsx
import React, { useState, Suspense, lazy } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import HomePage from './HomePage'; // Yeni ana sayfamızı import ediyoruz
import AiAssistant from '../components/ai/AiAssistant';

// Lazy load the other pages
const NutritionPage = lazy(() => import('./NutritionPage'));
const WorkoutPage = lazy(() => import('./WorkoutPage'));
const ProgressPage = lazy(() => import('./ProgressPage'));
const CommunityPage = lazy(() => import('./CommunityPage'));
const AdminPage = lazy(() => import('./AdminPage'));

const DashboardPage = () => {
    // 'home' artık varsayılan sekmemiz
    const [activeTab, setActiveTab] = useState('home');
    const { t } = useLanguage();
    const { userProfile } = useAuth();

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage onNavigate={setActiveTab} />; // Yönlendirme fonksiyonu ekledik
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
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />

                {/* Navigasyon sekmeleri artık Header'ın altında kalıcı */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex -mb-px space-x-6">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-1 font-medium text-lg transition-all duration-300 ease-in-out ${activeTab === tab
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
                <AiAssistant pageContext={activeTab} />
            </div>
        </div>
    );
};

export default DashboardPage;