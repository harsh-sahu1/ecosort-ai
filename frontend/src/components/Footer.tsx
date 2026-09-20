import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090d15] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">♻️</span>
            <span className="font-bold text-white text-sm tracking-tight">
              EcoSort AI
            </span>
            <span className="text-slate-400">• Know it. Decide it. Recycle it responsibly.</span>
          </div>
        </div>

        {/* Safety Limitations Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Safety & Assessment Disclaimer:</strong> EcoSort AI provides preliminary recommendations based on visual cues and user-provided condition answers. Computer vision models cannot inspect internal chemical integrity, micro-fissures, or battery degradation. For swollen, hot, or leaking lithium-ion batteries, always consult certified municipal hazardous materials facilities and avoid attempting DIY battery removal.
        </div>
      </div>
    </footer>
  );
};
