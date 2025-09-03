// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
// Arama component'ini ayrı bir dosyaya taşıyabiliriz, şimdilik burada kalabilir
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import UserProfileView from '../components/community/UserProfileView';

const CommunityPage = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Arama için state'ler
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    // 1. Kullanıcının arkadaşlarını çek
    const friendsRef = collection(db, `users/${currentUser.uid}/friends`);
    const unsubscribeFriends = onSnapshot(friendsRef, (snapshot) => {
      const friendsList = snapshot.docs.map(doc => doc.data().friendId);
      setFriends(friendsList);
    });

    return () => unsubscribeFriends();
  }, [currentUser]);

  useEffect(() => {
    if (friends.length === 0) {
      setLoading(false);
      return;
    }

    // 2. Arkadaşların aktivitelerini dinle
    const activitiesQuery = query(
      collection(db, 'activities'),
      where('userId', 'in', friends),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(activitiesData);
      setLoading(false);
    });

    return () => unsubscribeActivities();
  }, [friends]);

  const handleSearch = async () => { /* ... (mevcut arama kodunuz aynı kalacak) ... */ };

  if (selectedUserId) {
    return <UserProfileView userId={selectedUserId} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sol Taraf: Aktivite Akışı */}
      <div className="lg:col-span-2">
        <Card>
          <h2 className="text-2xl font-bold mb-4">{t('activityFeed')}</h2>
          {loading ? <Spinner /> : (
            <div className="space-y-4">
              {activities.length > 0 ? activities.map(activity => (
                <div key={activity.id} className="p-4 bg-gray-50 rounded-lg">
                  <p>
                    <span className="font-bold">{activity.userName}</span> {t('completedAWorkout')} 
                    <span className="font-semibold">"{activity.workoutName}"</span>.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              )) : (
                <p className="text-gray-500">{t('noFriendActivity')}</p>
              )}
            </div>
          )}
        </Card>
      </div>
      
      {/* Sağ Taraf: Kullanıcı Arama */}
      <div className="lg:col-span-1">
        <Card>
          <h3 className="text-xl font-bold">{t('searchForUsers')}</h3>
          {/* ... (mevcut arama JSX kodunuz buraya gelecek) ... */}
        </Card>
      </div>
    </div>
  );
};

export default CommunityPage;