// src/components/premium/UpgradeModal.jsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { redirectToCheckout } from '../../services/billingService';
import useStripe from '../../hooks/useStripe';

const UpgradeModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { stripe, loading: stripeLoading } = useStripe();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!stripe) return;
    try {
      await redirectToCheckout(stripe);
    } catch (error) {
      console.error("Failed to redirect to checkout:", error);
    }
  };
  
  const buttonDisabled = stripeLoading;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <Card className="w-full max-w-sm mx-auto p-6 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.25l-2.47 5.02-5.53.8.4 5.92-5.92 5.53.8 5.53.4-5.92L12 21.75l2.47-5.02 5.53-.8-.4-5.92 5.92-5.53-.8-5.53-.4 5.92L12 2.25z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-4">{t('upgradeToPremium')}</h3>
        <p className="text-gray-600 mb-6">{t('premiumFeatureDescription')}</p>
        <Button onClick={handleUpgrade} disabled={buttonDisabled} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          {buttonDisabled ? (
            <div className="flex items-center justify-center space-x-2">
              <Spinner />
              <span>{t('processing')}</span>
            </div>
          ) : (
            t('upgradeNow')
          )}
        </Button>
      </Card>
    </div>
  );
};

export default UpgradeModal;