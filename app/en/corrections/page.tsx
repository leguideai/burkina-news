import { AlertTriangle, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Correction Registry | Burkina News',
  description: 'Our public registry documenting all post-publication corrections and statistical updates.',
};

export default function CorrectionsPageEn() {
  const corrections = [
    { 
      date: '2026-08-15', 
      articleTitle: 'Is Burkina Faso producing more gold than before?', 
      previousText: 'Production of 59 tonnes in 2025', 
      correctedText: 'Production of 57.6 tonnes in 2025', 
      reason: 'Correction following release of definitive statistical figures by DGMG', 
      validatedBy: 'Editorial Committee' 
    },
    { 
      date: '2026-07-28', 
      articleTitle: 'Zina Solar Power Plant', 
      previousText: 'Connected to grid in May 2026', 
      correctedText: 'Connected to grid in June 2026', 
      reason: 'Commissioning date adjusted based on statutory SONABEL technical report', 
      validatedBy: 'Data & Tracker Desk' 
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center pb-8 mb-10 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          Transparency & Rigor
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] leading-tight mb-3">
          Public Correction Registry
        </h1>
        <p className="text-sm sm:text-base text-[#555555]">
          Every post-publication modification, factual rectification, or data precision is recorded publicly here.
        </p>
      </div>

      {/* Policy Note */}
      <div className="bg-white border border-[#e6dfd5] p-6 mb-10">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-2 pb-2 border-b border-[#e6dfd5]">
          Correction Protocol
        </h3>
        <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
          When a factual error or updated official statistic is identified in our investigations or Tracker dossiers, we correct the article directly, append the primary source, and permanently log the change in this public registry.
        </p>
      </div>

      {/* Corrections List */}
      <div className="space-y-6">
        {corrections.map((correction, i) => (
          <div key={i} className="border border-[#e6dfd5] bg-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 border-b border-[#e6dfd5] pb-3">
              <div>
                <span className="font-mono text-xs text-[#737373]">
                  {new Date(correction.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h2 className="text-lg font-bold text-[#141414] mt-0.5">
                  {correction.articleTitle}
                </h2>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold bg-[#f4eee3] text-[#0b4627] px-2.5 py-1 border border-[#e6dfd5]">
                Verified Correction
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
              <div className="bg-[#fef2f2] border border-red-200 p-3">
                <span className="font-mono uppercase font-bold text-red-700 text-[10px] block mb-1">
                  Previous Wording (Pre-audit):
                </span>
                <p className="text-red-900 line-through">
                  {correction.previousText}
                </p>
              </div>

              <div className="bg-[#f0fdf4] border border-green-200 p-3">
                <span className="font-mono uppercase font-bold text-green-700 text-[10px] block mb-1">
                  Rectified Factual Text:
                </span>
                <p className="text-green-900 font-semibold">
                  {correction.correctedText}
                </p>
              </div>
            </div>

            <div className="text-xs text-[#555555] bg-[#faf8f5] p-3 border border-[#e6dfd5] flex flex-col sm:flex-row justify-between gap-2">
              <p>
                <strong>Justification:</strong> {correction.reason}
              </p>
              <span className="font-mono text-[10px] text-[#737373] shrink-0">
                Validated by {correction.validatedBy}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center pt-8 border-t border-[#e6dfd5]">
        <p className="text-xs text-[#737373] mb-3">
          Notice a discrepancy in our data or reports?
        </p>
        <Link 
          href="/en/contact"
          className="inline-block px-5 py-2.5 bg-[#0b4627] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#072e1a] transition-colors"
        >
          Submit an Error Report →
        </Link>
      </div>

    </div>
  );
}
