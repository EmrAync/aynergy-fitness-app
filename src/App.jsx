// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/common/Spinner';

// Lazy load the main pages
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const App = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      }>
        {currentUser ? <DashboardPage /> : <AuthPage />}
      </Suspense>
    </>
  );
};

export default App;