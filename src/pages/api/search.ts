import type { APIRoute } from 'astro';
import { PRODUCTS_INDEX } from '../../data';

export const GET: APIRoute = ({ url }) => {
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  if (q.length < 2) {
    return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
  }

  const results = PRODUCTS_INDEX
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.cas.toLowerCase().includes(q) ||
      (p.ec && p.ec.toLowerCase().includes(q)) ||
      p.formula.toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map(p => ({
      name: p.name,
      slug: p.slug,
      cas: p.cas,
      ec: p.ec || '',
      formula: p.formula,
      category: p.category,
    }));

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
};
