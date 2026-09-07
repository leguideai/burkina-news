"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  X,
  Loader2,
  ArrowUp,
  Copy,
  RefreshCw,
  ChevronRight,
  Download,
  Check,
  Paperclip,
  Sparkles,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import MicumIcon from '@/components/admin/MicumIcon';
import { useMicum } from '@/components/admin/MicumContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  rawData?: any;
  timestamp: Date;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  isUploading?: boolean;
}

export default function MicumSidePanel() {
  const { isOpen, closeMicum, openMicum, toggleMicum, activeEditor } = useMicum();
  const pathname = usePathname();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [providerInfo, setProviderInfo] = useState<{ provider: string; modelName: string; isLive: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, warning, info } = useToast();

  // Fetch AI provider info
  useEffect(() => {
    if (isOpen && !providerInfo) {
      fetch('/api/admin/ai')
        .then(res => res.json())
        .then(data => {
          if (data?.modelName) setProviderInfo(data);
        })
        .catch(() => {});
    }
  }, [isOpen, providerInfo]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMicum();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeMicum]);

  // Detect active section and insertion capabilities
  const resolvedSection = useMemo(() => {
    if (activeEditor) {
      return {
        sectionId: activeEditor.sectionId,
        sectionTitle: activeEditor.sectionTitle,
        canInsert: activeEditor.canInsert,
        currentData: activeEditor.currentData,
        insertToBody: activeEditor.insertToBody,
        replaceField: activeEditor.replaceField,
        applyAll: activeEditor.applyAll,
      };
    }

    if (pathname === '/admin') {
      return { sectionId: 'dashboard', sectionTitle: "Vue d'ensemble / Dashboard", canInsert: false };
    }
    if (pathname === '/admin/une') {
      return { sectionId: 'une', sectionTitle: "Pilotage de la Une", canInsert: false };
    }
    if (pathname === '/admin/articles/nouveau') {
      return { sectionId: 'article', sectionTitle: "Création d'Article", canInsert: true };
    }
    if (pathname.startsWith('/admin/articles/')) {
      return { sectionId: 'article', sectionTitle: "Édition d'Article", canInsert: true };
    }
    if (pathname === '/admin/articles') {
      return { sectionId: 'article', sectionTitle: "Catalogue des Articles", canInsert: false };
    }
    if (pathname === '/admin/projets/nouveau') {
      return { sectionId: 'project', sectionTitle: "Nouveau Chantier", canInsert: true };
    }
    if (pathname.startsWith('/admin/projets/')) {
      return { sectionId: 'project', sectionTitle: "Fiche Chantier", canInsert: true };
    }
    if (pathname === '/admin/projets') {
      return { sectionId: 'project', sectionTitle: "Tracker des Chantiers", canInsert: false };
    }
    if (pathname.startsWith('/admin/indicateurs')) {
      return { sectionId: 'indicator', sectionTitle: "Baromètre RELANCE", canInsert: false };
    }
    if (pathname.startsWith('/admin/fil')) {
      return { sectionId: 'fil', sectionTitle: "Le Fil Hebdomadaire", canInsert: false };
    }
    if (pathname.startsWith('/admin/numeros')) {
      return { sectionId: 'issue', sectionTitle: "Numéros Mensuels", canInsert: false };
    }
    if (pathname.startsWith('/admin/corrections')) {
      return { sectionId: 'corrections', sectionTitle: "Registre des Corrections", canInsert: false };
    }
    if (pathname.startsWith('/admin/signalements')) {
      return { sectionId: 'signalements', sectionTitle: "Signalements Lecteurs", canInsert: false };
    }
    if (pathname.startsWith('/admin/newsletter')) {
      return { sectionId: 'newsletter', sectionTitle: "Abonnés Newsletter", canInsert: false };
    }
    if (pathname.startsWith('/admin/utilisateurs')) {
      return { sectionId: 'users', sectionTitle: "Équipe & Accès", canInsert: false };
    }
    if (pathname.startsWith('/admin/rubriques')) {
      return { sectionId: 'rubriques', sectionTitle: "Rubriques & Histoire", canInsert: false };
    }

    return { sectionId: 'general', sectionTitle: "Desk Rédaction", canInsert: false };
  }, [activeEditor, pathname]);

  // Section-tailored suggestions
  const getSuggestions = () => {
    switch (resolvedSection.sectionId) {
      case 'article':
        if (resolvedSection.canInsert) {
          return [
            { label: "Proposer 3 titres d'enquête percutants", icon: "✍️" },
            { label: "Rédiger un chapô rigoureux et factuel", icon: "📰" },
            { label: "Traduire l'article en anglais (style Reuters)", icon: "🇬🇧" },
            { label: "Auditer la robustesse des chiffres et sources", icon: "🔍" },
          ];
        }
        return [
          { label: "Idées d'enquêtes sur les mines et l'or", icon: "⛏️" },
          { label: "Méthodologie du Grand Décryptage mensuel", icon: "📋" },
          { label: "Critères de sélection des sources primaires", icon: "🔍" },
        ];

      case 'project':
        if (resolvedSection.canInsert) {
          return [
            { label: "Rédiger la description synthétique du chantier", icon: "🏗️" },
            { label: "Formuler la note du dernier jalon constaté", icon: "⏱️" },
            { label: "Traduire la fiche chantier en anglais", icon: "🇬🇧" },
            { label: "Extraire les bailleurs et maîtres d'ouvrage", icon: "💰" },
          ];
        }
        return [
          { label: "Les 6 statuts vérifiés du Tracker", icon: "📊" },
          { label: "Protocole d'audit physique de chantier", icon: "🏗️" },
        ];

      case 'indicator':
        return [
          { label: "Proposer une définition méthodologique standard", icon: "📊" },
          { label: "Calculer la trajectoire cible PND 2028-2030", icon: "🎯" },
          { label: "Traduire l'indicateur et le programme en anglais", icon: "🇬🇧" },
        ];

      case 'fil':
        return [
          { label: "Formater un fait certifié au format 1 minute", icon: "⚡" },
          { label: "Traduire une sélection de faits en anglais", icon: "🇬🇧" },
          { label: "Vérifier la validité de la source primaire", icon: "🔍" },
        ];

      case 'issue':
        return [
          { label: "Rédiger l'éditorial du Directeur de la publication", icon: "📖" },
          { label: "Structurer le sommaire du numéro mensuel", icon: "📑" },
          { label: "Calculer le décompte consolidé des sources", icon: "📚" },
        ];

      case 'une':
        return [
          { label: "Optimiser la hiérarchie visuelle de la Une", icon: "⭐" },
          { label: "Proposer une citation éditoriale pour la semaine", icon: "💬" },
        ];

      case 'signalements':
        return [
          { label: "Auditer la pertinence d'un signalement d'erreur", icon: "⚖️" },
          { label: "Rédiger un accusé de réception déontologique", icon: "✉️" },
        ];

      default:
        return [
          { label: "Faire le point sur l'actualité de la rédaction", icon: "📰" },
          { label: "Rappel des 3 niveaux de preuve de la charte", icon: "🛡️" },
          { label: "Guide des capacités et insertion de Micum", icon: "🤖" },
        ];
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) {
        warning('Fichier trop volumineux', `${file.name} dépasse 25 Mo.`);
        continue;
      }
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newFile: AttachedFile = { id: fileId, name: file.name, size: file.size, type: file.type, isUploading: true };
      setAttachedFiles(prev => [...prev, newFile]);

      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
        try {
          const text = await file.text();
          setInputText(prev => prev ? prev + '\n\n' + text : text);
          info('Texte extrait', `Le contenu de "${file.name}" a été ajouté.`);
        } catch {}
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setAttachedFiles(prev => prev.map(f => f.id === fileId ? { ...f, url: data.url, isUploading: false } : f));
        } else {
          setAttachedFiles(prev => prev.map(f => f.id === fileId ? { ...f, isUploading: false } : f));
        }
      } catch {
        setAttachedFiles(prev => prev.map(f => f.id === fileId ? { ...f, isUploading: false } : f));
      }
    }
  };

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || inputText.trim();
    if (!text && attachedFiles.length === 0) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text || `[${attachedFiles.length} fichier(s) joint(s)]`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const action = resolvedSection.sectionId === 'project' ? 'extract_project' :
                     resolvedSection.sectionId === 'fil' ? 'compile_fil' :
                     resolvedSection.sectionId === 'indicator' ? 'extract_indicators' : 'extract_article';

      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          payload: {
            text,
            instructions: text,
            section: resolvedSection.sectionTitle,
            canInsert: resolvedSection.canInsert,
            attachments: attachedFiles.map(f => ({ name: f.name, url: f.url, type: f.type, size: f.size })),
            currentContext: resolvedSection.currentData
          }
        })
      });

      if (!res.ok) throw new Error("Erreur lors de l'analyse");

      const json = await res.json();
      const data = json.data || {};

      let responseText = '';
      if (data.title) responseText += `**Titre proposé :**\n${data.title}\n\n`;
      if (data.excerpt) responseText += `**Chapô / Résumé :**\n${data.excerpt}\n\n`;
      if (data.content || data.body || data.description) {
        const body = data.content || data.body || data.description;
        responseText += `**Corps / Description :**\n${body}\n\n`;
      }
      if (data.titleEn) responseText += `**Titre (EN) :**\n${data.titleEn}\n\n`;
      if (data.excerptEn) responseText += `**Chapô (EN) :**\n${data.excerptEn}\n\n`;
      if (data.analysis) responseText += `**Analyse éditoriale :**\n${data.analysis}\n\n`;

      if (!responseText.trim()) {
        responseText = json.message || "Analyse terminée avec succès par Micum.";
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: responseText.trim(),
        rawData: data,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setAttachedFiles([]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-e`,
        role: 'assistant',
        content: `❌ Erreur : ${err.message || 'Impossible de contacter Micum.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Copié', 'Texte copié dans le presse-papier.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    setAttachedFiles([]);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. CLOSED STATE: ONLY THE FLOATING ACTION BUTTON (FAB)
  // ─────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <aside aria-label="Assistant IA Micum" className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={openMicum}
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#087443] via-[#09663b] to-[#0A5C36] text-white shadow-xl shadow-emerald-950/30 hover:shadow-2xl hover:scale-105 active:scale-95 border border-emerald-400/40 transition-all duration-200 cursor-pointer group"
          title={`Ouvrir Micum (${resolvedSection.sectionTitle})`}
          aria-label="Ouvrir Micum (Assistant IA)"
        >
          <MicumIcon size={24} glow />
          <span className="font-mono text-xs font-bold tracking-wider uppercase">Micum</span>
          {resolvedSection.canInsert && (
            <span className="bg-emerald-300/30 text-emerald-100 text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-emerald-200/30 font-semibold">
              Formulaire
            </span>
          )}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
        </button>
      </aside>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. OPEN STATE: SLIDE-OVER DRAWER WITH SECTION CONTEXT
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs transition-opacity"
        onClick={closeMicum}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] md:w-[480px] z-50 bg-white flex flex-col h-full shadow-2xl border-l border-[#e6dfd5] animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="shrink-0 px-4 py-3 border-b border-[#e6dfd5] bg-[#faf8f5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MicumIcon size={28} glow />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#141414]">Micum</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-[#736c62] uppercase tracking-wider">Desk IA</span>
                </div>
                {providerInfo && (
                  <span className="text-[10px] font-mono text-[#087443]">
                    {providerInfo.modelName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="p-1.5 text-[#736c62] hover:text-[#141414] hover:bg-[#e6dfd5] rounded cursor-pointer transition-colors"
                  title="Effacer la conversation"
                >
                  <RefreshCw size={15} />
                </button>
              )}
              <button
                onClick={closeMicum}
                className="p-1.5 text-[#736c62] hover:text-[#141414] hover:bg-[#e6dfd5] rounded cursor-pointer transition-colors"
                aria-label="Fermer Micum"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Section Awareness Banner */}
        <div className="px-4 py-2.5 bg-[#f4eee3] border-b border-[#e6dfd5] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] uppercase font-bold text-[#736c62] shrink-0">Section :</span>
            <span className="font-semibold text-[#141414] truncate font-serif">{resolvedSection.sectionTitle}</span>
          </div>

          {resolvedSection.canInsert ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold shrink-0 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Insertion active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-mono shrink-0 border border-neutral-200">
              Consultation
            </span>
          )}
        </div>

        {/* Messages / Discussion Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-5">
              <MicumIcon size={52} glow />
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-[#141414]">
                  {resolvedSection.canInsert ? "Assistance à la Rédaction" : "Conseil & Analyse Éditoriale"}
                </h3>
                <p className="text-xs text-[#736c62] max-w-xs font-serif leading-relaxed">
                  {resolvedSection.canInsert 
                    ? "Posez une question, fournissez une source ou demandez une formulation. Vous pourrez l'insérer directement dans le formulaire."
                    : `Micum est à votre écoute pour la section « ${resolvedSection.sectionTitle} ». Mode conseil et analyse documentaire.`}
                </p>
              </div>

              <div className="space-y-2 w-full pt-2">
                {getSuggestions().map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.label)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs text-[#141414] bg-[#faf8f5] hover:bg-[#f4eee3] border border-[#e6dfd5] rounded-lg transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{s.icon}</span>
                      <span className="truncate">{s.label}</span>
                    </span>
                    <ChevronRight size={13} className="text-[#736c62] group-hover:text-[#141414] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat message bubbles */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] bg-emerald-50 border border-emerald-200 rounded-2xl rounded-br-xs px-4 py-2.5 shadow-2xs">
                  <p className="text-xs font-mono text-[#141414] whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <div className="bg-white border border-[#e6dfd5] rounded-xl px-4 py-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MicumIcon size={16} />
                      <span className="text-[10px] font-mono font-bold text-[#087443] uppercase">Micum</span>
                    </div>
                    <div className="text-xs font-serif text-[#222] whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>

                  {/* Contextual Action Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 pl-1">
                    {resolvedSection.canInsert && msg.rawData ? (
                      <>
                        {(msg.rawData.content || msg.rawData.body || msg.rawData.description) && resolvedSection.insertToBody && (
                          <button
                            onClick={() => {
                              resolvedSection.insertToBody!(msg.rawData.content || msg.rawData.body || msg.rawData.description);
                              success('Inséré', 'Le texte a été injecté dans le formulaire.');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#087443] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded cursor-pointer transition-colors"
                          >
                            <Download size={12} />
                            <span>Insérer dans le corps</span>
                          </button>
                        )}

                        {msg.rawData.title && resolvedSection.replaceField && (
                          <button
                            onClick={() => {
                              resolvedSection.replaceField!('title', msg.rawData.title);
                              success('Titre mis à jour', 'Le titre a été remplacé.');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:bg-emerald-50 border border-emerald-200 px-2 py-1 rounded cursor-pointer transition-colors"
                          >
                            <span>Remplacer le titre</span>
                          </button>
                        )}

                        {msg.rawData.excerpt && resolvedSection.replaceField && (
                          <button
                            onClick={() => {
                              resolvedSection.replaceField!('excerpt', msg.rawData.excerpt);
                              success('Chapô mis à jour', 'Le chapô a été remplacé.');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:bg-emerald-50 border border-emerald-200 px-2 py-1 rounded cursor-pointer transition-colors"
                          >
                            <span>Remplacer le chapô</span>
                          </button>
                        )}

                        {resolvedSection.applyAll && (
                          <button
                            onClick={() => {
                              resolvedSection.applyAll!(msg.rawData);
                              success('Champs synchronisés', 'Tous les champs extraits ont été appliqués.');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1e3a5f] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded cursor-pointer transition-colors font-bold"
                          >
                            <Sparkles size={12} />
                            <span>Tout appliquer</span>
                          </button>
                        )}
                      </>
                    ) : null}

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#736c62] hover:text-[#141414] hover:bg-[#faf8f5] border border-[#e6dfd5] px-2 py-1 rounded cursor-pointer transition-colors"
                      title="Copier la réponse"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedId === msg.id ? 'Copié !' : 'Copier'}</span>
                    </button>

                    {!resolvedSection.canInsert && (
                      <span className="text-[10px] font-mono text-[#8a8174] pl-1">
                        (Consultation · Aucun formulaire à modifier)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#087443] bg-emerald-50 p-3 rounded-lg border border-emerald-200 animate-pulse">
              <Loader2 size={14} className="animate-spin" />
              <span>Micum analyse la demande pour la section {resolvedSection.sectionTitle}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Footer Area */}
        <div className="shrink-0 p-3 border-t border-[#e6dfd5] bg-[#faf8f5]">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {attachedFiles.map(file => (
                <div key={file.id} className="flex items-center gap-1 bg-white border border-[#e6dfd5] px-2 py-0.5 rounded text-[11px] font-mono text-[#141414]">
                  <Paperclip size={11} className="text-[#087443]" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button
                    onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))}
                    className="text-[#736c62] hover:text-red-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-end gap-1.5 bg-white border border-[#e6dfd5] focus-within:border-[#087443] rounded-xl p-1.5 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              multiple
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#736c62] hover:text-[#087443] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Joindre un document (PDF, TXT, CSV, DOCX)"
            >
              <Paperclip size={16} />
            </button>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                resolvedSection.canInsert
                  ? `Demander à Micum pour ${resolvedSection.sectionTitle}...`
                  : `Interroger Micum (${resolvedSection.sectionTitle})...`
              }
              rows={1}
              className="flex-1 max-h-28 py-1.5 px-2 text-xs font-mono resize-none focus:outline-none placeholder:text-[#a8a29e]"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || (!inputText.trim() && attachedFiles.length === 0)}
              className="p-2 bg-[#087443] text-white hover:bg-[#065b35] disabled:opacity-40 disabled:hover:bg-[#087443] rounded-lg transition-colors cursor-pointer shrink-0 disabled:cursor-not-allowed"
              title="Envoyer à Micum"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8174] px-1 pt-1.5">
            <span>Entrée pour envoyer · Maj+Entrée pour saut de ligne</span>
            <span>Burkina News Desk IA</span>
          </div>
        </div>

      </div>
    </>
  );
}
