import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, Grid, List, ArrowRight, ChevronRight, ChevronLeft, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProductLite {
  id: string;
  name: string;
  slug: string;
  cas: string;
  formula: string;
  category: string;
  industry: string[];
  description: string;
}

interface Props {
  products: ProductLite[];
}

export default function ProductsPage({ products: PRODUCTS }: Props) {
  // Read initial values from URL (guard for SSR where window is undefined)
  const getParams = () => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  };

  const [view, setView] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');

  // Filter States
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeIndustries, setActiveIndustries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [globalResults, setGlobalResults] = useState<any[]>([]);
  const [showGlobalDropdown, setShowGlobalDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const fetchGlobal = useCallback((q: string) => {
    if (q.trim().length < 2) { setGlobalResults([]); setShowGlobalDropdown(false); return; }
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      .then(r => r.json())
      .then(data => { setGlobalResults(data); setShowGlobalDropdown(data.length > 0); })
      .catch(() => {});
  }, []);

  // Read URL params on client mount
  useEffect(() => {
    const params = getParams();
    const q = params.get('q');
    const cat = params.get('category');
    const ind = params.get('industry');
    const page = params.get('page');
    if (q) setSearch(q);
    if (cat) setActiveCategory(cat);
    if (ind) setActiveIndustries([ind]);
    if (page) setCurrentPage(parseInt(page, 10));
  }, []);
  const ITEMS_PER_PAGE = 24;

  // Sync URL params without full page reload
  const updateURL = (params: Record<string, string | null>) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    }
    window.history.replaceState({}, '', url.toString());
  };

  // Update URL when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    updateURL({ q: val || null });
  };

  // Extract unique filter options from data
  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category))).sort()];
  const industries = Array.from(new Set(PRODUCTS.flatMap(p => p.industry)));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, activeIndustries]);

  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const filteredProducts = useMemo(() => {
    const filtered = PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                           (p.cas || "").includes(search) ||
                           p.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;

      const matchesIndustry = activeIndustries.length === 0 || activeIndustries.some(i => p.industry.includes(i));

      return matchesSearch && matchesCategory && matchesIndustry;
    });

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'cas':
        sorted.sort((a, b) => a.cas.localeCompare(b.cas));
        break;
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  }, [search, activeCategory, activeIndustries, sortBy]);

  const hasActiveFilter = activeCategory !== 'All' || activeIndustries.length > 0;
  useEffect(() => {
    if (search.trim().length >= 2 && hasActiveFilter) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchGlobal(search), 200);
    } else {
      setGlobalResults([]);
      setShowGlobalDropdown(false);
    }
  }, [filteredProducts.length, search, hasActiveFilter, fetchGlobal]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowGlobalDropdown(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    ...activeIndustries.map(i => ({ type: 'industry', value: i, remove: () => toggleFilter(setActiveIndustries, i) }))
  ];

  const clearAllFilters = () => {
    setActiveCategory('All');
    setActiveIndustries([]);
    setSearch('');
    updateURL({ q: null, category: null, industry: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
          <a href="/" className="hover:text-orange-600 transition-colors">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 dark:text-white">Products</span>
        </div>

        <div id="products-list-top" className="space-y-5">
          {/* Unified Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Search Input */}
              <div ref={searchBoxRef} className="relative flex-1 flex items-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 px-4">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" value={search} onChange={handleSearchChange} onFocus={() => { if (globalResults.length > 0 && hasActiveFilter) setShowGlobalDropdown(true); }} placeholder="Search by name, CAS number, or formula..." className="w-full h-12 pl-3 bg-transparent text-[13px] font-medium focus:outline-none transition-all dark:text-white dark:placeholder-slate-400" autoComplete="off" />
                {search && (
                  <button onClick={() => { setSearch(''); updateURL({ q: null }); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors shrink-0">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                {showGlobalDropdown && globalResults.length > 0 && hasActiveFilter && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl z-50 max-h-[400px] overflow-y-auto">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" /> Results from All Products
                      </span>
                    </div>
                    {globalResults.map((r: any) => (
                      <a key={r.slug} href={`/products/${r.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <div className="w-8 h-8 shrink-0 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{r.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>CAS: {r.cas}</span>
                            {r.ec && <><span className="text-slate-300">|</span><span>EC: {r.ec}</span></>}
                          </div>
                        </div>
                      </a>
                    ))}
                    <a href={`/products?q=${encodeURIComponent(search)}`} onClick={() => { setActiveCategory('All'); setActiveIndustries([]); }} className="block px-4 py-2.5 text-center text-[12px] font-bold text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 uppercase tracking-wider">
                      View all results →
                    </a>
                  </div>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative flex items-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-4 shrink-0" />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="h-12 bg-transparent text-[13px] font-medium text-slate-900 dark:text-white pl-2 pr-8 focus:outline-none transition-colors appearance-none cursor-pointer hover:text-orange-600"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              {/* View Toggles & Clear */}
              <div className="flex items-center gap-1 px-3 shrink-0">
                <button onClick={() => setView('grid')} className={cn("p-2 transition-colors", view === 'grid' ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800" : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800")}><Grid className="w-4 h-4" /></button>
                <button onClick={() => setView('list')} className={cn("p-2 transition-colors", view === 'list' ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800" : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800")}><List className="w-4 h-4" /></button>
                {activeFilters.length > 0 && (
                  <>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                    <button onClick={clearAllFilters} className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors whitespace-nowrap uppercase tracking-wider px-2">
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
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
                      className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-sm text-xs font-medium shadow-sm"
                    >
                      <span className="opacity-50 capitalize mr-1">{filter.type}:</span>
                      {filter.value}
                      <button onClick={filter.remove} className="ml-1 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white">
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
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800">
              <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400">
                <span className="text-slate-900 dark:text-white font-bold">{filteredProducts.length}</span> products matching your criteria
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[13px] font-medium text-slate-900 dark:text-white focus:ring-0 cursor-pointer outline-none dark:bg-slate-900 p-0 hover:text-orange-600 transition-colors"
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="name-desc">Sort: Name Z-A</option>
                <option value="cas">Sort: CAS Number</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>

            {/* Product Grid/List */}
            <div className={cn(
              "grid gap-4",
              view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 gap-0 border-y border-slate-200 dark:border-slate-800"
            )}>
              {view === 'list' && paginatedProducts.length > 0 && (
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">CAS Number</div>
                  <div className="col-span-2">Formula</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    key={`${product.name}-${product.cas}-${currentPage}-${index}`}
                    className={cn(
                      "group relative bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col",
                      view === 'grid'
                        ? "border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-500/50 hover:-translate-y-1 overflow-hidden"
                        : "border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {view === 'grid' ? (
                      <div className="p-4 flex flex-col h-full z-10">
                        <div className="flex-1 space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{product.category}</span>
                          </div>

                          <div>
                            <a href={`/products/${product.slug}`} className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:hover:text-orange-400 transition-colors tracking-tight line-clamp-2">
                              {product.name}
                            </a>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">CAS Number</span>
                                <span className="text-[13px] font-mono font-medium text-slate-700 dark:text-slate-300">{product.cas}</span>
                              </div>
                              {product.formula && (
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">Formula</span>
                                <span className="text-[13px] font-mono font-medium text-slate-700 dark:text-slate-300">{product.formula}</span>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 relative z-30">
                          <div className="flex flex-col space-y-1 mb-2">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Primary Industry</span>
                            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 line-clamp-1">{product.industry[0]}</span>
                          </div>
                          <a href={`/products/${product.slug}`} className="w-full flex items-center justify-center gap-1.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-900 h-9 font-bold text-xs transition-colors rounded-sm uppercase tracking-wider">
                            View Details
                          </a>
                        </div>
                      </div>
                    ) : (
                      <a href={`/products/${product.slug}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-2 items-center z-10 w-full group">
                        <div className="col-span-1 md:col-span-4">
                          <div className="font-semibold text-[13px] text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">{product.name}</div>
                          <div className="text-[11px] text-slate-500 md:hidden mt-1 font-mono">CAS: {product.cas}</div>
                        </div>
                        <div className="hidden md:block col-span-2 font-mono text-[12px] text-slate-600 dark:text-slate-400">
                          {product.cas}
                        </div>
                        <div className="hidden md:block col-span-2 font-mono text-[12px] text-slate-600 dark:text-slate-400 line-clamp-1">
                          {product.formula || '—'}
                        </div>
                        <div className="hidden md:block col-span-2">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-widest line-clamp-1 truncate">
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
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-12 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                              ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          )}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-slate-400 dark:text-slate-500 px-3 w-10 flex justify-center">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="py-10 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 shadow-sm px-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mt-2">
                    {search ? <>No products matching "<span className="font-bold text-slate-700 dark:text-slate-300">{search}</span>" in the current filters.</> : 'No products match your current filter criteria.'}
                  </p>
                  <button onClick={clearAllFilters} className="bg-white border border-slate-200 hover:border-orange-500 text-slate-900 px-6 py-2.5 font-semibold text-[13px] transition-all mt-4 hover:shadow-sm">
                    Clear All Filters
                  </button>
                </div>
                {globalResults.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Results from All Products
                    </h4>
                    <div className="space-y-1">
                      {globalResults.map((r: any) => (
                        <a key={r.slug} href={`/products/${r.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors border border-slate-100 dark:border-slate-800 rounded-sm group">
                          <div className="w-9 h-9 shrink-0 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 transition-colors">
                            <Package className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors truncate">{r.name}</div>
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
