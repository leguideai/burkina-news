"use client";

import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  FileText, 
  Download, 
  Camera, 
  Maximize2, 
  X, 
  Quote as QuoteIcon
} from 'lucide-react';

interface ArticleBodyRendererProps {
  content: string;
  lang?: 'fr' | 'en';
  className?: string;
}

export default function ArticleBodyRenderer({
  content,
  lang = 'fr',
  className = '',
}: ArticleBodyRendererProps) {
  const [lightbox, setLightbox] = useState<{ url: string; caption: string; source?: string } | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null);
      }
    };
    if (lightbox) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [lightbox]);

  if (!content || !content.trim()) {
    return (
      <div className="p-8 text-center text-[#737373] font-serif italic bg-[#faf8f5] border border-[#e6dfd5] rounded">
        {lang === 'en' 
          ? 'Full investigation content is being digitized and archived.' 
          : "Contenu documentaire complet en cours d'archivage."}
      </div>
    );
  }

  // Parse inline elements (links, bold, italic, inline code)
  const renderInline = (text: string) => {
    // Regex tokens: links [text](url), bold **text**, italic *text*, code `text`
    const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(text)) !== null) {
      // Add plain text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const [, , linkText, linkUrl, boldText, italicText, codeText] = match;

      if (linkText && linkUrl) {
        const isPdf = linkUrl.toLowerCase().endsWith('.pdf') || linkText.toLowerCase().includes('pdf');
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 font-medium transition-colors ${
              isPdf
                ? 'text-[#b91c1c] hover:text-[#991b1b] underline decoration-[#b91c1c]/40 font-semibold'
                : 'text-[#087443] hover:text-[#065330] underline decoration-[#087443]/40 hover:decoration-[#087443]'
            }`}
          >
            {isPdf && <FileText size={13} className="inline text-red-600 shrink-0" />}
            <span>{linkText}</span>
            <ExternalLink size={11} className="inline opacity-70 shrink-0" />
          </a>
        );
      } else if (boldText) {
        parts.push(<strong key={match.index} className="font-bold text-[#141414]">{boldText}</strong>);
      } else if (italicText) {
        parts.push(<em key={match.index} className="italic">{italicText}</em>);
      } else if (codeText) {
        parts.push(
          <code key={match.index} className="font-mono text-xs bg-[#f1f5f9] text-[#0f172a] px-1.5 py-0.5 rounded border border-[#e2e8f0]">
            {codeText}
          </code>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Split content into blocks by double newlines
  const rawBlocks = content.split(/\n\n+/);
  let firstNarrativeRendered = false;

  return (
    <div className={`article-body-content space-y-6 text-[#222222] font-serif leading-[1.8] ${className}`}>
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Image Check: Markdown ![alt](url) or <img>
        const imgMarkdownMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        const imgHtmlMatch = trimmed.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i);

        if (imgMarkdownMatch || imgHtmlMatch) {
          let url = '';
          let rawAlt = '';

          if (imgMarkdownMatch) {
            rawAlt = imgMarkdownMatch[1] || '';
            url = imgMarkdownMatch[2] || '';
          } else if (imgHtmlMatch) {
            url = imgHtmlMatch[1] || '';
            const altAttr = trimmed.match(/alt=["']([^"']*)["']/i);
            rawAlt = altAttr ? altAttr[1] : '';
          }

          // Check if alt has split source: "Caption | Source: AFP"
          let caption = rawAlt;
          let source = '';
          if (rawAlt.includes('|')) {
            const splitted = rawAlt.split('|');
            caption = splitted[0].trim();
            source = splitted.slice(1).join('|').replace(/source\s*:\s*/i, '').trim();
          }

          return (
            <figure
              key={bIdx}
              className="my-8 overflow-hidden rounded-xl border border-[#e6dfd5] bg-[#faf8f5] shadow-xs group transition-all"
            >
              <div className="relative overflow-hidden bg-neutral-900/5 flex items-center justify-center max-h-[560px]">
                <img
                  src={url}
                  alt={caption || 'Photographie d\'enquête'}
                  className="w-full h-auto max-h-[560px] object-cover sm:object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => setLightbox({ url, caption, source })}
                  className="absolute top-3 right-3 p-2 bg-[#141414]/70 hover:bg-[#141414] text-white rounded-lg backdrop-blur-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-mono"
                  aria-label="Agrandir la photographie"
                >
                  <Maximize2 size={14} />
                  <span className="hidden sm:inline">Agrandir</span>
                </button>
              </div>
              <figcaption className="p-3.5 sm:p-4 border-t border-[#e6dfd5] text-xs font-serif text-[#555] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#fdfcf9]">
                <div className="flex items-start sm:items-center gap-2">
                  <Camera size={15} className="text-[#087443] shrink-0 mt-0.5 sm:mt-0" />
                  <span className="italic text-[#333] leading-relaxed">
                    {caption || (lang === 'en' ? 'Documentary photographic evidence.' : 'Photographie documentaire versée au dossier.')}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {source ? (
                    <span className="font-mono text-[10px] text-[#777] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#e6dfd5]">
                      Source : {source}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[#087443] font-bold uppercase tracking-wider bg-[#087443]/10 px-2 py-0.5 rounded">
                      Archive Rédaction
                    </span>
                  )}
                </div>
              </figcaption>
            </figure>
          );
        }

        // 2. Standalone PDF / Official Document Link Card
        // Detects standalone markdown link pointing to a PDF, DOC, or named (PDF)
        const docLinkMatch = trimmed.match(/^\[(.*?)\]\((.*?)\)$/);
        if (docLinkMatch) {
          const docTitle = docLinkMatch[1];
          const docUrl = docLinkMatch[2];
          const isDocFile = 
            docUrl.toLowerCase().endsWith('.pdf') || 
            docUrl.toLowerCase().endsWith('.doc') || 
            docUrl.toLowerCase().endsWith('.docx') ||
            docTitle.toLowerCase().includes('pdf') ||
            docTitle.toLowerCase().includes('rapport') ||
            docTitle.toLowerCase().includes('document');

          if (isDocFile) {
            return (
              <div 
                key={bIdx}
                className="my-7 p-4 sm:p-5 bg-[#faf8f5] border-2 border-[#141414] rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg shrink-0 border border-red-200">
                    <FileText size={26} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 bg-[#141414] text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded">
                        {lang === 'en' ? 'PRIMARY EVIDENCE' : 'PIÈCE DU DOSSIER'}
                      </span>
                      <span className="font-mono text-[10px] text-[#737373] uppercase">
                        {docUrl.toLowerCase().endsWith('.pdf') ? 'Format PDF' : 'Document officiel'}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#141414] leading-snug">
                      {docTitle}
                    </h4>
                    <p className="font-serif text-xs text-[#666] leading-relaxed">
                      {lang === 'en' 
                        ? 'Certified primary source document cross-referenced in this investigation.' 
                        : 'Document officiel source certifié versé aux archives de la rédaction.'}
                    </p>
                  </div>
                </div>

                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#087443] hover:bg-[#075f37] text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0 w-full sm:w-auto justify-center"
                >
                  <Download size={14} />
                  <span>{lang === 'en' ? 'Download / View' : 'Consulter / Télécharger'}</span>
                </a>
              </div>
            );
          }
        }

        // 3. Headings
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={bIdx} className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] pt-8 pb-3 border-b-2 border-[#141414] mt-8 mb-4">
              {trimmed.replace(/^#\s+/, '')}
            </h2>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={bIdx} className="text-xl sm:text-2xl font-serif font-bold text-[#141414] pt-6 pb-2 border-b border-[#e6dfd5] mt-6 mb-3">
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={bIdx} className="text-lg sm:text-xl font-serif font-bold text-[#141414] pt-4 pb-1 mt-4 mb-2">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }
        // Legacy **Titre** on standalone line
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('\n')) {
          return (
            <h3 key={bIdx} className="text-xl sm:text-2xl font-serif font-bold text-[#141414] pt-6 pb-2 border-b border-[#e6dfd5] mt-6 mb-3">
              {trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '')}
            </h3>
          );
        }

        // 4. Blockquotes / Exergues
        if (trimmed.startsWith('> ') || (trimmed.startsWith('«') && trimmed.includes('»'))) {
          const quoteText = trimmed.startsWith('> ') ? trimmed.replace(/^>\s*/, '') : trimmed;
          return (
            <blockquote 
              key={bIdx}
              className="relative border-l-4 border-[#087443] pl-5 sm:pl-6 pr-4 py-4 sm:py-5 my-6 sm:my-8 italic text-[#141414] bg-[#faf8f5] rounded-r-xl font-serif text-lg sm:text-xl leading-relaxed shadow-2xs"
            >
              <div className="absolute top-3 right-4 text-[#087443]/15 pointer-events-none">
                <QuoteIcon size={36} />
              </div>
              <div className="relative z-10">
                {renderInline(quoteText)}
              </div>
            </blockquote>
          );
        }

        // 5. Unordered list (- or *)
        const lines = trimmed.split('\n');
        if (lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          return (
            <ul key={bIdx} className="space-y-2.5 my-5 pl-2 list-none">
              {lines.map((l, lIdx) => {
                const itemContent = l.trim().replace(/^[-*]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-base sm:text-lg">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#087443] mt-2.5 shrink-0" />
                    <span className="flex-1">{renderInline(itemContent)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 6. Ordered list (1., 2.)
        if (lines.every(line => /^\d+\.\s+/.test(line.trim()))) {
          return (
            <ol key={bIdx} className="space-y-2.5 my-5 pl-2 list-none">
              {lines.map((l, lIdx) => {
                const match = l.trim().match(/^(\d+)\.\s+(.*)$/);
                const num = match ? match[1] : `${lIdx + 1}`;
                const itemContent = match ? match[2] : l.trim();
                return (
                  <li key={lIdx} className="flex items-start gap-3 text-base sm:text-lg">
                    <span className="font-mono text-xs font-bold text-[#087443] bg-[#087443]/10 px-2 py-0.5 rounded shrink-0 mt-1">
                      {num}.
                    </span>
                    <span className="flex-1">{renderInline(itemContent)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // 7. Regular narrative paragraph
        // First paragraph gets the drop-cap (lettrine)
        const isFirstNarrative = !firstNarrativeRendered;
        firstNarrativeRendered = true;

        return (
          <p
            key={bIdx}
            className={`text-base sm:text-lg text-[#222222] leading-[1.8] ${
              isFirstNarrative
                ? "first-letter:float-left first-letter:text-4xl sm:first-letter:text-5xl first-letter:pr-2.5 sm:first-letter:pr-3 first-letter:font-bold first-letter:text-[#141414] first-letter:font-serif first-letter:leading-none"
                : ""
            }`}
          >
            {renderInline(trimmed)}
          </p>
        );
      })}

      {/* Interactive Lightbox Overlay */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <div className="w-full flex justify-between items-center text-white mb-3 px-2">
              <span className="font-mono text-xs text-neutral-400">
                {lang === 'en' ? 'DOCUMENTARY ARCHIVE VIEWER' : 'ARCHIVES VISUELLES BURKINA NEWS'}
              </span>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="p-1.5 text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors cursor-pointer"
                aria-label="Fermer la vue plein écran"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950 flex items-center justify-center max-h-[75vh]">
              <img
                src={lightbox.url}
                alt={lightbox.caption}
                className="w-auto h-auto max-h-[75vh] max-w-full object-contain"
              />
            </div>

            {/* Bottom Caption & Source */}
            <div className="w-full mt-3 p-3 bg-neutral-900/90 border border-neutral-800 rounded-lg text-white text-xs font-serif flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-emerald-400 shrink-0" />
                <span className="italic">{lightbox.caption || 'Photographie documentaire'}</span>
              </div>
              {lightbox.source && (
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  Source : {lightbox.source}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
