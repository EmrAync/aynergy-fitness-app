// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import UserProfileView from '../components/community/UserProfileView';
import { useLanguage } from '../contexts/LanguageContext';
import SkeletonCard from '../components/common/SkeletonCard'; // Import SkeletonCard

const CommunityPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm) {
      setSearchResults([]);
      setSelectedUserId(null); // Clear selected user when search term is empty
      return;
    }
    setLoading(true);
    setSearchResults([]);
    setSelectedUserId(null);

    try {
      // The search query will look for users whose names start with the search term.
      const q = query(
        collection(db, "publicProfiles"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for users:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (selectedUserId) {
      return <UserProfileView userId={selectedUserId} />;
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{t('searchForUsers')}</h3>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
            />
          </div>
          <Button onClick={handleSearch} className="w-auto px-4 py-2" disabled={loading}>
            {loading ? <Spinner className="w-4 h-4" /> : t('search')}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3 mt-8">
            <SkeletonCard className="h-12 w-full" />
            <SkeletonCard className="h-12 w-full" />
            <SkeletonCard className="h-12 w-full" />
          </div>
        ) : searchResults.length > 0 ? (
          <ul className="space-y-2">
            {searchResults.map(user => (
              <li key={user.id}>
                <button
                  onClick={() => setSelectedUserId(user.userId)}
                  className="w-full text-left py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-100 text-lg text-gray-800"
                >
                  {user.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-8">No results found.</p>
        )}
      </div>
    );
  };

  return (
    <Card>
      {renderContent()}
    </Card>
  );
};

export default CommunityPage;