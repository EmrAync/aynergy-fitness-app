// src/components/workout/WorkoutPlanList.jsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';

const WorkoutPlanList = ({ plans, onSelectPlan, selectedPlanId }) => {
  const { t } = useLanguage();

  // Bu component artık plan oluşturmuyor, bu yüzden ilgili kodları kaldırdık.
  
  return (
    // Card component'i zaten WorkoutPage'de kullanıldığı için buradan kaldırıldı.
    // Daha esnek bir yapı için.
    <ul className="space-y-2">
      {plans.length > 0 ? (
        plans.map((plan) => (
          <li key={plan.id}>
            <button 
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full text-left py-2 px-4 rounded-md transition-colors duration-200 ${
                selectedPlanId === plan.id ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
              }`}
            >
              {plan.name}
            </button>
          </li>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">No workout plans yet.</p>
      )}
    </ul>
  );
};

export default WorkoutPlanList;