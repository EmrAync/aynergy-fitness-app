// src/components/workout/PlanDetails.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const PlanDetails = ({ selectedPlan, onDeletePlan, onAddSet }) => {
  const { t } = useLanguage();
  const [reps, setReps] = useState({});
  const [weight, setWeight] = useState({});

  const handleAddSet = (exerciseIndex) => {
    const newSet = {
      reps: parseInt(reps[exerciseIndex]) || 0,
      weight: parseFloat(weight[exerciseIndex]) || 0
    };
    onAddSet(selectedPlan.id, exerciseIndex, newSet);
    setReps({ ...reps, [exerciseIndex]: '' });
    setWeight({ ...weight, [exerciseIndex]: '' });
  };

  if (!selectedPlan) {
    return (
      <Card>
        <p className="text-center text-gray-500">{t('selectPlanMessage')}</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{selectedPlan.name}</h3>
        <Button onClick={() => onDeletePlan(selectedPlan.id)} className="w-auto px-4 py-2 text-sm bg-red-600 hover:bg-red-700">
          {t('deletePlan')}
        </Button>
      </div>
      <h4 className="font-semibold text-xl mb-4">{t('exercisesInPlan')}:</h4>
      <ul className="space-y-6">
        {selectedPlan.exercises.map((exercise, index) => (
          <li key={index} className="bg-gray-100 p-6 rounded-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                <img src={exercise.gif} alt={exercise.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <span className="font-bold text-lg text-gray-900">{exercise.name}</span>
                <p className="text-sm text-gray-500">{exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)}</p>
              </div>
            </div>
            
            <div className="pl-16">
              <h5 className="text-base font-semibold text-gray-700 mb-2">{t('set')}s:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {exercise.sets.length > 0 ? (
                  exercise.sets.map((set, setIndex) => (
                    <li key={setIndex}>
                      {t('set')} {setIndex + 1}: {set.reps} {t('reps')} x {set.weight} {t('kg')}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">{t('addSet')}</li>
                )}
              </ul>

              <form onSubmit={(e) => { e.preventDefault(); handleAddSet(index); }} className="flex items-end space-x-2 mt-4">
                <div className="flex-grow">
                  <Input 
                    label={t('reps')} 
                    type="number" 
                    value={reps[index] || ''} 
                    onChange={(e) => setReps({ ...reps, [index]: e.target.value })} 
                    className="h-10 text-sm"
                  />
                </div>
                <div className="flex-grow">
                  <Input 
                    label={t('weight')} 
                    type="number" 
                    value={weight[index] || ''} 
                    onChange={(e) => setWeight({ ...weight, [index]: e.target.value })} 
                    className="h-10 text-sm"
                  />
                </div>
                <Button type="submit" className="w-auto px-4 py-2 text-sm">{t('addSet')}</Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default PlanDetails;