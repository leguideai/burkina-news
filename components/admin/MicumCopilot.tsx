"use client";

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  FileText, 
  Check, 
  X, 
  Loader2, 
  ArrowRight, 
  Copy, 
  BookOpen, 
  ShieldCheck,
  AlertCircle,
  Maximize2,
  UploadCloud,
  Image as ImageIcon,
  Paperclip,
  Sliders,
  Plus,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import Tooltip from '@/components/ui/Tooltip';
import MicumIcon from '@/components/admin/MicumIcon';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  previewUrl?: string;
  isUploading?: boolean;
}

interface MicumCopilotProps {
  mode: 'article' | 'project' | 'indicators' | 'fil';
  onApply: (data: any) => void;
  variant?: 'button' | 'banner';
  buttonLabel?: string;
  className?: string;
  isEditing?: boolean;
  currentData?: {
    title?: string;
    titleEn?: string;
    excerpt?: string;
    excerptEn?: string;
    body?: string;
    bodyEn?: string;
    category?: string;
    tags?: string[] | string;
    readTime?: string;
    sourceCount?: number;
    amount?: string;
    currentStatus?: string;
    sector?: string;
    region?: string;
    description?: string;
    descriptionEn?: string;
    actors?: Array<{ name: string; role: string }>;
    weekNumber?: number;
    facts?: any[];
    [key: string]: any;
  };
}

