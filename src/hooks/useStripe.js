// src/hooks/useStripe.js
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const useStripe = () => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Anahtarı .env dosyasından oku
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
        console.error("Stripe publishable key is not set in environment variables.");
        setLoading(false);
        return;
    }
    
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