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
        <h3 className="text-2xl font-bold mb-4">{t('upgradeToPremium')}</h3>
        <p className="text-gray-600 mb-6">{t('premiumFeatureDescription')}</p>
        <Button onClick={handleUpgrade} disabled={buttonDisabled} className="bg-blue-600 hover:bg-blue-700">
          {buttonDisabled ? t('processing') : t('upgradeNow')}
        </Button>
      </Card>
    </div>
  );
};

export default UpgradeModal;