export default function MicumCopilot({
  mode,
  onApply,
  variant = 'button',
  buttonLabel,
  className = '',
  isEditing = false,
  currentData
}: MicumCopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extractedResult, setExtractedResult] = useState<any | null>(null);
  const [editMode, setEditMode] = useState<'enrich' | 'append_update' | 'refine_chapo' | 'rewrite'>('enrich');
  const [providerInfo, setProviderInfo] = useState<{ provider: string; modelName: string; isLive: boolean } | null>(null);
  const [applyOptions, setApplyOptions] = useState({
    body: true,
    excerpt: true,
    title: false,
    meta: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, warning, info } = useToast();

  React.useEffect(() => {
    if (isOpen && !providerInfo) {
      fetch('/api/admin/ai')
        .then(res => res.json())
        .then(data => {
          if (data && data.modelName) {
            setProviderInfo(data);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, providerInfo]);

  const getBannerInfo = () => {
    if (isEditing && (currentData?.title || currentData?.name)) {
      const subjectName = currentData.title || currentData.name || 'Contenu';
      const truncated = subjectName.length > 50 ? `${subjectName.slice(0, 50)}...` : subjectName;
      switch (mode) {
        case 'article':
          return {
            title: "Mise à jour & Révision d'Enquête avec Micum",
            desc: `Micum prend en compte votre enquête en cours « ${truncated} » pour intégrer de nouvelles pièces ou directives sans écraser votre travail d'investigation.`,
            btn: "Réviser / Enrichir l'article"
          };
        case 'project':
          return {
            title: "Mise à jour du Chantier avec Micum",
            desc: `Micum intègre les nouveaux PV de chantier ou avenants à la fiche « ${truncated} » en préservant l'historique et les données certifiées.`,
            btn: "Actualiser la fiche chantier"
          };
        case 'fil':
          return {
            title: "Mise à jour de l'Édition Hebdomadaire",
            desc: "Micum enrichit ou actualise les faits de cette semaine selon vos nouvelles dépêches officielles.",
            btn: "Actualiser les 10 faits"
          };
        case 'indicators':
          return {
            title: "Actualisation Statistique INSD / BCEAO",
            desc: "Importez le nouveau bulletin pour mettre à jour les valeurs et tendances du Baromètre RELANCE.",
            btn: "Actualiser les indicateurs"
          };
      }
    }

    switch (mode) {
      case 'article':
        return {
          title: "Ingestion & Rédaction automatique d'Article",
          desc: "Téléversez des documents (PDF, scans, images) ou collez un communiqué officiel pour extraire instantanément le titre, le chapô et pré-remplir les champs.",
          btn: "Extraire avec Micum"
        };
      case 'project':
        return {
          title: "Ingestion de Décret & Marché Public",
          desc: "Importez le décret d'attribution ou photos du PV pour renseigner le nom officiel, le ministère porteur, la région, le budget et le calendrier.",
          btn: "Extraire la fiche avec Micum"
        };
      case 'fil':
        return {
          title: "Compilation des 10 Faits Hebdomadaires",
          desc: "Déposez vos notes ou collez les dépêches de la semaine pour formater, ordonner et sourcer les 10 faits marquants selon la charte.",
          btn: "Compiler les 10 faits avec Micum"
        };
      case 'indicators':
        return {
          title: "Ingestion Statistique INSD / BCEAO",
          desc: "Importez le bulletin de conjoncture économique pour extraire et actualiser en un clic les indicateurs stratégiques du Baromètre RELANCE.",
          btn: "Analyser le bulletin avec Micum"
        };
    }
  };

  const bannerInfo = getBannerInfo();

  const getInstructionSuggestions = () => {
    if (isEditing) {
      switch (mode) {
        case 'article':
          return [
            { label: "Intégrer les chiffres", prompt: "Actualiser les chiffres et données budgétaires à partir des nouvelles pièces jointes", icon: "💰" },
            { label: "Ajouter mise à jour", prompt: "Ajouter une section 'Derniers développements' à la fin de l'enquête sans altérer l'analyse de fond", icon: "📌" },
            { label: "Ajuster le chapô", prompt: "Harmoniser le chapô pour refléter les derniers arbitrages officiels", icon: "📰" },
            { label: "Vérifier les délais", prompt: "Confronter les nouveaux délais annoncés avec le calendrier contractuel initial", icon: "⏱️" },
            { label: "Version anglaise", prompt: "Harmoniser la version anglaise en miroir des modifications", icon: "🇬🇧" },
          ];
        case 'project':
          return [
            { label: "Taux d'avancement", prompt: "Consigner le nouveau taux d'avancement physique certifié par la mission de contrôle", icon: "🏗️" },
            { label: "Avenant budgétaire", prompt: "Intégrer l'avenant financier voté et préciser la quote-part additionnelle", icon: "💰" },
            { label: "Date de livraison", prompt: "Ajuster la date prévisionnelle de mise en service selon les derniers constats", icon: "⏱️" },
            { label: "Note de terrain", prompt: "Ajouter le compte-rendu de la visite de chantier à la note technique", icon: "🛡️" },
          ];
        case 'fil':
          return [
            { label: "Actualiser un fait", prompt: "Mettre à jour le fait avec les chiffres définitifs publiés ce jour", icon: "🔄" },
            { label: "Vérifier la source", prompt: "Remplacer la source intermédiaire par le communiqué officiel ministériel", icon: "🔍" },
          ];
        case 'indicators':
          return [
            { label: "Évolution trimestrielle", prompt: "Calculer la variation nette par rapport au trimestre précédent", icon: "📈" },
          ];
        default:
          return [];
      }
    }

    switch (mode) {
      case 'article':
        return [
          { label: "Montants & Bailleurs", prompt: "Mettre l'accent sur les montants budgétaires et les bailleurs de fonds", icon: "💰" },
          { label: "Date & Calendrier", prompt: "Identifier précisément les dates limites et les délais d'exécution", icon: "⏱️" },
          { label: "Chapô Percutant", prompt: "Formuler un chapô court, factuel et percutant orienté impact citoyen", icon: "📰" },
          { label: "Version Anglaise", prompt: "Soigner particulièrement la traduction bilingue en anglais journalistique", icon: "🇬🇧" },
          { label: "Bénéficiaires", prompt: "Préciser les provinces et populations directement bénéficiaires", icon: "📍" },
        ];
      case 'project':
        return [
          { label: "Bailleurs & Partenaires", prompt: "Détailler la quote-part de l'État et des partenaires techniques et financiers", icon: "💰" },
          { label: "Date de livraison", prompt: "Mettre en avant la date de livraison contractuelle et les jalons", icon: "⏱️" },
          { label: "Taux certifié", prompt: "Consigner le taux d'avancement physique certifié par la mission de contrôle", icon: "🏗️" },
          { label: "Note de traçabilité", prompt: "Formuler une note de traçabilité conforme aux exigences de Burkina News", icon: "🛡️" },
        ];
      case 'fil':
        return [
          { label: "Ordre chronologique", prompt: "Ordonner les faits par heure de parution dans la journée", icon: "🕒" },
          { label: "Points d'alerte", prompt: "Rédiger des notes 'Pourquoi surveiller' percutantes pour chaque fait", icon: "⚠️" },
          { label: "Économie & Mines", prompt: "Prioriser les annonces économiques, minières et de relance", icon: "📊" },
        ];
      case 'indicators':
        return [
          { label: "Évolutions clés", prompt: "Mettre en relief les évolutions notables par rapport au trimestre précédent", icon: "📈" },
          { label: "Cibles 2028-2030", prompt: "Confronter la valeur actuelle avec la trajectoire cible du PND", icon: "🎯" },
        ];
      default:
        return [];
    }
  };

  const getActionForMode = () => {
    switch (mode) {
      case 'article': return 'extract_article';
      case 'project': return 'extract_project';
      case 'indicators': return 'extract_indicators';
      case 'fil': return 'compile_fil';
      default: return 'extract_article';
    }
  };

  const getSampleText = () => {
    if (isEditing) {
      switch (mode) {
        case 'article':
          return `RAPPORT DE CONTRÔLE D'ÉTAT ET NOTE DE RECOUPEMENT (Septembre 2026) :
- Enveloppe financière : le ministère des Finances confirme le déblocage effectif d'une tranche additionnelle de 12 milliards FCFA.
- Taux d'exécution physique : les travaux de terrassement et d'ouvrages d'art atteignent 68% d'achèvement.
- Calendrier : confirmation de la date limite contractuelle fixée à décembre 2027.
- Source primaire : Bulletin officiel des marchés publics et rapport de mission du contrôle d'État.`;
        case 'project':
          return `AVENANT N°1 ET PROCÈS-VERBAL DE CONTRÔLE DE CHANTIER :
- Taux d'avancement certifié : progression à 65% au 1er septembre 2026.
- Avenant budgétaire : +3,5 milliards FCFA approuvés en Conseil des ministres pour les raccordements annexes.
- Entreprise de contrôle technique : Bureau Veritas Faso.`;
        default:
          break;
      }
    }

    switch (mode) {
      case 'article':
        return `COMMUNIQUÉ DU CONSEIL DES MINISTRES DU 28 AOÛT 2026

Le Conseil des ministres s'est réuni ce mercredi sous la présidence du Chef de l'État. Au titre du Ministère des Infrastructures et du Désenclavement, le Conseil a adopté un rapport relatif à la mobilisation d'une enveloppe de 45 milliards FCFA pour la modernisation des axes routiers stratégiques reliant Ouagadougou aux bassins de production agricole.

Ce programme pluriannuel vise à désenclaver les zones de production cotonnière et céréalière de la Boucle du Mouhoun et à réduire les délais de transit logistique vers les marchés sous-régionaux. Le financement est assuré conjointement sur le budget national et un concours de la Banque Ouest Africaine de Développement (BOAD). Le taux d'avancement des études techniques est certifié à 100%.`;
      
      case 'project':
        return `DÉCRET PORTANT APPROBATION DU MARCHÉ DE CONSTRUCTION DE LA CENTRALE SOLAIRE DE KOUDOUGOU

Montant total du marché : 25 milliards FCFA.
Maître d'ouvrage : Ministère de l'Énergie, des Mines et des Carrières.
Bailleur principal : Banque Africaine de Développement et État burkinabè.
Entreprise exécutante : Consortium Énergie Faso.
Région : Centre-Ouest (Commune de Koudougou).
Date prévisionnelle de démarrage des travaux : 1er mars 2026.
Date estimée de mise en service : 31 décembre 2027.
Capacité installée : 30 MW avec système de stockage par batteries de 15 MWh.
Taux d'avancement certifié par la mission de contrôle : 42%.`;

      case 'indicators':
        return `BULLETIN TRIMESTRIEL DE CONJONCTURE ÉCONOMIQUE - INSD / BCEAO (Août 2026)

- Production aurifère industrielle : la production cumulée s'établit à 28,4 tonnes au 30 juin 2026, portant la projection annuelle à 58,4 tonnes (en hausse de 1,4% par rapport à 2025).
- Capacité électrique installée : la mise sous tension de nouveaux postes porte la capacité globale connectée à 480 MW (+30 MW).
- Taux de croissance du PIB : estimé à 6,2% pour l'exercice 2026 contre 5,8% initialement anticipé.`;

      case 'fil':
        return `DÉPÊCHES ET COMMUNIQUÉS OFFICIELS DE LA SEMAINE 35 :
1. Conseil des ministres : 45 milliards débloqués pour les axes routiers de desserte agricole.
2. SONABEL : mise en service de la sous-station électrique de Koudougou (30 MW).
3. Campagne agricole : distribution de 25 000 tonnes d'engrais aux coopératives du Mouhoun.
4. Mines : 28,4 tonnes d'or extraites au premier semestre 2026 selon la DGMG.
5. Sécurité : 400 nouveaux agents déployés pour l'escorte des convois marchands dans l'Est.
6. BRVM : emprunt obligataire de l'État burkinabè souscrit à 112%.
7. Éducation : ouverture de 12 collèges techniques dans 6 régions.
8. Santé : 50 ambulances médicalisées remises aux districts sanitaires régionaux.
9. Mémorial Sankara : inauguration du pavillon d'archives historiques à Ouaga.
10. SOFITEX : relance de la seconde usine d'égrenage de Bobo-Dioulasso (300 t/j).`;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    if (newFiles.length === 0) return;

    for (const file of newFiles) {
      if (file.size > 25 * 1024 * 1024) {
        warning('Fichier trop lourd', `${file.name} dépasse 25 Mo.`);
        continue;
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;

      const newAttachment: AttachedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        isUploading: true,
      };

      setAttachments(prev => [...prev, newAttachment]);

      // Auto-extract text from text-based documents (.txt, .md, .csv, .json)
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
        try {
          const textContent = await file.text();
          setInputText(prev => {
            if (!prev.trim()) return textContent;
            return prev + '\n\n' + textContent;
          });
          info('Contenu extrait', `Le texte de "${file.name}" a été ajouté dans la zone d'analyse.`);
        } catch (e) {
          console.error('Error reading text file', e);
        }
      }

      // Upload to server /api/admin/upload
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setAttachments(prev => prev.map(a => a.id === fileId ? { ...a, url: data.url, isUploading: false } : a));
        } else {
          setAttachments(prev => prev.map(a => a.id === fileId ? { ...a, isUploading: false } : a));
        }
      } catch (err) {
        setAttachments(prev => prev.map(a => a.id === fileId ? { ...a, isUploading: false } : a));
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => {
      const item = prev.find(a => a.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && attachments.length === 0) {
      warning('Aucune donnée', 'Veuillez coller un texte, importer un document/image ou charger un exemple avant de lancer l\'analyse.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: getActionForMode(),
          payload: { 
            text: inputText,
            instructions: customInstructions,
            attachments: attachments.map(a => ({
              name: a.name,
              url: a.url,
              type: a.type,
              size: a.size
            })),
            isEditing: Boolean(isEditing),
            editMode,
            currentContext: (isEditing && currentData) ? {
              title: currentData.title || currentData.name,
              titleEn: currentData.titleEn || currentData.nameEn,
              excerpt: currentData.excerpt,
              excerptEn: currentData.excerptEn,
              body: currentData.body || currentData.content,
              bodyEn: currentData.bodyEn || currentData.contentEn,
              category: currentData.category,
              tags: currentData.tags,
              readTime: currentData.readTime,
              sourceCount: currentData.sourceCount,
              confidence: currentData.confidence,
              amount: currentData.amount || currentData.currentBudget,
              currentStatus: currentData.currentStatus || currentData.status,
              sector: currentData.sector,
              region: currentData.region,
              description: currentData.description,
              descriptionEn: currentData.descriptionEn,
              actors: currentData.actors
            } : undefined
          }
        })
      });

      if (!res.ok) throw new Error('Erreur lors de l\'analyse par Micum');

      const json = await res.json();
      if (json.data) {
        setExtractedResult({
          ...json.data,
          appliedInstructions: customInstructions,
          appliedAttachments: attachments.map(a => a.name)
        });
        success(
          isEditing ? 'Mise à jour calculée par Micum' : 'Analyse Micum terminée', 
          isEditing 
            ? 'Les nouvelles données ont été intégrées à votre enquête existante. Vérifiez et appliquez.' 
            : 'Données extraites et directives appliquées avec succès.'
        );
      }
    } catch (err: any) {
      error('Erreur Micum', err.message || 'Impossible d\'analyser le document.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (extractedResult) {
      // If an image was uploaded and not yet set, provide it
      const uploadedImg = attachments.find(a => a.url && a.type.startsWith('image/'))?.url;
      
      let dataToApply: any;

      if (isEditing && mode === 'article') {
        dataToApply = {};
        if (applyOptions.title && extractedResult.title) {
          dataToApply.title = extractedResult.title;
          dataToApply.titleEn = extractedResult.titleEn;
        }
        if (applyOptions.excerpt) {
          dataToApply.excerpt = extractedResult.excerpt;
          dataToApply.excerptEn = extractedResult.excerptEn;
          dataToApply.subtitle = extractedResult.subtitle;
          dataToApply.subtitleEn = extractedResult.subtitleEn;
        }
        if (applyOptions.body) {
          dataToApply.content = extractedResult.content;
          dataToApply.body = extractedResult.content;
          dataToApply.contentEn = extractedResult.contentEn;
          dataToApply.bodyEn = extractedResult.contentEn;
        }
        if (applyOptions.meta) {
          dataToApply.sourcesCount = extractedResult.sourcesCount;
          dataToApply.sourceCount = extractedResult.sourcesCount;
          dataToApply.readTime = extractedResult.readTime;
          dataToApply.tags = extractedResult.tags;
        }
        if (uploadedImg) {
          dataToApply.imageUrl = uploadedImg;
        }
      } else {
        dataToApply = {
          ...extractedResult,
          ...(uploadedImg && !extractedResult.imageUrl && !extractedResult.image ? { imageUrl: uploadedImg } : {})
        };
      }
      
      onApply(dataToApply);
      success(
        isEditing ? 'Enquête mise à jour' : 'Formulaire pré-rempli', 
        isEditing 
          ? 'Les enrichissements sélectionnés ont été appliqués à votre article.' 
          : 'Les données extraites par Micum ont été insérées dans votre formulaire.'
      );
      setIsOpen(false);
      setExtractedResult(null);
      setInputText('');
      setCustomInstructions('');
      setAttachments([]);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className={`p-4 rounded-xl border border-emerald-600/25 bg-gradient-to-r from-[#FAF8F5] via-[#F4F9F5] to-[#EEF7F2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${className}`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <MicumIcon size={40} glow className="shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300/60">
                  {isEditing ? "Mode Révision · Micum" : "Assistant Micum · IA"}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {bannerInfo.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                {bannerInfo.desc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:from-emerald-800 hover:to-teal-900 shadow-sm transition-all duration-150 cursor-pointer border border-emerald-800/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MicumIcon size={18} glow />
            <span>{buttonLabel || bannerInfo.btn}</span>
          </button>
        </div>
      ) : (
        <Tooltip content={isEditing ? "Co-pilote IA : enrichit votre contenu existant avec de nouveaux documents" : "Co-pilote IA : extrait automatiquement les champs depuis un document officiel"}>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 shadow-sm border bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white border-emerald-700/30 hover:scale-[1.02] active:scale-[0.98] ${className}`}
          >
            <MicumIcon size={16} glow />
            <span>{buttonLabel || (isEditing ? '✨ Réviser avec Micum' : '✨ Micum Ingestion')}</span>
          </button>
        </Tooltip>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-4xl w-full h-[95vh] sm:h-auto sm:max-h-[92vh] flex flex-col border border-gray-100 overflow-hidden">
            
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-[var(--ink)] to-[#0A5C36] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <MicumIcon size={30} glow className="shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-base flex flex-wrap items-center gap-1.5 sm:gap-2 truncate">
                    <span>Micum · Desk IA</span>
                    {providerInfo?.isLive ? (
                      <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-200 font-mono flex items-center gap-1 font-semibold">
                        <Sparkles className="w-2 h-2 text-amber-300" />
                        {providerInfo.modelName}
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
                        Moteur Local
                      </span>
                    )}
                  </h3>
                  <p className="hidden sm:block text-[11px] sm:text-xs text-white/75 truncate">
                    Analyse de scans, photos de décrets, PDF officiels et directives sur-mesure
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.md,.json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = '';
              }}
            />

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {!extractedResult ? (
                <>
                  {/* Step 1-Context: Ultra-compact & Light Context Bar */}
                  {isEditing && currentData && (
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300/70 shrink-0">
                            <Edit3 className="w-3 h-3 text-amber-700" /> Mode Révision
                          </span>
                          <span className="font-semibold text-gray-800 truncate max-w-xs sm:max-w-md" title={currentData.title || currentData.name}>
                            « {currentData.title || currentData.name || 'Document en cours'} »
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                          {currentData.body && (
                            <span>~{Math.round(currentData.body.length / 5)} mots</span>
                          )}
                          {currentData.category && (
                            <span className="px-1.5 py-0.5 rounded bg-gray-200/70 text-gray-700">{currentData.category}</span>
                          )}
                        </div>
                      </div>

                      {/* Action Pills */}
                      {mode === 'article' && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[11px] font-medium text-gray-500 mr-1">Consigne :</span>
                          <button
                            type="button"
                            onClick={() => setEditMode('enrich')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                              editMode === 'enrich'
                                ? 'bg-[var(--ink)] text-white shadow-xs'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                            title="Intègre les nouveaux chiffres sans écraser le texte existant"
                          >
                            ⚡ Enrichir & actualiser
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditMode('append_update')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                              editMode === 'append_update'
                                ? 'bg-[var(--ink)] text-white shadow-xs'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                            title="Conserve 100% du texte et ajoute une section de mise à jour"
                          >
                            📌 Ajouter mise à jour
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditMode('refine_chapo')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                              editMode === 'refine_chapo'
                                ? 'bg-[var(--ink)] text-white shadow-xs'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                            title="Met à jour uniquement le chapô et le résumé"
                          >
                            ✍️ Chapô seul
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditMode('rewrite')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                              editMode === 'rewrite'
                                ? 'bg-[var(--ink)] text-white shadow-xs'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                            title="Restructuration complète de l'article"
                          >
                            🔄 Réécrire
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 1A: File & Image Upload Area */}
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E6DFD5] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-emerald-700" />
                        {isEditing ? "Nouvelles Pièces Jointes ou Rapports de Suivi" : "Documents & Images Officiels"}
                        <span className="text-[10px] font-normal text-gray-500 font-mono">
                          (PDF, Word, photos de décrets, scans)
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Parcourir
                      </button>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-3.5 sm:p-4 text-center cursor-pointer transition-all duration-150 ${
                        isDragging 
                          ? 'border-emerald-600 bg-emerald-50/80 scale-[0.99]' 
                          : 'border-gray-300 hover:border-emerald-600/70 bg-white hover:bg-emerald-50/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-xs text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <UploadCloud className="w-4 h-4" />
                        </div>
                        <p>
                          <span className="font-bold text-gray-900">Glissez-déposez</span> vos fichiers PDF, scans de décrets ou photos de documents ici, ou <span className="text-emerald-700 font-bold underline">cliquez pour sélectionner</span>.
                        </p>
                      </div>
                    </div>

                    {/* Attachments List */}
                    {attachments.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {attachments.map((att) => {
                          const isImg = att.type.startsWith('image/') || att.previewUrl;
                          return (
                            <div 
                              key={att.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200 shadow-xs text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                                {isImg && att.previewUrl ? (
                                  <img 
                                    src={att.previewUrl} 
                                    alt={att.name} 
                                    className="w-9 h-9 rounded object-cover border border-gray-200 shrink-0" 
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">
                                    {att.name.endsWith('.pdf') ? 'PDF' : att.name.endsWith('.docx') ? 'DOC' : 'TXT'}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 truncate" title={att.name}>
                                    {att.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                                    <span>{(att.size / (1024 * 1024)).toFixed(2)} Mo</span>
                                    {att.isUploading ? (
                                      <span className="text-amber-600 animate-pulse font-bold">· Téléversement...</span>
                                    ) : (
                                      <span className="text-emerald-600 font-bold">✓ Prêt</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveAttachment(att.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                title="Supprimer la pièce jointe"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step 1B: Raw Text Input Area */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        {isEditing ? "Nouveaux éléments textuels ou procès-verbal de contrôle" : "Texte brut ou extrait officiel (Conseil des ministres, décret, rapport...)"}
                      </label>
                      <button
                        type="button"
                        onClick={() => setInputText(getSampleText())}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {isEditing ? "Charger un exemple de mise à jour officielle" : "Charger un exemple officiel type"}
                      </button>
                    </div>

                    <textarea
                      rows={isEditing ? 4 : 6}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isEditing 
                        ? "Collez ici les nouvelles données de suivi, les chiffres du dernier Conseil des ministres ou les déclarations officielles à intégrer..." 
                        : "Collez ici le texte intégral du document officiel, communiqué de presse, arrêté ministériel ou rapport financier..."}
                      className="w-full text-xs font-mono p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--green)] bg-gray-50 focus:bg-white transition-all text-gray-800 leading-relaxed"
                    />
                  </div>

                  {/* Step 1C: Custom Instructions / Consignes spécifiques */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#F46B18]" />
                        Directives & Consignes spécifiques pour Micum
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                          Sur-mesure
                        </span>
                      </label>
                      {customInstructions && (
                        <button
                          type="button"
                          onClick={() => setCustomInstructions('')}
                          className="text-[11px] text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
                        >
                          Effacer les consignes
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder={isEditing 
                        ? "Ex : Intègre les chiffres de décaissement de la page 3 du rapport, ajoute un paragraphe sur le retard du lot 2 sans modifier le reste..." 
                        : "Ex : Focalise l'analyse sur la date prévisionnelle de fin des travaux et le bailleur principal, adopte un ton journalistique percutant pour le chapô..."}
                      className="w-full text-xs font-sans p-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46B18] bg-white transition-all text-gray-800 placeholder:text-gray-400"
                    />

                    {/* Suggestion Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-gray-500 font-semibold">Suggestions rapides :</span>
                      {getInstructionSuggestions().map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCustomInstructions(prev => prev ? `${prev}. ${chip.prompt}` : chip.prompt);
                          }}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-amber-200 hover:border-[#F46B18] text-gray-700 hover:text-[#F46B18] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <span>{chip.icon}</span>
                          <span>{chip.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ethical Reminder */}
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      <strong>Garantie Déontologique :</strong> {isEditing 
                        ? "Micum respecte la structure et l'historique de votre article existant. Les nouvelles données sont ajoutées sous forme de faits vérifiés et recoupés." 
                        : "Micum prend en compte vos pièces jointes et vos directives pour structurer les données exactes sans inventer de faits non vérifiables. Vous validez chaque champ avant enregistrement."}
                    </p>
                  </div>
                </>
              ) : (
                /* Step 2: Review extracted data */
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      {isEditing ? "Modifications & enrichissements calculés par Micum" : "Données extraites et consignes appliquées par Micum"}
                    </div>
                    <button
                      type="button"
                      onClick={() => setExtractedResult(null)}
                      className="text-xs text-gray-600 hover:text-gray-900 hover:underline cursor-pointer"
                    >
                      Modifier le texte source & directives
                    </button>
                  </div>

                  {/* Summary of changes in edit mode */}
                  {extractedResult.changesSummary && extractedResult.changesSummary.length > 0 && (
                    <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-blue-900">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                        Synthèse des ajustements calculés par Micum :
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5 list-disc text-[11px] text-blue-900/90 font-medium">
                        {extractedResult.changesSummary.map((change: string, idx: number) => (
                          <li key={idx}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Checkboxes for selective fields application */}
                  {isEditing && mode === 'article' && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6DFD5] space-y-2 text-xs">
                      <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block">
                        Champs à appliquer dans le formulaire :
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer font-semibold text-gray-800 hover:border-emerald-500">
                          <input 
                            type="checkbox" 
                            checked={applyOptions.body} 
                            onChange={(e) => setApplyOptions(prev => ({ ...prev, body: e.target.checked }))}
                            className="text-emerald-700 rounded focus:ring-emerald-600"
                          />
                          <span>Corps d'enquête</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer font-semibold text-gray-800 hover:border-emerald-500">
                          <input 
                            type="checkbox" 
                            checked={applyOptions.excerpt} 
                            onChange={(e) => setApplyOptions(prev => ({ ...prev, excerpt: e.target.checked }))}
                            className="text-emerald-700 rounded focus:ring-emerald-600"
                          />
                          <span>Chapô / Résumé</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer font-semibold text-gray-800 hover:border-emerald-500">
                          <input 
                            type="checkbox" 
                            checked={applyOptions.meta} 
                            onChange={(e) => setApplyOptions(prev => ({ ...prev, meta: e.target.checked }))}
                            className="text-emerald-700 rounded focus:ring-emerald-600"
                          />
                          <span>Sources & Tags</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer font-semibold text-gray-800 hover:border-emerald-500">
                          <input 
                            type="checkbox" 
                            checked={applyOptions.title} 
                            onChange={(e) => setApplyOptions(prev => ({ ...prev, title: e.target.checked }))}
                            className="text-emerald-700 rounded focus:ring-emerald-600"
                          />
                          <span>Titre</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Directive & Attachment Badges */}
                  {extractedResult.appliedInstructions && (
                    <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Sliders className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Directive éditoriale appliquée :</span> « {extractedResult.appliedInstructions} »
                      </div>
                    </div>
                  )}

                  {extractedResult.appliedAttachments && extractedResult.appliedAttachments.length > 0 && (
                    <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                      <Paperclip className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Pièces jointes analysées ({extractedResult.appliedAttachments.length}) :</span> {extractedResult.appliedAttachments.join(', ')}
                      </div>
                    </div>
                  )}

                  {/* Previews based on mode */}
                  {mode === 'article' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-500 uppercase text-[10px]">Titre (FR)</span>
                          {isEditing && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${applyOptions.title ? 'bg-amber-100 text-amber-900' : 'bg-gray-200 text-gray-700'}`}>
                              {applyOptions.title ? 'Modifié' : 'Inchangé (Conservé)'}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{extractedResult.title}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Title (EN)</span>
                        <p className="font-semibold text-gray-800 italic">{extractedResult.titleEn}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Rubrique</span>
                        <p className="font-bold text-emerald-700 capitalize">{extractedResult.category}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Sources & Preuve</span>
                        <p className="font-bold text-gray-800">{extractedResult.sourcesCount} sources primaires (Confiance {extractedResult.confidenceLevel})</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Chapô / Excerpt</span>
                        <p className="text-gray-700">{extractedResult.excerpt}</p>
                      </div>
                      <div className="col-span-2 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-gray-600 uppercase text-[10px]">
                            {isEditing ? "Extrait du corps enrichi par Micum" : "Corps de l'enquête"}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold">
                            ~{Math.round((extractedResult.content?.length || 0) / 5)} mots au total
                          </span>
                        </div>
                        <div className="text-gray-700 max-h-40 overflow-y-auto font-mono text-[11px] whitespace-pre-line bg-gray-50 p-2.5 rounded border border-gray-100 leading-relaxed">
                          {extractedResult.content?.slice(0, 600)}...
                        </div>
                      </div>
                    </div>
                  )}

                  {mode === 'project' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="col-span-2">
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Nom du Projet</span>
                        <p className="font-semibold text-gray-900 text-sm">{extractedResult.name}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Secteur & Région</span>
                        <p className="font-bold text-emerald-700">{extractedResult.sector} · {extractedResult.region}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Budget Officiel</span>
                        <p className="font-bold text-orange-600 text-sm">{extractedResult.currentBudget}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-gray-500 uppercase text-[10px]">Note de vérification</span>
                        <p className="text-gray-700 italic">{extractedResult.verificationNote}</p>
                      </div>
                    </div>
                  )}

                  {mode === 'fil' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                      <p className="font-bold text-gray-900 mb-2">
                        {extractedResult.facts?.length || 10} faits hebdomadaires générés avec sources et notes d'alerte :
                      </p>
                      <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {extractedResult.facts?.slice(0, 4).map((f: any, idx: number) => (
                          <li key={idx} className="p-2 bg-white rounded border border-gray-200">
                            <span className="font-bold text-orange-600">{f.time}</span> — {f.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {mode === 'indicators' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                      <p className="font-bold text-gray-900 mb-2">
                        {extractedResult.updates?.length || 0} indicateurs prêts pour actualisation en lot :
                      </p>
                      <div className="space-y-1.5">
                        {extractedResult.updates?.map((u: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                            <span className="font-semibold text-gray-800">{u.name}</span>
                            <span className="font-bold text-emerald-700">
                              {u.previousValue} ➔ {u.newValue} {u.unit} (↗)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer text-center w-full sm:w-auto"
              >
                Annuler
              </button>

              {!extractedResult ? (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEditing ? "Micum intègre..." : "Micum analyse..."}</span>
                    </>
                  ) : (
                    <>
                      <MicumIcon size={16} glow />
                      <span>{isEditing ? "Calculer la mise à jour" : "Lancer l'analyse avec Micum"}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? "Appliquer à l'enquête" : "Appliquer au formulaire"}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
