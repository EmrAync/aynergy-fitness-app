// src/components/workout/WorkoutPlanList.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const WorkoutPlanList = ({ plans, onSelectPlan, onCreatePlan }) => {
  const [newPlanName, setNewPlanName] = useState('');
  const { t } = useLanguage();

  const handleCreate = () => {
    if (newPlanName) {
      onCreatePlan(newPlanName);
      setNewPlanName('');
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">{t('myWorkoutPlans')}</h3>
      <div className="flex space-x-2 mb-6">
        <div className="flex-grow">
          <Input 
            value={newPlanName} 
            onChange={(e) => setNewPlanName(e.target.value)} 
            placeholder={t('enterPlanName')}
          />
        </div>
        <Button onClick={handleCreate} className="w-auto">{t('createPlan')}</Button>
      </div>
      <ul className="space-y-2">
        {plans.map((plan) => (
          <li key={plan.id}>
            <button 
              onClick={() => onSelectPlan(plan.id)}
              className="w-full text-left py-2 px-4 rounded-md transition-colors duration-200 hover:bg-gray-100"
            >
              {plan.name}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default WorkoutPlanList;