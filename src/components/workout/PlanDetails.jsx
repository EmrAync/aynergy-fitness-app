// src/components/workout/PlanDetails.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

// Egzersiz detaylarını göstermek için yeni bir component
const ExerciseDetailView = ({ exercise }) => {
    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h5 className="font-bold text-gray-800 mb-2">Instructions:</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {exercise.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ul>

            {exercise.tips && exercise.tips.length > 0 && (
                <>
                    <h5 className="font-bold text-gray-800 mt-4 mb-2">Tips:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {exercise.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </>
            )}

            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                <div className="mt-4">
                    <h5 className="font-bold text-gray-800 mb-1">Secondary Muscles:</h5>
                    <div className="flex flex-wrap gap-2">
                        {exercise.secondaryMuscles.map((muscle, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{muscle}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const PlanDetails = ({ selectedPlan, onDeletePlan, onAddSet, onCompleteWorkout }) => {
    const { t } = useLanguage();
    const [reps, setReps] = useState({});
    const [weight, setWeight] = useState({});
    const [expandedExerciseIndex, setExpandedExerciseIndex] = useState(null);

    const handleAddSet = (exerciseIndex) => {
        const newSet = {
            reps: parseInt(reps[exerciseIndex]) || 0,
            weight: parseFloat(weight[exerciseIndex]) || 0
        };
        onAddSet(selectedPlan.id, exerciseIndex, newSet);
        setReps({ ...reps, [exerciseIndex]: '' });
        setWeight({ ...weight, [exerciseIndex]: '' });
    };

    const toggleExerciseDetail = (index) => {
        setExpandedExerciseIndex(expandedExerciseIndex === index ? null : index);
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
                {/* Butonları içeren bir div ekliyoruz */}
                <div className="flex space-x-2">
                    <Button onClick={() => onCompleteWorkout(selectedPlan.id)} className="w-auto px-4 py-2 text-sm bg-green-600 hover:bg-green-700">
                        Finish Workout
                    </Button>
                    <Button onClick={() => onDeletePlan(selectedPlan.id)} className="w-auto px-4 py-2 text-sm bg-red-600 hover:bg-red-700">
                        {t('deletePlan')}
                    </Button>
                </div>
            </div>
            <h4 className="font-semibold text-xl mb-4">{t('exercisesInPlan')}:</h4>
            <ul className="space-y-4">
                {selectedPlan.exercises.map((exercise, index) => (
                    <li key={index} className="bg-gray-100 p-4 rounded-xl shadow-sm transition-all duration-300">
                        <div
                            className="flex items-center space-x-4 cursor-pointer"
                            onClick={() => toggleExerciseDetail(index)}
                        >
                            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img src={exercise.gif} alt={exercise.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <span className="font-bold text-lg text-gray-900">{exercise.name}</span>
                                <p className="text-sm text-gray-500">{exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)}</p>
                            </div>
                            <div className="text-gray-400">
                                {/* Ikonun yönünü değiştirerek açılıp kapandığını gösteriyoruz */}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${expandedExerciseIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Açılır kapanır detay bölümü */}
                        {expandedExerciseIndex === index && <ExerciseDetailView exercise={exercise} />}

                        <div className="pl-20 mt-4">
                            <h5 className="text-base font-semibold text-gray-700 mb-2">{t('set')}s:</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
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
                                <Input
                                    label={t('reps')}
                                    type="number"
                                    value={reps[index] || ''}
                                    onChange={(e) => setReps({ ...reps, [index]: e.target.value })}
                                />
                                <Input
                                    label={t('weight')}
                                    type="number"
                                    value={weight[index] || ''}
                                    onChange={(e) => setWeight({ ...weight, [index]: e.target.value })}
                                />
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