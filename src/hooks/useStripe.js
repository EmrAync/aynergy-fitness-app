// src/hooks/useStripe.js
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const useStripe = () => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stripeKey = 'pk_test_51P85f92e9Fj1n0o93b8Rk2o3'; // Replace with your actual publishable key
    let isMounted = true;

    const loadStripeScript = async () => {
      try {
        const stripeInstance = await loadStripe(stripeKey);
        if (isMounted) {
          setStripe(stripeInstance);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load Stripe.js:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStripeScript();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stripe, loading };
};

export default useStripe;