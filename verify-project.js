const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Checking MoneyMate project...\n');

// Check if all critical files exist
const criticalFiles = [
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
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 All critical files are present!');
  
  // Try to check if npm scripts work
  try {
    console.log('\n📦 Checking package.json scripts...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('Available scripts:', Object.keys(packageJson.scripts));
    
    console.log('\n🚀 Project is ready!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up Firebase configuration in src/services/firebase.ts');
    console.log('2. Run: npm install (if not done already)');
    console.log('3. Run: npm start');
    console.log('4. Open http://localhost:3000');
    
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
  }
} else {
  console.log('❌ Some critical files are missing.');
}

console.log('\n📚 Documentation available:');
console.log('- README.md - Complete setup guide');
console.log('- FIREBASE_SETUP.md - Firebase configuration');
console.log('- DEPLOYMENT.md - Deployment instructions');
