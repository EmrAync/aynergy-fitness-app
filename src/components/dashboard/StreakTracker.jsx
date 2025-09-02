// src/components/dashboard/StreakTracker.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Card from '../common/Card';

// Tarihleri karşılaştırmak için yardımcı fonksiyon
const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
};

const isYesterday = (someDate) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return someDate.getDate() === yesterday.getDate() &&
    someDate.getMonth() === yesterday.getMonth() &&
    someDate.getFullYear() === yesterday.getFullYear();
};


const StreakTracker = () => {
  const { currentUser } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const profileRef = doc(db, `users/${currentUser.uid}/profile`, "data");
    const unsubscribe = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentStreak = data.streak || 0;
        const lastWorkout = data.lastWorkoutDate?.toDate();

        if (lastWorkout) {
          if (isToday(lastWorkout)) {
            setStreak(currentStreak);
          } else if (isYesterday(lastWorkout)) {
            setStreak(currentStreak);
          } else {
            // Seri bozulmuş
            setStreak(0);
          }
        } else {
          setStreak(0);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Bu useEffect, `handleCompleteWorkout` fonksiyonu çağrıldığında çalışacak
  // ve seriyi güncelleyecek.
  useEffect(() => {
    if (!currentUser) return;
    const profileRef = doc(db, `users/${currentUser.uid}/profile`, "data");
    const unsubscribe = onSnapshot(profileRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            let lastWorkout = data.lastWorkoutDate?.toDate();
            let currentStreak = data.streak || 0;

            if (lastWorkout) {
                if (isToday(lastWorkout) && currentStreak === 0) {
                   currentStreak = 1;
                } else if (!isToday(lastWorkout) && isYesterday(lastWorkout) && currentStreak > 0) {
                   // Dün antrenman yapılmış, bugün henüz yapılmamış. Seri devam ediyor.
                } else if (!isToday(lastWorkout) && !isYesterday(lastWorkout)) {
                   currentStreak = 0; // Seri bozulmuş
                }
            }
            setStreak(currentStreak);
        }
    });
    return () => unsubscribe();
}, [currentUser]);


  return (
    <Card className="bg-gradient-to-r from-orange-400 to-rose-400 text-white">
      <div className="flex items-center space-x-4">
        <div className="text-5xl">🔥</div>
        <div>
          <h4 className="font-bold text-2xl">{streak} Day Streak</h4>
          <p className="text-orange-100">Keep the fire going! Complete a workout today.</p>
        </div>
      </div>
    </Card>
  );
};

export default StreakTracker;