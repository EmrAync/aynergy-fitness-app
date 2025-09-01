// src/components/profile/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const ProfileSettings = ({ userProfile, onProfileUpdate }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setAge(userProfile.age || '');
      setHeight(userProfile.height || '');
      setWeight(userProfile.weight || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: name,
        age: parseInt(age) || 0,
        height: parseFloat(height) || 0,
        weight: parseFloat(weight) || 0,
      };
      await onProfileUpdate(updatedData);

      // Update public profile
      await setDoc(doc(db, "publicProfiles", currentUser.uid), {
        name: name,
        userId: currentUser.uid
      });

      notifySuccess(t('profileUpdatedSuccess'));
    } catch (error) {
      notifyError(t('profileUpdatedError'));
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('userSettings')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label={t('name')} 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <Input 
          label={t('age')} 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
        />
        <Input 
          label={t('height')} 
          type="number" 
          value={height} 
          onChange={(e) => setHeight(e.target.value)} 
        />
        <Input 
          label={t('weight')} 
          type="number" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
        />
        <Button type="submit">{t('updateProfile')}</Button>
      </form>
    </Card>
  );
};

export default ProfileSettings;