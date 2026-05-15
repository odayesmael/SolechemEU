import type { APIRoute } from 'astro';
import Fuse from 'fuse.js';
import { PRODUCTS_INDEX } from '../../data';

const fuse = new Fuse(PRODUCTS_INDEX, {
  keys: [
    { name: 'name', weight: 0.6 },
    { name: 'cas', weight: 0.2 },
    { name: 'ec', weight: 0.1 },
    { name: 'formula', weight: 0.1 },
  ],
  threshold: 0.4,
  distance: 200,
  includeScore: true,
  minMatchCharLength: 2,
});

function toResult(p: typeof PRODUCTS_INDEX[number]) {
  return { name: p.name, slug: p.slug, cas: p.cas, ec: p.ec || '', formula: p.formula, category: p.category };
}

export const GET: APIRoute = ({ url }) => {
  const q = (url.searchParams.get('q') || '').trim();
  if (q.length < 2) {
    return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
  }

  const ql = q.toLowerCase();
  const exact = PRODUCTS_INDEX
    .filter(p =>
      p.name.toLowerCase().includes(ql) ||
      p.cas.toLowerCase().includes(ql) ||
      (p.ec && p.ec.toLowerCase().includes(ql)) ||
      p.formula.toLowerCase().includes(ql)
    )
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(ql) ? 0 : 1;
      const bStarts = bName.startsWith(ql) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return (ql.length / aName.length) > (ql.length / bName.length) ? -1 : 1;
    });

  const exactSlugs = new Set(exact.map(p => p.slug));
  const fuzzy = fuse.search(q, { limit: 16 })
    .filter(r => !exactSlugs.has(r.item.slug))
    .map(r => r.item);

  const combined = [...exact, ...fuzzy].slice(0, 8);

  return new Response(JSON.stringify(combined.map(toResult)), {
    headers: { 'Content-Type': 'application/json' },
  });
};
