"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  Type, 
  Trash2, 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Link2, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Undo2, 
  Redo2,
  Image as ImageIcon,
  Loader2,
  FileText,
  Eye,
  Edit3
} from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import ArticleBodyRenderer from '@/components/editorial/ArticleBodyRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = "Rédigez le texte de l'enquête ici...",
  label = "TEXT",
  minHeight = "min-h-[280px]",
  onDelete,
  onMoveUp,
  onMoveDown,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Synchronize history when external value changes drastically
  useEffect(() => {
    if (history[historyIndex] !== value) {
      setHistory(prev => {
        const next = prev.slice(0, historyIndex + 1);
        next.push(value);
        return next.slice(-40); // keep last 40 steps
      });
      setHistoryIndex(prev => Math.min(prev + 1, 39));
    }
  }, [value]);

  const updateValueWithHistory = useCallback((newValue: string) => {
    onChange(newValue);
  }, [onChange]);

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      onChange(history[newIdx]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      onChange(history[newIdx]);
    }
  };

  // Apply formatting (Bold, Italic, Link, Headings, etc.)
  const applyFormat = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultPlaceholder;

    const replacement = `${prefix}${textToInsert}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    updateValueWithHistory(newValue);

    // Reposition cursor after update
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText 
        ? start + replacement.length 
        : start + prefix.length;
      textarea.setSelectionRange(
        selectedText ? newCursorPos : newCursorPos + defaultPlaceholder.length,
        selectedText ? newCursorPos : newCursorPos + defaultPlaceholder.length
      );
    }, 10);
  };

  // Insert block formatting at beginning of line (H1, H2, H3, Lists, Quote)
  const applyLineFormat = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;

    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    updateValueWithHistory(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 10);
  };

  // Handle local image upload inside text
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Format de fichier non supporté. Veuillez sélectionner une image.');
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const caption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          applyFormat(`\n\n![${caption}](`, `${data.url})\n\n`, '');
          setIsUploadingImage(false);
          return;
        }
      }

      // Fallback to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        applyFormat(`\n\n![Photo](`, `${base64})\n\n`, '');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingImage(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle local PDF / Document upload inside text
  const handleDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const isPdf = file.name.toLowerCase().endsWith('.pdf');
          const badge = isPdf ? '(PDF)' : '(DOCUMENT)';
          applyFormat(`\n\n[${cleanName} ${badge}](`, `${data.url})\n\n`, '');
          setIsUploadingDoc(false);
          return;
        }
      }

      alert('Échec du téléversement du document. Veuillez vérifier le fichier.');
      setIsUploadingDoc(false);
    } catch {
      alert("Erreur réseau lors de l'envoi du document.");
      setIsUploadingDoc(false);
    } finally {
      if (docInputRef.current) {
        docInputRef.current.value = '';
      }
    }
  };

  // Clear or delete content
  const handleClearOrDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      if (confirm('Voulez-vous effacer l\'intégralité du texte ?')) {
        updateValueWithHistory('');
      }
    }
  };

  // Character and word count
  const charCount = value ? value.length : 0;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 sm:p-5 shadow-xs transition-all">
      <div className="flex items-start gap-2.5 sm:gap-3.5">
        
        {/* Left Drag & Reorder Controls */}
        <div className="flex flex-col items-center gap-1.5 pt-1 text-[#94a3b8] shrink-0 select-none">
          <Tooltip position="right" content="Monter le bloc">
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1 hover:text-[#141414] hover:bg-[#f1f5f9] rounded transition-colors cursor-pointer"
              aria-label="Monter le bloc"
            >
              <ArrowUp size={16} />
            </button>
          </Tooltip>
          
          <Tooltip position="right" content="Glisser pour réorganiser">
            <div className="p-1 cursor-grab active:cursor-grabbing hover:text-[#141414]" aria-label="Déplacer le bloc">
              <GripVertical size={16} />
            </div>
          </Tooltip>

          <Tooltip position="right" content="Descendre le bloc">
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 hover:text-[#141414] hover:bg-[#f1f5f9] rounded transition-colors cursor-pointer"
              aria-label="Descendre le bloc"
            >
              <ArrowDown size={16} />
            </button>
          </Tooltip>
        </div>

        {/* Main Editor Card */}
        <div className="flex-1 min-w-0 space-y-3">
          
          {/* Top Bar inside Card (Badge + Supprimer) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0] rounded-md text-[11px] font-mono font-bold tracking-wider uppercase">
                <Type size={13} className="text-[#64748b]" />
                <span>{label}</span>
              </div>

              {/* Mode Toggle: Édition / Aperçu Direct */}
              <div className="inline-flex items-center p-0.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'edit'
                      ? 'bg-white text-[#087443] font-bold shadow-2xs'
                      : 'text-[#64748b] hover:text-[#141414]'
                  }`}
                >
                  <Edit3 size={12} />
                  <span>Édition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'preview'
                      ? 'bg-[#087443] text-white font-bold shadow-2xs'
                      : 'text-[#64748b] hover:text-[#141414]'
                  }`}
                >
                  <Eye size={12} />
                  <span>Aperçu Réel</span>
                </button>
              </div>
            </div>

            {/* Supprimer button */}
            <Tooltip position="left" content="Effacer ou supprimer le contenu du bloc">
              <button
                type="button"
                onClick={handleClearOrDelete}
                className="inline-flex items-center gap-1.5 text-xs font-serif text-[#94a3b8] hover:text-[#e11d48] transition-colors py-1 px-1.5 rounded hover:bg-rose-50 cursor-pointer"
                aria-label="Supprimer le bloc"
              >
                <Trash2 size={14} />
                <span>Supprimer</span>
              </button>
            </Tooltip>
          </div>

          {/* Inner Rounded Editor Box */}
          <div className="border border-[#e2e8f0] rounded-lg overflow-hidden bg-white shadow-2xs focus-within:border-[#087443] transition-colors">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-[#e2e8f0] text-[#334155]">
              
              {/* Group 1: Basic Inline Styles */}
              <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#e2e8f0]">
                <Tooltip position="top" content="Gras (Ctrl+B)">
                  <button
                    type="button"
                    onClick={() => applyFormat('**', '**', 'texte en gras')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors cursor-pointer"
                    aria-label="Gras"
                  >
                    <Bold size={15} strokeWidth={2.5} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Italique (Ctrl+I)">
                  <button
                    type="button"
                    onClick={() => applyFormat('*', '*', 'texte en italique')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors cursor-pointer"
                    aria-label="Italique"
                  >
                    <Italic size={15} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Barré">
                  <button
                    type="button"
                    onClick={() => applyFormat('~~', '~~', 'texte barré')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors cursor-pointer"
                    aria-label="Barré"
                  >
                    <Strikethrough size={15} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Code en ligne">
                  <button
                    type="button"
                    onClick={() => applyFormat('`', '`', 'code')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors font-mono cursor-pointer"
                    aria-label="Code en ligne"
                  >
                    <Code size={15} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Insérer un lien web">
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Entrez le lien URL :');
                      if (url) applyFormat('[', `](${url})`, 'lien');
                    }}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors cursor-pointer"
                    aria-label="Insérer un lien"
                  >
                    <Link2 size={15} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Insérer une image locale">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors relative cursor-pointer"
                    aria-label="Téléverser une image"
                  >
                    {isUploadingImage ? (
                      <Loader2 size={15} className="animate-spin text-[#087443]" />
                    ) : (
                      <ImageIcon size={15} />
                    )}
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Insérer un document PDF / Preuve d'audit">
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    disabled={isUploadingDoc}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors relative cursor-pointer"
                    aria-label="Téléverser un document PDF ou preuve"
                  >
                    {isUploadingDoc ? (
                      <Loader2 size={15} className="animate-spin text-red-600" />
                    ) : (
                      <FileText size={15} className="text-red-700" />
                    )}
                  </button>
                </Tooltip>
              </div>

              {/* Group 2: Headings */}
              <div className="flex items-center gap-0.5 px-1.5 border-r border-[#e2e8f0]">
                <Tooltip position="top" content="Titre principal H1">
                  <button
                    type="button"
                    onClick={() => applyLineFormat('# ')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors font-bold text-xs cursor-pointer"
                    aria-label="Titre H1"
                  >
                    <Heading1 size={16} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Sous-titre H2">
                  <button
                    type="button"
                    onClick={() => applyLineFormat('## ')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors font-bold text-xs cursor-pointer"
                    aria-label="Sous-titre H2"
                  >
                    <Heading2 size={16} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Intertitre H3">
                  <button
                    type="button"
                    onClick={() => applyLineFormat('### ')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors font-bold text-xs cursor-pointer"
                    aria-label="Intertitre H3"
                  >
                    <Heading3 size={16} />
                  </button>
                </Tooltip>
              </div>

              {/* Group 3: Lists */}
              <div className="flex items-center gap-0.5 px-1.5 border-r border-[#e2e8f0]">
                <Tooltip position="top" content="Liste à puces">
                  <button
                    type="button"
                    onClick={() => applyLineFormat('- ')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors cursor-pointer"
                    aria-label="Liste à puces"
                  >
                    <List size={15} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Liste numérotée">
                  <button
                    type="button"
                    onClick={() => applyLineFormat('1. ')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors cursor-pointer"
                    aria-label="Liste numérotée"
                  >
                    <ListOrdered size={15} />
                  </button>
                </Tooltip>
              </div>

              {/* Group 4: Quotes */}
              <div className="flex items-center gap-0.5 px-1.5 border-r border-[#e2e8f0]">
                <Tooltip position="top" content="Citation / Exergue">
                  <button
                    type="button"
                    onClick={() => applyLineFormat('> ')}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] rounded transition-colors cursor-pointer"
                    aria-label="Citation"
                  >
                    <Quote size={15} />
                  </button>
                </Tooltip>
              </div>

              {/* Group 5: History Undo / Redo */}
              <div className="flex items-center gap-0.5 pl-1.5">
                <Tooltip position="top" content="Annuler (Ctrl+Z)">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] disabled:text-[#cbd5e1] disabled:hover:bg-transparent rounded transition-colors cursor-pointer"
                    aria-label="Annuler"
                  >
                    <Undo2 size={15} />
                  </button>
                </Tooltip>

                <Tooltip position="top" content="Rétablir (Ctrl+Y)">
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-1.5 hover:bg-[#f1f5f9] text-[#1e293b] disabled:text-[#cbd5e1] disabled:hover:bg-transparent rounded transition-colors cursor-pointer"
                    aria-label="Rétablir"
                  >
                    <Redo2 size={15} />
                  </button>
                </Tooltip>
              </div>

            </div>

            {/* Content Area: Editor or Live Preview */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv"
                onChange={handleDocumentSelect}
                className="hidden"
              />
              {viewMode === 'edit' ? (
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => updateValueWithHistory(e.target.value)}
                  placeholder={placeholder}
                  className={`w-full ${minHeight} p-4 sm:p-5 font-serif text-sm text-[#1e293b] leading-relaxed focus:outline-none resize-y bg-white placeholder-[#94a3b8]`}
                />
              ) : (
                <div className={`w-full ${minHeight} p-4 sm:p-8 bg-[#faf8f5] overflow-y-auto border-t border-[#f1f5f9]`}>
                  <div className="max-w-3xl mx-auto bg-white border border-[#e6dfd5] p-5 sm:p-8 shadow-xs rounded-xl">
                    <div className="mb-4 pb-2 border-b border-[#e6dfd5] flex items-center justify-between text-xs font-mono text-[#736c62]">
                      <span className="font-bold text-[#087443] flex items-center gap-1.5">
                        <Eye size={14} /> Aperçu du Rendu Public (Images, Liens, Pièces PDF)
                      </span>
                      <span className="bg-[#087443]/10 text-[#087443] px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                        Vue Visiteur
                      </span>
                    </div>
                    <ArticleBodyRenderer content={value} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar: Character Count */}
            <div className="px-4 py-2 border-t border-[#f1f5f9] bg-[#fafafa] flex items-center justify-between text-xs font-serif text-[#94a3b8]">
              <span>
                {charCount.toLocaleString('fr-FR')} caractère{charCount > 1 ? 's' : ''}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
