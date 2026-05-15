import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Building2, User, Mail, Phone, Package, FileText, Globe, DollarSign, Target, Truck, FlaskConical } from 'lucide-react';
import type { Product } from '@/types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export default function QuoteModal({ isOpen, onClose, product }: QuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      alert("Error: Web3Forms access key not found (PUBLIC_WEB3FORMS_ACCESS_KEY).");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New B2B Quote Request: ${product?.name || "General"}`,
          from_name: "SoleChem Quote System",
          "Product Requested": product ? `${product.name} (CAS: ${product.cas})` : "General request",
          "Full Name": data.fullName,
          "Work Email": data.email,
          "Company": data.company,
          "Phone": data.phone || "Not provided",
          "Country": data.country,
          "Quantity": `${data.quantity} ${data.unit}`,
          "Target Price": data.targetPrice || "Not provided",
          "Application/Industry": data.application || "Not provided",
          "Incoterms": data.incoterms || "Not provided",
          "Additional Requirements": data.requirements || "None",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2500);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-sm shadow-2xl w-full max-w-4xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] border border-slate-200"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between shrink-0 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Request a Quote</h2>
                  {product ? (
                    <div className="mt-2 space-y-2">
                      <h3 className="text-[15px] font-bold text-orange-600 flex items-center gap-1.5">
                        <FlaskConical className="w-4 h-4" />
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-sm text-slate-600 uppercase tracking-widest">CAS: {product.cas}</span>
                        {product.ec && <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-sm text-slate-600 uppercase tracking-widest">EC: {product.ec}</span>}
                        {product.formula && product.formula !== 'N/A' && <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-sm text-slate-600 uppercase tracking-widest">Formula: {product.formula}</span>}
                        {product.mw && product.mw !== 'N/A' && <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-sm text-slate-600 uppercase tracking-widest">MW: {product.mw}</span>}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-slate-500 font-medium mt-1">Fill out the form below and our team will get back to you within 24 hours.</p>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-sm bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3">Quote Requested!</h3>
                    <p className="text-slate-500 text-lg max-w-md">
                      Thank you for your interest. Our sales team will get back to you with a customized quote within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form id="quote-form" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Personal Info */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <User className="w-4 h-4 text-orange-600" />
                          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em]">Contact Details</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Full Name *</label>
                            <input required name="fullName" type="text" className="w-full h-10 px-3 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Work Email *</label>
                            <input required name="email" type="email" className="w-full h-10 px-3 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors" placeholder="john@company.com" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Company Name *</label>
                          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-sm focus-within:border-orange-500 focus-within:bg-white transition-colors">
                            <Building2 className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                            <input required name="company" type="text" className="w-full h-10 pl-3 pr-3 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none" placeholder="Acme Corp" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Phone Number</label>
                            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-sm focus-within:border-orange-500 focus-within:bg-white transition-colors">
                              <Phone className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                              <input type="tel" name="phone" className="w-full h-10 pl-3 pr-3 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none" placeholder="+1 (555) 000-0000" />
                            </div>
                          </div>
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Country / Region *</label>
                            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-sm focus-within:border-orange-500 focus-within:bg-white transition-colors">
                              <Globe className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                              <select required name="country" className="w-full h-10 pl-3 pr-3 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none appearance-none">
                                <option value="">Select Country</option>
                                <option value="US">United States</option>
                                <option value="GB">United Kingdom</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                                <option value="IT">Italy</option>
                                <option value="ES">Spain</option>
                                <option value="AE">United Arab Emirates</option>
                                <option value="SA">Saudi Arabia</option>
                                <option value="OTHER">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <Package className="w-4 h-4 text-orange-600" />
                          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em]">Request Details</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Estimated Quantity *</label>
                            <div className="flex gap-2">
                              <input required name="quantity" type="number" min="1" className="w-full h-10 px-3 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g. 1000" />
                              <select name="unit" className="h-10 px-2 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white text-[13px] text-slate-900 focus:outline-none focus:border-orange-500 transition-colors w-20 shrink-0">
                                <option>kg</option>
                                <option>MT</option>
                                <option>L</option>
                                <option>drums</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Target Price (Optional)</label>
                            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-sm focus-within:border-orange-500 focus-within:bg-white transition-colors">
                              <DollarSign className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                              <input type="text" name="targetPrice" className="w-full h-10 pl-3 pr-3 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none" placeholder="e.g. 2.50 / kg" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Application / Industry</label>
                            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-sm focus-within:border-orange-500 focus-within:bg-white transition-colors">
                              <Target className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                              <input type="text" name="application" className="w-full h-10 pl-3 pr-3 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none" placeholder="e.g. Cosmetics" />
                            </div>
                          </div>
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Incoterms / Delivery</label>
                            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-sm focus-within:border-orange-500 focus-within:bg-white transition-colors">
                              <Truck className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                              <select name="incoterms" className="w-full h-10 pl-3 pr-3 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none appearance-none">
                                <option value="">Select Term</option>
                                <option value="EXW">EXW (Ex Works)</option>
                                <option value="FOB">FOB (Free on Board)</option>
                                <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                                <option value="DAP">DAP (Delivered at Place)</option>
                                <option value="DDP">DDP (Delivered Duty Paid)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400" /> Additional Requirements
                          </label>
                          <textarea 
                            name="requirements"
                            className="w-full p-3 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors resize-none h-[100px]" 
                            placeholder="Please specify any specific grades, compliance requirements (e.g., REACH, GMP), or delivery terms..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Footer */}
              {!isSuccess && (
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-sm font-semibold text-[13px] uppercase tracking-widest text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    form="quote-form"
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-sm font-semibold text-[13px] uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Request <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
