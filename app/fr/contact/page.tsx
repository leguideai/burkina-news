'use client';

import { useState } from 'react';
import { AlertCircle, Send, MapPin, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
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
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi');

      setErrorStatus('success');
      setErrorForm({ url: '', desc: '', source: '', email: '' });
    } catch (err: any) {
      setErrorStatus('error');
      setErrorMessage(err.message || 'Une erreur est survenue lors de l\'envoi.');
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
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi');

      setGenStatus('success');
      setGenForm({ name: '', email: '', category: 'question', message: '' });
    } catch (err: any) {
      setGenStatus('error');
      setGenMessage(err.message || 'Une erreur est survenue lors de l\'envoi.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Contact & Signalement</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
              Dialogue & Droit de Rectification
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-3">
              Contacter la Rédaction
            </h1>
            <p className="text-sm sm:text-base font-serif text-[#555555] max-w-2xl leading-relaxed">
              Pour soumettre un document officiel, apporter une précision sur un chantier du Tracker ou joindre le comité éditorial.
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
                <span>Canal Prioritaire</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#141414] mb-2">
                Signaler une erreur ou apporter une source
              </h2>
              <p className="text-xs sm:text-sm font-serif text-[#555555] leading-relaxed mb-6">
                Si vous constatez une divergence factuelle dans une enquête ou dans une fiche du Tracker, transmettez-nous la source primaire contradictoire. Toute rectification avérée est publiée dans notre <Link href="/fr/corrections" className="text-[#0b4627] font-bold underline">registre des corrections</Link>.
              </p>

              {errorStatus === 'success' ? (
                <div className="bg-[#f0fdf4] border border-green-300 p-4 text-xs font-serif text-[#0b4627] flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Votre signalement a été transmis au comité éditorial. Il sera instruit dans les 48 heures.</span>
                </div>
              ) : (
                <form onSubmit={handleErrorSubmit} className="space-y-4 text-xs font-serif">
                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      URL ou titre de l'article / de la fiche chantier *
                    </label>
                    <input 
                      required 
                      type="text" 
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" 
                      value={errorForm.url} 
                      onChange={e => setErrorForm({...errorForm, url: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      Description précise du point factuel *
                    </label>
                    <textarea 
                      required 
                      rows={3} 
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" 
                      value={errorForm.desc} 
                      onChange={e => setErrorForm({...errorForm, desc: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      Source primaire justifiant la correction *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Lien vers le document officiel, rapport, compte-rendu du Conseil des ministres..." 
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414]" 
                      value={errorForm.source} 
                      onChange={e => setErrorForm({...errorForm, source: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">
                      Votre adresse email (pour suivi confidentiel)
                    </label>
                    <input 
                      type="email" 
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
                    {errorStatus === 'submitting' ? 'Transmission...' : 'Envoyer le signalement'}
                  </button>
                </form>
              )}
            </section>

            {/* Form 2: General Contact */}
            <section className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <h2 className="text-xl font-bold font-serif text-[#141414] mb-4 pb-2 border-b border-[#e6dfd5]">
                Courrier Général & Partenariats
              </h2>

              {genStatus === 'success' ? (
                <div className="bg-[#f0fdf4] border border-green-300 p-4 text-xs font-serif text-[#0b4627] flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Votre message a bien été envoyé.</span>
                </div>
              ) : (
                <form onSubmit={handleGenSubmit} className="space-y-4 text-xs font-serif">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">Nom / Organisation *</label>
                      <input required type="text" className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" value={genForm.name} onChange={e => setGenForm({...genForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">Email *</label>
                      <input required type="email" className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" value={genForm.email} onChange={e => setGenForm({...genForm, email: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] text-[#737373] mb-1">Objet de la demande *</label>
                    <select required className="w-full p-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] focus:outline-none focus:border-[#141414]" value={genForm.category} onChange={e => setGenForm({...genForm, category: e.target.value})}>
                      <option value="question">Question à la rédaction</option>
                      <option value="partenariat">Proposition de partenariat académique ou institutionnel</option>
                      <option value="presse">Demande presse / médias</option>
                      <option value="autre">Autre demande</option>
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
                    {genStatus === 'submitting' ? 'Envoi...' : 'Transmettre le message'}
                  </button>
                </form>
              )}
            </section>

          </div>

          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-[#141414] p-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-4 border-b border-[#141414]">
                Correspondance & Bureaux
              </h3>

              <div className="space-y-4 text-xs font-serif">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#737373] block mb-0.5">Courriel de Rédaction</span>
                  <a href="mailto:contact@burkinanews.bf" className="font-bold text-[#0b4627] hover:underline font-mono">
                    contact@burkinanews.bf
                  </a>
                </div>

                <div className="pt-3 border-t border-[#e6dfd5]">
                  <span className="font-mono text-[10px] uppercase text-[#737373] block mb-0.5">Siège & Ancrage</span>
                  <p className="text-[#141414]">
                    Bobo-Dioulasso & Ouagadougou<br />
                    Burkina Faso
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e6dfd5]">
                  <span className="font-mono text-[10px] uppercase text-[#737373] block mb-0.5">Protection des Sources</span>
                  <p className="text-[11px] text-[#555555] leading-relaxed">
                    Les communications transmises pour transmission de documents confidentiels ou alertes documentaires sont traitées sous le secret déontologique le plus strict.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
