#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SCHOOL_DIR = path.resolve(__dirname, '../../../School');
const PUBLIC_LABS_DIR = path.resolve(__dirname, '../public/physics-labs');
const IMAGES_DIR = path.join(PUBLIC_LABS_DIR, 'images');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_LABS_DIR)) fs.mkdirSync(PUBLIC_LABS_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

console.log('Finding and copying physics labs...');

// Recursively find all .preview.html files in the physics-12 directory
function findPreviews(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findPreviews(filePath, fileList);
    } else if (file.endsWith('.preview.html') && file.toLowerCase().includes('lab')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const previewFiles = findPreviews(path.join(SCHOOL_DIR, 'physics-12'));
const manifest = [];

previewFiles.forEach(source => {
  const sourceDir = path.dirname(source);
  const basename = path.basename(source, '.preview.html');
  
  // Create a clean slug from the filename
  const slug = basename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let html = fs.readFileSync(source, 'utf8');

  // Extract title (look for <title> or fallback)
  let title = basename;
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].replace(' - Physics Lab', '').trim();
  }

  // Extract images
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    
    // Ignore data URIs or absolute URLs
    if (imgSrc.startsWith('data:') || imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
      continue;
    }

    const imagePath = path.resolve(sourceDir, imgSrc);
    
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(imagePath);
      const originalName = path.basename(imagePath, ext);
      const newImageName = `${slug}-${originalName}${ext}`.replace(/[^a-zA-Z0-9.-]/g, '-');
      const destImagePath = path.join(IMAGES_DIR, newImageName);
      
      fs.copyFileSync(imagePath, destImagePath);
      console.log(`  Copied image: ${imgSrc} -> images/${newImageName}`);
      
      html = html.replace(`src="${imgSrc}"`, `src="/physics-labs/images/${newImageName}"`);
    } else {
      console.warn(`  Warning: Could not find image ${imagePath}`);
    }
  }

  // Remove <base> tag
  html = html.replace(/<base[^>]+>/i, '');

  // Inject the internal scrolling Navbar at the top of the body
  const backButtonHtml = `
  <div style="padding: 1.5rem 1.5rem 0 1.5rem; text-align: left; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <a href="/physics" target="_parent" style="color: #666; text-decoration: none; font-weight: 500; font-size: 1rem; border: 1px solid #ddd; padding: 0.5rem 1rem; border-radius: 6px; display: inline-block; background: #fff;">← Back to Physics Labs</a>
  </div>
  `;
  html = html.replace(/<body[^>]*>/i, `$&${backButtonHtml}`);

  // Save the modified HTML
  const destHtml = path.join(PUBLIC_LABS_DIR, `${slug}.html`);
  fs.writeFileSync(destHtml, html, 'utf8');

  // Push to manifest
  // Read unit from filename or directory if possible
  let unit = "Other";
  const unitMatch = source.match(/u(\d)/i) || source.match(/unit[\s-]?(\d)/i);
  if (unitMatch) {
    unit = `Unit ${unitMatch[1]}`;
  }
  
  manifest.push({ slug, title, unit });
  console.log(`✔ Processed ${slug} ("${title}")`);
});

// Sort manifest by unit
manifest.sort((a, b) => a.unit.localeCompare(b.unit) || a.title.localeCompare(b.title));

// Write manifest.json
fs.writeFileSync(
  path.join(PUBLIC_LABS_DIR, 'manifest.json'), 
  JSON.stringify(manifest, null, 2)
);

// Clean up obsolete HTML files in the destination directory
const existingFiles = fs.readdirSync(PUBLIC_LABS_DIR);
const activeSlugs = new Set(manifest.map(m => m.slug));
existingFiles.forEach(file => {
  if (file.endsWith('.html')) {
    const slug = path.basename(file, '.html');
    if (!activeSlugs.has(slug)) {
      fs.unlinkSync(path.join(PUBLIC_LABS_DIR, file));
      console.log(`🧹 Deleted obsolete HTML file: ${file}`);
    }
  }
});

console.log('Done! Generated manifest.json with', manifest.length, 'labs.');
