import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isDemoMode } from './firebase';
import { User } from '../types';

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    if (isDemoMode) {
      const usersStr = localStorage.getItem('moneymate_demo_users') || '[]';
      let users = [];
      try {
        users = JSON.parse(usersStr);
      } catch (e) {
        users = [];
      }

      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        const error = new Error('Firebase: Error (auth/email-already-in-use).');
        (error as any).code = 'auth/email-already-in-use';
        throw error;
      }

      const newUid = 'demo-uid-' + Math.random().toString(36).substring(2, 11);
      const userData: User = {
        uid: newUid,
        email: email,
        displayName: displayName || null,
        photoURL: null,
      };

      users.push({ ...userData, password });
      localStorage.setItem('moneymate_demo_users', JSON.stringify(users));
      localStorage.setItem('moneymate_demo_current_user', JSON.stringify(userData));

      // Set up some mock default transactions so the dashboard looks great!
      const mockTransactions = [
        {
          id: 't-1',
          userId: newUid,
          amount: 5000,
          type: 'income',
          category: 'Salary',
          date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
          description: 'Monthly Salary',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 't-2',
          userId: newUid,
          amount: 120,
          type: 'expense',
          category: 'Food & Dining',
          date: new Date().toISOString(),
          description: 'Dinner with friends',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 't-3',
          userId: newUid,
          amount: 45,
          type: 'expense',
          category: 'Transportation',
          date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          description: 'Gas station',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 't-4',
          userId: newUid,
          amount: 350,
          type: 'expense',
          category: 'Shopping',
          date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
          description: 'New shoes',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(`moneymate_demo_transactions_${newUid}`, JSON.stringify(mockTransactions));

      // Prepopulate budgets
      const mockBudgets = [
        {
          id: 'b-1',
          userId: newUid,
          category: 'Food & Dining',
          amount: 500,
          period: 'monthly',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'b-2',
          userId: newUid,
          category: 'Shopping',
          amount: 400,
          period: 'monthly',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(`moneymate_demo_budgets_${newUid}`, JSON.stringify(mockBudgets));

      return userData;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user document in Firestore
      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || user.displayName || null,
        photoURL: user.photoURL || null,
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    if (isDemoMode) {
      const usersStr = localStorage.getItem('moneymate_demo_users') || '[]';
      let users = [];
      try {
        users = JSON.parse(usersStr);
      } catch (e) {
        users = [];
      }

      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser || foundUser.password !== password) {
        const error = new Error('Firebase: Error (auth/invalid-credential).');
        (error as any).code = 'auth/invalid-credential';
        throw error;
      }

      // Extract User fields only (no password)
      const userData: User = {
        uid: foundUser.uid,
        email: foundUser.email,
        displayName: foundUser.displayName,
        photoURL: foundUser.photoURL || null,
      };

      localStorage.setItem('moneymate_demo_current_user', JSON.stringify(userData));
      return userData;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }

      // If user document doesn't exist, create it
      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    if (isDemoMode) {
      localStorage.removeItem('moneymate_demo_current_user');
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    if (isDemoMode) {
      const savedUser = localStorage.getItem('moneymate_demo_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return auth.currentUser;
  },

  // Convert Firebase user to our User type
  convertFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
    };
  },
};
