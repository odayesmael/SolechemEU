import fs from 'fs';
import path from 'path';

const SOURCE = path.resolve('src/data/products-full.json');
const CONTENT_DIR = path.resolve('src/content/products');
const INDEX_OUTPUT = path.resolve('src/data/products-index.json');

console.log('📦 Reading monolith...');
const products: any[] = JSON.parse(fs.readFileSync(SOURCE, 'utf-8'));
console.log(`   Found ${products.length} products (${(fs.statSync(SOURCE).size / 1024 / 1024).toFixed(1)}MB)`);

// 1. Create content directory
fs.mkdirSync(CONTENT_DIR, { recursive: true });

// 2. Write individual product files for Content Collection
console.log('📂 Splitting into individual files...');
let written = 0;
for (const product of products) {
  const filename = `${product.slug}.json`;
  fs.writeFileSync(
    path.join(CONTENT_DIR, filename),
    JSON.stringify(product, null, 2)
  );
  written++;
  if (written % 500 === 0) {
    console.log(`   ...${written}/${products.length}`);
  }
}
console.log(`   ✅ Wrote ${written} individual product files to ${CONTENT_DIR}`);

// 3. Generate lightweight index (only fields needed for listing/search)
console.log('📋 Generating lightweight index...');
const index = products.map((p: any) => ({
  id:          p.id,
  name:        p.name,
  slug:        p.slug,
  cas:         p.cas,
  ec:          p.ec || '',
  formula:     p.formula,
  category:    p.category,
  industry:    p.industry,
  description: (p.description || '').substring(0, 120),
}));

fs.writeFileSync(INDEX_OUTPUT, JSON.stringify(index));

const indexSize = fs.statSync(INDEX_OUTPUT).size;
console.log(`   ✅ Generated index: ${INDEX_OUTPUT}`);
console.log(`   📊 Index size: ${(indexSize / 1024).toFixed(0)}KB (vs ${(fs.statSync(SOURCE).size / 1024 / 1024).toFixed(1)}MB original)`);
console.log(`   📊 Reduction: ${((1 - indexSize / fs.statSync(SOURCE).size) * 100).toFixed(1)}%`);
console.log('\n🎉 Migration complete!');
