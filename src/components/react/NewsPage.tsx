import { useState } from 'react';
import { Calendar, Clock, ArrowRight, Tag, Search, Newspaper } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { NewsItem } from '../../data/news';

const CATEGORIES = ['All', 'Company News', 'Industry Insights', 'Product Updates', 'Events', 'Partnerships'];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

interface Props {
  news: NewsItem[];
}

export default function NewsPageClient({ news }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = news.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredItems = news.filter(n => n.featured);
  const regularItems = filtered.filter(n => !n.featured || activeCategory !== 'All' || searchQuery);

  return (
    <>
      {activeCategory === 'All' && !searchQuery && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h2 className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em] mb-8">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredItems.map((item) => (
                <a href={`/news/${item.slug}`} key={item.id} className="group relative bg-white rounded-sm border border-slate-200 overflow-hidden hover:border-orange-500 hover:shadow-xl transition-all duration-300 block">
                  <div className="relative h-64 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">{item.category}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white leading-tight group-hover:text-orange-200 transition-colors">{item.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-[14px] text-slate-600 leading-relaxed font-medium line-clamp-2">{item.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(item.date)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.readTime}</span>
                      </div>
                      <span className="text-orange-600 font-bold text-[12px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 bg-slate-50 border-y border-slate-200 sticky top-[72px] z-30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("px-4 py-2 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all border", activeCategory === cat ? "bg-orange-600 text-white border-orange-600" : "bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-600")}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search articles..." className="w-full h-10 bg-white border border-slate-200 rounded-sm pl-10 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {regularItems.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
              <p className="text-[14px] text-slate-500 font-medium">Try adjusting your search or filter criteria.</p>
              <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="text-orange-600 font-bold text-[12px] uppercase tracking-widest hover:text-orange-700 transition-colors">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularItems.map((item) => (
                <a href={`/news/${item.slug}`} key={item.id} className="group bg-white rounded-sm border border-slate-200 overflow-hidden hover:border-orange-500 hover:shadow-lg transition-all duration-300 flex flex-col block">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border border-slate-200 flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-orange-600" /> {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(item.date)}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{item.readTime}</span>
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium line-clamp-3 flex-1">{item.excerpt}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-orange-600 font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-3 transition-all">
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
