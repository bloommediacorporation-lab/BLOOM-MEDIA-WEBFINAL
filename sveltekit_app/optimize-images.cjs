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
const ROOT_IMAGES_DIR = path.join(__dirname, 'static');
const OUTPUT_DIR = IMAGES_DIR;

async function optimizeImages() {
  try {
    console.log('🖼️  Starting image optimization...\n');

    // Process Services Images
    // const serviceFiles = fs.readdirSync(IMAGES_DIR).filter(file => 
    //   /\.(jpg|jpeg|png)$/i.test(file)
    // );

    // if (serviceFiles.length > 0) {
    //   console.log(`Found ${serviceFiles.length} service images to optimize\n`);
    //   for (const file of serviceFiles) {
    //     await processImage(file, IMAGES_DIR, OUTPUT_DIR);
    //   }
    // }

    // Process Root Images (Monstru)
    const rootFiles = fs.readdirSync(ROOT_IMAGES_DIR).filter(file => 
      /^monstru_.*\.(png|jpg)$/i.test(file)
    );

    if (rootFiles.length > 0) {
      console.log(`Found ${rootFiles.length} root images (monstru) to optimize\n`);
      for (const file of rootFiles) {
        await processMonstruImage(file, ROOT_IMAGES_DIR, ROOT_IMAGES_DIR);
      }
    }

    console.log('✨ Image optimization complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function processMonstruImage(file, inputDir, outputDir) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    
    console.log(`Processing Monstru: ${file}`);
    
    // Mobile version (300px width)
    await sharp(inputPath)
        .resize(300)
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, `${baseName}_mobile.webp`));
    console.log(`   ✅ Mobile WebP created`);

    // Desktop version (600px width)
    await sharp(inputPath)
        .resize(600)
        .webp({ quality: 85 })
        .toFile(path.join(outputDir, `${baseName}_desktop.webp`));
    console.log(`   ✅ Desktop WebP created`);

    // Original size WebP
    await sharp(inputPath)
        .webp({ quality: 90 })
        .toFile(path.join(outputDir, `${baseName}.webp`));
    console.log(`   ✅ Full WebP created`);
}

async function processImage(file, inputDir, outputDir) {
      const inputPath = path.join(inputDir, file);
      const baseName = path.parse(file).name;

      try {
        // Get original file size
        const originalSize = fs.statSync(inputPath).size;
        console.log(`📄 Processing: ${file}`);
        console.log(`   Original size: ${(originalSize / 1024).toFixed(2)} KB`);

        // Convert to WebP
        const webpPath = path.join(outputDir, `${baseName}.webp`);
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(webpPath);
        
        const webpSize = fs.statSync(webpPath).size;
        const webpReduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
        console.log(`   ✅ WebP: ${(webpSize / 1024).toFixed(2)} KB (${webpReduction}% smaller)`);

        // Convert to AVIF
        const avifPath = path.join(outputDir, `${baseName}.avif`);
        await sharp(inputPath)
          .avif({ quality: 75, effort: 9 })
          .toFile(avifPath);
        
        const avifSize = fs.statSync(avifPath).size;
        const avifReduction = ((1 - avifSize / originalSize) * 100).toFixed(1);
        console.log(`   ✅ AVIF: ${(avifSize / 1024).toFixed(2)} KB (${avifReduction}% smaller)`);

        // Compress original JPG (if input is JPG)
        if (/\.(jpg|jpeg)$/i.test(file)) {
            const jpgPath = path.join(outputDir, `${baseName}-optimized.jpg`);
            await sharp(inputPath)
            .jpeg({ quality: 85, progressive: true })
            .toFile(jpgPath);
            
            const jpgSize = fs.statSync(jpgPath).size;
            const jpgReduction = ((1 - jpgSize / originalSize) * 100).toFixed(1);
            console.log(`   ✅ JPG: ${(jpgSize / 1024).toFixed(2)} KB (${jpgReduction}% smaller)\n`);
        }

      } catch (error) {
        console.error(`   ❌ Error processing ${file}:`, error.message);
      }
}

optimizeImages();
