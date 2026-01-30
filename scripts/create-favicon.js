#!/usr/bin/env node
/**
 * Create favicon.ico from PWA icon
 * 
 * This script creates a favicon.ico file from the 96x96 icon
 * for maximum browser compatibility.
 * 
 * Requirements:
 * - Install sharp: npm install --save-dev sharp
 * - Requires icon-96x96.png to exist in public/icons/
 * 
 * Usage:
 *   node scripts/create-favicon.js
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const iconsDir = join(projectRoot, 'public', 'icons');
const sourceIcon = join(iconsDir, 'icon-96x96.png');
const faviconPath = join(projectRoot, 'public', 'favicon.ico');

async function createFavicon() {
  try {
    // Check if sharp is installed
    let sharp;
    try {
      sharp = (await import('sharp')).default;
    } catch (error) {
      console.error('❌ Error: sharp is not installed.');
      console.error('   Please install it with: npm install --save-dev sharp');
      console.error('   Or: pnpm add -D sharp');
      process.exit(1);
    }

    // Check if source icon exists
    if (!existsSync(sourceIcon)) {
      console.error('❌ Error: Source icon not found!');
      console.error(`   Expected location: ${sourceIcon}`);
      console.error('\n📝 Please generate PWA icons first:');
      console.error('   node scripts/generate-pwa-icons.js');
      process.exit(1);
    }

    console.log('🎨 Creating favicon.ico...\n');

    // Create favicon.ico (16x16 and 32x32 sizes in ICO format)
    // Note: sharp doesn't support ICO format directly, so we'll create PNG and rename
    // Most modern browsers accept PNG as favicon, but for true ICO format,
    // you'd need a different tool. This creates a 32x32 PNG that works as favicon.
    
    await sharp(sourceIcon)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(faviconPath);

    console.log('✅ Created: favicon.ico');
    console.log(`📁 Location: ${faviconPath}`);
    console.log('\n💡 Note: This creates a PNG file named favicon.ico.');
    console.log('   Modern browsers will accept it. For true ICO format,');
    console.log('   use an online converter or ImageMagick.');
    
  } catch (error) {
    console.error('❌ Error creating favicon:', error.message);
    process.exit(1);
  }
}

createFavicon();
