// src/pages/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../components/common/Card';
import SkeletonCard from '../components/common/SkeletonCard'; // Skeleton'ı import ediyoruz

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressPage = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true); // Yüklenme state'i

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, `users/${currentUser.uid}/weightLogs`), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logs = querySnapshot.docs.map(doc => doc.data());

      if (logs.length > 0) {
        const labels = logs.map(log => new Date(log.timestamp.seconds * 1000).toLocaleDateString());
        const weights = logs.map(log => log.weight);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: t('weightProgressChart'),
              data: weights,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              tension: 0.1,
            },
          ],
        });
      }
      setLoading(false); // Veri geldikten sonra yüklenmeyi bitir
    });

    return () => unsubscribe();
  }, [currentUser, t]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Yükleniyorsa iskelet göster
  if (loading) {
    return <SkeletonCard className="w-full h-96" />;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('weightProgressChart')}</h3>
      <div className="w-full h-96">
        {chartData && chartData.labels.length >= 2 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <p>{t('addTwoEntries')}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProgressPage;