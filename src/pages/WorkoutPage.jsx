// src/pages/WorkoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import WorkoutPlanList from '../components/workout/WorkoutPlanList';
import PlanDetails from '../components/workout/PlanDetails';
import ExerciseLibrary from '../components/workout/ExerciseLibrary';
import Spinner from '../components/common/Spinner';
import PremiumFeatureLocker from '../components/premium/PremiumFeatureLocker';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/common/Card';
import PlanWizardModal from '../components/workout/PlanWizardModal';

const WorkoutPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { t } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedPlan = plans.find(plan => plan.id === selectedPlanId) || null;
  const [newPlanName, setNewPlanName] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);

  const isPremiumUser = userProfile?.subscription?.status === 'premium';
  const hasFreePlan = plans.length > 0;
  const planLimitReached = !isPremiumUser && hasFreePlan;

  useEffect(() => {
    if (!currentUser) return;

    const plansRef = collection(db, `users/${currentUser.uid}/workoutPlans`);
    const unsubscribe = onSnapshot(plansRef, (snapshot) => {
      const plansData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(plansData);
      if (plansData.length > 0 && !selectedPlanId) {
        setSelectedPlanId(plansData[0].id);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching workout plans:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, selectedPlanId]);

  const handleCreatePlan = async () => {
    if (!currentUser || newPlanName === '') return;
    if (planLimitReached) return;

    const plansRef = collection(db, `users/${currentUser.uid}/workoutPlans`);
    await addDoc(plansRef, {
      name: newPlanName,
      exercises: []
    });
    setNewPlanName('');
  };
  
  const handlePlanGenerated = async (plan) => {
    if (!currentUser) return;
    const plansRef = collection(db, `users/${currentUser.uid}/workoutPlans`);
    await addDoc(plansRef, plan);
  };
  
  const handleAddExerciseToPlan = async (exercise) => {
    if (!currentUser || !selectedPlanId) return;
    const planRef = doc(db, `users/${currentUser.uid}/workoutPlans`, selectedPlanId);
    
    const newExercise = { ...exercise, sets: [] };

    const updatedExercises = [...selectedPlan.exercises, newExercise];
    await updateDoc(planRef, { exercises: updatedExercises });
  };
  
  const handleAddSetToExercise = async (planId, exerciseIndex, newSet) => {
    if (!currentUser) return;

    const planRef = doc(db, `users/${currentUser.uid}/workoutPlans`, planId);
    
    const planToUpdate = plans.find(p => p.id === planId);
    if (!planToUpdate) return;
    
    const updatedExercises = JSON.parse(JSON.stringify(planToUpdate.exercises));
    
    updatedExercises[exerciseIndex].sets.push(newSet);
    
    await updateDoc(planRef, { exercises: updatedExercises });
  };

  const handleDeletePlan = async (planId) => {
    if (!currentUser) return;
    const planRef = doc(db, `users/${currentUser.uid}/workoutPlans`, planId);
    await deleteDoc(planRef);
    setSelectedPlanId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
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
            <PremiumFeatureLocker featureLimit={isPremiumUser ? null : (plans.length >= 1 ? 1 : 0)}>
              <Button onClick={handleCreatePlan} className="w-auto">{t('createPlan')}</Button>
            </PremiumFeatureLocker>
          </div>
          <Button onClick={() => setWizardOpen(true)} className="w-full bg-green-600 hover:bg-green-700">
            {t('createWithAIWizard')}
          </Button>
          {planLimitReached && (
            <p className="text-sm text-red-500 mt-4">{t('freePlanLimitReached')}</p>
          )}
          <ul className="space-y-2 mt-6">
            {plans.map((plan) => (
              <li key={plan.id}>
                <button 
                  onClick={() => setSelectedPlanId(plan.id)}
                  className="w-full text-left py-2 px-4 rounded-md transition-colors duration-200 hover:bg-gray-100"
                >
                  {plan.name}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <PlanDetails 
          selectedPlan={selectedPlan} 
          onDeletePlan={handleDeletePlan}
          onAddSet={handleAddSetToExercise}
        />
      </div>
      <div className="md:col-span-2">
        <ExerciseLibrary onAddExercise={handleAddExerciseToPlan} />
      </div>
      <PlanWizardModal 
        isOpen={wizardOpen} 
        onClose={() => setWizardOpen(false)} 
        onPlanGenerated={handlePlanGenerated}
      />
    </div>
  );
};

export default WorkoutPage;