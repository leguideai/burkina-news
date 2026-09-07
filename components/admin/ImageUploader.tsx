"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Link2, 
  Trash2, 
  Check, 
  Loader2, 
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useToast } from './Toast';
import Tooltip from '@/components/ui/Tooltip';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  helperText = "Glissez une image locale ou collez une URL externe (JPG, PNG, WebP, max 10 Mo)",
  required = false,
  className = "",
}: ImageUploaderProps) {
  const { success, error, warning, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');

  // Keep local url input in sync if external value changes
  React.useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  // Handle local file selection
  const handleFileProcess = async (file: File) => {
    if (!file) return;

    // Check mime type
    if (!file.type.startsWith('image/')) {
      warning('Format de fichier non supporté', 'Veuillez sélectionner une image valide.');
      return;
    }

    // Check size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      error('Fichier trop volumineux', "L'image ne doit pas dépasser 10 Mo.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Try uploading to server via /api/admin/upload
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          setUrlInput(data.url);
          success('Image locale téléversée', file.name);
          setIsUploading(false);
          return;
        }
      }

      // 2. Fallback to Base64 data URL if API endpoint is unreachable or static
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setUrlInput(base64);
        info('Image locale prête', file.name);
        setIsUploading(false);
      };
      reader.onerror = () => {
        throw new Error('Erreur de lecture locale');
      };
      reader.readAsDataURL(file);

    } catch (err: any) {
      console.error('Upload error:', err);
      // Fallback base64
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          onChange(base64);
          setUrlInput(base64);
          info('Image locale chargée en mémoire', file.name);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (e) {
        error('Erreur', "Échec du téléversement de l'image locale.");
        setIsUploading(false);
      }
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // reset input so the same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Handle URL input submission
  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      info('Lien appliqué', 'Le lien image a été mis à jour.');
    }
  };

  // Handle image removal
  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine type of image source for badge
  const isLocalUpload = value?.startsWith('/uploads/');
  const isInternal = value?.startsWith('/images/');
  const isBase64 = value?.startsWith('data:image/');

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-mono uppercase font-bold text-[#141414]">
          {label} {required && <span className="text-[#d32f2f]">*</span>}
        </label>

        {/* Source Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded border border-[#e2e8f0] text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-white text-[#087443] font-bold shadow-xs'
                : 'text-[#64748b] hover:text-[#141414]'
            }`}
          >
            <UploadCloud size={11} />
            <span>Fichier local</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'url'
                ? 'bg-white text-[#087443] font-bold shadow-xs'
                : 'text-[#64748b] hover:text-[#141414]'
            }`}
          >
            <Link2 size={11} />
            <span>Lien URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Main Container */}
      <div className="border border-[#e6dfd5] rounded-lg p-3 bg-[#faf8f5]/50 space-y-3">
        {/* If an image is already set: Preview Card */}
        {value ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-2.5 rounded-md border border-[#e6dfd5] shadow-xs">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-28 h-20 bg-[#f1f5f9] rounded overflow-hidden border border-[#e2e8f0] shrink-0 group">
              <img
                src={value}
                alt="Aperçu de l'image"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/lead.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Tooltip position="top" content="Ouvrir l'image en taille réelle">
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-white/90 text-[#141414] rounded hover:bg-white transition-colors"
                    aria-label="Ouvrir l'image en taille réelle"
                  >
                    <ExternalLink size={14} />
                  </a>
                </Tooltip>
              </div>
            </div>

            {/* Image Details and Actions */}
            <div className="flex-1 min-w-0 space-y-1 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isLocalUpload
                    ? 'bg-emerald-100 text-emerald-800'
                    : isBase64
                    ? 'bg-amber-100 text-amber-800'
                    : isInternal
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  <Check size={10} />
                  {isLocalUpload
                    ? 'Téléversé en local (/uploads/)'
                    : isBase64
                    ? 'Fichier local intégré (Base64)'
                    : isInternal
                    ? 'Image interne (/images/)'
                    : 'URL Web Externe'}
                </span>
              </div>

              <p className="text-[11px] font-mono text-[#736c62] truncate max-w-full" title={value}>
                {value}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Tooltip position="top" content="Parcourir l'ordinateur pour remplacer cette image">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:underline font-bold cursor-pointer"
                  >
                    <RefreshCw size={11} className={isUploading ? 'animate-spin' : ''} />
                    <span>Remplacer depuis l'ordinateur</span>
                  </button>
                </Tooltip>

                <span className="text-[#d1d5db]">•</span>

                <Tooltip position="top" content="Retirer cette image">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d32f2f] hover:underline cursor-pointer"
                  >
                    <Trash2 size={11} />
                    <span>Supprimer</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State: Uploader Zone */
          <>
            {activeMode === 'upload' ? (
              /* Drag & Drop Upload Zone */
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#087443] bg-emerald-50/70 scale-[1.01]'
                    : 'border-[#cbd5e1] hover:border-[#087443] bg-white hover:bg-[#faf8f5]'
                }`}
              >
                {isUploading ? (
                  <div className="py-2 flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-[#087443]" />
                    <span className="text-xs font-mono font-bold text-[#087443]">
                      Téléversement local en cours...
                    </span>
                  </div>
                ) : (
                  <div className="py-1 flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#087443] flex items-center justify-center mb-1">
                      <UploadCloud size={20} />
                    </div>
                    <div className="text-xs font-mono font-bold text-[#141414]">
                      Glissez une image ici, ou <span className="text-[#087443] underline">parcourez votre ordinateur</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#736c62]">
                      PNG, JPG, WebP, SVG ou AVIF (jusqu'à 10 Mo)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* URL Mode Input */
              <div className="space-y-2 bg-white p-3 rounded border border-[#e2e8f0]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... ou /images/lead.jpeg"
                    className="flex-1 px-3 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-[#087443] text-white text-xs font-mono font-bold rounded hover:bg-[#0a5c36] transition-colors shrink-0 cursor-pointer"
                  >
                    Valider le lien
                  </button>
                </div>
                <p className="text-[10px] font-mono text-[#736c62]">
                  Collez un lien d'image externe direct ou un chemin local du site.
                </p>
              </div>
            )}
          </>
        )}

        {/* Bottom Helper */}
        <p className="text-[10px] font-mono text-[#736c62]">
          {helperText}
        </p>
      </div>
    </div>
  );
}
