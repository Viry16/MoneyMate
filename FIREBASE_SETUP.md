# Firebase Setup Guide for MoneyMate

This guide will help you set up Firebase Authentication and Firestore for your MoneyMate application.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `moneymate` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) icon
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 5. Update Firebase Configuration

Replace the placeholder values in `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 6. Set up Firestore Security Rules

Go to Firestore Database > Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions are user-specific
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Budgets are user-specific
    match /budgets/{budgetId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Categories are public (read-only for users)
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can modify categories
    }
  }
}
```

## 7. Create Initial Categories (Optional)

You can add default categories to Firestore:

1. Go to Firestore Database > Data
2. Click "Start collection"
3. Collection ID: `categories`
4. Add documents with these fields:
   - `name`: Category name (e.g., "Food", "Transport")
   - `type`: "income" or "expense"
   - `color`: Hex color code
   - `icon`: Icon name

## 8. Environment Variables (Production)

For production deployment, use environment variables:

Create `.env.local` file:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

Then update `firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## 9. Test Your Setup

1. Start your development server: `npm start`
2. Try to register a new account
3. Check if the user appears in Firebase Authentication
4. Add a transaction and verify it appears in Firestore

## Troubleshooting

### Common Issues:

1. **Authentication not working**: Check if Email/Password is enabled
2. **Database permission denied**: Verify Firestore security rules
3. **Configuration errors**: Double-check your Firebase config
4. **CORS errors**: Make sure your domain is added to authorized domains

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

Your Firebase setup is now complete! 🎉
