import React from 'react';
import type { HistoryItem } from '../types';
import { X, Trash2, Clock } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onClear,
}) => {
  if (!isOpen) return null;

  const formatRecBadge = (rec: string) => {
    switch (rec) {
      case 'SAFETY_ALERT':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'REPAIR':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'REUSE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'DONATE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'RECYCLE':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getEmoji = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('laptop') || t.includes('pc')) return '💻';
    if (t.includes('phone')) return '📱';
    if (t.includes('tablet')) return '📟';
    if (t.includes('battery')) return '🔋';
    if (t.includes('headphone')) return '🎧';
    if (t.includes('monitor')) return '🖥️';
    return '📦';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#0d131f] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Assessment History</h3>
                <p className="text-xs text-slate-400">Stored locally in your browser</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <span className="text-4xl block mb-2 opacity-50">📋</span>
              <p className="text-sm font-semibold text-slate-300">No previous assessments</p>
              <p className="text-xs mt-1 text-slate-400">
                Upload or analyze a device and its recommendation will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                      {getEmoji(item.device_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white capitalize">
                          {item.device_type}
                        </span>
                        {item.brand && item.brand !== 'Unknown' && (
                          <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                            {item.brand}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 capitalize block">
                        Condition: {item.visible_condition}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${formatRecBadge(
                      item.recommendation
                    )}`}
                  >
                    {item.recommendation}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {items.length} {items.length === 1 ? 'record' : 'records'} cached
            </span>
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
