#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts JPG images to WebP and AVIF formats for better performance
 * 
 * Usage: node optimize-images.js
 * 
 * Requirements:
 * - npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, 'static/images/services');
const OUTPUT_DIR = IMAGES_DIR;

async function optimizeImages() {
  try {
    console.log('🖼️  Starting image optimization...\n');

    const files = fs.readdirSync(IMAGES_DIR).filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    if (files.length === 0) {
      console.log('❌ No images found in', IMAGES_DIR);
      return;
    }

    console.log(`Found ${files.length} images to optimize\n`);

    for (const file of files) {
      const inputPath = path.join(IMAGES_DIR, file);
      const baseName = path.parse(file).name;

      try {
        // Get original file size
        const originalSize = fs.statSync(inputPath).size;
        console.log(`📄 Processing: ${file}`);
        console.log(`   Original size: ${(originalSize / 1024).toFixed(2)} KB`);

        // Convert to WebP
        const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(webpPath);
        
        const webpSize = fs.statSync(webpPath).size;
        const webpReduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
        console.log(`   ✅ WebP: ${(webpSize / 1024).toFixed(2)} KB (${webpReduction}% smaller)`);

        // Convert to AVIF
        const avifPath = path.join(OUTPUT_DIR, `${baseName}.avif`);
        await sharp(inputPath)
          .avif({ quality: 75, effort: 9 })
          .toFile(avifPath);
        
        const avifSize = fs.statSync(avifPath).size;
        const avifReduction = ((1 - avifSize / originalSize) * 100).toFixed(1);
        console.log(`   ✅ AVIF: ${(avifSize / 1024).toFixed(2)} KB (${avifReduction}% smaller)`);

        // Compress original JPG
        const jpgPath = path.join(OUTPUT_DIR, `${baseName}-optimized.jpg`);
        await sharp(inputPath)
          .jpeg({ quality: 85, progressive: true })
          .toFile(jpgPath);
        
        const jpgSize = fs.statSync(jpgPath).size;
        const jpgReduction = ((1 - jpgSize / originalSize) * 100).toFixed(1);
        console.log(`   ✅ JPG: ${(jpgSize / 1024).toFixed(2)} KB (${jpgReduction}% smaller)\n`);

      } catch (error) {
        console.error(`   ❌ Error processing ${file}:`, error.message);
      }
    }

    console.log('✨ Image optimization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your image imports to use <picture> tags with WebP/AVIF fallbacks');
    console.log('2. Example:');
    console.log(`
    <picture>
      <source srcset="/images/services/image.avif" type="image/avif">
      <source srcset="/images/services/image.webp" type="image/webp">
      <img src="/images/services/image.jpg" alt="Description">
    </picture>
    `);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

optimizeImages();
