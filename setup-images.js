const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\priya\\.gemini\\antigravity\\brain\\93980ec9-d4f8-429e-a2af-75a06c50855a';
const publicDir = path.join(__dirname, 'public', 'images');

// Create directories
['categories', 'products', 'banners'].forEach(dir => {
  fs.mkdirSync(path.join(publicDir, dir), { recursive: true });
});

// Mapping
const mappings = {
  'hero_jewelry_1786560622415.jpg': 'banners/hero.jpg',
  'cat_earrings_1786560829739.jpg': 'categories/earrings.png',
  'cat_necklaces_1786560847716.jpg': 'categories/necklaces.png',
  'cat_rings_1786560867930.jpg': 'categories/rings.png',
  'cat_bracelets_1786560880652.jpg': 'categories/bracelets.png',
};

// Copy basic images
for (const [src, dest] of Object.entries(mappings)) {
  fs.copyFileSync(path.join(srcDir, src), path.join(publicDir, dest));
}

// Map category images to products for demo purposes
const productMap = {
  'e': 'cat_earrings_1786560829739.jpg',
  'n': 'cat_necklaces_1786560847716.jpg',
  'r': 'cat_rings_1786560867930.jpg',
  'b': 'cat_bracelets_1786560880652.jpg'
};

const products = [
  'e1','e2','e3','e4','e5','e6','e7',
  'n1','n2','n3','n4','n5','n6',
  'r1','r2','r3','r4','r5','r6',
  'b1','b2','b3','b4','b5','b6'
];

products.forEach(p => {
  const prefix = p[0];
  const src = productMap[prefix];
  
  // Create two variations of the same image for hover effects
  fs.copyFileSync(path.join(srcDir, src), path.join(publicDir, `products/${p}-1.png`));
  fs.copyFileSync(path.join(srcDir, src), path.join(publicDir, `products/${p}-2.png`));
});

console.log("Images copied successfully.");
