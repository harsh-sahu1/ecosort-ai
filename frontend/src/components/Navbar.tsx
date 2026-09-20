import React from 'react';
import { History, Layers } from 'lucide-react';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onManualSelect: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onManualSelect,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onReset}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d131f] rounded-[10px] flex items-center justify-center">
              <span className="text-xl">♻️</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                EcoSort<span className="text-emerald-400"> AI</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Smart Assistant
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400 font-medium">
              Know it. Decide it. Recycle it responsibly.
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="#how-it-works"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            How it works
          </a>

          <button
            onClick={onManualSelect}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 transition-all"
            title="Manual fallback if camera or AI is unavailable"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Manual</span> Mode
          </button>

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500 text-black">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
