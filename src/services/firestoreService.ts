import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db, isDemoMode } from './firebase';
import { Transaction, Category, Budget, DashboardStats, User } from '../types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', type: 'expense', color: '#FF5722', icon: 'Utensils' },
  { id: 'cat-2', name: 'Shopping', type: 'expense', color: '#E91E63', icon: 'ShoppingBag' },
  { id: 'cat-3', name: 'Housing & Rent', type: 'expense', color: '#3F51B5', icon: 'Home' },
  { id: 'cat-4', name: 'Transportation', type: 'expense', color: '#00BCD4', icon: 'Car' },
  { id: 'cat-5', name: 'Entertainment', type: 'expense', color: '#9C27B0', icon: 'Film' },
  { id: 'cat-6', name: 'Salary', type: 'income', color: '#4CAF50', icon: 'DollarSign' },
  { id: 'cat-7', name: 'Investments', type: 'income', color: '#8BC34A', icon: 'TrendingUp' },
  { id: 'cat-8', name: 'Others', type: 'expense', color: '#607D8B', icon: 'PlusCircle' },
];

export const firestoreService = {
  // Transaction operations
  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (isDemoMode) {
      const id = 't-' + Math.random().toString(36).substring(2, 11);
      const newTx: Transaction = {
        ...transaction,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const userId = transaction.userId;
      const txs = JSON.parse(localStorage.getItem(`moneymate_demo_transactions_${userId}`) || '[]');
      txs.push({
        ...newTx,
        date: newTx.date.toISOString(),
        createdAt: newTx.createdAt.toISOString(),
        updatedAt: newTx.updatedAt.toISOString(),
      });
      localStorage.setItem(`moneymate_demo_transactions_${userId}`, JSON.stringify(txs));
      
      // Update amountSpent in budgets
      const budgets = JSON.parse(localStorage.getItem(`moneymate_demo_budgets_${userId}`) || '[]');
      const updatedBudgets = budgets.map((b: any) => {
        if (b.category === transaction.category) {
          return { ...b, amountSpent: b.amountSpent + transaction.amount };
        }
        return b;
      });
      localStorage.setItem(`moneymate_demo_budgets_${userId}`, JSON.stringify(updatedBudgets));

      return id;
    }

    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        date: Timestamp.fromDate(transaction.date),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<void> {
    if (isDemoMode) {
      const savedUser = localStorage.getItem('moneymate_demo_current_user');
      if (!savedUser) return;
      const userId = JSON.parse(savedUser).uid;
      
      const txs = JSON.parse(localStorage.getItem(`moneymate_demo_transactions_${userId}`) || '[]');
      const oldTx = txs.find((t: any) => t.id === id);
      if (!oldTx) return;

      const txIndex = txs.findIndex((t: any) => t.id === id);
      const updatedTx = {
        ...oldTx,
        ...transaction,
        date: transaction.date ? transaction.date.toISOString() : oldTx.date,
        updatedAt: new Date().toISOString(),
      };
      txs[txIndex] = updatedTx;
      localStorage.setItem(`moneymate_demo_transactions_${userId}`, JSON.stringify(txs));

      // Update budgets if amount or category changed
      const diffAmount = (transaction.amount !== undefined ? transaction.amount : oldTx.amount) - oldTx.amount;
      const budgets = JSON.parse(localStorage.getItem(`moneymate_demo_budgets_${userId}`) || '[]');
      const updatedBudgets = budgets.map((b: any) => {
        if (b.category === oldTx.category) {
          return { ...b, amountSpent: b.amountSpent + diffAmount };
        }
        return b;
      });
      localStorage.setItem(`moneymate_demo_budgets_${userId}`, JSON.stringify(updatedBudgets));
      return;
    }

    try {
      const transactionRef = doc(db, 'transactions', id);
      const updateData: any = {
        ...transaction,
        updatedAt: Timestamp.now(),
      };
      
      if (transaction.date) {
        updateData.date = Timestamp.fromDate(transaction.date);
      }
      
      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    if (isDemoMode) {
      const savedUser = localStorage.getItem('moneymate_demo_current_user');
      if (!savedUser) return;
      const userId = JSON.parse(savedUser).uid;
      
      const txs = JSON.parse(localStorage.getItem(`moneymate_demo_transactions_${userId}`) || '[]');
      const oldTx = txs.find((t: any) => t.id === id);
      if (!oldTx) return;

      const filteredTxs = txs.filter((t: any) => t.id !== id);
      localStorage.setItem(`moneymate_demo_transactions_${userId}`, JSON.stringify(filteredTxs));

      // Subtract from budget amount spent
      const budgets = JSON.parse(localStorage.getItem(`moneymate_demo_budgets_${userId}`) || '[]');
      const updatedBudgets = budgets.map((b: any) => {
        if (b.category === oldTx.category) {
          return { ...b, amountSpent: Math.max(0, b.amountSpent - oldTx.amount) };
        }
        return b;
      });
      localStorage.setItem(`moneymate_demo_budgets_${userId}`, JSON.stringify(updatedBudgets));
      return;
    }

    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  async getTransactions(userId: string): Promise<Transaction[]> {
    if (isDemoMode) {
      const txs = JSON.parse(localStorage.getItem(`moneymate_demo_transactions_${userId}`) || '[]');
      const list = txs.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      })) as Transaction[];
      return list.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Transaction;
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    if (isDemoMode) {
      const catsStr = localStorage.getItem('moneymate_demo_categories');
      if (!catsStr) {
        localStorage.setItem('moneymate_demo_categories', JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
      }
      return JSON.parse(catsStr) as Category[];
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<string> {
    if (isDemoMode) {
      const id = 'cat-' + Math.random().toString(36).substring(2, 11);
      const cats = await this.getCategories();
      cats.push({ ...category, id });
      localStorage.setItem('moneymate_demo_categories', JSON.stringify(cats));
      return id;
    }

    try {
      const docRef = await addDoc(collection(db, 'categories'), category);
      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Budget operations
  async addBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (isDemoMode) {
      const id = 'b-' + Math.random().toString(36).substring(2, 11);
      const userId = budget.userId;
      const newBudget: Budget = {
        ...budget,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const budgets = JSON.parse(localStorage.getItem(`moneymate_demo_budgets_${userId}`) || '[]');
      budgets.push({
        ...newBudget,
        createdAt: newBudget.createdAt.toISOString(),
        updatedAt: newBudget.updatedAt.toISOString(),
      });
      localStorage.setItem(`moneymate_demo_budgets_${userId}`, JSON.stringify(budgets));
      return id;
    }

    try {
      const docRef = await addDoc(collection(db, 'budgets'), {
        ...budget,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  },

  async updateBudget(id: string, budget: Partial<Budget>): Promise<void> {
    if (isDemoMode) {
      const savedUser = localStorage.getItem('moneymate_demo_current_user');
      if (!savedUser) return;
      const userId = JSON.parse(savedUser).uid;
      
      const budgets = JSON.parse(localStorage.getItem(`moneymate_demo_budgets_${userId}`) || '[]');
      const oldBudget = budgets.find((b: any) => b.id === id);
      if (!oldBudget) return;

      const idx = budgets.findIndex((b: any) => b.id === id);
      budgets[idx] = {
        ...oldBudget,
        ...budget,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`moneymate_demo_budgets_${userId}`, JSON.stringify(budgets));
      return;
    }

    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, {
        ...budget,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },

  async deleteBudget(id: string): Promise<void> {
    if (isDemoMode) {
      const savedUser = localStorage.getItem('moneymate_demo_current_user');
      if (!savedUser) return;
      const userId = JSON.parse(savedUser).uid;
      
      const budgets = JSON.parse(localStorage.getItem(`moneymate_demo_budgets_${userId}`) || '[]');
      const filtered = budgets.filter((b: any) => b.id !== id);
      localStorage.setItem(`moneymate_demo_budgets_${userId}`, JSON.stringify(filtered));
      return;
    }

    try {
      await deleteDoc(doc(db, 'budgets', id));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },

  async getBudgets(userId: string): Promise<Budget[]> {
    if (isDemoMode) {
      const budgets = JSON.parse(localStorage.getItem(`moneymate_demo_budgets_${userId}`) || '[]');
      return budgets.map((b: any) => ({
        ...b,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      })) as Budget[];
    }

    try {
      const q = query(
        collection(db, 'budgets'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Budget;
      });
    } catch (error) {
      console.error('Error getting budgets:', error);
      throw error;
    }
  },

  // User operations
  async getUser(userId: string): Promise<User | null> {
    if (isDemoMode) {
      const usersStr = localStorage.getItem('moneymate_demo_users') || '[]';
      const users = JSON.parse(usersStr);
      const user = users.find((u: any) => u.uid === userId);
      if (user) {
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || null,
        };
      }
      return null;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async createUser(user: User): Promise<void> {
    if (isDemoMode) {
      const usersStr = localStorage.getItem('moneymate_demo_users') || '[]';
      const users = JSON.parse(usersStr);
      if (!users.some((u: any) => u.uid === user.uid)) {
        users.push(user);
        localStorage.setItem('moneymate_demo_users', JSON.stringify(users));
      }
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Calculate dashboard stats
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const transactions = await this.getTransactions(userId);
      
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyIncome = transactions
        .filter(t => t.type === 'income' && t.date >= currentMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && t.date >= currentMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },
};
