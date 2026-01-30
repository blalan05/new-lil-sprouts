#!/usr/bin/env node
/**
 * PWA Icon Generator Script
 * 
 * This script generates PWA icons from a source image.
 * 
 * Requirements:
 * - Install sharp: npm install --save-dev sharp
 * - Create a source icon image (icon-source.png) in the public/icons/ directory
 *   Recommended size: 1024x1024px, square, PNG format
 * 
 * Usage:
 *   node scripts/generate-pwa-icons.js
 */

import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const iconsDir = join(projectRoot, 'public', 'icons');
const sourceIcon = join(iconsDir, 'icon-source.png');

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
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
      console.error('\n📝 Instructions:');
      console.error('   1. Create a square icon image (1024x1024px recommended)');
      console.error('   2. Save it as "icon-source.png" in the public/icons/ directory');
      console.error('   3. Run this script again');
      process.exit(1);
    }

    // Ensure icons directory exists
    if (!existsSync(iconsDir)) {
      mkdirSync(iconsDir, { recursive: true });
    }

    console.log('🎨 Generating PWA icons...\n');

    // Generate each icon size
    for (const size of iconSizes) {
      const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    }

    console.log('\n✨ All icons generated successfully!');
    console.log(`📁 Icons location: ${iconsDir}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Test your PWA by visiting your site');
    console.log('   2. Open DevTools > Application > Manifest');
    console.log('   3. Check that all icons are loading correctly');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
