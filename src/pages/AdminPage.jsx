// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import AdminUserDetail from '../components/admin/AdminUserDetail'; // Yeni component'i import edeceğiz
import { useLanguage } from '../contexts/LanguageContext';

const AdminPage = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Seçili kullanıcıyı tutmak için state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "publicProfiles"));
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  }

  // Eğer bir kullanıcı seçildiyse, detay görünümünü göster
  if (selectedUser) {
    return (
      <AdminUserDetail 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)} // Geri dönme fonksiyonu
      />
    );
  }

  // Kullanıcı seçilmediyse, listeyi göster
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">{t('adminPanelTitle')}</h2>
      <ul className="divide-y divide-gray-200">
        {users.map(user => (
          <li 
            key={user.id} 
            className="py-3 px-2 -mx-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            onClick={() => setSelectedUser(user)}
          >
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">User ID: {user.userId}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default AdminPage;