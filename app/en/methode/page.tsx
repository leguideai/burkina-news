import Link from 'next/link';
import { CheckCircle, FileText, Database, Archive, Edit3, ShieldCheck, Calculator } from 'lucide-react';

export const metadata = {
  title: 'Our Methodology | Burkina News',
  description: 'Journalistic methodology, hierarchy of sources, and transparency principles at Burkina News.',
};

export default function MethodePageEn() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pb-8 mb-12 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          Transparency & Methodological Rigor
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] leading-tight mb-4">
          Our Working Methodology
        </h1>
        <p className="text-base sm:text-lg text-[#555555]">
          To restore public trust in reporting, we make our evidence criteria, source hierarchy, and verification protocols completely transparent and auditable.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 relative">
        
        {/* Sticky Table of Contents */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24 space-y-4 bg-white p-5 border border-[#e6dfd5]">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 border-b border-[#e6dfd5]">
              Contents
            </h3>
            <ul className="space-y-2.5 text-xs font-serif text-[#555555]">
              <li><a href="#positioning" className="hover:text-[#0b4627] transition-colors block">1. Our Positioning</a></li>
              <li><a href="#sources" className="hover:text-[#0b4627] transition-colors block">2. Hierarchy of Sources</a></li>
              <li><a href="#tracker" className="hover:text-[#0b4627] transition-colors block">3. The Project Tracker</a></li>
              <li><a href="#verification" className="hover:text-[#0b4627] transition-colors block">4. Verification Protocol</a></li>
              <li><a href="#archiving" className="hover:text-[#0b4627] transition-colors block">5. Evidence Archival</a></li>
              <li><a href="#corrections" className="hover:text-[#0b4627] transition-colors block">6. Correction Registry</a></li>
              <li><a href="#data-audit" className="hover:text-[#0b4627] transition-colors block">7. Quantitative Data Auditing</a></li>
            </ul>
          </div>
        </div>

        {/* Content Body */}
        <div className="w-full md:w-3/4 space-y-12 text-[#333333] leading-relaxed">
          
          {/* Section 1 */}
          <section id="positioning" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#0b4627] font-mono font-bold flex items-center justify-center text-sm">01</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141414]">1. Our Editorial Positioning</h2>
            </div>
            <p className="mb-4">
              Burkina News is neither an institutional mouthpiece nor an opposition platform. We observe the state from a strictly documentary and factual perspective: <em>the government sets its goals; we independently record delivery and progression.</em>
            </p>
            <p>
              We cover structural reforms, major national construction sites, and macroeconomic data by examining tangible physical evidence and auditable public accounts.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sources" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#0b4627] font-mono font-bold flex items-center justify-center text-sm">02</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141414]">2. Strict Hierarchy of Sources</h2>
            </div>
            <p className="mb-4">
              Every data point published on Burkina News is classified according to a 5-tier evidential hierarchy:
            </p>
            <ol className="space-y-3 list-decimal list-inside text-sm bg-[#faf8f5] p-5 border border-[#e6dfd5]">
              <li><strong>Institutional Primary Sources:</strong> Reports by DGMG, INSD, BCEAO, ministerial decrees, and certified administrative budgets.</li>
              <li><strong>Verifiable Multilateral Bodies:</strong> IMF, World Bank, African Development Bank, UN agencies, WHO, FAO.</li>
              <li><strong>Direct Field Verification:</strong> Visual observation, photographic capture, and on-site reporting by our correspondents.</li>
              <li><strong>Contractors and Technical Partners:</strong> Progress audit sheets, concession contracts, certified handover minutes.</li>
              <li><strong>Third-party Press:</strong> Used solely as alert signals, never as stand-alone evidence.</li>
            </ol>
          </section>

          {/* Section 3 */}
          <section id="tracker" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#0b4627] font-mono font-bold flex items-center justify-center text-sm">03</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141414]">3. The Project Tracker Lifecycle</h2>
            </div>
            <p className="mb-4">
              The Tracker monitors major structural projects across Burkina Faso through 6 sequential statuses. No project advances to a subsequent status without a validated primary proof document:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                <strong className="text-[#141414] block mb-1">1. Announced</strong>
                <span>Official communication in Council of Ministers or public presidential speech.</span>
              </div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                <strong className="text-[#141414] block mb-1">2. Committed</strong>
                <span>Secured financing, signed decree, or finalized procurement contract.</span>
              </div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                <strong className="text-[#141414] block mb-1">3. Under Construction</strong>
                <span>Physical works underway, verified on the ground with date-stamped photographic evidence.</span>
              </div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                <strong className="text-[#141414] block mb-1">4. Inaugurated</strong>
                <span>Official commissioning or formal state ceremony.</span>
              </div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                <strong className="text-[#141414] block mb-1">5. Operational</strong>
                <span>Effective service delivery (megawatts on the grid, traffic open, water flowing).</span>
              </div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                <strong className="text-[#141414] block mb-1">6. Impact Measured</strong>
                <span>Independent evaluation of actual output compared to original pledge.</span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="verification" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#0b4627] font-mono font-bold flex items-center justify-center text-sm">04</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141414]">4. Adversarial Verification (Red Team Test)</h2>
            </div>
            <p className="mb-4">
              Prior to publishing any investigation or major data update, we apply an editorial stress test (“Red Team Test”): an independent desk editor scrutinizes every number, attempting to find methodological discrepancies, conflicting filings, or alternate interpretations.
            </p>
            <p>
              If a claim cannot withstand documentary challenge, it is either refined, downgraded in certainty, or withheld from publication.
            </p>
          </section>

          {/* Section 5 */}
          <section id="archiving" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#0b4627] font-mono font-bold flex items-center justify-center text-sm">05</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141414]">5. Evidence Archival</h2>
            </div>
            <p className="mb-4">
              Web links and online press articles are fragile and subject to disappearance. For every primary document we reference:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm text-[#444444]">
              <li>We capture a digital snapshot and store the permanent URI.</li>
              <li>Official statistical bulletins and decree PDFs are duplicated in our offline documentary archive in Bobo-Dioulasso.</li>
              <li>Every fact published in The Brief retains an immutable anchor permalink.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="corrections" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#0b4627] font-mono font-bold flex items-center justify-center text-sm">06</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141414]">6. Public Correction Registry</h2>
            </div>
            <p className="mb-4">
              We never modify an article silently. When a factual inaccuracy is identified or a newly published institutional report supersedes earlier data, we publish a full correction entry in our <Link href="/en/corrections" className="text-[#0b4627] font-bold underline">Correction Registry</Link>.
            </p>
            <p>
              Each entry specifies the previous wording, the revised factual text, the reason for the update, and the validating desk.
            </p>
          </section>

          {/* Section 7 */}
          <section id="data-audit" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-[#f4eee3] text-[#0b4627] font-mono font-bold flex items-center justify-center text-sm">07</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#141414]">7. Quantitative Data Auditing</h2>
            </div>
            <p className="mb-4">
              Statistics published by government agencies are audited against cross-sectional indicators:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm text-[#444444]">
              <li>Gold production is cross-checked against custom export declarations, DGI royalties, and regional mining chambers.</li>
              <li>Installed electrical capacity is systematically distinguished from effective feed-in power delivered to the national grid.</li>
              <li>Agricultural projections are correlated with regional rainfall indexes, seed allocations, and UN FAO food balances.</li>
            </ul>
          </section>

        </div>

      </div>

    </div>
  );
}
