import Link from 'next/link';

export const metadata = {
  title: 'About | Burkina News',
  description: 'Our mission, collective editorial organization, and regional presence.',
};

export default function AProposPageEn() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center pb-8 mb-10 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          About · Burkina News
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#141414] leading-tight">
          Understanding Burkina Faso, <br /> documenting reality.
        </h1>
      </div>

      <div className="space-y-12 text-[#333333] leading-relaxed">
        
        {/* Mission Statement */}
        <p className="text-lg sm:text-xl font-medium text-[#141414] leading-relaxed text-center max-w-2xl mx-auto">
          In an informational landscape saturated with short-lived claims and unverified rumors, our mission is to provide auditable facts, statistical rigor, and continuous documentary monitoring of public policy.
        </p>

        {/* What We Do */}
        <section className="pt-8 border-t border-[#e6dfd5]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-6">
            Our Three Core Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-white p-5 border border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-base text-[#141414] mb-2">The Monthly Issue</h3>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                In-depth investigative Deep Dives and sectoral dossiers, published with a complete registry of primary evidence.
              </p>
            </div>
            <div className="bg-white p-5 border border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-base text-[#141414] mb-2">The Brief</h3>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                The weekly summary of the ten major facts of the past week, timestamped and sourced without opinion or spin.
              </p>
            </div>
            <div className="bg-white p-5 border border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-base text-[#141414] mb-2">The Tracker</h3>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                Our public registry of major national infrastructure sites (target objective: 60 audited projects), monitored physically and documentarily through 6 verified statuses.
              </p>
            </div>
          </div>
        </section>

        {/* Collective Editorial Organization */}
        <section className="pt-8 border-t border-[#e6dfd5]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-4">
            Newsroom Structure
          </h2>
          <p className="text-xs sm:text-sm text-[#444444] mb-6 leading-relaxed">
            Burkina News operates under the collective responsibility of our editorial Desks to safeguard total independence, protect field observers, and maintain the absolute primacy of evidence over individual bylines:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
            <div className="border border-[#e6dfd5] bg-white p-5">
              <span className="font-mono text-[10px] uppercase text-[#0b4627] font-bold block mb-1">Desk 01</span>
              <h4 className="font-serif font-bold text-sm text-[#141414] mb-1">Investigation & Field Reporting</h4>
              <p className="text-xs text-[#555555] font-serif">
                Specialized in deep dives, sectoral economic analysis, and on-site physical verifications across regions.
              </p>
            </div>

            <div className="border border-[#e6dfd5] bg-white p-5">
              <span className="font-mono text-[10px] uppercase text-[#0b4627] font-bold block mb-1">Desk 02</span>
              <h4 className="font-serif font-bold text-sm text-[#141414] mb-1">Data & Tracker</h4>
              <p className="text-xs text-[#555555] font-serif">
                Maintains project registries, audits macroeconomic indicators, and tracks the PND RELANCE 2026–2030 targets.
              </p>
            </div>

            <div className="border border-[#e6dfd5] bg-white p-5">
              <span className="font-mono text-[10px] uppercase text-[#0b4627] font-bold block mb-1">Desk 03</span>
              <h4 className="font-serif font-bold text-sm text-[#141414] mb-1">Monitoring & Archival</h4>
              <p className="text-xs text-[#555555] font-serif">
                Produces The Brief each Sunday, manages digital snapshots, verifies regulatory decrees, and conducts adversarial Red Team tests.
              </p>
            </div>
          </div>
        </section>

        {/* Anchoring in Bobo-Dioulasso */}
        <section className="pt-8 border-t border-[#e6dfd5]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-3">
            Anchored in Bobo-Dioulasso & Ouagadougou
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-4">
            Locating our investigative desk in Bobo-Dioulasso provides an immediate proximity to agro-industrial basins, industrial mining belts, energy corridors, and major infrastructure links in western Burkina Faso.
          </p>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            Our Ouagadougou desk maintains permanent access to ministerial decrees, National Assembly records, and multilateral publications.
          </p>
        </section>

        {/* The Promise */}
        <div className="p-6 bg-[#f4eee3] border border-[#e6dfd5] text-center">
          <h3 className="font-serif font-bold text-base text-[#141414] mb-2">
            Our Core Promise
          </h3>
          <p className="text-xs text-[#444444] max-w-xl mx-auto leading-relaxed">
            Every figure published on Burkina News can be verified by its readers. We build a lasting archive of what is truly being accomplished.
          </p>
        </div>

      </div>

    </div>
  );
}
