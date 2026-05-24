# MoneyMate - Personal Finance Management App

A modern, responsive web application built with React and TypeScript for managing personal finances. Features include transaction tracking, data visualization, budget planning, and secure user authentication.

## 🚀 Features

- **User Authentication**: Secure login/register with Firebase Authentication
- **Dashboard**: Overview of financial health with key metrics and charts
- **Transaction Management**: Add, edit, delete income and expense transactions
- **Data Visualization**: Interactive charts showing spending patterns and trends
- **Categories**: Organize transactions with predefined categories
- **Export Functionality**: Export transaction data to CSV or PDF
- **Responsive Design**: Modern UI with Tailwind CSS and dark theme
- **Real-time Data**: Firebase Firestore for cloud data storage

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Date Handling**: date-fns
- **PDF Export**: jsPDF
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moneymate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration

4. **Configure Firebase**
   - Update `src/services/firebase.ts` with your Firebase configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── transactions/   # Transaction management components
│   ├── charts/         # Chart components
│   └── ui/             # Generic UI components
├── pages/              # Page components
├── context/            # React Context providers
├── services/           # Firebase and API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🎨 Design System

- **Primary Color**: #4CAF50 (Green)
- **Secondary Color**: #1E1E2F (Dark Blue)
- **Accent Color**: #FFC107 (Yellow)
- **Background**: #1E1E2F (Dark)
- **Text**: #F5F5F5 (Light)

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables** in Vercel dashboard:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📱 Features Overview

### Dashboard
- Financial overview with key metrics
- Interactive charts showing income vs expenses
- Recent transactions list
- Monthly spending trends

### Transaction Management
- Add income and expense transactions
- Edit existing transactions
- Delete transactions
- Filter by type (income/expense)
- Categorize transactions

### Data Visualization
- Pie chart for expense categories
- Bar chart for monthly trends
- Responsive charts that work on all devices

### Export Functionality
- Export transactions to CSV
- Generate PDF reports
- Include summary statistics

## 🔐 Security

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Input validation and sanitization
- HTTPS enforcement in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🎯 Future Enhancements

- [ ] Budget planning and tracking
- [ ] Recurring transactions
- [ ] Investment tracking
- [ ] Goal setting and progress tracking
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and insights
- [ ] Multi-currency support
- [ ] Bank account integration
- [ ] Bill reminders
- [ ] Financial reports and insights

---

**MoneyMate** - Take control of your finances with style! 💰✨