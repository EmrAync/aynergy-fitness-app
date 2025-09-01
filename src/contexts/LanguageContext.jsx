// src/contexts/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const LanguageContext = createContext();
const translations = { en, tr };

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('tr');

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const value = { lang, setLang, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};