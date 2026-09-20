import React from 'react';
import { Camera, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick }) => {
  return (
    <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-32 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Intelligent E-Waste Decision Assistant</span>
        </div>

        {/* Hero title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Don't throw it.{' '}
          <span className="eco-gradient-text block sm:inline">
            Know what to do with it.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          AI-powered guidance for repairing, reusing, donating, or responsibly recycling your unwanted electronics.
        </p>

        {/* Call to actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={onAnalyzeClick}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Camera className="w-5 h-5 text-slate-950" />
            <span>Analyze My Device</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/60 hover:border-slate-600 transition-all"
          >
            How it works
          </a>
        </div>

        {/* 3-Step Visual Process */}
        <div id="how-it-works" className="pt-6">
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">
            How EcoSort AI Works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Step 1 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden glass-card-hover border border-white/10">
              <div className="text-4xl font-black text-emerald-500/20 mb-3 font-mono">01</div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Photo</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Take a clear photo of your electronic device. Multimodal computer vision identifies the category and visible wear.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden glass-card-hover border border-white/10">
              <div className="text-4xl font-black text-emerald-500/20 mb-3 font-mono">02</div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quick Assessment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Answer 4 quick functional questions: power status, battery safety, hardware age, and primary symptom.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden glass-card-hover border border-white/10">
              <div className="text-4xl font-black text-emerald-500/20 mb-3 font-mono">03</div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Decide & Act</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive an authoritative recommendation: Repair, Reuse, Donate, or Recycle, paired with data wiping and safety checklists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
