import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ProContextType {
  isPro: boolean;
  proPlan: 'none' | 'monthly' | 'lifetime';
  credits: number;
  upgradeToPro: (plan: 'monthly' | 'lifetime') => Promise<void>;
  buyCredits: (amount: number) => Promise<void>;
  useCredit: () => boolean;
  restorePurchases: () => Promise<boolean>;
  openProModal: () => void;
  closeProModal: () => void;
  isProModalOpen: boolean;
}

const ProContext = createContext<ProContextType>({
  isPro: false,
  proPlan: 'none',
  credits: 5,
  upgradeToPro: async () => {},
  buyCredits: async () => {},
  useCredit: () => true,
  restorePurchases: async () => false,
  openProModal: () => {},
  closeProModal: () => {},
  isProModalOpen: false,
});

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [proPlan, setProPlan] = useState<'none' | 'monthly' | 'lifetime'>('none');
  const [credits, setCredits] = useState(5);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const storedPro = localStorage.getItem('memegen_is_pro');
      const storedPlan = localStorage.getItem('memegen_pro_plan');
      const storedCredits = localStorage.getItem('memegen_credits');

      if (storedPro === 'true') {
        setIsPro(true);
        setProPlan((storedPlan as any) || 'monthly');
      }
      if (storedCredits !== null) {
        setCredits(parseInt(storedCredits, 10));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Sync with Firestore if logged in
  useEffect(() => {
    if (!user) return;
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.isPro) {
            setIsPro(true);
            setProPlan(data.proPlan || 'monthly');
            localStorage.setItem('memegen_is_pro', 'true');
            localStorage.setItem('memegen_pro_plan', data.proPlan || 'monthly');
          }
          if (typeof data.credits === 'number') {
            setCredits(data.credits);
            localStorage.setItem('memegen_credits', String(data.credits));
          }
        }
      } catch (err) {
        console.warn('Could not sync Pro status with Firestore:', err);
      }
    };
    fetchUserProfile();
  }, [user]);

  const upgradeToPro = async (plan: 'monthly' | 'lifetime') => {
    setIsPro(true);
    setProPlan(plan);
    setCredits(9999);
    localStorage.setItem('memegen_is_pro', 'true');
    localStorage.setItem('memegen_pro_plan', plan);
    localStorage.setItem('memegen_credits', '9999');

    if (user) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            isPro: true,
            proPlan: plan,
            credits: 9999,
            upgradedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Firestore update notice:', err);
      }
    }
  };

  const buyCredits = async (amount: number) => {
    const newTotal = credits + amount;
    setCredits(newTotal);
    localStorage.setItem('memegen_credits', String(newTotal));

    if (user) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          { credits: newTotal },
          { merge: true }
        );
      } catch (err) {
        console.warn('Firestore update notice:', err);
      }
    }
  };

  const useCredit = (): boolean => {
    if (isPro) return true;
    if (credits > 0) {
      const nextCredits = credits - 1;
      setCredits(nextCredits);
      localStorage.setItem('memegen_credits', String(nextCredits));
      if (user) {
        setDoc(doc(db, 'users', user.uid), { credits: nextCredits }, { merge: true }).catch(() => {});
      }
      return true;
    }
    // Out of credits
    setIsProModalOpen(true);
    return false;
  };

  const restorePurchases = async (): Promise<boolean> => {
    const storedPro = localStorage.getItem('memegen_is_pro');
    if (storedPro === 'true') {
      setIsPro(true);
      return true;
    }
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().isPro) {
          setIsPro(true);
          setProPlan(userDoc.data().proPlan || 'monthly');
          return true;
        }
      } catch (e) {
        // ignore
      }
    }
    return false;
  };

  return (
    <ProContext.Provider
      value={{
        isPro,
        proPlan,
        credits,
        upgradeToPro,
        buyCredits,
        useCredit,
        restorePurchases,
        openProModal: () => setIsProModalOpen(true),
        closeProModal: () => setIsProModalOpen(false),
        isProModalOpen,
      }}
    >
      {children}
    </ProContext.Provider>
  );
};

export const usePro = () => useContext(ProContext);
