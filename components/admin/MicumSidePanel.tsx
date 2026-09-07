"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Loader2,
  ArrowUp,
  Plus,
  Copy,
  FileText,
  Sliders,
  RefreshCw,
  ChevronRight,
  Download,
  Replace,
  Image as ImageIcon,
  Paperclip,
  Check
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import MicumIcon from '@/components/admin/MicumIcon';

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

interface MicumSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onToggle?: () => void;
  mode: 'article' | 'project' | 'indicators' | 'fil';
  isEditing: boolean;
  currentData?: Record<string, any>;
  onInsertToBody?: (text: string) => void;
  onReplaceField?: (field: string, value: string) => void;
  onApplyAll?: (data: any) => void;
  showFloatingButton?: boolean;
  variant?: 'docked' | 'drawer';
}

export default function MicumSidePanel({
  isOpen,
  onClose,
  onOpen,
  onToggle,
  mode,
  isEditing,
  currentData,
  onInsertToBody,
  onReplaceField,
  onApplyAll,
  showFloatingButton = true,
  variant = 'docked'
}: MicumSidePanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [editMode, setEditMode] = useState<'enrich' | 'append_update' | 'refine_chapo' | 'rewrite'>('enrich');
  const [showEditModes, setShowEditModes] = useState(false);
  const [providerInfo, setProviderInfo] = useState<{ provider: string; modelName: string; isLive: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, warning, info } = useToast();

  // Fetch provider info
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

  // Auto-scroll to bottom
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
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const getActionForMode = () => {
    switch (mode) {
      case 'article': return 'extract_article';
      case 'project': return 'extract_project';
      case 'indicators': return 'extract_indicators';
      case 'fil': return 'compile_fil';
      default: return 'extract_article';
    }
  };

  const getSuggestions = () => {
    if (isEditing) {
      switch (mode) {
        case 'article': return [
          { label: "Améliorer le chapô", icon: "📰" },
          { label: "Vérifier les sources & chiffres", icon: "🔍" },
          { label: "Proposer 3 titres alternatifs", icon: "✍️" },
          { label: "Traduire en anglais", icon: "🇬🇧" },
        ];
        case 'project': return [
          { label: "Analyser le PV de chantier", icon: "🏗️" },
          { label: "Vérifier les délais contractuels", icon: "⏱️" },
          { label: "Extraire les montants & bailleurs", icon: "💰" },
        ];
        default: return [];
      }
    }
    switch (mode) {
      case 'article': return [
        { label: "Rédiger le chapô", icon: "📰" },
        { label: "Proposer 3 titres", icon: "✍️" },
        { label: "Résumer ce document", icon: "📋" },
        { label: "Traduire en anglais", icon: "🇬🇧" },
      ];
      case 'project': return [
        { label: "Extraire la fiche projet", icon: "🏗️" },
        { label: "Identifier les bailleurs", icon: "💰" },
        { label: "Résumer les jalons", icon: "📊" },
      ];
      default: return [];
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) {
        warning('Fichier trop lourd', `${file.name} dépasse 25 Mo.`);
        continue;
      }
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newFile: AttachedFile = { id: fileId, name: file.name, size: file.size, type: file.type, isUploading: true };
      setAttachedFiles(prev => [...prev, newFile]);

      // Extract text from text-based files
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
        try {
          const text = await file.text();
          setInputText(prev => prev ? prev + '\n\n' + text : text);
          info('Contenu extrait', `Le texte de "${file.name}" a été ajouté.`);
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
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: getActionForMode(),
          payload: {
            text,
            instructions: text,
            attachments: attachedFiles.map(f => ({ name: f.name, url: f.url, type: f.type, size: f.size })),
            isEditing: Boolean(isEditing),
            editMode,
            currentContext: currentData ? {
              title: currentData.title || currentData.name,
              titleEn: currentData.titleEn || currentData.nameEn,
              excerpt: currentData.excerpt,
              excerptEn: currentData.excerptEn,
              body: currentData.body || currentData.content || currentData.description,
              bodyEn: currentData.bodyEn || currentData.contentEn || currentData.descriptionEn,
              category: currentData.category,
              tags: currentData.tags,
              sourceCount: currentData.sourceCount,
              amount: currentData.amount,
              sector: currentData.sector,
              region: currentData.region,
            } : undefined
          }
        })
      });

      if (!res.ok) throw new Error("Erreur lors de l'analyse");

      const json = await res.json();
      const data = json.data || {};

      // Build readable response from extracted data
      let responseText = '';
      if (data.title) responseText += `**Titre :** ${data.title}\n\n`;
      if (data.excerpt) responseText += `**Chapô :** ${data.excerpt}\n\n`;
      if (data.content || data.body || data.description) {
        const body = data.content || data.body || data.description;
        responseText += `**Contenu :**\n${body}\n\n`;
      }
      if (data.readTime) responseText += `⏱ ${data.readTime} · `;
      if (data.sourcesCount || data.sourceCount) responseText += `📚 ${data.sourcesCount || data.sourceCount} sources`;
      if (!responseText.trim()) responseText = 'Analyse terminée. Aucun contenu structuré n\'a été extrait.';

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
    success('Copié', 'Le texte a été copié dans le presse-papier.');
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

  const editModeLabels: Record<string, string> = {
    enrich: "⚡ Enrichir & actualiser",
    append_update: "📌 Ajouter mise à jour",
    refine_chapo: "✍️ Ajuster chapô & résumé",
    rewrite: "🔄 Restructuration complète"
  };

  if (!isOpen) {
    if (!showFloatingButton) return null;

    return (
      <aside aria-label="Assistant IA Micum" className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={onOpen || onToggle}
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#087443] via-[#09663b] to-[#0A5C36] text-white shadow-xl shadow-emerald-950/25 hover:shadow-2xl hover:scale-105 active:scale-95 border border-emerald-400/30 transition-all duration-200 cursor-pointer group"
          title="Ouvrir Micum (Assistant IA)"
          aria-label="Ouvrir Micum (Assistant IA)"
        >
          <MicumIcon size={22} glow />
          <span className="font-mono text-xs font-bold tracking-wider uppercase">Micum</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
        </button>
      </aside>
    );
  }

  const isDrawer = variant === 'drawer';

  return (
    <>
      {/* Mobile or Drawer backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${isDrawer ? 'block' : 'lg:hidden'}`} 
        onClick={onClose} 
      />

      {/* Panel */}
      <div 
        className={
          isDrawer
            ? "fixed top-0 right-0 bottom-0 w-full sm:w-[400px] xl:w-[420px] z-50 bg-white flex flex-col h-full shadow-2xl border-l border-[#e6dfd5] transition-transform duration-200"
            : "fixed top-0 right-0 bottom-0 w-full sm:w-[380px] lg:relative lg:w-[400px] xl:w-[420px] z-50 lg:z-auto shrink-0 border-l border-[#e6dfd5] bg-white flex flex-col h-full shadow-xl lg:shadow-none"
        }
      >

        {/* Header */}
        <div className="shrink-0 px-4 py-3 border-b border-[#e6dfd5] bg-[#faf8f5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MicumIcon size={28} glow />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#141414]">Micum</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                {providerInfo && (
                  <span className="text-[10px] font-mono text-[#736c62]">
                    {providerInfo.modelName}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="p-1.5 text-[#736c62] hover:text-[#141414] hover:bg-[#e6dfd5] rounded cursor-pointer"
                  title="Effacer la conversation"
                >
                  <RefreshCw size={15} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#736c62] hover:text-[#141414] hover:bg-[#e6dfd5] rounded cursor-pointer"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

          {/* Suggestions when no messages */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-5">
              <MicumIcon size={48} glow />
              <h3 className="text-lg font-serif font-bold text-[#141414]">
                {isEditing ? "Réviser avec Micum" : "Trouvez de nouvelles idées"}
              </h3>
              <div className="space-y-2 w-full">
                {getSuggestions().map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-[#141414] bg-[#faf8f5] hover:bg-[#e6dfd5] border border-[#e6dfd5] rounded-xl transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </span>
                    <ChevronRight size={14} className="text-[#736c62] group-hover:text-[#141414]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] bg-emerald-50 border border-emerald-200 rounded-2xl rounded-br-md px-4 py-2.5">
                  <p className="text-xs font-mono text-[#141414] whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <div className="bg-white border border-[#e6dfd5] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MicumIcon size={16} />
                      <span className="text-[10px] font-mono font-bold text-[#087443] uppercase">Micum</span>
                    </div>
                    <div className="text-xs font-serif text-[#333] whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {msg.rawData && (
                    <div className="flex flex-wrap gap-1 pl-1">
                      {(msg.rawData.content || msg.rawData.body || msg.rawData.description) && onInsertToBody && (
                        <button
                          onClick={() => onInsertToBody(msg.rawData.content || msg.rawData.body || msg.rawData.description)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer transition-colors"
                        >
                          <Download size={12} />
                          <span>Insérer dans le corps</span>
                        </button>
                      )}
                      {msg.rawData.excerpt && onReplaceField && (
                        <button
                          onClick={() => onReplaceField('excerpt', msg.rawData.excerpt)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer transition-colors"
                        >
                          <Replace size={12} />
                          <span>Remplacer le chapô</span>
                        </button>
                      )}
                      {msg.rawData.title && onReplaceField && (
                        <button
                          onClick={() => onReplaceField('title', msg.rawData.title)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer transition-colors"
                        >
                          <Replace size={12} />
                          <span>Remplacer le titre</span>
                        </button>
                      )}
                      {onApplyAll && (
                        <button
                          onClick={() => onApplyAll(msg.rawData)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer transition-colors"
                        >
                          <Check size={12} />
                          <span>Tout appliquer</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#736c62] hover:text-[#141414] hover:bg-[#faf8f5] px-2 py-1 rounded cursor-pointer transition-colors"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedId === msg.id ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-[#736c62]">
              <MicumIcon size={16} />
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#087443] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#087443] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#087443] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] font-mono">Micum réfléchit...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="shrink-0 px-4 pb-2 flex flex-wrap gap-1.5">
            {attachedFiles.map(f => (
              <div key={f.id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#faf8f5] border border-[#e6dfd5] rounded text-[10px] font-mono text-[#444]">
                {f.type.startsWith('image/') ? <ImageIcon size={11} /> : <Paperclip size={11} />}
                <span className="max-w-[100px] truncate">{f.name}</span>
                {f.isUploading && <Loader2 size={10} className="animate-spin text-[#087443]" />}
                <button onClick={() => setAttachedFiles(prev => prev.filter(x => x.id !== f.id))} className="text-[#736c62] hover:text-rose-600 cursor-pointer"><X size={10} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="shrink-0 border-t border-[#e6dfd5] bg-white px-3 py-3 space-y-2">

          {/* Edit mode selector */}
          {isEditing && showEditModes && (
            <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-lg p-2 space-y-1 mb-2">
              <span className="text-[10px] font-mono font-bold text-[#736c62] uppercase">Stratégie de révision :</span>
              {Object.entries(editModeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setEditMode(key as any); setShowEditModes(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-[11px] font-mono rounded cursor-pointer transition-colors ${editMode === key ? 'bg-[#087443] text-white' : 'text-[#333] hover:bg-[#e6dfd5]'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl px-3 py-2 focus-within:border-[#087443] transition-colors">
            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.md,.csv,.json,.doc,.docx"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 text-[#736c62] hover:text-[#141414] rounded cursor-pointer"
                title="Joindre un fichier"
              >
                <Plus size={18} />
              </button>
              {isEditing && (
                <button
                  onClick={() => setShowEditModes(!showEditModes)}
                  className={`p-1 rounded cursor-pointer transition-colors ${showEditModes ? 'text-[#087443] bg-emerald-50' : 'text-[#736c62] hover:text-[#141414]'}`}
                  title="Stratégie de révision"
                >
                  <Sliders size={16} />
                </button>
              )}
            </div>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Demander à Micum..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-xs font-mono text-[#141414] placeholder:text-[#999] py-0.5 leading-relaxed"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() && attachedFiles.length === 0}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[#087443] text-white disabled:bg-[#ccc] disabled:cursor-not-allowed cursor-pointer transition-colors hover:bg-[#075f37] mb-0.5"
            >
              <ArrowUp size={14} />
            </button>
          </div>

          <p className="text-[9px] font-mono text-[#999] text-center">
            Micum peut faire des erreurs. Vérifiez les informations.
          </p>
        </div>
      </div>
    </>
  );
}
