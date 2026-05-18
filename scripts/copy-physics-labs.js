#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SCHOOL_DIR = path.resolve(__dirname, '../../../School');
const PUBLIC_LABS_DIR = path.resolve(__dirname, '../public/physics-labs');
const IMAGES_DIR = path.join(PUBLIC_LABS_DIR, 'images');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_LABS_DIR)) fs.mkdirSync(PUBLIC_LABS_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const LABS = [
  {
    source: path.join(SCHOOL_DIR, 'physics-12/u4-momentum/PH12 U4 Lab/PH12 U4 Lab A - Collision Forensics.preview.html'),
    slug: 'collision-forensics'
  },
  {
    source: path.join(SCHOOL_DIR, 'physics-12/u5-electricity/u5-lab-colombs-law/PH12 U5: Coulomb’s Law Virtual Lab.preview.html'),
    slug: 'coulombs-law'
  }
];

console.log('Copying physics labs and their images...');

for (const lab of LABS) {
  if (!fs.existsSync(lab.source)) {
    console.warn(`Warning: Could not find ${lab.source}`);
    continue;
  }

  const sourceDir = path.dirname(lab.source);
  let html = fs.readFileSync(lab.source, 'utf8');

  // Find all images: <img src="..."> or similar
  // HTML from pdf-exporter might have <img src="...">
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    
    // Ignore data URIs or absolute URLs
    if (imgSrc.startsWith('data:') || imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
      continue;
    }

    // imgSrc is likely relative to sourceDir, e.g., "force-vs-distance.png"
    // Wait, pdf-exporter sets <base href="file://${INPUT_DIR}/">
    // So the browser resolves imgSrc relative to INPUT_DIR.
    const imagePath = path.resolve(sourceDir, imgSrc);
    
    if (fs.existsSync(imagePath)) {
      const imageName = path.basename(imgSrc);
      const newImageName = `${lab.slug}-${imageName}`;
      const destImagePath = path.join(IMAGES_DIR, newImageName);
      
      fs.copyFileSync(imagePath, destImagePath);
      
      // Replace the src in HTML
      // Since replace replaces the first occurrence, we can just replace `src="imgSrc"` or similar.
      html = html.replace(`src="${imgSrc}"`, `src="/physics-labs/images/${newImageName}"`);
      console.log(`  Copied image: ${imgSrc} -> images/${newImageName}`);
    } else {
      console.warn(`  Warning: Could not find image ${imagePath}`);
    }
  }

  // Save the modified HTML
  const destHtml = path.join(PUBLIC_LABS_DIR, `${lab.slug}.html`);
  fs.writeFileSync(destHtml, html, 'utf8');
  console.log(`✔ Copied ${lab.slug}`);
}

console.log('Done!');
