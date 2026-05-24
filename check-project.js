const fs = require('fs');
const path = require('path');

console.log('Checking MoneyMate project structure...\n');

// Check if all required files exist
const requiredFiles = [
  'src/App.tsx',
  'src/index.tsx',
  'src/types/index.ts',
  'src/services/firebase.ts',
  'src/context/AuthContext.tsx',
  'src/context/AppContext.tsx',
  'src/pages/Login.tsx',
  'src/pages/Register.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Transactions.tsx',
  'src/components/Layout.tsx',
  'tailwind.config.js',
  'postcss.config.js',
  'package.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 All required files are present!');
  console.log('\n📋 Next steps:');
  console.log('1. Set up Firebase configuration in src/services/firebase.ts');
  console.log('2. Run: npm install');
  console.log('3. Run: npm start');
  console.log('4. Open http://localhost:3000');
} else {
  console.log('❌ Some files are missing. Please check the project structure.');
}

console.log('\n📚 Documentation available:');
console.log('- README.md - Complete setup guide');
console.log('- FIREBASE_SETUP.md - Firebase configuration');
console.log('- DEPLOYMENT.md - Deployment instructions');
