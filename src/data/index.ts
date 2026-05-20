import industriesData from './industries-full.json';
import categoriesData from './categories-full.json';
import productsIndexData from './products-index.json';
import type { Industry } from '../types';

// Lightweight product type for listing/search/filtering pages
export interface ProductLite {
  id: string;
  name: string;
  slug: string;
  cas: string;
  ec: string;
  formula: string;
  category: string;
  industry: string[];
  description: string;
}

// Lightweight index (~1.7MB) instead of full products (~18MB)
export const PRODUCTS_INDEX: ProductLite[] = productsIndexData as ProductLite[];
export const INDUSTRIES: Industry[] = industriesData as Industry[];
export const CATEGORIES: any[] = categoriesData;

const _slugToName = new Map<string, string>(categoriesData.map((c: any) => [c.slug, c.name]));
const _nameToSlug = new Map<string, string>(categoriesData.map((c: any) => [c.name, c.slug]));

export function categorySlug(name: string): string {
  return _nameToSlug.get(name) ?? name.toLowerCase().replace(/[&,]+/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export function categoryName(slug: string): string {
  return _slugToName.get(slug) ?? slug;
}
