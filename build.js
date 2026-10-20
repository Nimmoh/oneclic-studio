const fs = require('fs');
const path = require('path');

console.log('🔨 Starting build process...');

// Create public directory
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
  console.log('✓ Created public directory');
}

// Copy HTML files
try {
  fs.copyFileSync('index.html', 'public/index.html');
  console.log('✓ Copied index.html');
  
  fs.copyFileSync('admin.html', 'public/admin.html');
  console.log('✓ Copied admin.html');
} catch (err) {
  console.error('✗ Error copying HTML files:', err.message);
  process.exit(1);
}

// Copy assets directory
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

try {
  copyDir('assets', 'public/assets');
  console.log('✓ Copied assets directory');
} catch (err) {
  console.error('✗ Error copying assets:', err.message);
  process.exit(1);
}

console.log('✅ Build complete - files ready in public/');

