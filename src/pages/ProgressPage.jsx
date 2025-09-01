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
import Spinner from '../components/common/Spinner';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, `users/${currentUser.uid}/weightLogs`), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push(doc.data());
      });

      if (logs.length >= 2) {
        const labels = logs.map(log => {
          const date = log.date;
          return date;
        });
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
      } else {
        setChartData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching weight logs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, t]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('weightProgressChart'),
      },
    },
    maintainAspectRatio: false,
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="w-full h-96">
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <p>{t('addTwoEntries')}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProgressPage;