// Utility to attach image URLs to products based on name or SKU

const IMAGE_MAP = [
  {
    match: (p) =>
      (p.name && p.name.toLowerCase().includes('iphone 15')) ||
      (p.skuCode && p.skuCode.toLowerCase().includes('iphone')),
    src: '/assests/iphone_15.png',
  },
  {
    match: (p) =>
      (p.name && p.name.toLowerCase().includes('narzo 70x')) ||
      (p.name && p.name.toLowerCase().includes('narzo')) ||
      (p.skuCode && p.skuCode.toLowerCase().includes('narzo')),
    src: '/assests/narzo_70x.png',
  },
];

function imageFromSku(sku) {
  if (!sku) return null;
  // Match SKU-001 or PROD-001 → /assests/products/product-001.jpg
  const m = sku.match(/^(?:SKU|PROD)[-_](\d{3})$/i);
  if (m) {
    // Use SVG placeholders we generate: product-001.svg ... product-100.svg
    return `/assests/products/product-${m[1]}.svg`;
  }
  return null;
}

export function getImageForProduct(product) {
  const hit = IMAGE_MAP.find((m) => m.match(product));
  if (hit) return hit.src;
  const fromSku = imageFromSku(product?.skuCode);
  return fromSku || null;
}

export function attachProductImages(products) {
  if (!Array.isArray(products)) return [];
  return products.map((p) => ({ ...p, imageUrl: p.imageUrl || getImageForProduct(p) }));
}
