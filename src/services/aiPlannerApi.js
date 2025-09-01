// src/services/aiPlannerApi.js
import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * Calls the Firebase Cloud Function to generate a personalized workout plan.
 * @param {object} preferences - User's workout preferences (goal, level, days).
 * @returns {Promise<object>} The generated workout plan.
 */
export const generatePlan = async (preferences) => {
  try {
    const functions = getFunctions();
    const generateAiWorkoutPlan = httpsCallable(functions, 'generateAiWorkoutPlan');
    
    const response = await generateAiWorkoutPlan(preferences);

    if (!response.data) {
      throw new Error("Cloud Function returned no data.");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error calling AI plan generator:", error);
    throw error;
  }
};