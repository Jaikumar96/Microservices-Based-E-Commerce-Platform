// Generates 100 SVG placeholder images for products
// Output: frontend/public/assests/products/product-001.svg ... product-100.svg

const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'frontend', 'public', 'assests', 'products');

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function svgTemplate(label, color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <g>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="64" fill="#111111" opacity="0.9">${label}</text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#222222" opacity="0.8">High quality placeholder image</text>
  </g>
</svg>`;
}

function colorForIndex(i) {
  const palette = ['#FDE68A','#93C5FD','#A7F3D0','#FCA5A5','#C4B5FD','#FBCFE8','#99F6E4','#F9A8D4','#BAE6FD','#FEE2E2'];
  return palette[i % palette.length];
}

async function main() {
  ensureDir(outDir);
  for (let i = 1; i <= 100; i++) {
    const num = String(i).padStart(3, '0');
    const file = path.join(outDir, `product-${num}.svg`);
    const label = `Product ${num}`;
    const svg = svgTemplate(label, colorForIndex(i));
    fs.writeFileSync(file, svg, 'utf8');
  }
  console.log(`Generated 100 SVG images in: ${outDir}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
