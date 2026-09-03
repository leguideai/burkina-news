'use client';

import { useState } from 'react';
import { AlertCircle, Send, MapPin, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPageEn() {
  const [errorForm, setErrorForm] = useState({ url: '', desc: '', source: '', email: '' });
  const [genForm, setGenForm] = useState({ name: '', email: '', category: 'question', message: '' });
  
  const [errorStatus, setErrorStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [genStatus, setGenStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [genMessage, setGenMessage] = useState('');

  const handleErrorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error_report',
          ...errorForm
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit report');

      setErrorStatus('success');
      setErrorForm({ url: '', desc: '', source: '', email: '' });
    } catch (err: any) {
      setErrorStatus('error');
      setErrorMessage(err.message || 'An error occurred while submitting your report.');
    }
  };

  const handleGenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenStatus('submitting');
    setGenMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general',
          ...genForm
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setGenStatus('success');
      setGenForm({ name: '', email: '', category: 'question', message: '' });
    } catch (err: any) {
      setGenStatus('error');
      setGenMessage(err.message || 'An error occurred while sending your message.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Contact & Feedback</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
              Dialogue & Right of Rectification
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-3">
              Contact the Newsroom
            </h1>
            <p className="text-sm sm:text-base font-serif text-[#555555] max-w-2xl leading-relaxed">
              To submit an official primary document, provide on-site precision on a Tracker project, or reach our editorial desk.
            </p>
          </div>

        </div>
      </header>

      {/* Main Forms Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* Form 1: Error Reporting (Top priority) */}
            <section className="bg-white border-2 border-[#141414] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
                <AlertCircle size={14} />
                <span>Priority Channel</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#141414] mb-2">
                Report an Error or Provide a Source
              </h2>
              <p className="text-xs sm:text-sm font-serif text-[#555555] leading-relaxed mb-6">
                If you notice a factual discrepancy in an investigation or in a Tracker file, submit the contradictory primary source. Any substantiated correction is logged in our <Link href="/en/corrections" className="text-[#0b4627] font-bold underline">Correction Registry</Link>.
              </p>

              {errorStatus === 'success' ? (
                <div className="bg-[#f0fdf4] border border-green-300 p-4 text-xs font-serif text-[#0b4627] flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Your report has been forwarded to the editorial committee. It will be reviewed within 48 hours.</span>
                </div>
              ) : (
                <form onSubmit={handleErrorSubmit} className="space-y-4 text-xs font-serif">
                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      URL or Title of the Article / Project File *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. /en/tracker/projets/centrale-solaire-koudougou"
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" 
                      value={errorForm.url} 
                      onChange={e => setErrorForm({...errorForm, url: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      Precise Description of the Factual Issue *
                    </label>
                    <textarea 
                      required 
                      rows={3} 
                      placeholder="Describe the discrepancy, figure, or statement in question..."
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" 
                      value={errorForm.desc} 
                      onChange={e => setErrorForm({...errorForm, desc: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      Contradictory Primary Source *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Name and reference of official document, decree, or auditable report..."
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" 
                      value={errorForm.source} 
                      onChange={e => setErrorForm({...errorForm, source: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      Your Email (for follow-up and confirmation) *
                    </label>
                    <input 
                      required 
                      type="email" 
                      placeholder="name@organization.com"
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" 
                      value={errorForm.email} 
                      onChange={e => setErrorForm({...errorForm, email: e.target.value})} 
                    />
                  </div>

                  {errorStatus === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={errorStatus === 'submitting'} 
                    className="px-6 py-2.5 bg-[#0b4627] hover:bg-[#072e1a] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <Send size={12} />
                    {errorStatus === 'submitting' ? 'Submitting...' : 'Submit Report'}
                  </button>
                </form>
              )}
            </section>

            {/* Form 2: General Contact */}
            <section className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <h2 className="text-xl font-bold font-serif text-[#141414] mb-4 pb-2 border-b border-[#e6dfd5]">
                General Inquiries & Partnerships
              </h2>

              {genStatus === 'success' ? (
                <div className="bg-[#f0fdf4] border border-green-300 p-4 text-xs font-serif text-[#0b4627] flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Your message has been sent successfully.</span>
                </div>
              ) : (
                <form onSubmit={handleGenSubmit} className="space-y-4 text-xs font-serif">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">Name / Organization *</label>
                      <input required type="text" className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" value={genForm.name} onChange={e => setGenForm({...genForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">Email *</label>
                      <input required type="email" className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" value={genForm.email} onChange={e => setGenForm({...genForm, email: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">Purpose of Inquiry *</label>
                    <select required className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" value={genForm.category} onChange={e => setGenForm({...genForm, category: e.target.value})}>
                      <option value="question">Question for the Newsroom</option>
                      <option value="partenariat">Academic or Institutional Partnership</option>
                      <option value="presse">Press / Media Request</option>
                      <option value="autre">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">Message *</label>
                    <textarea required rows={4} className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" value={genForm.message} onChange={e => setGenForm({...genForm, message: e.target.value})} />
                  </div>

                  {genStatus === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                      {genMessage}
                    </div>
                  )}

                  <button type="submit" disabled={genStatus === 'submitting'} className="px-6 py-2.5 bg-[#141414] hover:bg-[#0b4627] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2">
                    <Send size={12} />
                    {genStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </section>

          </div>

          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-[#141414] p-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-4 border-b border-[#141414]">
                Offices & Correspondence
              </h3>

              <div className="space-y-4 text-xs font-serif text-[#333333]">
                <div className="flex gap-3 items-start">
                  <MapPin size={16} className="text-[#0b4627] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#141414]">Bobo-Dioulasso Desk</strong>
                    <span className="text-[#555555]">Hauts-Bassins, Burkina Faso</span>
                    <span className="text-[11px] text-[#737373] block mt-0.5">Field investigations & western economic basin</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <MapPin size={16} className="text-[#0b4627] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#141414]">Ouagadougou Desk</strong>
                    <span className="text-[#555555]">Centre, Burkina Faso</span>
                    <span className="text-[11px] text-[#737373] block mt-0.5">Institutions, ministerial decrees & data records</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start pt-2 border-t border-[#e6dfd5]">
                  <Mail size={16} className="text-[#0b4627] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#141414]">Encrypted Channel</strong>
                    <span className="text-[#555555] font-mono text-[11px]">redaction@burkina-news.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f4eee3] border border-[#e6dfd5] p-5">
              <span className="font-mono text-[10px] uppercase text-[#737373] block mb-0.5">Source Protection</span>
              <h4 className="font-serif font-bold text-sm text-[#141414] mb-2">Confidentiality Guarantee</h4>
              <p className="text-xs font-serif text-[#555555] leading-relaxed">
                Burkina News strictly protects sources who transmit non-public documentary audits or regulatory decrees. Encrypted communication available upon request.
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
