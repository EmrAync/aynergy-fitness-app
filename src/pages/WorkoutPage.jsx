// src/pages/WorkoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, doc, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import WorkoutPlanList from '../components/workout/WorkoutPlanList';
import PlanDetails from '../components/workout/PlanDetails';
import ExerciseLibrary from '../components/workout/ExerciseLibrary';
import PlanWizardModal from '../components/workout/PlanWizardModal';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useNotification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import UpgradeModal from '../components/premium/UpgradeModal';
import SkeletonCard from '../components/common/SkeletonCard'; // Import SkeletonCard

const WorkoutPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotification();

  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlanName, setNewPlanName] = useState('');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAiWizardOpen, setIsAiWizardOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for workout plans

  const MAX_FREE_PLANS = 3;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const plansRef = collection(db, `users/${currentUser.uid}/workoutPlans`);
    const q = query(plansRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkoutPlans(plansData);
      if (selectedPlan) {
        // If a plan was selected, try to re-select it to update its data
        const updatedSelected = plansData.find(plan => plan.id === selectedPlan.id);
        setSelectedPlan(updatedSelected || null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching workout plans:", error);
      notifyError("Failed to load workout plans.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCreatePlan = async () => {
    if (!currentUser || !newPlanName.trim()) return;

    if (userProfile?.subscription?.status !== 'premium' && workoutPlans.length >= MAX_FREE_PLANS) {
      setIsUpgradeModalOpen(true);
      return;
    }

    try {
      await addDoc(collection(db, `users/${currentUser.uid}/workoutPlans`), {
        name: newPlanName,
        exercises: [],
        createdAt: new Date(),
      });
      setNewPlanName('');
      notifySuccess("Workout plan created!");
    } catch (error) {
      console.error("Error creating workout plan:", error);
      notifyError("Failed to create workout plan.");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!currentUser || !planId) return;
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/workoutPlans`, planId));
      setSelectedPlan(null); // Deselect the plan if it was deleted
      notifySuccess("Workout plan deleted.");
    } catch (error) {
      console.error("Error deleting workout plan:", error);
      notifyError("Failed to delete workout plan.");
    }
  };

  const handleAddExerciseToPlan = async (exercise) => {
    if (!currentUser || !selectedPlan) {
      notifyError("Please select a plan first.");
      return;
    }
    try {
      const planRef = doc(db, `users/${currentUser.uid}/workoutPlans`, selectedPlan.id);
      const currentPlan = (await getDoc(planRef)).data();
      const updatedExercises = [...currentPlan.exercises, { ...exercise, sets: [] }];
      await updateDoc(planRef, { exercises: updatedExercises });
      notifySuccess(`${exercise.name} added to ${selectedPlan.name}.`);
    } catch (error) {
      console.error("Error adding exercise to plan:", error);
      notifyError("Failed to add exercise.");
    }
  };

  const handleAddSetToExercise = async (planId, exerciseIndex, newSet) => {
    if (!currentUser || !planId || exerciseIndex === undefined) return;
    try {
      const planRef = doc(db, `users/${currentUser.uid}/workoutPlans`, planId);
      const currentPlan = (await getDoc(planRef)).data();
      const updatedExercises = [...currentPlan.exercises];
      if (!updatedExercises[exerciseIndex].sets) {
        updatedExercises[exerciseIndex].sets = [];
      }
      updatedExercises[exerciseIndex].sets.push(newSet);
      await updateDoc(planRef, { exercises: updatedExercises });
      notifySuccess("Set added successfully.");
    } catch (error) {
      console.error("Error adding set to exercise:", error);
      notifyError("Failed to add set.");
    }
  };

  const handleAiPlanGenerated = async (aiPlan) => {
    if (!currentUser || !aiPlan.name) return;

    if (userProfile?.subscription?.status !== 'premium' && workoutPlans.length >= MAX_FREE_PLANS) {
      setIsAiWizardOpen(false);
      setIsUpgradeModalOpen(true);
      return;
    }

    try {
      await addDoc(collection(db, `users/${currentUser.uid}/workoutPlans`), {
        name: aiPlan.name,
        exercises: aiPlan.exercises,
        createdAt: new Date(),
        generatedByAi: true,
      });
      notifySuccess("AI Workout plan added!");
      setIsAiWizardOpen(false); // Close wizard after plan is added
    } catch (error) {
      console.error("Error adding AI workout plan:", error);
      notifyError("Failed to add AI workout plan.");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column for WorkoutPlanList and AI Wizard button */}
        <div className="lg:col-span-1 space-y-6">
          <SkeletonCard className="h-40" /> {/* For create plan input */}
          <SkeletonCard className="h-64" /> {/* For plan list */}
          <SkeletonCard className="h-20" /> {/* For AI Wizard button */}
        </div>
        {/* Middle column for PlanDetails */}
        <div className="lg:col-span-1">
          <SkeletonCard className="h-[calc(100vh-180px)]" />
        </div>
        {/* Right column for ExerciseLibrary */}
        <div className="lg:col-span-1">
          <SkeletonCard className="h-[calc(100vh-180px)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Workout Plans List and AI Wizard */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">{t('myWorkoutPlans')}</h3>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder={t('enterPlanName')}
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
            />
            <Button onClick={handleCreatePlan} className="w-auto px-4 py-2">{t('createPlan')}</Button>
          </div>
          <WorkoutPlanList
            plans={workoutPlans}
            onSelectPlan={setSelectedPlan}
            selectedPlanId={selectedPlan?.id}
          />
        </Card>
        <Button onClick={() => setIsAiWizardOpen(true)} className="bg-green-600 hover:bg-green-700 w-full flex items-center justify-center space-x-2 text-lg py-3">
          <span>{t('createWithAIWizard')}</span>
        </Button>
      </div>

      {/* Middle Column: Plan Details */}
      <div className="lg:col-span-1">
        <PlanDetails
          selectedPlan={selectedPlan}
          onDeletePlan={handleDeletePlan}
          onAddSet={handleAddSetToExercise}
        />
      </div>

      {/* Right Column: Exercise Library */}
      <div className="lg:col-span-1">
        <ExerciseLibrary onAddExercise={handleAddExerciseToPlan} />
      </div>

      {isUpgradeModalOpen && <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />}
      {isAiWizardOpen && (
        <PlanWizardModal 
          isOpen={isAiWizardOpen} 
          onClose={() => setIsAiWizardOpen(false)} 
          onPlanGenerated={handleAiPlanGenerated} 
        />
      )}
    </div>
  );
};

export default WorkoutPage;