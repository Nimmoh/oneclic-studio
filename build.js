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
  files.forEach((file) => {
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

// Verify required local images exist in the Vercel public output
const requiredImages = [
  'public/images/oneclic.jpeg',
  'public/images/Graphics_flyer.jpg',
  'public/images/Interface Design.jpg',
  'public/images/pro-itee.jpg',
  'public/images/photo1.jpg',
  'public/images/design.jpeg',
  'public/images/Graphic Design _ Preferred Printing.jpg',
  'public/images/Mindset _ Business.jpg',
  'public/images/ad-img.jpg',
  'public/images/Ad Inspiration.jpg',
  'public/images/logo.png'
];

const missingImages = requiredImages.filter((file) => !fs.existsSync(file));
if (missingImages.length) {
  console.error('✗ Missing local images:', missingImages.join(', '));
  process.exit(1);
}
console.log('✓ Verified local image files');

console.log('✅ Build complete - files ready in public/');

