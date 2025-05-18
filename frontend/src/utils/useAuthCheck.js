// src/hooks/useAuthCheck.js
import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/contexts/AuthContext';

const useAuthCheck = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && window.location.pathname.match(/\/(diagnosis|results)/)) {
      setShowAuthModal(true);
    }
  }, [user]);

  return {
    showAuthModal,
    setShowAuthModal,
    isAuthenticated: !!user
  };
};

export default useAuthCheck;