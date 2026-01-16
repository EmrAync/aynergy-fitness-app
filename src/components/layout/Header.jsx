// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Button from '../common/Button';

// Icons
const DumbbellIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h3v12H4zM17 6h3v12h-3zM7 10h10v4H7z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Header = () => {
  const { userProfile } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleSignOut = () => {
    signOut(auth).catch(error => console.error("Sign out error", error));
  };

  const languages = [
    { code: 'tr', label: 'Turkce', flag: 'TR' },
    { code: 'en', label: 'English', flag: 'EN' },
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <DumbbellIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{t('appTitle')}</h1>
            {userProfile && (
              <p className="text-neutral-500 text-sm">
                {t('welcome')}, <span className="font-medium text-primary-600">{userProfile.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-neutral-200
                       hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200"
            >
              <GlobeIcon />
              <span className="text-sm font-medium text-neutral-700">{currentLang.flag}</span>
              <ChevronDownIcon />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-soft-lg border border-neutral-100 py-1 z-50 animate-fade-in">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setLang(language.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-50 transition-colors
                              ${lang === language.code ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'}`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium">{language.label}</span>
                    {lang === language.code && (
                      <svg className="w-4 h-4 ml-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-3 pl-3 pr-4 py-2 bg-white rounded-xl border border-neutral-200
                       hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(userProfile?.name)}
              </div>
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                {userProfile?.name?.split(' ')[0] || 'User'}
              </span>
              <ChevronDownIcon />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-neutral-100 py-2 z-50 animate-fade-in">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-semibold text-neutral-900">{userProfile?.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Free Plan</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <UserIcon />
                    <span className="text-sm font-medium">Profile Settings</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-neutral-100 pt-1 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    <LogoutIcon />
                    <span className="text-sm font-medium">{t('logoutBtn')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showLangMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowLangMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
