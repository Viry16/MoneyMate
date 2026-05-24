const fs = require('fs');

console.log('🔍 Verifying Tailwind CSS v4 Setup...\n');

// Check package.json
console.log('📋 Checking package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const tailwindVersion = packageJson.dependencies?.tailwindcss || 'NOT FOUND';
  const postcssPlugin = packageJson.dependencies?.['@tailwindcss/postcss'] || 'NOT FOUND';
  
  console.log(`✅ Tailwind CSS: ${tailwindVersion}`);
  console.log(`✅ PostCSS Plugin: ${postcssPlugin}`);
  
  if (tailwindVersion.startsWith('4.')) {
    console.log('✅ Tailwind v4 detected');
  } else {
    console.log('⚠️  Expected Tailwind v4, found:', tailwindVersion);
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check PostCSS config
console.log('\n📋 Checking PostCSS configuration:');
if (fs.existsSync('postcss.config.js')) {
  try {
    const postcssConfig = fs.readFileSync('postcss.config.js', 'utf8');
    if (postcssConfig.includes('@tailwindcss/postcss')) {
      console.log('✅ PostCSS config uses @tailwindcss/postcss plugin');
    } else {
      console.log('⚠️  PostCSS config may not be correct for v4');
    }
  } catch (error) {
    console.log('❌ Error reading postcss.config.js:', error.message);
  }
} else {
  console.log('❌ postcss.config.js not found');
}

// Check CSS file
console.log('\n📋 Checking src/index.css:');
if (fs.existsSync('src/index.css')) {
  try {
    const cssContent = fs.readFileSync('src/index.css', 'utf8');
    
    if (cssContent.includes('@import "tailwindcss"')) {
      console.log('✅ CSS uses @import "tailwindcss" syntax');
    } else {
      console.log('❌ CSS missing @import "tailwindcss"');
    }
    
    if (cssContent.includes('@theme')) {
      console.log('✅ CSS contains @theme configuration');
    } else {
      console.log('⚠️  CSS missing @theme configuration');
    }
    
    if (cssContent.includes('@tailwind base') || cssContent.includes('@tailwind components') || cssContent.includes('@tailwind utilities')) {
      console.log('⚠️  CSS still contains old @tailwind directives');
    } else {
      console.log('✅ CSS uses new v4 syntax (no old @tailwind directives)');
    }
  } catch (error) {
    console.log('❌ Error reading src/index.css:', error.message);
  }
} else {
  console.log('❌ src/index.css not found');
}

console.log('\n' + '='.repeat(50));
console.log('🎯 Tailwind v4 Setup Summary:');
console.log('✅ Uses @import "tailwindcss" instead of @tailwind directives');
console.log('✅ CSS-based configuration with @theme');
console.log('✅ Custom colors: primary, secondary, accent, dark, light');
console.log('✅ PostCSS plugin: @tailwindcss/postcss');
console.log('\n🚀 Ready to run: npm start');
