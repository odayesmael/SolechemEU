import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Package, ArrowRight, Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProductLite {
  id: string;
  name: string;
  slug: string;
  cas: string;
  formula: string;
  category: string;
  description: string;
}

interface Props {
  products: ProductLite[];
  industryName: string;
}

const ITEMS_PER_PAGE = 24;

export default function IndustryProducts({ products, industryName }: Props) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name-asc');
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

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cas.toLowerCase().includes(search.toLowerCase())
    );

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
  }, [products, search, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to product list top, not page top
    const el = document.getElementById('industry-products-top');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (search.trim().length >= 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchGlobal(search), 200);
    } else {
      setGlobalResults([]);
      setShowGlobalDropdown(false);
    }
  }, [search, fetchGlobal]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowGlobalDropdown(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Reset to page 1 when search changes
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | 'dots')[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - 2 || i === currentPage + 2) &&
        !pages.includes('dots')
      ) {
        pages.push('dots');
      }
    }
    // Clean up consecutive dots
    return pages.filter((p, idx, arr) => p !== 'dots' || arr[idx - 1] !== 'dots');
  }, [totalPages, currentPage]);

  return (
    <div className="flex-1 w-full space-y-5">
      <div id="industry-products-top" />
      {/* Toolbar */}
      <div className="bg-white p-3 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div ref={searchBoxRef} className="relative flex-1 w-full flex items-center bg-slate-50 border border-slate-200 px-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => { if (globalResults.length > 0 && search.trim().length >= 2) setShowGlobalDropdown(true); }}
            placeholder={`Search ${industryName} products...`}
            className="w-full h-10 pl-3 bg-transparent text-[13px] font-medium focus:outline-none transition-all text-slate-900 placeholder-slate-400"
            autoComplete="off"
          />
          {showGlobalDropdown && globalResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 max-h-[400px] overflow-y-auto">
              <div className="px-4 py-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Results from All Products
                </span>
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
              <a href={`/products?q=${encodeURIComponent(search)}`} className="block px-4 py-2.5 text-center text-[12px] font-bold text-orange-600 hover:bg-orange-50 uppercase tracking-wider">
                View all results →
              </a>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 px-2">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border-none text-[12px] font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none p-0 hover:text-orange-600 transition-colors"
          >
            <option value="name-asc">A-Z</option>
            <option value="name-desc">Z-A</option>
            <option value="cas">CAS</option>
            <option value="category">Category</option>
          </select>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
          <button
            onClick={() => setView('grid')}
            className={cn("p-2 transition-colors hidden sm:block", view === 'grid' ? "text-slate-900 bg-slate-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn("p-2 transition-colors hidden sm:block", view === 'list' ? "text-slate-900 bg-slate-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")}
          >
            <List className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
          <div className="text-[13px] font-medium text-slate-600 ml-1">
            <span className="font-bold text-slate-900">{filteredProducts.length}</span> Products
          </div>
        </div>
      </div>

      {/* Results info */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 text-[12px] text-slate-500 font-medium">
          <span>
            Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–<span className="text-slate-900 font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="text-slate-900 font-bold">{filteredProducts.length}</span>
          </span>
          <span>
            Page <span className="text-slate-900 font-bold">{currentPage}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
          </span>
        </div>
      )}

      {/* Products list */}
      {paginatedProducts.length > 0 ? (
        <div className={cn(
          "grid gap-4",
          view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 gap-0 border-y border-slate-200"
        )}>
          {view === 'list' && (
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Product</div>
              <div className="col-span-2">CAS Number</div>
              <div className="col-span-2">Formula</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
          )}
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
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
                      </div>
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium line-clamp-2">{product.description}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3 relative z-30">
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
                  <div className="hidden md:block col-span-2 font-mono text-[12px] text-slate-600">{product.cas}</div>
                  <div className="hidden md:block col-span-2 font-mono text-[12px] text-slate-600 line-clamp-1">{product.formula || '—'}</div>
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
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-300 p-10 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4 rounded-sm shadow-sm">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Products Found in {industryName}</h3>
            <p className="text-[13px] text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              We couldn't find any products matching "<span className="font-bold text-slate-700">{search}</span>" in this industry.
            </p>
            <button
              onClick={() => handleSearchChange('')}
              className="mt-4 text-[12px] text-orange-600 font-semibold uppercase tracking-widest hover:text-orange-700 underline transition-colors"
            >
              Clear Search
            </button>
          </div>
          {globalResults.length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Results from All Products
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 pt-6 pb-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center">
            {pageNumbers.map((page, idx) => {
              if (page === 'dots') {
                return <span key={`dots-${idx}`} className="text-slate-400 px-3 w-10 flex justify-center">...</span>;
              }
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center text-[13px] font-semibold transition-colors",
                    currentPage === page
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
