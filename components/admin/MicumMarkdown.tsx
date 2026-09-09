"use client";

import React, { useMemo } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';

interface MicumMarkdownProps {
  content: string;
  className?: string;
  hideJsonBlocks?: boolean;
}

/**
 * Parses inline formatting:
 * - Bold: **text**
 * - Italic: *text* or _text_
 * - Code: `text`
 * - Links: [text](url)
 */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const [fullMatch, , linkText, linkUrl, boldText, italicText, codeText] = match;

    if (linkText && linkUrl) {
      parts.push(
        <a
          key={`link-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#087443] hover:text-[#065330] underline font-medium inline-flex items-center gap-0.5"
        >
          <span>{linkText}</span>
          <ExternalLink size={10} className="inline opacity-70 shrink-0" />
        </a>
      );
    } else if (boldText) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-bold text-[#141414]">
          {boldText}
        </strong>
      );
    } else if (italicText) {
      parts.push(
        <em key={`em-${match.index}`} className="italic text-[#2b2723]">
          {italicText}
        </em>
      );
    } else if (codeText) {
      parts.push(
        <code
          key={`code-${match.index}`}
          className="font-mono text-[11px] bg-[#f4eee3] text-[#087443] px-1 py-0.5 rounded border border-[#e6dfd5]"
        >
          {codeText}
        </code>
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export default function MicumMarkdown({
  content,
  className = '',
  hideJsonBlocks = true,
}: MicumMarkdownProps) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Clean raw JSON insertion blocks if requested so user sees clean prose
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    if (hideJsonBlocks) {
      // Remove JSON code block at the end that is typically used for form insertion
      const stripped = content.replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/gi, '').trim();
      return stripped || content;
    }
    return content;
  }, [content, hideJsonBlocks]);

  // Block parser
  const parsedElements = useMemo(() => {
    if (!sanitizedContent) return null;

    const lines = sanitizedContent.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // 1. Empty lines
      if (!trimmed) {
        i++;
        continue;
      }

      // 2. Code Block
      if (trimmed.startsWith('```')) {
        const lang = trimmed.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        const fullCode = codeLines.join('\n');
        nodes.push(
          <div key={`codeblock-${nodes.length}`} className="my-2 rounded-lg border border-[#e6dfd5] bg-[#1a1a1a] text-slate-100 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#252525] border-b border-neutral-700 text-[10px] font-mono text-neutral-400">
              <span>{lang || 'code'}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(fullCode)}
                className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Copier le code"
              >
                {copiedCode === fullCode ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400">Copié</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-emerald-300">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        continue;
      }

      // 3. Headings
      if (trimmed.startsWith('### ')) {
        nodes.push(
          <h4 key={`h3-${nodes.length}`} className="font-serif font-bold text-xs text-[#141414] mt-2.5 mb-1 tracking-tight">
            {renderInlineMarkdown(trimmed.slice(4))}
          </h4>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        nodes.push(
          <h3 key={`h2-${nodes.length}`} className="font-serif font-bold text-sm text-[#141414] mt-3 mb-1.5 border-b border-[#e6dfd5]/60 pb-1">
            {renderInlineMarkdown(trimmed.slice(3))}
          </h3>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        nodes.push(
          <h2 key={`h1-${nodes.length}`} className="font-serif font-bold text-sm text-[#141414] mt-3 mb-1.5 border-b border-[#e6dfd5] pb-1">
            {renderInlineMarkdown(trimmed.slice(2))}
          </h2>
        );
        i++;
        continue;
      }

      // 4. Blockquote
      if (trimmed.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
          i++;
        }
        nodes.push(
          <blockquote key={`quote-${nodes.length}`} className="my-2 pl-3 border-l-2 border-[#087443] bg-[#fbf9f6] py-1.5 pr-2 rounded-r italic font-serif text-xs text-[#3d3832] leading-relaxed">
            {renderInlineMarkdown(quoteLines.join(' '))}
          </blockquote>
        );
        continue;
      }

      // 5. Horizontal rule
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        nodes.push(<hr key={`hr-${nodes.length}`} className="my-3 border-[#e6dfd5]" />);
        i++;
        continue;
      }

      // 6. Unordered List (bullet items: * or -)
      if (/^[-*]\s+/.test(trimmed)) {
        const listItems: React.ReactNode[] = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
          const itemText = lines[i].trim().replace(/^[-*]\s+/, '');
          listItems.push(
            <li key={`li-${listItems.length}`} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#087443] select-none font-bold text-xs mt-0.5 shrink-0">•</span>
              <span className="min-w-0 flex-1">{renderInlineMarkdown(itemText)}</span>
            </li>
          );
          i++;
        }
        nodes.push(
          <ul key={`ul-${nodes.length}`} className="my-2 space-y-1.5 pl-0.5 text-xs">
            {listItems}
          </ul>
        );
        continue;
      }

      // 7. Ordered List (numbers: 1. 2. etc.)
      if (/^\d+\.\s+/.test(trimmed)) {
        const listItems: React.ReactNode[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          const matchNum = lines[i].trim().match(/^(\d+)\.\s+(.*)$/);
          if (matchNum) {
            const num = matchNum[1];
            const itemText = matchNum[2];
            listItems.push(
              <li key={`oli-${listItems.length}`} className="flex items-start gap-2 leading-relaxed">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#f4eee3] text-[#087443] font-mono font-bold text-[10px] shrink-0 mt-0.5 border border-[#e6dfd5]">
                  {num}
                </span>
                <span className="min-w-0 flex-1">{renderInlineMarkdown(itemText)}</span>
              </li>
            );
          }
          i++;
        }
        nodes.push(
          <ol key={`ol-${nodes.length}`} className="my-2 space-y-1.5 pl-0.5 text-xs">
            {listItems}
          </ol>
        );
        continue;
      }

      // 8. Regular Paragraph
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].trim().startsWith('```') &&
        !lines[i].trim().startsWith('#') &&
        !lines[i].trim().startsWith('>') &&
        !lines[i].trim().startsWith('---') &&
        !/^[-*]\s+/.test(lines[i].trim()) &&
        !/^\d+\.\s+/.test(lines[i].trim())
      ) {
        paragraphLines.push(lines[i].trim());
        i++;
      }

      if (paragraphLines.length > 0) {
        nodes.push(
          <p key={`p-${nodes.length}`} className="leading-relaxed text-xs text-[#222]">
            {renderInlineMarkdown(paragraphLines.join(' '))}
          </p>
        );
      }
    }

    return nodes;
  }, [sanitizedContent, copiedCode]);

  return (
    <div className={`space-y-2 font-serif ${className}`}>
      {parsedElements}
    </div>
  );
}
