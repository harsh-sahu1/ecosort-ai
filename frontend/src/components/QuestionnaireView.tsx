import React, { useState } from 'react';
import type {
  ConditionAnswers,
  TurnsOnAnswer,
  BatteryHazardAnswer,
  ApproximateAgeAnswer,
  MainProblemAnswer,
  DeviceAnalysis,
} from '../types';
import { ShieldAlert, Sparkles, Check, ArrowLeft, ArrowRight } from 'lucide-react';

interface QuestionnaireViewProps {
  device: DeviceAnalysis;
  onSubmitAnswers: (answers: ConditionAnswers) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const QuestionnaireView: React.FC<QuestionnaireViewProps> = ({
  device,
  onSubmitAnswers,
  onBack,
  isLoading,
}) => {
  const [turnsOn, setTurnsOn] = useState<TurnsOnAnswer>('yes');
  const [batteryHazard, setBatteryHazard] = useState<BatteryHazardAnswer>('no');
  const [approximateAge, setApproximateAge] = useState<ApproximateAgeAnswer>('1_to_3_years');
  const [mainProblem, setMainProblem] = useState<MainProblemAnswer>('minor_issue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAnswers({
      turns_on: turnsOn,
      battery_hazard: batteryHazard,
      approximate_age: approximateAge,
      main_problem: mainProblem,
    });
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Step 3 • Condition Assessment
            </span>
            <span className="text-xs text-slate-400">
              Assessing: <span className="text-white capitalize font-semibold">{device.device_type}</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Confirm a few essential details
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Answer these 4 questions to calculate the safest, most economical, and eco-friendly next step.
          </p>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-amber-300">Safety Notice:</span> A photograph alone cannot determine internal lithium-ion battery health or circuit viability. Your answers are critical for hazardous waste prevention.
          </div>
        </div>

        {/* Question 1: Does the device turn on? */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono font-bold">1</span>
            Does the device currently turn on?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'yes', label: 'Yes', desc: 'Powers on fully' },
              { val: 'no', label: 'No', desc: 'Completely unpowered' },
              { val: 'not_sure', label: 'Not sure', desc: 'Need to test / no charger' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setTurnsOn(opt.val as TurnsOnAnswer)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  turnsOn === opt.val
                    ? 'border-emerald-400 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{opt.label}</span>
                  {turnsOn === opt.val && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <span className="text-[11px] text-slate-400 block leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Is the battery swollen or leaking? */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono font-bold">2</span>
              Is the battery swollen, leaking, overheating, or physically punctured?
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { val: 'yes', label: '⚠️ Yes (Hazard)', danger: true },
              { val: 'no', label: 'No swelling / safe', danger: false },
              { val: 'not_sure', label: 'Not sure', danger: false },
              { val: 'not_applicable', label: 'No battery', danger: false },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setBatteryHazard(opt.val as BatteryHazardAnswer)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  batteryHazard === opt.val
                    ? opt.danger
                      ? 'border-red-500 bg-red-950/40 text-red-200'
                      : 'border-emerald-400 bg-emerald-500/15 text-white'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{opt.label}</span>
                  {batteryHazard === opt.val && (
                    <Check className={`w-3.5 h-3.5 ${opt.danger ? 'text-red-400' : 'text-emerald-400'}`} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 3: How old is the device? */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono font-bold">3</span>
            How old is the device approximately?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { val: 'less_than_1_year', label: '< 1 year' },
              { val: '1_to_3_years', label: '1–3 years' },
              { val: '3_to_5_years', label: '3–5 years' },
              { val: 'more_than_5_years', label: '> 5 years' },
              { val: 'not_sure', label: 'Not sure' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setApproximateAge(opt.val as ApproximateAgeAnswer)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  approximateAge === opt.val
                    ? 'border-emerald-400 bg-emerald-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="text-xs block">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question 4: What is the main problem? */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono font-bold">4</span>
            What is the main problem?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { val: 'no_problem', label: 'Works fine / No problem' },
              { val: 'minor_issue', label: 'Minor issue (slow, glitch)' },
              { val: 'physical_damage', label: 'Physical damage (screen/body)' },
              { val: 'battery_issue', label: 'Battery degrades quickly' },
              { val: 'major_issue', label: 'Major hardware defect' },
              { val: 'completely_non_functional', label: 'Completely non-functional' },
              { val: 'not_sure', label: 'Not sure' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setMainProblem(opt.val as MainProblemAnswer)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mainProblem === opt.val
                    ? 'border-emerald-400 bg-emerald-500/15 text-white'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                  {mainProblem === opt.val && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-1" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to photo identification</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all order-1 sm:order-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Computing Recommendation...' : 'Generate Recommendation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </section>
  );
};
