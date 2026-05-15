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
