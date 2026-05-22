import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, Grid, List, ArrowRight, ChevronRight, ChevronLeft, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  cas: string;
  formula: string;
  category: string;
  industry: string[];
}

interface Props {
  initialProducts: ProductItem[];
  initialTotal: number;
  categories: Array<{ name: string; slug: string }>;
  industries: string[];
  availableLetters: string[];
}

const ITEMS_PER_PAGE = 24;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function ProductsPage({
  initialProducts,
  initialTotal,
  categories,
  industries: _allIndustries,
  availableLetters,
}: Props) {
  const getParams = () => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  };

  const catSlugToName = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => map.set(c.slug, c.name));
    return map;
  }, [categories]);

  const categoryNames = useMemo(() => categories.map(c => c.name), [categories]);

  const [view, setView] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeIndustries, setActiveIndustries] = useState<string[]>([]);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const [globalResults, setGlobalResults] = useState<any[]>([]);
  const [showGlobalDropdown, setShowGlobalDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  const hasActiveFilter = activeCategory !== 'All' || activeIndustries.length > 0 || activeLetter !== null;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // --- Data fetching ---

  const doFetch = async (params: {
    q: string;
    category: string;
    industry: string;
    letter: string;
    sort: string;
    page: number;
  }) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const apiParams = new URLSearchParams();
    if (params.q) apiParams.set('q', params.q);
    if (params.category && params.category !== 'All') apiParams.set('category', params.category);
    if (params.industry) apiParams.set('industry', params.industry);
    if (params.letter) apiParams.set('letter', params.letter);
    apiParams.set('sort', params.sort);
    apiParams.set('page', String(params.page));
    apiParams.set('limit', String(ITEMS_PER_PAGE));

    setLoading(true);
    try {
      const res = await fetch(`/api/products?${apiParams}`, { signal: controller.signal });
      if (controller.signal.aborted) return;
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
      setLoading(false);
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      setLoading(false);
    }
  };

  const fetchGlobal = useCallback((q: string) => {
    if (q.trim().length < 2) { setGlobalResults([]); setShowGlobalDropdown(false); return; }
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      .then(r => r.json())
      .then(data => { setGlobalResults(data); setShowGlobalDropdown(data.length > 0); })
      .catch(() => {});
  }, []);

  // --- Effects ---

  useEffect(() => {
    const params = getParams();
    const q = params.get('q') || '';
    const cat = params.get('category') || '';
    const ind = params.get('industry') || '';
    const ltr = params.get('letter') || '';
    const page = params.get('page') || '';

    if (q) setSearch(q);
    if (cat) setActiveCategory(catSlugToName.get(cat) || cat);
    if (ind) setActiveIndustries([ind]);
    if (ltr) setActiveLetter(ltr);
    if (page) setCurrentPage(parseInt(page, 10));

    mountedRef.current = true;

    if (q || cat || ind || ltr || page) {
      doFetch({
        q,
        category: cat ? (catSlugToName.get(cat) || cat) : 'All',
        industry: ind,
        letter: ltr,
        sort: 'name-asc',
        page: parseInt(page || '1', 10),
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mountedRef.current) return;
    setCurrentPage(1);
  }, [search, activeCategory, activeIndustries, activeLetter]);

  useEffect(() => {
    if (!mountedRef.current) return;

    const isDefault = !search && activeCategory === 'All' &&
      activeIndustries.length === 0 && !activeLetter &&
      sortBy === 'name-asc' && currentPage === 1;

    if (isDefault) {
      setProducts(initialProducts);
      setTotal(initialTotal);
      setLoading(false);
      return;
    }

    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => {
      doFetch({
        q: search.trim(),
        category: activeCategory,
        industry: activeIndustries.join(','),
        letter: activeLetter || '',
        sort: sortBy,
        page: currentPage,
      });
    }, search ? 200 : 50);

    return () => {
      if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    };
  }, [search, activeCategory, activeIndustries, activeLetter, sortBy, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (search.trim().length >= 2 && hasActiveFilter) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchGlobal(search), 200);
    } else {
      setGlobalResults([]);
      setShowGlobalDropdown(false);
    }
  }, [total, search, hasActiveFilter, fetchGlobal]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowGlobalDropdown(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // --- URL sync ---

  const updateURL = (params: Record<string, string | null>) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url.toString());
  };

  // --- Handlers ---

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    updateURL({ q: val || null });
  };

  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('products-list-top');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const activeFilters = [
    ...(activeCategory !== 'All' ? [{ type: 'category', value: activeCategory, remove: () => setActiveCategory('All') }] : []),
    ...activeIndustries.map(i => ({ type: 'industry', value: i, remove: () => toggleFilter(setActiveIndustries, i) })),
    ...(activeLetter ? [{ type: 'letter', value: `Letter: ${activeLetter}`, remove: () => setActiveLetter(null) }] : [])
  ];

  const clearAllFilters = () => {
    setActiveCategory('All');
    setActiveIndustries([]);
    setActiveLetter(null);
    setSearch('');
    updateURL({ q: null, category: null, industry: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
          <a href="/" className="hover:text-orange-600 transition-colors">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">Products</span>
        </div>

        <div id="products-list-top" className="space-y-5">
          {/* Unified Search & Filter Toolbar */}
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Search Input */}
              <div ref={searchBoxRef} className="relative flex-1 flex items-center border-b md:border-b-0 md:border-r border-slate-200 px-4">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" value={search} onChange={handleSearchChange} onFocus={() => { if (globalResults.length > 0 && hasActiveFilter) setShowGlobalDropdown(true); }} placeholder="Search by name, CAS number, or formula..." className="w-full h-12 pl-3 bg-transparent text-[13px] font-medium focus:outline-none transition-all" autoComplete="off" />
                {search && (
                  <button onClick={() => { setSearch(''); updateURL({ q: null }); }} className="p-1 hover:bg-slate-100 rounded-sm transition-colors shrink-0">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                {showGlobalDropdown && globalResults.length > 0 && hasActiveFilter && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 max-h-[400px] overflow-y-auto">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" /> Results from All Products
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{globalResults.length} result{globalResults.length !== 1 ? 's' : ''}</span>
                    </div>
                    {globalResults.map((r: any) => (
                      <a key={r.slug} href={`/products/${r.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0">
                        <div className="w-8 h-8 shrink-0 rounded bg-slate-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">{r.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>CAS: {r.cas}</span>
                            {r.ec && <><span className="text-slate-300">|</span><span>EC: {r.ec}</span></>}
                          </div>
                        </div>
                      </a>
                    ))}
                    <a href={`/products?q=${encodeURIComponent(search)}`} onClick={() => { setActiveCategory('All'); setActiveIndustries([]); }} className="block px-4 py-2.5 text-center text-[12px] font-bold text-orange-600 hover:bg-orange-50 uppercase tracking-wider">
                      View all results →
                    </a>
                  </div>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative flex items-center border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-4 shrink-0" />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="h-12 bg-transparent text-[13px] font-medium text-slate-900 pl-2 pr-8 focus:outline-none transition-colors appearance-none cursor-pointer hover:text-orange-600"
                >
                  {categoryNames.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              {/* View Toggles & Clear */}
              <div className="flex items-center gap-1 px-3 shrink-0">
                <button onClick={() => setView('grid')} className={cn("p-2 transition-colors", view === 'grid' ? "text-slate-900 bg-slate-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}><Grid className="w-4 h-4" /></button>
                <button onClick={() => setView('list')} className={cn("p-2 transition-colors", view === 'list' ? "text-slate-900 bg-slate-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}><List className="w-4 h-4" /></button>
                {activeFilters.length > 0 && (
                  <>
                    <div className="h-6 w-px bg-slate-200 mx-1" />
                    <button onClick={clearAllFilters} className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors whitespace-nowrap uppercase tracking-wider px-2">
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Alphabetic Filter Bar */}
          <div className="flex flex-wrap items-center gap-1 bg-white border border-slate-200 px-3 py-2 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 shrink-0">A-Z</span>
            <button
              onClick={() => setActiveLetter(null)}
              className={cn(
                "w-7 h-7 flex items-center justify-center text-[11px] font-bold rounded-sm transition-all",
                activeLetter === null
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              All
            </button>
            {(() => {
              const hasNumeric = availableLetters.includes('#');
              return (
                <button
                  onClick={() => hasNumeric && setActiveLetter(activeLetter === '#' ? null : '#')}
                  disabled={!hasNumeric}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center text-[11px] font-bold rounded-sm transition-all",
                    activeLetter === '#'
                      ? "bg-orange-600 text-white shadow-sm"
                      : hasNumeric
                        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        : "text-slate-300 cursor-not-allowed"
                  )}
                >
                  #
                </button>
              );
            })()}
            {ALPHABET.map(letter => {
              const hasProducts = availableLetters.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => hasProducts && setActiveLetter(activeLetter === letter ? null : letter)}
                  disabled={!hasProducts}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center text-[11px] font-bold rounded-sm transition-all",
                    activeLetter === letter
                      ? "bg-orange-600 text-white shadow-sm"
                      : hasProducts
                        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        : "text-slate-300 cursor-not-allowed"
                  )}
                >
                  {letter}
                </button>
              );
            })}
          </div>

            {/* Active Filters Chips */}
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.div
                  key="active-filters-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 items-center pb-2"
                >
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-2">Active Filters:</span>
                  {activeFilters.map((filter, idx) => (
                    <motion.div
                      key={`${filter.type}-${filter.value}-${idx}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-sm text-xs font-medium shadow-sm"
                    >
                      <span className="opacity-50 capitalize mr-1">{filter.type}:</span>
                      {filter.value}
                      <button onClick={filter.remove} className="ml-1 p-0.5 hover:bg-slate-100 rounded-sm transition-colors text-slate-400 hover:text-slate-900">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                  <button onClick={clearAllFilters} className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline ml-2">
                    Clear All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Info */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
              <p className="text-[13px] font-medium text-slate-600">
                <span className="text-slate-900 font-bold">{total}</span> products matching your criteria
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[13px] font-medium text-slate-900 focus:ring-0 cursor-pointer outline-none p-0 hover:text-orange-600 transition-colors"
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="name-desc">Sort: Name Z-A</option>
                <option value="cas">Sort: CAS Number</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>

            {/* Product Grid/List */}
            <div className={cn(
              "grid gap-4 transition-opacity duration-200",
              loading && "opacity-50 pointer-events-none",
              view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 gap-0 border-y border-slate-200"
            )}>
              {view === 'list' && products.length > 0 && (
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">CAS Number</div>
                  <div className="col-span-2">Formula</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
              )}

              <>
                {products.map((product, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.015 }}
                    key={`${product.id}-${currentPage}`}
                    className={cn(
                      "group relative bg-white transition-all duration-300 flex flex-col",
                      view === 'grid'
                        ? "border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-500/50 hover:-translate-y-1 overflow-hidden"
                        : "border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    )}
                  >
                    {view === 'grid' ? (
                      <div className="p-4 flex flex-col h-full z-10">
                        <div className="flex-1 space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{product.category}</span>
                          </div>

                          <div>
                            <a href={`/products/${product.slug}`} className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight line-clamp-2">
                              {product.name}
                            </a>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">CAS Number</span>
                                <span className="text-[13px] font-mono font-medium text-slate-700">{product.cas}</span>
                              </div>
                              {product.formula && (
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">Formula</span>
                                <span className="text-[13px] font-mono font-medium text-slate-700">{product.formula}</span>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3 relative z-30">
                          <div className="flex flex-col space-y-1 mb-2">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Primary Industry</span>
                            <span className="text-[13px] font-medium text-slate-700 line-clamp-1">{product.industry[0]}</span>
                          </div>
                          <a href={`/products/${product.slug}`} className="w-full flex items-center justify-center gap-1.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white h-9 font-bold text-xs transition-colors rounded-sm uppercase tracking-wider">
                            View Details
                          </a>
                        </div>
                      </div>
                    ) : (
                      <a href={`/products/${product.slug}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-2 items-center z-10 w-full group">
                        <div className="col-span-1 md:col-span-4">
                          <div className="font-semibold text-[13px] text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{product.name}</div>
                          <div className="text-[11px] text-slate-500 md:hidden mt-1 font-mono">CAS: {product.cas}</div>
                        </div>
                        <div className="hidden md:block col-span-2 font-mono text-[12px] text-slate-600">
                          {product.cas}
                        </div>
                        <div className="hidden md:block col-span-2 font-mono text-[12px] text-slate-600 line-clamp-1">
                          {product.formula || '—'}
                        </div>
                        <div className="hidden md:block col-span-2">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest line-clamp-1 truncate">
                            {product.category}
                          </span>
                        </div>
                        <div className="hidden md:flex col-span-2 justify-end">
                          <div className="flex items-center justify-center gap-1 text-slate-400 group-hover:text-orange-600 transition-colors font-medium text-[12px]">
                            <span className="md:hidden lg:inline">Details</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                          </div>
                        </div>
                      </a>
                    )}
                  </motion.div>
                ))}
              </>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-12 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            "w-10 h-10 flex items-center justify-center text-[13px] font-semibold transition-colors border-y border-transparent",
                            currentPage === page
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-slate-400 px-3 w-10 flex justify-center">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Empty State */}
            {products.length === 0 && !loading && (
              <div className="py-10 bg-white border border-dashed border-slate-300 shadow-sm px-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">No products found</h4>
                  <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-2">
                    {search ? <>No products matching "<span className="font-bold text-slate-700">{search}</span>" in the current filters.</> : 'No products match your current filter criteria.'}
                  </p>
                  <button onClick={clearAllFilters} className="bg-white border border-slate-200 hover:border-orange-500 text-slate-900 px-6 py-2.5 font-semibold text-[13px] transition-all mt-4 hover:shadow-sm">
                    Clear All Filters
                  </button>
                </div>
                {globalResults.length > 0 && (
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Results from All Products
                      <span className="text-slate-400 font-semibold">({globalResults.length})</span>
                    </h4>
                    <div className="space-y-1">
                      {globalResults.map((r: any) => (
                        <a key={r.slug} href={`/products/${r.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border border-slate-100 rounded-sm group">
                          <div className="w-9 h-9 shrink-0 rounded bg-slate-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <Package className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">{r.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>CAS: {r.cas}</span>
                              {r.ec && <><span className="text-slate-300">|</span><span>EC: {r.ec}</span></>}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                    <a href={`/products?q=${encodeURIComponent(search)}`} className="block mt-4 text-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                      View all results →
                    </a>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
