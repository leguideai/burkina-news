"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Download, 
  Search, 
  Plus, 
  Check, 
  X, 
  Calendar, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Sparkles,
  Copy,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';

interface Subscriber {
  email: string;
  subscribedAt: string;
}

export default function AdminNewsletterPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal to Add Subscriber
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les abonnés.');
      const data = await res.json();
      setSubscribers(data.newsletter || []);
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(sub => 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subscribers, searchTerm]);

  // Export to CSV
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [newsletterDraft, setNewsletterDraft] = useState<any>(null);

  const handleGenerateDraft = async () => {
    try {
      setDraftLoading(true);
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_newsletter', payload: {} })
      });
      if (!res.ok) throw new Error('Erreur lors de la génération de la lettre.');
      const json = await res.json();
      if (json.data) {
        setNewsletterDraft(json.data);
        setIsDraftModalOpen(true);
        success('Lettre rédigée par Micum', 'Le brouillon de la lettre d\'information a été composé avec succès.');
      }
    } catch (err: any) {
      error('Erreur Micum', err.message || 'Impossible de générer la lettre.');
    } finally {
      setDraftLoading(false);
    }
  };
  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      warning('Aucun abonné', 'La liste des abonnés est vide.');
      return;
    }

    const headers = ['Email', 'Date d\'inscription'];
    const rows = subscribers.map(s => [
      s.email,
      new Date(s.subscribedAt).toISOString()
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `burkina_news_abonnes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Export CSV généré', `${subscribers.length} adresses téléchargées.`);
  };

  // Add subscriber
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      warning('Email invalide', 'Veuillez saisir une adresse email correcte.');
      return;
    }

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur d\'inscription.');

      success('Abonné ajouté', `L'adresse ${newEmail} a été inscrite à la lettre hebdomadaire.`);
      setNewEmail('');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#087443] font-bold uppercase tracking-wider">
            <Mail size={15} />
            <span>Audience & Diffusion Hebdomadaire</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Abonnés à la Lettre d'Information
          </h1>
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Base des abonnés recevant chaque dimanche les 10 faits du Fil et le Grand Décryptage mensuel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Tooltip position="bottom" content="Micum génère la lettre hebdomadaire à partir des faits du Fil et de la Une">
            <button
              onClick={handleGenerateDraft}
              disabled={draftLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-mono text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {draftLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Micum rédige...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-amber-300 animate-pulse" />
                  <span>✨ Rédiger la Lettre</span>
                </>
              )}
            </button>
          </Tooltip>

          <Tooltip position="bottom" content="Exporter toute la base des abonnés au format CSV">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors"
              aria-label="Exporter en CSV"
            >
              <Download size={14} />
              Exporter en CSV
            </button>
          </Tooltip>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            Ajouter un Abonné
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <SkeletonStat count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Total Abonnés</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">{subscribers.length}</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Base active qualifiée</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Fréquence d'Envoi</div>
            <div className="text-2xl font-mono font-bold text-[#d97706] mt-1">Chaque dimanche</div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Édition dominicale 08h00</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Profil Lecteurs</div>
            <div className="text-2xl font-mono font-bold text-[#1e3a5f] mt-1">Institutionnels & Citoyens</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Chercheurs, bailleurs, diaspora</div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-[#e6dfd5] p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#736c62]" />
          <input
            type="text"
            placeholder="Rechercher une adresse email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] bg-[#faf8f5]"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736c62] hover:text-[#141414]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-[#736c62] shrink-0">
          {filteredSubscribers.length} adresse{filteredSubscribers.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Subscribers Table */}
      {loading ? (
        <SkeletonTable rows={6} columns={3} />
      ) : filteredSubscribers.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-[#736c62] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Aucun abonné trouvé</div>
          <p className="text-xs font-mono text-[#736c62] mt-1">
            Aucune adresse ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#e6dfd5] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase tracking-wider text-[#736c62]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Adresse Email</th>
                <th className="py-3 px-4">Date d'inscription</th>
                <th className="py-3 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd5] text-xs font-mono">
              {filteredSubscribers.map((sub, idx) => (
                <tr key={sub.email} className="hover:bg-[#faf8f5]/80 transition-colors">
                  <td className="py-3 px-4 text-[#736c62] font-bold">
                    {idx + 1}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#141414]">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#087443]" />
                      <span>{sub.email}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#5a554e]">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#736c62]" />
                      <span>
                        {sub.subscribedAt 
                          ? new Date(sub.subscribedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'Récemment'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#087443] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check size={11} /> Actif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Add Subscriber Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white border-t sm:border border-[#141414] rounded-t-xl sm:rounded-none max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  Diffusion Directe
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  Inscrire un abonné
                </h3>
              </div>
              <Tooltip position="left" content="Fermer la boîte de dialogue">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#736c62] hover:text-[#141414]"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </Tooltip>
            </div>

            <form onSubmit={handleAddSubscriber} className="p-5 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nom@organisation.bf"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                />
              </div>

              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] rounded cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] cursor-pointer"
                >
                  <Check size={14} />
                  Valider l'inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Micum Generated Newsletter Draft Modal */}
      {isDraftModalOpen && newsletterDraft && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border-t sm:border border-[#141414] max-w-2xl w-full shadow-2xl overflow-hidden my-0 sm:my-auto rounded-t-xl sm:rounded-xl">
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-gradient-to-r from-[var(--ink)] to-[#0A5C36] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200">
                    Micum · Desk IA
                  </span>
                  <h3 className="font-serif font-bold text-base text-white">
                    Brouillon de la Lettre Hebdomadaire
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs font-mono">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5">
                  Propositions d'Objets d'Email (3 options à fort taux d'ouverture) :
                </span>
                <div className="space-y-1.5">
                  {newsletterDraft.subjectOptions?.map((subj: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="font-semibold text-gray-800">{subj}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(subj);
                          success('Copié', 'Objet d\'email copié dans le presse-papier.');
                        }}
                        className="p-1 text-gray-500 hover:text-emerald-700 cursor-pointer"
                        title="Copier"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5">
                  Texte Intégral de la Lettre :
                </span>
                <textarea
                  rows={10}
                  readOnly
                  value={newsletterDraft.fullText || ''}
                  className="w-full p-3 font-serif text-xs bg-gray-50 border border-gray-200 rounded-lg leading-relaxed text-gray-800 focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(newsletterDraft.fullText || '');
                    success('Lettre copiée', 'Le texte complet a été copié dans le presse-papier.');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Copy size={14} />
                  Copier le texte de la lettre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
