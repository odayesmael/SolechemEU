import type { APIRoute } from 'astro';
import Fuse from 'fuse.js';
import { PRODUCTS_INDEX } from '../../data';

const fuse = new Fuse(PRODUCTS_INDEX, {
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'cas', weight: 0.3 },
    { name: 'formula', weight: 0.1 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  distance: 200,
  minMatchCharLength: 2,
});

export const GET: APIRoute = ({ url }) => {
  const q = (url.searchParams.get('q') || '').trim();
  const category = url.searchParams.get('category') || '';
  const industry = url.searchParams.get('industry') || '';
  const letter = url.searchParams.get('letter') || '';
  const sort = url.searchParams.get('sort') || 'name-asc';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(Math.max(1, parseInt(url.searchParams.get('limit') || '24', 10)), 100);

  let results: typeof PRODUCTS_INDEX[number][];

  if (q.length >= 2) {
    results = fuse.search(q).map(r => r.item);
  } else if (q.length === 1) {
    results = PRODUCTS_INDEX.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  } else {
    results = [...PRODUCTS_INDEX];
  }

  if (category && category !== 'All') {
    results = results.filter(p => p.category === category);
  }

  if (industry) {
    const industries = industry.split(',').map(s => s.trim());
    results = results.filter(p =>
      industries.some(i => p.industry.includes(i))
    );
  }

  if (letter) {
    if (letter === '#') {
      results = results.filter(p => /^[0-9]/.test(p.name));
    } else {
      results = results.filter(p =>
        p.name.charAt(0).toUpperCase() === letter.toUpperCase()
      );
    }
  }

  const sorted = [...results];
  switch (sort) {
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'cas':
      sorted.sort((a, b) => a.cas.localeCompare(b.cas));
      break;
    case 'category':
      sorted.sort((a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      );
      break;
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  const total = sorted.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const products = sorted.slice(offset, offset + limit).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    cas: p.cas,
    formula: p.formula,
    category: p.category,
    industry: p.industry,
  }));

  return new Response(JSON.stringify({ products, total, page, totalPages }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
};
