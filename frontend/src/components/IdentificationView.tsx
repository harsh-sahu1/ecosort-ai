import React from 'react';
import type { DeviceAnalysis } from '../types';
import { ArrowRight, Edit3, Cpu } from 'lucide-react';

interface IdentificationViewProps {
  device: DeviceAnalysis | null;
  imagePreviewUrl: string | null;
  isLoading: boolean;
  onProceedToQuestions: () => void;
  onEditDevice: () => void;
  onReset: () => void;
}

export const IdentificationView: React.FC<IdentificationViewProps> = ({
  device,
  imagePreviewUrl,
  isLoading,
  onProceedToQuestions,
  onEditDevice,
  onReset,
}) => {
  if (isLoading) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center">
        <div className="glass-panel p-10 rounded-3xl border border-white/10 relative overflow-hidden">
          {/* Radar scanning simulation bar */}
          <div className="relative w-48 h-48 mx-auto mb-8 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Scanning device"
                className="w-full h-full object-cover opacity-70"
              />
            ) : (
              <Cpu className="w-16 h-16 text-emerald-400/40" />
            )}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent scan-line shadow-[0_0_15px_#34d399]" />
          </div>

          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-lg mb-2">
            <span className="text-xl">🔍</span>
            <span>Identifying your device...</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Analyzing device form-factor, visible chassis damage, and screen conditions using computer vision.
          </p>
        </div>
      </div>
    );
  }

  if (!device) return null;

  // Icon selector based on device type
  const getDeviceEmoji = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('laptop') || t.includes('pc') || t.includes('computer')) return '💻';
    if (t.includes('phone') || t.includes('smartphone')) return '📱';
    if (t.includes('tablet') || t.includes('ipad')) return '📟';
    if (t.includes('monitor') || t.includes('tv') || t.includes('screen')) return '🖥️';
    if (t.includes('battery') || t.includes('power bank')) return '🔋';
    if (t.includes('headphone') || t.includes('earphone')) return '🎧';
    if (t.includes('keyboard')) return '⌨️';
    if (t.includes('mouse')) return '🖱️';
    if (t.includes('printer')) return '🖨️';
    if (t.includes('charger') || t.includes('cable')) return '🔌';
    if (t.includes('watch')) return '⌚';
    return '📦';
  };

  const confidencePct = Math.round(device.confidence * 100);

  return (
    <section className="py-8 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
        {/* Step Badge */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Step 2 • Identification Confirmed
          </span>
          <button
            onClick={onEditDevice}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Not accurate? Edit</span>
          </button>
        </div>

        {/* Main Identification Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
            {getDeviceEmoji(device.device_type)}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h2 className="text-2xl font-black text-white capitalize">
                {device.device_type}
              </h2>
              {device.brand && device.brand !== 'Unknown' && (
                <span className="text-xs font-medium text-slate-300 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                  {device.brand}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-400 mb-3 capitalize">
              Category: {device.category}
              {device.model && device.model !== 'Not identifiable' && ` • ${device.model}`}
            </p>

            {/* Confidence Bar */}
            <div className="flex items-center gap-3">
              <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                {confidencePct}% Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Visible Condition & Issues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Visible Condition
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                device.visible_condition.toLowerCase().includes('damaged')
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`} />
              <span className="text-base font-bold text-white capitalize">
                {device.visible_condition}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Visible Issues Detected
            </span>
            {device.visible_damage && device.visible_damage.length > 0 ? (
              <ul className="space-y-1">
                {device.visible_damage.map((issue, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span className="capitalize">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No severe external structural fractures visible</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={onReset}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors order-2 sm:order-1"
          >
            ← Upload different item
          </button>

          <button
            onClick={onProceedToQuestions}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all order-1 sm:order-2"
          >
            <span>Proceed to Condition Questions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
