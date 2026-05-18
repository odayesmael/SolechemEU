import { useState } from 'react';
import { Send, Loader2, CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      alert('Email service access key is missing.');
      setIsSubmitting(false);
      return;
    }

    try {
      const interestTypes = Array.from(
        e.currentTarget.querySelectorAll('input[type="checkbox"][name="interestType"]:checked')
      ).map(cb => (cb as HTMLInputElement).value).join(', ');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New B2B General Contact',
          from_name: 'SoleChem Contact System',
          'Full Name': data.fullName,
          'Job Title': data.jobTitle,
          'Company': data.company,
          'Email': data.email,
          'Phone': data.phone || 'Not provided',
          'Interest Area': interestTypes || 'Not provided',
          'Message': data.message || 'None',
          'NDA Requested': data.ndaRequest ? 'Yes' : 'No',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('An error occurred while submitting the request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-sm border border-orange-100 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Enquiry Received</h3>
        <p className="text-[15px] text-slate-600 max-w-md mx-auto font-medium">
          Thank you for your inquiry. A technical specialist from our Milan office will review your requirements and contact you within 4 business hours.
        </p>
        <button onClick={() => setIsSubmitted(false)} className="text-[13px] font-bold text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-6">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Full Name*</label>
            <input required name="fullName" type="text" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-sm px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Job Title*</label>
            <input required name="jobTitle" type="text" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-sm px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Procurement Manager" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Company Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Company Name*</label>
            <input required name="company" type="text" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-sm px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Acme Corp S.r.l." />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Business Email*</label>
            <input required type="email" name="email" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-sm px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="john@acme.com" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Phone</label>
            <input type="tel" name="phone" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-sm px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="+39 ..." />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Enquiry Details</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Enquiry Type</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['RFQ / Pricing', 'Custom Formulation', 'Supply Agreement', 'Toll Manufacturing', 'Sample Request'].map(type => (
                <label key={type} className="cursor-pointer group">
                  <input type="checkbox" name="interestType" value={type} className="hidden peer" />
                  <span className="px-3 py-2 rounded-sm border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-widest peer-checked:bg-orange-50 peer-checked:border-orange-600 peer-checked:text-orange-600 group-hover:border-slate-300 transition-all block">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Message</label>
            <textarea rows={4} name="message" className="w-full bg-slate-50 border border-slate-200 rounded-sm p-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all min-h-[120px]" placeholder="Describe requirements: product, CAS, quantity, purity grade, application, Incoterms..." />
          </div>
        </div>
      </div>

      <div className="p-4 bg-orange-50/50 rounded-sm border border-orange-100 flex items-start gap-3">
        <input type="checkbox" name="ndaRequest" className="mt-1 w-4 h-4 rounded-sm border-slate-300 text-orange-600 focus:ring-orange-500" />
        <div>
          <p className="text-[13px] font-bold text-slate-900">Request an NDA before sharing details</p>
          <p className="text-[12px] text-slate-600 font-medium">We'll send a mutual NDA within 4 business hours for confidential projects.</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input required type="checkbox" name="privacyPolicy" className="mt-1 w-4 h-4 rounded-sm border-slate-300 text-orange-600 focus:ring-orange-500" />
        <label className="text-[13px] text-slate-600 font-medium">
          I have agreed to the <a href="/privacy-policy" target="_blank" className="text-orange-600 hover:text-orange-700 underline">Privacy Policy</a>
        </label>
      </div>

      <button
        disabled={isSubmitting}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 rounded-sm font-semibold text-[13px] uppercase tracking-widest transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit B2B Enquiry'}
      </button>

      <div className="flex justify-center gap-x-6 gap-y-2 flex-wrap">
        <span className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5" /> GDPR Compliant</span>
        <span className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> 24h Response</span>
        <span className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest"><Award className="w-3.5 h-3.5" /> ISO 9001</span>
      </div>
    </form>
  );
}
