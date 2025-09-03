// src/components/community/UserProfileView.jsx
// src/components/community/UserProfileView.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  limit,
  setDoc,
} from "firebase/firestore";
import Card from "../common/Card";
import Spinner from "../common/Spinner";
import Button from "../common/Button"; // Butonu import ediyoruz
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext"; // Mevcut kullanıcıyı almak için
import { useNotification } from "../../contexts/NotificationContext"; // Bildirimler için

const UserProfileView = ({ userId }) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // ... (mevcut kod aynı kalacak)
    };
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleAddFriend = async () => {
    if (!currentUser || !userId) return;
    try {
      // Arkadaşlığı iki taraflı olarak ekliyoruz
      const currentUserFriendsRef = doc(
        db,
        `users/${currentUser.uid}/friends`,
        userId
      );
      await setDoc(currentUserFriendsRef, {
        friendId: userId,
        name: profile.name,
        addedAt: new Date(),
      });

      const otherUserFriendsRef = doc(
        db,
        `users/${userId}/friends`,
        currentUser.uid
      );
      // Diğer kullanıcının adını da almamız lazım, şimdilik varsayılan bir isim kullanalım
      const currentUserName = doc(
        db,
        `users/${currentUser.uid}/profile`,
        "data"
      );
      const docSnap = await getDoc(currentUserName);
      let name = "A new friend";
      if (docSnap.exists()) {
        name = docSnap.data().name;
      }
      await setDoc(otherUserFriendsRef, {
        friendId: currentUser.uid,
        name: name,
        addedAt: new Date(),
      });

      notifySuccess(`${profile.name} ${t("friendAdded")}`);
    } catch (error) {
      notifyError(t("friendAddError"));
      console.error("Error adding friend: ", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <Spinner />
      </Card>
    );
  }
  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-2">{t("userProfile")}</h3>
            <p className="text-gray-700 text-lg">
              <strong>{t("name")}:</strong> {profile.name}
            </p>
          </div>
          {currentUser.uid !== userId && (
            <Button onClick={handleAddFriend} className="w-auto">
              {t("addFriend")}
            </Button>
          )}
        </div>
      </Card>
      <Card>
        <h3 className="text-2xl font-bold mb-2">{t("workoutPlans")}</h3>
        {plans.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {plans.map((plan) => (
              <li key={plan.id} className="text-gray-700">
                {plan.name} ({plan.exercises.length} exercises)
              </li>
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
