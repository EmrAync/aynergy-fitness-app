// src/components/premium/PremiumFeatureLocker.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UpgradeModal from './UpgradeModal';
import Card from '../common/Card';

const PremiumFeatureLocker = ({ children, featureLimit = null }) => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const isPremium = userProfile?.subscription?.status === 'premium';
  const isLocked = !isPremium && featureLimit !== null && featureLimit <= 0;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && isLocked) {
      return React.cloneElement(child, {
        ...child.props,
        onClick: handleClick,
        disabled: true,
        className: `${child.props.className} opacity-50 cursor-not-allowed`
      });
    }
    return child;
  });

  return (
    <>
      {isLocked && (
        <div className="relative inline-block w-full">
          {childrenWithProps}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {t('premium')}
            </span>
          </div>
        </div>
      )}
      {!isLocked && children}
      <UpgradeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default PremiumFeatureLocker;