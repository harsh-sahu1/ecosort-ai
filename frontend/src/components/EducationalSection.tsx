import React from 'react';
import { Pickaxe, Globe2, Compass } from 'lucide-react';

export const EducationalSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Circular Economy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
            Why Responsible Electronics Disposal Matters
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Over 62 million metric tons of electronic waste are generated globally every year. Here is why structured sorting makes a massive difference:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Pickaxe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Urban Mining & Critical Minerals
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1 million recycled mobile phones yield roughly 24 kg of gold, 350 kg of silver, and 9,000 kg of refined copper. Recycling e-waste prevents destructive open-pit mining in fragile ecosystems.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Preventing Landfill Toxins
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When discarded into regular municipal bins, lead in circuit boards, cadmium in chips, and mercury in displays leach into groundwater supplies, accumulating in food chains.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Embodied Carbon Preservation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Up to 80% of a laptop or smartphone's total lifetime carbon footprint occurs during the semiconductor manufacturing stage. Repairing or donating delays replacement manufacturing emissions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
