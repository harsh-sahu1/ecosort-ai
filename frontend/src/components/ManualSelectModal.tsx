import React, { useState } from 'react';
import type { DeviceAnalysis } from '../types';
import { X, Layers, ArrowRight } from 'lucide-react';

interface ManualSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDevice: (device: DeviceAnalysis) => void;
}

const CATEGORIES = [
  { type: 'smartphone', name: 'Smartphone', emoji: '📱', category: 'mobile electronics', brand: 'Samsung / Apple' },
  { type: 'laptop', name: 'Laptop', emoji: '💻', category: 'computing', brand: 'Dell / Lenovo / HP' },
  { type: 'tablet', name: 'Tablet', emoji: '📟', category: 'mobile electronics', brand: 'Apple iPad' },
  { type: 'monitor', name: 'Monitor / Display', emoji: '🖥️', category: 'peripherals', brand: 'LG / Dell' },
  { type: 'battery', name: 'Battery / Power Pack', emoji: '🔋', category: 'power & accessories', brand: 'Generic OEM' },
  { type: 'power bank', name: 'Power Bank', emoji: '⚡', category: 'power & accessories', brand: 'Anker' },
  { type: 'headphones', name: 'Headphones / Earphones', emoji: '🎧', category: 'audio', brand: 'Sony / JBL' },
  { type: 'keyboard', name: 'Keyboard', emoji: '⌨️', category: 'peripherals', brand: 'Logitech' },
  { type: 'mouse', name: 'Mouse', emoji: '🖱️', category: 'peripherals', brand: 'Logitech' },
  { type: 'printer', name: 'Printer / Scanner', emoji: '🖨️', category: 'computing peripherals', brand: 'HP' },
  { type: 'charger', name: 'Charger / Cable', emoji: '🔌', category: 'power & accessories', brand: 'Universal' },
  { type: 'other', name: 'Other Small Electronics', emoji: '📦', category: 'general electronics', brand: 'Unknown' },
];

export const ManualSelectModal: React.FC<ManualSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectDevice,
}) => {
  const [selectedType, setSelectedType] = useState('smartphone');
  const [condition, setCondition] = useState('damaged');
  const [damageNotes, setDamageNotes] = useState('cracked screen');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const item = CATEGORIES.find((c) => c.type === selectedType) || CATEGORIES[0];
    const issues = damageNotes.trim() ? damageNotes.split(',').map((s) => s.trim()) : [];

    onSelectDevice({
      device_type: item.type,
      category: item.category,
      brand: item.brand,
      model: 'User specified',
      visible_condition: condition,
      visible_damage: issues,
      confidence: 1.0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Manual Device Selection</h3>
              <p className="text-xs text-slate-400">Select hardware manually to test or bypass photo upload</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Select Device Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.type}
                type="button"
                onClick={() => setSelectedType(cat.type)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  selectedType === cat.type
                    ? 'border-emerald-400 bg-emerald-500/15 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-xs truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Condition Selector */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Visible Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="pristine">Pristine / Like new</option>
              <option value="good">Good condition</option>
              <option value="fair">Fair / Used</option>
              <option value="worn">Worn / Scuffed</option>
              <option value="damaged">Damaged</option>
              <option value="severely damaged">Severely Damaged</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Visible Damage Note
            </label>
            <input
              type="text"
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              placeholder="e.g. cracked screen, dent"
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Proceed with Device</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
