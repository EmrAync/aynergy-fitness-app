// src/pages/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import WeightProgressChart from '../components/progress/WeightProgressChart';
import Card from '../components/common/Card';
import { useLanguage } from '../contexts/LanguageContext';
import SkeletonCard from '../components/common/SkeletonCard'; // Import SkeletonCard

const ProgressPage = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const profileRef = doc(db, `users/${currentUser.uid}/profile`, "data");
    const unsubscribe = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        console.log("No such profile document!");
        setUserProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching profile for progress:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const { t } = useLanguage();

  if (loading) {
    return <SkeletonCard className="h-96" />; // Skeleton for the main chart area
  }

  return (
    <Card>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('weightProgressChart')}</h3>
      {userProfile?.weightHistory && userProfile.weightHistory.length >= 2 ? (
        <WeightProgressChart weightHistory={userProfile.weightHistory} />
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-500 text-center p-4">
          <p>{t('addTwoEntries')}</p>
        </div>
      )}
    </Card>
  );
};

export default ProgressPage;