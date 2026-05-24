import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from './AuthContext';
import { Transaction, Category, Budget, DashboardStats, AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyBalance: 0,
  });
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setBudgets([]);
      setStats({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyBalance: 0,
      });
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [transactionsData, categoriesData, budgetsData, statsData] = await Promise.all([
        firestoreService.getTransactions(user.uid),
        firestoreService.getCategories(),
        firestoreService.getBudgets(user.uid),
        firestoreService.getDashboardStats(user.uid),
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setBudgets(budgetsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;
    
    try {
      const id = await firestoreService.addTransaction({
        ...transaction,
        userId: user.uid,
      });
      
      const newTransaction: Transaction = {
        ...transaction,
        id,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update stats
      const newStats = await firestoreService.getDashboardStats(user.uid);
      setStats(newStats);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    if (!user) return;
    
    try {
      await firestoreService.updateTransaction(id, transaction);
      
      setTransactions(prev => 
        prev.map(t => 
          t.id === id 
            ? { ...t, ...transaction, updatedAt: new Date() }
            : t
        )
      );
      
      // Update stats
      const newStats = await firestoreService.getDashboardStats(user.uid);
      setStats(newStats);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    
    try {
      await firestoreService.deleteTransaction(id);
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Update stats
      const newStats = await firestoreService.getDashboardStats(user.uid);
      setStats(newStats);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const id = await firestoreService.addCategory(category);
      const newCategory: Category = { ...category, id };
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      const id = await firestoreService.addBudget({
        ...budget,
        userId: user.uid,
      });
      
      const newBudget: Budget = {
        ...budget,
        id,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setBudgets(prev => [...prev, newBudget]);
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    try {
      await firestoreService.updateBudget(id, budget);
      
      setBudgets(prev => 
        prev.map(b => 
          b.id === id 
            ? { ...b, ...budget, updatedAt: new Date() }
            : b
        )
      );
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await firestoreService.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };

  const value: AppContextType = {
    transactions,
    categories,
    budgets,
    stats,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
