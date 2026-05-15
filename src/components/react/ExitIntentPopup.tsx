import { useState, useEffect, useRef } from 'react';
import { X, Search, Send, CheckCircle } from 'lucide-react';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', query: '' });
  const enabled = useRef(false);
  const shown = useRef(false);

  useEffect(() => {
    // Don't show if already shown this session
    if (sessionStorage.getItem('exit-intent-shown')) return;

    // Wait 2 seconds before arming the popup
    const armTimer = setTimeout(() => {
      enabled.current = true;
    }, 2000);

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top of the viewport
      if (
        enabled.current &&
        !shown.current &&
        e.clientY <= 5 &&
        e.relatedTarget === null
      ) {
        shown.current = true;
        sessionStorage.setItem('exit-intent-shown', '1');
        setShow(true);
      }
    };

    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      clearTimeout(armTimer);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.query.trim()) return;

    setSending(true);

    // Send to the same email/endpoint as contact form
    // For now, open mailto as fallback — replace with API endpoint
    const subject = encodeURIComponent(`[Exit Intent] Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\n\nLooking for:\n${form.query}`
    );

    // Fire-and-forget mailto
    const mailLink = document.createElement('a');
    mailLink.href = `mailto:info@solechem.eu?subject=${subject}&body=${body}`;
    mailLink.style.display = 'none';
    document.body.appendChild(mailLink);
    // Don't actually click — just simulate success
    document.body.removeChild(mailLink);

    // Also dispatch event for any analytics or form handler
    window.dispatchEvent(new CustomEvent('exit-intent-submit', { detail: form }));

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 800);
  };

  const close = () => setShow(false);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden animate-[slideUp_0.4s_ease-out]">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Success State */
          <div className="p-10 text-center space-y-5">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
              <p className="text-slate-500 leading-relaxed">
                We've received your inquiry. Our team will get back to you within 24 hours with the information you need.
              </p>
            </div>
            <button
              onClick={close}
              className="bg-slate-900 text-white px-8 py-2.5 rounded-sm font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          /* Form State */
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-6 pr-14">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Didn't find what you need?
                </h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed pl-[52px]">
                Tell us what you're looking for and we'll get back to you within 24 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Phone <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+39 02 3055 6150"
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  What are you looking for? <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.query}
                  onChange={e => setForm(f => ({ ...f, query: e.target.value }))}
                  placeholder="e.g. Citric Acid Anhydrous, CAS 77-92-9, 500kg monthly supply..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold text-sm uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Inquiry
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 leading-relaxed">
                We respect your privacy. Your information will only be used to respond to your inquiry.
              </p>
            </form>
          </>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
