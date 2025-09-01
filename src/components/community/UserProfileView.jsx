// src/components/community/UserProfileView.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { useLanguage } from '../../contexts/LanguageContext';

const UserProfileView = ({ userId }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch public profile
        const profileRef = doc(db, "publicProfiles", userId);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          setError("User not found.");
          setLoading(false);
          return;
        }

        // Fetch some of their workout plans (simulated public activity)
        const plansRef = collection(db, `users/${userId}/workoutPlans`);
        const q = query(plansRef, limit(3));
        const plansSnap = await getDocs(q);
        const plansData = plansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(plansData);

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }

  }, [userId]);

  if (loading) {
    return (
      <Card>
        <Spinner />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-center text-red-500">{error}</p>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-2xl font-bold mb-2">{t('userProfile')}</h3>
        <p className="text-gray-700 text-lg"><strong>{t('name')}:</strong> {profile.name}</p>
        {/* You can add more public info here in the future */}
      </Card>
      <Card>
        <h3 className="text-2xl font-bold mb-2">{t('workoutPlans')}</h3>
        {plans.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {plans.map(plan => (
              <li key={plan.id} className="text-gray-700">{plan.name} ({plan.exercises.length} exercises)</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No public workout plans found.</p>
        )}
      </Card>
    </div>
  );
};

export default UserProfileView;