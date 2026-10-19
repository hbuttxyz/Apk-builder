import React from 'react';
import { UploadCloud, Sliders, Layers, Cpu, CheckCircle2 } from 'lucide-react';

interface WizardStepsProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxReachedStep: number;
}

export const WizardSteps: React.FC<WizardStepsProps> = ({
  currentStep,
  onSelectStep,
  maxReachedStep,
}) => {
  const steps = [
    { num: 1, label: 'Upload & Inspect', icon: UploadCloud },
    { num: 2, label: 'Configure', icon: Sliders },
    { num: 3, label: 'Integrate', icon: Layers },
    { num: 4, label: 'Build APK', icon: Cpu },
    { num: 5, label: 'Download', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full bg-slate-900/40 border-y border-slate-800/80 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0 hidden sm:block" />

        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          const isAccessible = s.num <= maxReachedStep;

          return (
            <button
              key={s.num}
              disabled={!isAccessible}
              onClick={() => onSelectStep(s.num)}
              className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 relative z-10 px-2 sm:px-3 py-1.5 rounded-lg transition text-left ${
                isActive
                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-semibold'
                  : isDone
                  ? 'text-slate-300 hover:text-white cursor-pointer bg-slate-900/60'
                  : isAccessible
                  ? 'text-slate-400 hover:text-slate-200 cursor-pointer'
                  : 'text-slate-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : isDone
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? '✓' : s.num}
              </div>
              <span className="text-[11px] sm:text-xs tracking-tight whitespace-nowrap">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
