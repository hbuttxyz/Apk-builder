import React from 'react';
import { Sliders, Smartphone, AlertCircle, ArrowLeft, ArrowRight, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { BuildConfig, ProjectInspection } from '../types/builder';

interface Step2ConfigureProps {
  config: BuildConfig;
  onChangeConfig: (newConfig: BuildConfig) => void;
  inspection: ProjectInspection | null;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2Configure: React.FC<Step2ConfigureProps> = ({
  config,
  onChangeConfig,
  inspection,
  onPrev,
  onNext,
}) => {
  // Validate package ID format
  const isPackageIdValid = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i.test(config.packageId);

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-sky-400 font-semibold">Step 2 of 5</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Android Application Configuration</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Configure identity metadata, Android platform targets, orientation, and icon settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-5">
          {/* App Name & Package ID */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Identity & Manifest Parameters
            </h3>

            {/* App Name */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Application Name (User-Visible Label)
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => onChangeConfig({ ...config, appName: e.target.value })}
                placeholder="My Application"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Package ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Android Package ID / Application ID
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  reverse-domain: com.domain.app
                </span>
              </div>
              <input
                type="text"
                value={config.packageId}
                onChange={(e) => onChangeConfig({ ...config, packageId: e.target.value.toLowerCase() })}
                placeholder="com.example.app"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm font-mono focus:outline-none ${
                  isPackageIdValid
                    ? 'border-slate-800 text-emerald-400 focus:border-emerald-500'
                    : 'border-rose-500/80 text-rose-300 focus:border-rose-500'
                }`}
              />
              {!isPackageIdValid && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Must be dot-separated reverse domain (e.g. com.fc.ioslauncher)
                </p>
              )}
            </div>
          </div>

          {/* Versions & SDK */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Build Versioning & Target SDK
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Version Name</label>
                <input
                  type="text"
                  value={config.versionName}
                  onChange={(e) => onChangeConfig({ ...config, versionName: e.target.value })}
                  placeholder="1.0.0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Version Code</label>
                <input
                  type="number"
                  min="1"
                  value={config.versionCode}
                  onChange={(e) =>
                    onChangeConfig({ ...config, versionCode: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Minimum SDK */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Minimum Android SDK
              </label>
              <select
                value={config.minSdk}
                onChange={(e) => onChangeConfig({ ...config, minSdk: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value={26}>API 26 — Android 8.0 (Oreo) • 94.6% Device Reach</option>
                <option value={28}>API 28 — Android 9.0 (Pie) • 89.2% Device Reach</option>
                <option value={29}>API 29 — Android 10 (Q) • 82.5% Device Reach</option>
                <option value={31}>API 31 — Android 12 (S) • 65.1% Device Reach</option>
                <option value={33}>API 33 — Android 13 (Tiramisu) • Modern Target</option>
                <option value={34}>API 34 — Android 14 (Upside Down Cake)</option>
              </select>
            </div>
          </div>

          {/* Screen Orientation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Screen Orientation Lock
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'unspecified', label: 'Sensor Auto', desc: 'Adapts to phone rotation' },
                { id: 'portrait', label: 'Portrait', desc: 'Locked upright (Mobile)' },
                { id: 'landscape', label: 'Landscape', desc: 'Locked widescreen (Games)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeConfig({ ...config, orientation: opt.id as any })}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    config.orientation === opt.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Phone Mockup & App Icon Preview */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-4">
              Android Preview Mockup
            </h3>

            {/* Mobile Device Frame */}
            <div className="w-56 mx-auto bg-slate-950 border-4 border-slate-800 rounded-[32px] p-3 shadow-2xl relative">
              {/* Speaker notch */}
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-3" />

              {/* Screen */}
              <div className="bg-slate-900 rounded-[20px] p-4 min-h-[260px] flex flex-col items-center justify-center text-center">
                {/* App Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-xl shadow-emerald-500/20 mb-3 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>

                <div className="text-sm font-bold text-white truncate max-w-[150px]">
                  {config.appName || 'My App'}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 truncate max-w-[150px] mt-0.5">
                  {config.packageId}
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">
                  v{config.versionName} (Build {config.versionCode})
                </div>

                {inspection?.isHomeLauncher && (
                  <div className="mt-3 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
                    Home Launcher Active
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onPrev}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-2 cursor-pointer transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </button>

        <button
          onClick={onNext}
          disabled={!isPackageIdValid || !config.appName}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
        >
          <span>Next: Native Integrations (Step 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
