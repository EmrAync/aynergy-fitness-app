// src/components/admin/AdminUserDetail.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';

const AdminUserDetail = ({ user, onBack }) => {
  const { currentUser } = useAuth(); // Yönetici bilgilerini almak için
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotification();

  const [userPlans, setUserPlans] = useState([]);
  const [adminPlans, setAdminPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Seçilen kullanıcının antrenman planlarını çek
        const userPlansSnapshot = await getDocs(collection(db, `users/${user.userId}/workoutPlans`));
        setUserPlans(userPlansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Yöneticinin (yani sizin) antrenman planlarını çek
        const adminPlansSnapshot = await getDocs(collection(db, `users/${currentUser.uid}/workoutPlans`));
        setAdminPlans(adminPlansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching plans: ", error);
        notifyError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.userId, currentUser.uid, notifyError]);

  const handleAssignPlan = async (planToAssign) => {
    try {
      // Yöneticinin planını kopyalayıp kullanıcının planlarına yeni bir döküman olarak ekle
      const { id, ...planData } = planToAssign; // Orijinal planın ID'sini kopyalamıyoruz
      
      await addDoc(collection(db, `users/${user.userId}/workoutPlans`), {
        ...planData,
        assignedBy: currentUser.uid, // Programı kimin atadığını belirtelim
        createdAt: new Date(),
      });

      // Başarılı atama sonrası kullanıcı planları listesini anında güncelle
      setUserPlans(prevPlans => [...prevPlans, { ...planData, assignedBy: currentUser.uid }]);
      notifySuccess(`Plan "${planData.name}" successfully assigned to ${user.name}.`);

    } catch (error) {
      console.error("Error assigning plan: ", error);
      notifyError("Failed to assign plan.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} className="w-auto bg-gray-600 hover:bg-gray-700">
        &larr; Back to User List
      </Button>

      <Card>
        <h2 className="text-2xl font-bold mb-1">{user.name}'s Profile</h2>
        <p className="text-sm text-gray-500 mb-4">User ID: {user.userId}</p>
        
        <h3 className="text-xl font-semibold mb-2">Current Workout Plans ({userPlans.length})</h3>
        <ul className="list-disc list-inside pl-2 space-y-1">
          {userPlans.length > 0 ? (
            userPlans.map(plan => <li key={plan.id}>{plan.name}</li>)
          ) : (
            <p className="text-gray-500">This user has no workout plans yet.</p>
          )}
        </ul>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-2">Assign a Plan from Your Library</h3>
        <p className="text-sm text-gray-500 mb-4">Select one of your own plans to copy to this user's account.</p>
        <div className="space-y-3">
          {adminPlans.length > 0 ? (
            adminPlans.map(plan => (
              <div key={plan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>{plan.name}</span>
                <Button onClick={() => handleAssignPlan(plan)} className="w-auto text-xs px-3 py-1">
                  Assign
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You don't have any plans to assign. Go to the Workout tab to create one.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminUserDetail;