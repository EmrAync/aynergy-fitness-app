// src/components/workout/ExerciseLibrary.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { exercises } from '../../data/exercises';
import Card from '../common/Card';
import Button from '../common/Button';

const ExerciseLibrary = ({ onAddExercise }) => {
  const [filter, setFilter] = useState('all');
  const { t } = useLanguage();

  const filteredExercises = exercises.filter(ex => filter === 'all' || ex.muscle === filter);

  const muscleGroups = [...new Set(exercises.map(ex => ex.muscle))];

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">{t('exerciseLibrary')}</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('filterByMuscleGroup')}</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="all">{t('allMuscles')}</option>
          {muscleGroups.map(group => (
            <option key={group} value={group}>{group.charAt(0).toUpperCase() + group.slice(1)}</option>
          ))}
        </select>
      </div>
      <ul className="space-y-4 max-h-96 overflow-y-auto">
        {filteredExercises.map(ex => (
          <li key={ex.id} className="flex items-center space-x-4">
            <div className="w-16 h-16 flex-shrink-0">
              <img src={ex.gif} alt={ex.name} className="w-full h-full object-cover rounded-md" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium">{ex.name}</h4>
              <p className="text-sm text-gray-500">{ex.muscle.charAt(0).toUpperCase() + ex.muscle.slice(1)}</p>
            </div>
            <Button onClick={() => onAddExercise({ ...ex, sets: [] })} className="w-auto px-4 py-1 text-xs">{t('add')}</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ExerciseLibrary;