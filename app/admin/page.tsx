"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Construction, 
  TrendingUp, 
  AlertCircle, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AuthGuard';
import { SkeletonStat, SkeletonTable } from '@/components/admin/Skeleton';
import { PROJECT_STATUS_ORDER, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/data/types';
import { normalizeRoleCode } from '@/lib/api';

export default function AdminOverviewPage() {
  const { user } = useAdminAuth();
  const roleCode = normalizeRoleCode(user?.role || '');
  const canManageRubriques = roleCode === 'superadmin' || roleCode === 'editorial_director';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/data');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error('Error fetching admin data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse" />
        <SkeletonStat count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonTable rows={4} columns={3} />
          <SkeletonTable rows={4} columns={3} />
        </div>
      </div>
    );
  }

  const articlesCount = data?.articles?.length || 0;
  const projectsCount = data?.projects?.length || 0;
  const indicatorsCount = data?.indicators?.length || 0;
  const contactsCount = data?.contacts?.length || 0;
  const unreadReportsCount = data?.contacts?.filter((c: any) => c.type === 'error_report')?.length || 0;
  const newsletterCount = data?.newsletter?.length || 0;

  // Status breakdown of projects
  const statusCounts = PROJECT_STATUS_ORDER.reduce((acc, st) => {
    acc[st] = data?.projects?.filter((p: any) => p.currentStatus === st)?.length || 0;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      
      {/* 1. Welcoming Hero Strip */}
      <div className="bg-white border-2 border-[#141414] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#0b4627] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0b4627]" />
            <span>Desk de Rédaction Actif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#141414]">
            Bonjour, {user?.name || 'User'} ! <span className="text-[#0b4627]">Bienvenue sur le Desk</span>
          </h1>
          <p className="text-xs sm:text-xs font-serif text-[#555555] mt-1 max-w-2xl">
            Gestion intégrale des contenus, des chantiers du Tracker, des indicateurs et des signalements de la communauté.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/articles?nouveau=1"
            className="px-3.5 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            <span>Rédiger enquête</span>
          </Link>
          <Link
            href="/admin/projets?nouveau=1"
            className="px-3.5 py-2 border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Construction size={14} />
            <span>Nouveau chantier</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1 : Articles */}
        <Link href="/admin/articles" className="bg-white border border-[#e6dfd5] p-5 hover:border-[#141414] transition-all group">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#737373] mb-2">
            <span>Enquêtes & Analyses</span>
            <FileText size={16} className="text-[#0b4627]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#141414] group-hover:text-[#0b4627] transition-colors">
            {articlesCount}
          </div>
          <div className="text-[11px] font-serif text-[#555555] mt-1 flex justify-between">
            <span>Toutes rubriques confondues</span>
            <span className="text-[#0b4627] font-semibold font-mono">Gérer →</span>
          </div>
        </Link>

        {/* Metric 2 : Tracker */}
        <Link href="/admin/projets" className="bg-white border border-[#e6dfd5] p-5 hover:border-[#141414] transition-all group">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#737373] mb-2">
            <span>Tracker des Chantiers</span>
            <Construction size={16} className="text-[#c2410c]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#141414] group-hover:text-[#0b4627] transition-colors">
            {projectsCount} <span className="text-xs font-normal text-[#737373]">/ 60 cibles</span>
          </div>
          <div className="text-[11px] font-serif text-[#555555] mt-1 flex justify-between">
            <span>Traçabilité & 6 statuts</span>
            <span className="text-[#0b4627] font-semibold font-mono">Auditer →</span>
          </div>
        </Link>

        {/* Metric 3 : Baromètre RELANCE */}
        <Link href="/admin/indicateurs" className="bg-white border border-[#e6dfd5] p-5 hover:border-[#141414] transition-all group">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#737373] mb-2">
            <span>Baromètre RELANCE</span>
            <TrendingUp size={16} className="text-[#0b4627]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#141414] group-hover:text-[#0b4627] transition-colors">
            {indicatorsCount} <span className="text-xs font-normal text-[#737373]">indicateurs</span>
          </div>
          <div className="text-[11px] font-serif text-[#555555] mt-1 flex justify-between">
            <span>PND 2026–2030</span>
            <span className="text-[#0b4627] font-semibold font-mono">Mettre à jour →</span>
          </div>
        </Link>

        {/* Metric 4 : Signalements & Newsletter */}
        <Link href="/admin/signalements" className="bg-white border border-[#e6dfd5] p-5 hover:border-[#141414] transition-all group">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#737373] mb-2">
            <span>Signalements & Corrections</span>
            <AlertCircle size={16} className="text-red-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-red-700">
            {unreadReportsCount} <span className="text-xs font-normal text-[#737373]">en attente</span>
          </div>
          <div className="text-[11px] font-serif text-[#555555] mt-1 flex justify-between">
            <span>{newsletterCount} abonnés newsletter</span>
            <span className="text-[#0b4627] font-semibold font-mono">Traiter →</span>
          </div>
        </Link>

      </div>

      {/* 3. Status Breakdown Strip (The 6 Milestones) */}
      <div className="bg-white border border-[#e6dfd5] p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 mb-5 border-b border-[#e6dfd5]">
          <div>
            <h2 className="font-serif font-bold text-base text-[#141414]">
              Progression des 60 Chantiers du Tracker
            </h2>
            <p className="text-xs font-serif text-[#666666]">
              Répartition par jalon d'exécution vérifié avec source primaire contradictoire.
            </p>
          </div>
          <Link href="/admin/projets" className="text-xs font-mono font-bold text-[#0b4627] hover:underline flex items-center gap-1">
            <span>Gérer tous les chantiers</span>
            <ChevronRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROJECT_STATUS_ORDER.map((st) => {
            const count = statusCounts[st] || 0;
            const color = PROJECT_STATUS_COLORS[st];
            return (
              <div key={st} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-xs">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#737373] mb-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                  <span className="font-bold">{count}</span>
                </div>
                <div className="font-mono text-xs font-bold uppercase text-[#141414] truncate">
                  {PROJECT_STATUS_LABELS[st]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Dashboard Split: Pilotage de la Une & Derniers Signalements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (8) : Pilotage de la Une & Rubriques */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-[#e6dfd5] p-6">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#141414]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#0b4627]" />
                <h3 className="font-serif font-bold text-base text-[#141414]">
                  Pilotage en Direct de la Une (Homepage)
                </h3>
              </div>
              <Link href="/admin/une" className="text-xs font-mono font-bold text-[#0b4627] hover:underline">
                Modifier la composition →
              </Link>
            </div>

            <p className="text-xs font-serif text-[#555555] mb-4">
              Sélectionnez en 1 clic quelle enquête ouvre le journal et personnalisez la citation du mois.
            </p>

            <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] space-y-3">
              <div className="text-[10px] font-mono uppercase text-[#0b4627] font-bold">
                Actuellement en Grand Décryptage (Une) :
              </div>
              <div className="font-serif font-bold text-base text-[#141414]">
                {data?.articles?.find((a: any) => a.id === data?.homepageConfig?.leadArticleId)?.title || 'Enquête d\'ouverture'}
              </div>
              <div className="text-xs font-serif italic text-[#666666]">
                {data?.homepageConfig?.featuredQuote?.quoteFr}
              </div>
            </div>
          </div>

          {/* Quick Access to Rubriques including Histoire */}
          <div className="bg-white border border-[#e6dfd5] p-6">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#141414]">
              <h3 className="font-serif font-bold text-base text-[#141414]">
                {canManageRubriques ? "Gestion des Rubriques Thématiques" : "Architecture des Rubriques Thématiques"}
              </h3>
              <Link href="/admin/rubriques" className="text-xs font-mono font-bold text-[#0b4627] hover:underline">
                {canManageRubriques ? "Gérer les rubriques →" : "Consulter les rubriques →"}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['histoire', 'economie', 'securite', 'chantiers', 'agriculture', 'societe'].map((catCode) => {
                const count = data?.articles?.filter((a: any) => a.category === catCode)?.length || 0;
                const catName = catCode === 'histoire' ? 'Histoire' : catCode === 'economie' ? 'Économie' : catCode === 'securite' ? 'Sécurité' : catCode === 'chantiers' ? 'Chantiers' : catCode === 'agriculture' ? 'Agriculture' : 'Société';
                
                return (
                  <Link
                    key={catCode}
                    href={`/admin/articles?cat=${catCode}`}
                    className={`p-3 border text-left transition-colors ${
                      catCode === 'histoire' 
                        ? 'bg-[#f4eee3] border-[#0b4627]/30 hover:border-[#0b4627]' 
                        : 'bg-[#faf8f5] border-[#e6dfd5] hover:border-[#141414]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#737373]">
                      <span>{catName}</span>
                      <span className="font-bold text-[#0b4627]">{count} art.</span>
                    </div>
                    <div className="text-[11px] font-serif text-[#141414] mt-1 font-semibold truncate">
                      {catCode === 'histoire' ? '★ Archives & Mémoire' : 'Enquêtes dédiées'}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col (4) : Signalements récents & Activité */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-[#e6dfd5] p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#e6dfd5]">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-red-600" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                  Derniers Signalements
                </h4>
              </div>
              <Link href="/admin/signalements" className="text-[11px] font-mono text-[#0b4627] hover:underline">
                Tous ({contactsCount}) →
              </Link>
            </div>

            {data?.contacts?.slice(0, 3).map((contact: any) => (
              <div key={contact.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] text-xs font-serif space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#737373]">
                  <span className="uppercase font-bold text-[#c2410c]">{contact.type}</span>
                  <span>{new Date(contact.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="font-bold text-[#141414] line-clamp-1">
                  {contact.url || contact.name || contact.email}
                </div>
                <p className="text-[#555555] line-clamp-2 text-[11px]">
                  {contact.description || contact.message}
                </p>
              </div>
            ))}

            <Link
              href="/admin/signalements"
              className="block w-full py-2 bg-[#faf8f5] hover:bg-[#e6dfd5] text-center font-mono text-xs text-[#141414] transition-colors"
            >
              Examiner les alertes déontologiques
            </Link>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#f4eee3] border border-[#0b4627]/30 p-4 text-xs font-serif space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-[#0b4627]">
              <ShieldCheck size={14} />
              <span>Rappel Déontologique</span>
            </div>
            <p className="text-[#444444] leading-relaxed">
              Toute modification de statut dans le Tracker requiert la saisie obligatoire de la source primaire (rapport ministériel, bailleur, PV de chantier).
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
