// src/components/workout/PlanWizardModal.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { generatePlan } from '../../services/aiPlannerApi';

const steps = ['goal', 'level', 'days'];

const PlanWizardModal = ({ isOpen, onClose, onPlanGenerated }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({ goal: null, level: null, days: [] });
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generatedPlan = await generatePlan(preferences);
      onPlanGenerated(generatedPlan);
      setLoading(false);
      setPlanGenerated(true);
      setTimeout(() => {
        onClose();
        setStep(0);
        setPreferences({ goal: null, level: null, days: [] });
        setPlanGenerated(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (steps[step]) {
      case 'goal':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4">{t('step1Goal')}</h3>
            <div className="space-y-2">
              <Button onClick={() => { setPreferences({ ...preferences, goal: 'muscleGain' }); handleNext(); }}>{t('muscleGain')}</Button>
              <Button onClick={() => { setPreferences({ ...preferences, goal: 'fatLoss' }); handleNext(); }}>{t('fatLoss')}</Button>
              <Button onClick={() => { setPreferences({ ...preferences, goal: 'generalFitness' }); handleNext(); }}>{t('generalFitness')}</Button>
            </div>
          </>
        );
      case 'level':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4">{t('step2Level')}</h3>
            <div className="space-y-2">
              <Button onClick={() => { setPreferences({ ...preferences, level: 'beginner' }); handleNext(); }}>{t('beginner')}</Button>
              <Button onClick={() => { setPreferences({ ...preferences, level: 'intermediate' }); handleNext(); }}>{t('intermediate')}</Button>
              <Button onClick={() => { setPreferences({ ...preferences, level: 'advanced' }); handleNext(); }}>{t('advanced')}</Button>
            </div>
          </>
        );
      case 'days':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4">{t('step3Days')}</h3>
            <div className="space-y-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <Button key={day} onClick={() => setPreferences({ ...preferences, days: [...preferences.days, day] })}>
                  {t(day)}
                </Button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button onClick={handleBack} className="w-auto px-4 py-2 bg-gray-500 hover:bg-gray-600">Geri</Button>
              <Button onClick={handleGenerate} className="w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700">
                {t('generatePlan')}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <Card className="w-full max-w-lg mx-auto p-6 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">{t('workoutPlanWizard')}</h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Spinner />
            <p className="mt-4 text-gray-500">{t('generatingPlan')}</p>
          </div>
        ) : planGenerated ? (
          <div className="flex flex-col items-center justify-center h-48">
            <p className="text-green-500 font-bold text-lg">{t('planGenerated')}</p>
          </div>
        ) : (
          renderContent()
        )}
      </Card>
    </div>
  );
};

export default PlanWizardModal;