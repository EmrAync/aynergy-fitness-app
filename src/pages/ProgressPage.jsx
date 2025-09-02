// src/pages/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Card from '../components/common/Card';
import SkeletonCard from '../components/common/SkeletonCard';
import { exercises as exerciseLibrary } from '../data/exercises'; // Zenginleştirilmiş egzersiz datamızı import ediyoruz

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Seçilen bir egzersiz için gelişim grafiği çizen component
const ExerciseProgressChart = ({ logs, exerciseName }) => {
  const { t } = useLanguage();
  const relevantLogs = logs
    .map(log => ({
      ...log,
      exercises: log.exercises.filter(ex => ex.name === exerciseName && ex.sets.length > 0)
    }))
    .filter(log => log.exercises.length > 0)
    .sort((a, b) => a.completedAt.seconds - b.completedAt.seconds);

  if (relevantLogs.length < 2) {
    return <p className="text-center text-gray-500">{t('logMoreWorkoutsForChart')}</p>;
  }

  const chartData = {
    labels: relevantLogs.map(log => new Date(log.completedAt.seconds * 1000).toLocaleDateString()),
    datasets: [
      {
        label: `Total Volume (${t('kg')})`,
        data: relevantLogs.map(log => 
          log.exercises[0].sets.reduce((total, set) => total + (set.reps * set.weight), 0)
        ),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
      {
        label: `Max Weight (${t('kg')})`,
        data: relevantLogs.map(log => 
          Math.max(...log.exercises[0].sets.map(set => set.weight))
        ),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.1,
      }
    ]
  };

  return <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
};


const ProgressPage = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, `users/${currentUser.uid}/workoutLogs`), orderBy("completedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logs = querySnapshot.docs.map(doc => doc.data());
      setWorkoutLogs(logs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Kullanıcının antrenman yaptığı eşsiz egzersizlerin listesi
  const uniqueExercises = [...new Set(workoutLogs.flatMap(log => log.exercises.map(ex => ex.name)))];

  if (loading) {
    return <SkeletonCard className="w-full h-96" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sol Taraf: Egzersiz Seçimi ve Grafik */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">{t('exerciseProgress')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('selectExerciseToSeeProgress')}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {uniqueExercises.map(exName => (
              <button 
                key={exName} 
                onClick={() => setSelectedExercise(exName)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedExercise === exName ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {exName}
              </button>
            ))}
          </div>
          <div className="w-full h-96">
            {selectedExercise ? (
              <ExerciseProgressChart logs={workoutLogs} exerciseName={selectedExercise} />
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>{t('pleaseSelectAnExercise')}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Sağ Taraf: Geçmiş Antrenman Listesi */}
      <div className="lg:col-span-1">
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('workoutHistory')}</h3>
          <ul className="space-y-4 max-h-[600px] overflow-y-auto">
            {workoutLogs.map((log, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-bold">{log.name}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(log.completedAt.seconds * 1000).toLocaleString()}
                </p>
                <ul className="list-disc list-inside text-xs">
                  {log.exercises.map((ex, exIndex) => (
                    <li key={exIndex}>{ex.name} ({ex.sets.length} sets)</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;