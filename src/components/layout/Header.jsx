// src/components/layout/Header.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Button from '../common/Button';

const Header = () => {
  const { currentUser, userProfile } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const handleSignOut = () => {
    signOut(auth).catch(error => console.error("Sign out error", error));
  };

  return (
    <header className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{t('appTitle')}</h1>
        {userProfile && <p className="text-gray-600 mt-1">{t('welcome')}, <span className="font-semibold">{userProfile.name}</span>!</p>}
      </div>
      <div className="flex items-center mt-4 md:mt-0">
        <select value={lang} onChange={e => setLang(e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
          <option value="tr">🇹🇷 Türkçe</option>
          <option value="en">🇬🇧 English</option>
        </select>
        <Button onClick={handleSignOut} className="bg-gray-600 hover:bg-gray-700 ml-4 w-auto">
          {t('logoutBtn')}
        </Button>
      </div>
    </header>
  );
};

export default Header;