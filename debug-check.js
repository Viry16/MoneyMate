const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUGGING MoneyMate Tailwind CSS Issue...\n');

// Check package.json
console.log('📋 Checking package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const tailwindVersion = packageJson.dependencies?.tailwindcss || 'NOT FOUND';
  console.log(`✅ Tailwind version in package.json: ${tailwindVersion}`);
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check if PostCSS config exists
console.log('\n📋 Checking PostCSS configuration:');
if (fs.existsSync('postcss.config.js')) {
  console.log('⚠️  postcss.config.js exists');
  try {
    const postcssConfig = fs.readFileSync('postcss.config.js', 'utf8');
    console.log('PostCSS config content:');
    console.log(postcssConfig);
  } catch (error) {
    console.log('❌ Error reading postcss.config.js:', error.message);
  }
} else {
  console.log('✅ postcss.config.js removed (good for Create React App)');
}

// Check if node_modules exists
console.log('\n📋 Checking node_modules:');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules exists');
  
  // Check if tailwindcss is installed
  const tailwindPath = path.join('node_modules', 'tailwindcss', 'package.json');
  if (fs.existsSync(tailwindPath)) {
    try {
      const tailwindPackage = JSON.parse(fs.readFileSync(tailwindPath, 'utf8'));
      console.log(`📦 Installed Tailwind version: ${tailwindPackage.version}`);
      
      if (tailwindPackage.version.startsWith('4.')) {
        console.log('❌ PROBLEM: Tailwind v4 is installed but package.json shows v3!');
        console.log('🔧 SOLUTION: Run debug-tailwind.bat to fix this');
      } else if (tailwindPackage.version.startsWith('3.')) {
        console.log('✅ Tailwind v3 is correctly installed');
      }
    } catch (error) {
      console.log('❌ Error reading Tailwind package.json:', error.message);
    }
  } else {
    console.log('❌ Tailwind CSS not found in node_modules');
  }
} else {
  console.log('❌ node_modules not found - run npm install');
}

console.log('\n' + '='.repeat(50));
console.log('🚀 RECOMMENDED ACTIONS:');
console.log('1. Run: debug-tailwind.bat (Windows)');
console.log('2. Or manually: rm -rf node_modules package-lock.json && npm install');
console.log('3. Then: npm start');
console.log('\n📚 See DEBUG_GUIDE.md for detailed instructions');
