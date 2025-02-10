// scripts/generate-favicons.js
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="black" />
  <path d="M35 20h30c2.2 0 4 1.8 4 4v52c0 2.2-1.8 4-4 4H35c-2.2 0-4-1.8-4-4V24c0-2.2 1.8-4 4-4z" 
        fill="#0ff" opacity="0.9"/>
  <path d="M38 35h24M38 45h24M38 55h16" 
        stroke="black" stroke-width="3" stroke-linecap="round"/>
  <circle cx="65" cy="30" r="12" fill="#ff6ec7" opacity="0.9"/>
  <circle cx="70" cy="35" r="4" fill="#0ff" opacity="0.9"/>
</svg>`;

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'og-image.png': 1200,
  'twitter-image.png': 1200
};

async function ensurePublicDir() {
  try {
    await fs.access('public');
  } catch {
    await fs.mkdir('public');
  }
}

async function generateFavicons() {
  // Asegurarse de que existe el directorio public
  await ensurePublicDir();

  // Guardar el SVG original
  await fs.writeFile('public/logo.svg', LOGO_SVG);

  // Generar todas las versiones
  for (const [filename, size] of Object.entries(sizes)) {
    try {
      await sharp(Buffer.from(LOGO_SVG))
        .resize(size, size)
        .toFile(`public/${filename}`);
      console.log(`✅ Generated ${filename}`);
    } catch (error) {
      console.error(`❌ Error generating ${filename}:`, error);
    }
  }
}

generateFavicons().catch(console.error);