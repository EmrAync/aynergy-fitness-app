// src/components/profile/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const ProfileSettings = ({ userProfile, onProfileUpdate }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotification();

  // Form state'ini tek bir obje içinde yönetmek daha modern bir yaklaşımdır.
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: 'generalFitness', // Yeni alan
    activityLevel: 'moderate' // Yeni alan
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        age: userProfile.age || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        goal: userProfile.goal || 'generalFitness',
        activityLevel: userProfile.activityLevel || 'moderate'
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        age: parseInt(formData.age) || 0,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
      };
      await onProfileUpdate(updatedData);

      await setDoc(doc(db, "publicProfiles", currentUser.uid), {
        name: formData.name,
        userId: currentUser.uid
      }, { merge: true });

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
        <Input label={t('name')} name="name" value={formData.name} onChange={handleChange} />
        <Input label={t('age')} name="age" type="number" value={formData.age} onChange={handleChange} />
        <Input label={t('height')} name="height" type="number" value={formData.height} onChange={handleChange} />
        <Input label={t('weight')} name="weight" type="number" value={formData.weight} onChange={handleChange} />

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('fitnessGoal')}</label>
          <select name="goal" value={formData.goal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="fatLoss">{t('fatLoss')}</option>
            <option value="muscleGain">{t('muscleGain')}</option>
            <option value="generalFitness">{t('generalFitness')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('activityLevel')}</label>
          <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="sedentary">{t('sedentary')}</option>
            <option value="light">{t('light')}</option>
            <option value="moderate">{t('moderate')}</option>
            <option value="active">{t('active')}</option>
          </select>
        </div>

        <Button type="submit">{t('updateProfile')}</Button>
      </form>
    </Card>
  );
};

export default ProfileSettings;