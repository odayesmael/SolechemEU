import React, { useState, useEffect } from 'react';
import { ChevronRight, Copy, Check, ShieldCheck, Phone, Mail, MessageCircle, ArrowRight, FlaskConical, AlertTriangle, Scale, Thermometer, Droplets, Atom } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import QuoteModal from '@/components/react/QuoteModal';
import type { Product } from '@/types';

interface SimilarProductInfo {
  id: string;
  name: string;
  slug: string;
  cas: string;
  ec?: string;
}

interface IndustryInfo {
  name: string;
  slug: string;
}

interface ProductDetailClientProps {
  product: Product;
  industries: IndustryInfo[];
  similarProducts: SimilarProductInfo[];
}

export default function ProductDetailClient({ product, industries: INDUSTRIES, similarProducts: resolvedSimilarProducts }: ProductDetailClientProps) {
  const [activeSection, setActiveSection] = useState('description');
  const [copied, setCopied] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    ...(product.description ? [{ id: 'description', label: 'Description' }] : []),
    ...(product.physicalProperties ? [{ id: 'physical-properties', label: 'Physical Properties' }] : []),
    ...(product.safetyHandling ? [{ id: 'safety-handling', label: 'Safety & Handling' }] : []),
    ...(product.tradeRegulatory ? [{ id: 'trade-regulatory', label: 'Trade & Regulatory' }] : []),
    ...(resolvedSimilarProducts && resolvedSimilarProducts.length > 0 ? [{ id: 'similar-products', label: 'Similar Products' }] : [])
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-24 lg:pb-20 transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-[9px] sm:text-xs font-bold text-slate-400 mb-6 sm:mb-8 uppercase tracking-widest">
          <a href="/" className="hover:text-orange-600 transition-colors shrink-0">Home</a>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <a href="/products" className="hover:text-orange-600 transition-colors shrink-0">Products</a>
          <ChevronRight className="w-3 h-3 shrink-0 hidden sm:block" />
          <span className="text-slate-400 hidden sm:inline truncate max-w-[150px] md:max-w-none">{product.category}</span>
          <ChevronRight className="w-3 h-3 shrink-0 hidden sm:block" />
          <span className="text-slate-900 dark:text-white hidden sm:inline truncate max-w-[120px] md:max-w-none">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1 space-y-12">
            {/* Header Info */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <a href={`/products?category=${encodeURIComponent(product.category)}`} className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-900/30 dark:hover:text-orange-400 transition-colors cursor-pointer">
                    {product.category}
                  </a>
                  {product.compliance?.map((c: string) => (
                    <span key={c} className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-sm">
                      <ShieldCheck className="w-3 h-3" /> {c}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-5xl font-sans font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                  {product.name}
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'CAS Number', value: product.cas },
                    { label: 'EC Number', value: product.ec || "N/A" },
                    ...(product.formula ? [{ label: 'Chemical Formula', value: product.formula }] : []),
                    { label: 'Molecular Weight', value: product.mw && product.mw !== "N/A" ? (product.mw.includes('g/mol') ? product.mw : `${product.mw} g/mol`) : "N/A" }
                  ].map(pill => (
                    <div key={pill.label} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-sm flex flex-col justify-center">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">{pill.label}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-mono font-medium text-slate-900 dark:text-white truncate">{pill.value}</span>
                        <button
                          onClick={() => copyToClipboard(pill.value, pill.label)}
                          className="text-slate-400 hover:text-orange-600 transition-colors shrink-0 ml-2"
                        >
                          {copied === pill.label ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mr-2 flex items-center">Main Industries:</span>
                {product.industry.map((ind: string) => {
                  const industryObj = INDUSTRIES.find((i: any) => i.name === ind);
                  return industryObj ? (
                    <a key={ind} href={`/industries/${industryObj.slug}`} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-sm text-[11px] font-bold hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 dark:hover:border-orange-700 transition-colors cursor-pointer">{ind}</a>
                  ) : (
                    <span key={ind} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-sm text-[11px] font-bold">{ind}</span>
                  );
                })}
              </div>
            </div>

            {/* Scroll Navigation */}
            <div className="space-y-6">
              <div className="sticky top-[86px] z-40 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex gap-8 overflow-x-auto no-scrollbar pt-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "pb-3 text-[13px] font-semibold transition-all relative whitespace-nowrap",
                      activeSection === section.id ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                    )}
                  >
                    {section.label}
                    {activeSection === section.id && (
                      <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-12">
                {/* Description Section */}
                {product.description && (
                <div id="description" className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 scroll-mt-36">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Description</h3>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
                      {(() => {
                        const desc = product.description || '';
                        const casPattern = `CAS\\s*${product.cas.replace(/[-]/g, '[-\\s]?')}\\s*`;
                        const escapedName = product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const pattern = new RegExp(`(${escapedName}|${casPattern})`, 'gi');
                        const parts = desc.split(pattern);
                        return parts.map((part: string, i: number) =>
                          pattern.test(part)
                            ? <strong key={i} className="font-bold text-slate-800 dark:text-white">{part}</strong>
                            : part
                        );
                      })()}
                    </p>

                    {product.otherNames && product.otherNames !== "N/A" && (
                      <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Other Names (Synonyms)</h4>
                        <p className="text-slate-700 dark:text-slate-300 font-medium text-[13px]">{product.otherNames}</p>
                      </div>
                    )}

                    <h4 className="text-slate-900 dark:text-white font-bold text-lg mt-10 mb-5">Key Technical Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 list-none p-0 text-[13px]">
                      {['High Purity Grade standard', 'Consistent Batch Quality', 'Full Regulatory & REACH Support', 'Global Logistics Network enabled'].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
                          <Check className="w-4 h-4 text-orange-600 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                )}

                {/* Physical Properties Section */}
                {product.physicalProperties && (
                <div id="physical-properties" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 scroll-mt-36 overflow-hidden">
                  <div className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-slate-900 border-b border-orange-200 dark:border-orange-900/40">
                    <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center">
                      <FlaskConical className="w-[18px] h-[18px] text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Physical Properties</h3>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const text = product.physicalProperties || '';
                      if (!text) return <div className="px-8 py-4 text-slate-500">Information not available.</div>;
                      const parts = text.split(';').filter((p: string) => p.trim());
                      return parts.map((part: string, i: number) => {
                        const colonIdx = part.indexOf(':');
                        if (colonIdx > 0) {
                          const label = part.substring(0, colonIdx).trim();
                          const value = part.substring(colonIdx + 1).trim();
                          const iconMap: Record<string, React.ReactNode> = {
                            'Melting Point': <Thermometer className="w-4 h-4 text-orange-500" />,
                            'Boiling Point': <Thermometer className="w-4 h-4 text-red-500" />,
                            'Density': <Droplets className="w-4 h-4 text-blue-500" />,
                            'Water Solubility': <Droplets className="w-4 h-4 text-cyan-500" />,
                          };
                          const icon = iconMap[label] || <Atom className="w-4 h-4 text-slate-400 dark:text-slate-500" />;
                          return (
                            <div key={i} className={`flex items-center gap-4 px-8 py-3.5 ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/70 dark:bg-slate-800/30'} hover:bg-orange-50/40 dark:hover:bg-orange-950/10 transition-colors`}>
                              <span className="shrink-0">{icon}</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[160px] text-sm">{label}</span>
                              <span className="text-slate-900 dark:text-white text-sm font-medium">{value}</span>
                            </div>
                          );
                        }
                        return <div key={i} className="px-8 py-3.5 text-slate-600 dark:text-slate-400 text-sm">{part.trim()}</div>;
                      });
                    })()}
                  </div>
                </div>
                )}

                {/* Safety & Handling Section */}
                {product.safetyHandling && (
                <div id="safety-handling" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 scroll-mt-36 overflow-hidden">
                  <div className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-slate-900 border-b border-orange-200 dark:border-orange-900/40">
                    <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center">
                      <AlertTriangle className="w-[18px] h-[18px] text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Safety & Handling</h3>
                  </div>
                  {(() => {
                    const text = (product.safetyHandling || '').trim();
                    if (!text) return <div className="px-8 py-6 text-slate-500">Information not available.</div>;

                    // Parse signal word
                    let signalWord: string | null = null;
                    let rest = text;
                    const swMatch = text.match(/^(Danger|Warning)\s/);
                    if (swMatch) { signalWord = swMatch[1]; rest = text.substring(swMatch[0].length); }

                    // Parse GHS codes (before Hazard Statements)
                    const ghsCodes: string[] = [];
                    const hazardIdx = rest.indexOf('Hazard Statements');
                    const preHazard = hazardIdx >= 0 ? rest.substring(0, hazardIdx) : rest;
                    let gm: RegExpExecArray | null;
                    const ghsRe = /GHS(\d{2})/g;
                    while ((gm = ghsRe.exec(preHazard)) !== null) ghsCodes.push('GHS' + gm[1]);

                    // Parse Hazard Statements
                    const hazardStatements: { code: string; desc: string }[] = [];
                    const hSection = rest.match(/Hazard Statements\s*([\s\S]*?)(?=Precautionary Statements|$)/);
                    if (hSection) {
                      hSection[1].trim().split(/(?=H\d{3}\s)/).forEach((part: string) => {
                        const m = part.match(/^(H\d{3})\s+([\s\S]*)/);
                        if (m) hazardStatements.push({ code: m[1], desc: m[2].trim().replace(/\[.*?\]/g, '').replace(/;\s*$/, '').trim() });
                      });
                    }

                    // Parse Precautionary Statements
                    const precStatements: { code: string; desc: string }[] = [];
                    const pSection = rest.match(/Precautionary Statements\s*([\s\S]*?)$/);
                    if (pSection) {
                      pSection[1].trim().split(/(?=P\d{3})/).forEach((part: string) => {
                        const m = part.match(/^(P\d{3}(?:\+P\d{3})*)\s+([\s\S]*)/);
                        if (m) precStatements.push({ code: m[1], desc: m[2].trim().replace(/\[.*?\]/g, '').replace(/;\s*$/, '').trim() });
                      });
                    }

                    const isDanger = signalWord === 'Danger';

                    // GHS code to description map
                    const ghsNames: Record<string, string> = {
                      'GHS01': 'Explosive', 'GHS02': 'Flammable', 'GHS03': 'Oxidizer',
                      'GHS04': 'Compressed Gas', 'GHS05': 'Corrosive', 'GHS06': 'Toxic',
                      'GHS07': 'Irritant', 'GHS08': 'Health Hazard', 'GHS09': 'Environment',
                    };

                    return (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Signal Word + GHS Row */}
                        {(signalWord || ghsCodes.length > 0) && (
                          <div className="px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                            {signalWord && (
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider ${isDanger ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'}`}>
                                <AlertTriangle className="w-4 h-4" />
                                {signalWord}
                              </div>
                            )}
                            {ghsCodes.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {ghsCodes.map((code, i) => (
                                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-xs font-semibold text-orange-700 dark:text-orange-400">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    {code}
                                    <span className="text-orange-500 dark:text-orange-500 font-normal">· {ghsNames[code] || 'Hazard'}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Hazard Statements */}
                        {hazardStatements.length > 0 && (
                          <div className="px-6 sm:px-8 py-5">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <h4 className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Hazard Statements</h4>
                            </div>
                            <div className="grid gap-1.5">
                              {hazardStatements.map((h, i) => (
                                <div key={i} className={`flex items-start gap-3 px-4 py-2.5 rounded-lg ${i % 2 === 0 ? 'bg-red-50/50 dark:bg-red-950/10' : 'bg-white dark:bg-slate-900'}`}>
                                  <span className="shrink-0 mt-0.5 inline-flex items-center justify-center min-w-[52px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-mono font-bold">
                                    {h.code}
                                  </span>
                                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{h.desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Precautionary Statements */}
                        {precStatements.length > 0 && (
                          <div className="px-6 sm:px-8 py-5">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <h4 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Precautionary Statements</h4>
                            </div>
                            <div className="grid gap-1.5">
                              {precStatements.map((p, i) => (
                                <div key={i} className={`flex items-start gap-3 px-4 py-2.5 rounded-lg ${i % 2 === 0 ? 'bg-blue-50/40 dark:bg-blue-950/10' : 'bg-white dark:bg-slate-900'}`}>
                                  <span className="shrink-0 mt-0.5 inline-flex items-center justify-center min-w-[52px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold">
                                    {p.code}
                                  </span>
                                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{p.desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                )}

                {/* Trade & Regulatory Section */}
                {product.tradeRegulatory && (
                <div id="trade-regulatory" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 scroll-mt-36 overflow-hidden">
                  <div className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-slate-900 border-b border-orange-200 dark:border-orange-900/40">
                    <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center">
                      <Scale className="w-[18px] h-[18px] text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trade & Regulatory</h3>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const text = product.tradeRegulatory || '';
                      if (!text) return <div className="px-8 py-4 text-slate-500">Information not available.</div>;
                      const parts = text.split(';').filter((p: string) => p.trim());
                      return parts.map((part: string, i: number) => {
                        const colonIdx = part.indexOf(':');
                        if (colonIdx > 0) {
                          const label = part.substring(0, colonIdx).trim();
                          const value = part.substring(colonIdx + 1).trim();
                          const isHSCode = label.includes('HS Code') || label.includes('Tariff');
                          const isStorage = label.includes('Storage');
                          const isWGK = label.includes('WGK');
                          return (
                            <div key={i} className={`flex items-center gap-4 px-8 py-3.5 ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/70 dark:bg-slate-800/30'} hover:bg-orange-50/40 dark:hover:bg-orange-950/10 transition-colors`}>
                              <span className="shrink-0">
                                <Scale className="w-4 h-4 text-orange-500" />
                              </span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[160px] text-sm">{label}</span>
                              <span className="text-sm font-medium">
                                {isHSCode ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-mono">{value}</span>
                                ) : isStorage ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800">{value}</span>
                                ) : isWGK ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{value}</span>
                                ) : (
                                  <span className="text-slate-900 dark:text-white">{value}</span>
                                )}
                              </span>
                            </div>
                          );
                        }
                        return <div key={i} className="px-8 py-3.5 text-slate-600 dark:text-slate-400 text-sm">{part.trim()}</div>;
                      });
                    })()}
                  </div>
                </div>
                )}

                {/* Similar Products Section */}
                {resolvedSimilarProducts && resolvedSimilarProducts.length > 0 && (
                <div id="similar-products" className="bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 scroll-mt-36">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Related Products</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {resolvedSimilarProducts.map((similarProduct) => (
                        <a
                          key={similarProduct.id}
                          href={`/products/${similarProduct.slug}`}
                          className="group rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-2 hover:border-orange-400 hover:bg-orange-50/40 dark:hover:bg-orange-500/5 transition-all"
                        >
                          <p className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug line-clamp-1">{similarProduct.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                            CAS {similarProduct.cas}{similarProduct.ec && similarProduct.ec !== "N/A" ? `, EC ${similarProduct.ec}` : ''}
                          </p>
                        </a>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* RFQ Card */}
              <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="group relative w-full overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 text-white h-14 font-bold text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 rounded-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    <span className="relative">Request Quote (RFQ)</span>
                  </button>
                  <p className="text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Fast Response - Competitive Pricing
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Lead Time</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{product.leadTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Packing</span>
                    <span className="text-slate-900 dark:text-white font-semibold line-clamp-1 text-right">{product.packing[0]}</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Volume Pricing Guidelines</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[13px] border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="text-slate-600 dark:text-slate-400 font-mono">25-500 kg</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Base pricing</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-slate-600 dark:text-slate-400 font-mono">&gt; 500 kg</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">Custom quote</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 space-y-5">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technical Support</h5>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold rounded-sm">
                    SC
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 dark:text-white">SoleChem</p>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-widest mt-0.5">Sector Specialist</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href="tel:+390230556150" className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm p-2 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700">
                    <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </a>
                  <a href="mailto:info@solechem.eu" className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm p-2 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700">
                    <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </a>
                  <a href="https://wa.me/390230556150" target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm p-2 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700">
                    <MessageCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={product}
      />

      {/* Mobile Fixed Bottom RFQ Bar - hidden when modal is open */}
      {!isQuoteModalOpen && (
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-3 safe-bottom">
        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white h-12 font-bold text-[12px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded-sm shadow-lg shadow-orange-500/25"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <ArrowRight className="w-4 h-4" />
          <span className="relative">Request Quote (RFQ)</span>
        </button>
      </div>
      )}
    </div>
  );
}
