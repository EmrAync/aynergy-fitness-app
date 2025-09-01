// src/services/billingService.js
import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * Calls the Firebase Cloud Function to create a Stripe Checkout session
 * and redirects the user to the payment page.
 * @param {object} stripe - The Stripe object from useStripe hook.
 */
export const redirectToCheckout = async (stripe) => {
  try {
    const functions = getFunctions();
    const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');
    
    // Call the cloud function to create the session
    const response = await createStripeCheckout();
    const { sessionId } = response.data;
    
    if (!sessionId) {
      throw new Error("Failed to get session ID from Cloud Function.");
    }

    // Redirect to Stripe Checkout page
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });
    
    if (error) {
      throw new Error(error.message);
    }

  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    throw error;
  }
};