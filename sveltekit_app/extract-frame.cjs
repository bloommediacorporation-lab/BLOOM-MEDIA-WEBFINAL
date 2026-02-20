const ffmpeg = require('ffmpeg-static');
const sharp = require('sharp');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');

const videoPath = path.join(__dirname, 'static/0119.webm');
const tempFramePath = path.join(__dirname, 'static/images/temp-frame.jpg');
const outputWebPPath = path.join(__dirname, 'static/images/hero-poster.webp');
const outputJpgPath = path.join(__dirname, 'static/images/hero-poster.jpg');

console.log('🎥 Extracting frame from video...');

// Extract frame at 00:00:01 (1 second mark) to avoid black frames
execFile(ffmpeg, [
    '-y',
    '-i', videoPath,
    '-ss', '00:00:01',
    '-vframes', '1',
    tempFramePath
], async (error) => {
    if (error) {
        console.error('❌ Error extracting frame:', error);
        return;
    }

    console.log('✅ Frame extracted successfully!');
    console.log('🖼️  Optimizing to WebP...');

    try {
        // Convert to optimized WebP
        await sharp(tempFramePath)
            .webp({ quality: 80 })
            .toFile(outputWebPPath);
            
        console.log('✅ Created hero-poster.webp');

        // Also keep a JPG version just in case, but optimized
        await sharp(tempFramePath)
            .jpeg({ quality: 80, mozjpeg: true })
            .toFile(outputJpgPath);
            
        console.log('✅ Created hero-poster.jpg');

        // Cleanup temp file
        fs.unlinkSync(tempFramePath);
        console.log('🧹 Cleanup complete.');

    } catch (err) {
        console.error('❌ Error processing image:', err);
    }
});