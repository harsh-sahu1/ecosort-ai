import React, { useState } from 'react';
import type { RecommendationResponse } from '../types';
import {
  Wrench,
  RefreshCw,
  Gift,
  Recycle,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Leaf,
  RotateCcw,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

interface ResultViewProps {
  result: RecommendationResponse;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  // Track checklist progress for user interaction
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Visual theming based on recommendation type
  const getTheme = () => {
    switch (result.recommendation) {
      case 'SAFETY_ALERT':
        return {
          bgBadge: 'bg-red-500/20 text-red-300 border-red-500/40',
          gradientBg: 'from-red-950/50 via-slate-900 to-slate-950',
          borderAccent: 'border-red-500/40',
          accentColor: 'text-red-400',
          icon: <AlertTriangle className="w-10 h-10 text-red-400" />,
        };
      case 'REPAIR':
        return {
          bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          gradientBg: 'from-amber-950/40 via-slate-900 to-slate-950',
          borderAccent: 'border-amber-500/40',
          accentColor: 'text-amber-400',
          icon: <Wrench className="w-10 h-10 text-amber-400" />,
        };
      case 'REUSE':
        return {
          bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          gradientBg: 'from-cyan-950/40 via-slate-900 to-slate-950',
          borderAccent: 'border-cyan-500/40',
          accentColor: 'text-cyan-400',
          icon: <RefreshCw className="w-10 h-10 text-cyan-400" />,
        };
      case 'DONATE':
        return {
          bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          gradientBg: 'from-purple-950/40 via-slate-900 to-slate-950',
          borderAccent: 'border-purple-500/40',
          accentColor: 'text-purple-400',
          icon: <Gift className="w-10 h-10 text-purple-400" />,
        };
      case 'RECYCLE':
      default:
        return {
          bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          gradientBg: 'from-emerald-950/40 via-slate-900 to-slate-950',
          borderAccent: 'border-emerald-500/40',
          accentColor: 'text-emerald-400',
          icon: <Recycle className="w-10 h-10 text-emerald-400" />,
        };
    }
  };

  const theme = getTheme();

  return (
    <section className="py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Primary Recommendation Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-10 border bg-gradient-to-b ${theme.gradientBg} ${theme.borderAccent} shadow-2xl relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${theme.bgBadge} flex items-center gap-1.5`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic Assessment • {result.confidence} Confidence</span>
          </span>

          <span className="text-xs text-slate-400">
            Assessed: <span className="text-white capitalize font-semibold">{result.device_snapshot.brand !== 'Unknown' ? `${result.device_snapshot.brand} ` : ''}{result.device_snapshot.device_type}</span>
          </span>
        </div>

        <div className="flex items-start gap-5 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0">
            {theme.icon}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {result.recommendation_label}
            </h1>
            <p className="text-base text-slate-300 mt-2 font-medium leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Why section */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 mt-6">
          <div className="flex items-center gap-2 mb-2 text-sm font-bold text-white uppercase tracking-wider">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Why this recommendation?</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {result.why}
          </p>
        </div>
      </div>

      {/* Safety Warnings Banner (Critical if battery hazard) */}
      {result.safety_warnings && result.safety_warnings.length > 0 && (
        <div className="p-6 rounded-3xl bg-red-950/40 border-2 border-red-500/50 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-red-300 font-bold text-lg">
            <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 animate-bounce" />
            <span>Critical Safety Warnings</span>
          </div>
          <p className="text-xs text-red-200/80">
            Immediate precautions required to avoid thermal runaway, sparks, or chemical exposure:
          </p>
          <ul className="space-y-2 pt-1">
            {result.safety_warnings.map((warn, i) => (
              <li key={i} className="text-sm text-red-100 flex items-start gap-2 bg-red-900/20 p-2.5 rounded-xl border border-red-500/20">
                <span className="text-red-400 font-bold mt-0.5">⚠️</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Snapshot & Key Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Snapshot */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📱</span> Device Snapshot
          </h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Type</span>
              <span className="text-white font-medium capitalize">{result.device_snapshot.device_type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Category</span>
              <span className="text-white font-medium capitalize">{result.device_snapshot.category}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Brand / Model</span>
              <span className="text-white font-medium">
                {result.device_snapshot.brand || 'Unknown'} {result.device_snapshot.model && `(${result.device_snapshot.model})`}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Visible Condition</span>
              <span className="text-white font-medium capitalize">{result.device_snapshot.visible_condition}</span>
            </div>
          </div>
        </div>

        {/* Key Decision Factors */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎯</span> Key Decision Factors
          </h3>
          <ul className="space-y-2.5">
            {result.key_factors.map((factor, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Plan Checklist */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              Practical Action Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Follow these recommended preparation and disposal steps before handing over the device:
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-center">
            {Object.values(completedSteps).filter(Boolean).length} / {result.action_steps.length} Done
          </span>
        </div>

        <div className="space-y-3">
          {result.action_steps.map((step, idx) => {
            const isChecked = !!completedSteps[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleStep(idx)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 group ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-600 group-hover:border-emerald-400 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">Step {idx + 1}</span>
                  </div>
                  <p
                    className={`text-sm mt-0.5 ${
                      isChecked ? 'line-through text-slate-400' : 'text-slate-200'
                    }`}
                  >
                    {step}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Environmental Impact Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {result.environmental_impact.title}
            </h3>
            <span className="text-[11px] text-slate-400">
              *Estimates based on circular economy lifecycle benchmarks
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
              Estimated Climate & Resource Impact
            </span>
            <p className="text-base font-bold text-white">
              {result.environmental_impact.headline_metric}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block mb-1">
              Hazardous Landfill Leaching Diverted
            </span>
            <p className="text-sm font-medium text-slate-200">
              {result.environmental_impact.landfill_hazard_prevented}
            </p>
          </div>
        </div>

        {/* Salvageable Materials */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Recoverable & Closed-Loop Materials
          </span>
          <div className="flex flex-wrap gap-2">
            {result.environmental_impact.materials_salvageable.map((mat, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              >
                ♻️ {mat}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3 italic">
          "{result.environmental_impact.qualitative_impact}"
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10">
        <div>
          <h4 className="text-sm font-bold text-white">
            Have another device in your closet or drawer?
          </h4>
          <p className="text-xs text-slate-400">
            Assess smartphones, tablets, batteries, power banks, and cables in seconds.
          </p>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze Another Device</span>
        </button>
      </div>
    </section>
  );
};
