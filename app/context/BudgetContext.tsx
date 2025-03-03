import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BudgetContextType = {
  income: number;
  setIncome: (income: number) => Promise<void>;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [income, setIncomeState] = useState<number>(50000);

  // Load income from storage on initial render
  useEffect(() => {
    const loadIncome = async () => {
      try {
        const storedIncome = await AsyncStorage.getItem('user_income');
        if (storedIncome) {
          setIncomeState(parseFloat(storedIncome));
        }
      } catch (error) {
        console.error('Failed to load income:', error);
      }
    };
    
    loadIncome();
  }, []);

  // Function to update income in state and storage
  const setIncome = async (newIncome: number) => {
    try {
      await AsyncStorage.setItem('user_income', newIncome.toString());
      setIncomeState(newIncome);
    } catch (error) {
      console.error('Failed to save income:', error);
    }
  };

  return (
    <BudgetContext.Provider value={{ income, setIncome }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}; 