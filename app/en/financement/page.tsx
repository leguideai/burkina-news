import { Shield, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Funding & Independence | Burkina News',
  description: 'Full transparency regarding our financial structure, revenue model, and editorial autonomy.',
};

export default function FinancementPageEn() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center pb-8 mb-10 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          Economic Transparency
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] leading-tight mb-3">
          Who Funds Burkina News
        </h1>
        <p className="text-base sm:text-lg text-[#555555] max-w-2xl mx-auto">
          Editorial independence begins with financial clarity. Here is our economic model.
        </p>
      </div>

      {/* Intro Box */}
      <div className="bg-white border border-[#141414] p-6 mb-12">
        <p className="text-base text-[#141414] leading-relaxed">
          Our economic framework is designed to guarantee uncompromised freedom of investigation. We accept no direct governmental subsidies, no disguised native advertising, and no commercial partnerships capable of creating conflicts of interest with our reporting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        
        {/* Breakdown */}
        <div>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-4 pb-2 border-b border-[#e6dfd5]">
            Resource Allocation (2026)
          </h2>

          <div className="space-y-4 text-xs font-serif">
            <div className="bg-white border border-[#e6dfd5] p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#141414]">Founding Newsroom Equity</h3>
                <p className="text-[#737373] mt-0.5">Initial capital committed to ensure total autonomy</p>
              </div>
              <span className="text-2xl font-bold font-mono text-[#0b4627]">60%</span>
            </div>

            <div className="bg-white border border-[#e6dfd5] p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#141414]">Independent Press Foundations</h3>
                <p className="text-[#737373] mt-0.5">Non-binding grants for data journalism and fact-checking</p>
              </div>
              <span className="text-2xl font-bold font-mono text-[#0b4627]">30%</span>
            </div>

            <div className="bg-[#faf8f5] border border-dashed border-[#e6dfd5] p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#737373]">Reader Memberships (Phase 2)</h3>
                <p className="text-[#737373] mt-0.5">Direct reader support and premium documentary briefs</p>
              </div>
              <span className="text-2xl font-bold font-mono text-[#737373]">10%</span>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-4 pb-2 border-b border-[#e6dfd5]">
            Our Inviolable Rules
          </h2>

          <div className="space-y-4 text-xs font-serif text-[#333333] leading-relaxed">
            <div className="p-4 bg-white border border-[#e6dfd5]">
              <h4 className="font-bold text-sm text-[#141414] mb-1">1. Zero Editorial Interference</h4>
              <p className="text-[#555555]">
                No contributor, funder, or donor has prior knowledge of investigations or the ability to influence coverage.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#e6dfd5]">
              <h4 className="font-bold text-sm text-[#141414] mb-1">2. Absolute Firewall on Advertising</h4>
              <p className="text-[#555555]">
                We publish no commercial advertorials or institutional promotional content. All published material reflects purely editorial judgment.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#e6dfd5]">
              <h4 className="font-bold text-sm text-[#141414] mb-1">3. Public Disclosure</h4>
              <p className="text-[#555555]">
                Any philanthropic or institutional support exceeding 5% of our annual budget is listed openly in our annual transparency report.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
