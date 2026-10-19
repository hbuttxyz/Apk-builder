import React, { useState } from 'react';
import {
  UploadCloud,
  FileCode2,
  FolderGit2,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Home,
  FileCheck,
} from 'lucide-react';
import { ProjectInspection } from '../types/builder';

interface Step1UploadProps {
  inspection: ProjectInspection | null;
  onSelectSample: (sampleId: string) => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  onGitImport: (repoUrl: string) => Promise<void>;
  onNext: () => void;
  isLoading: boolean;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  inspection,
  onSelectSample,
  onFileUpload,
  onGitImport,
  onNext,
  isLoading,
}) => {
  const [gitUrl, setGitUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Project Classification Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Compile Any Supported Project into Genuine Android APK
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Intelligently detects Native Android Kotlin/Java, Google AI Studio/React/Vite SPAs, and Standalone HTML apps.
              <strong className="text-slate-200"> Native Android projects are never rejected for missing package.json or index.html.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Preloaded One-Click Sample Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Preloaded Tested Project Profiles</span>
            <span className="text-[11px] text-emerald-400 lowercase font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              1-click test
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Preset 1: FC iOS Launcher Pro (Mandatory Test Case) */}
          <button
            onClick={() => onSelectSample('fc-ios-launcher')}
            disabled={isLoading}
            className={`p-4 rounded-xl border text-left transition relative cursor-pointer group ${
              inspection?.sampleId === 'fc-ios-launcher'
                ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-950'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Engine C • Native
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-3 group-hover:text-emerald-300 transition">
              FC iOS Launcher Pro
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Native Kotlin Home Launcher. Preserves Home intent filter, SpringBoard app query, and Gradle settings.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span>settings.gradle.kts • no package.json</span>
            </div>
          </button>

          {/* Preset 2: Google AI Studio / React Vite */}
          <button
            onClick={() => onSelectSample('react-vite')}
            disabled={isLoading}
            className={`p-4 rounded-xl border text-left transition relative cursor-pointer group ${
              inspection?.sampleId === 'react-vite'
                ? 'bg-sky-950/30 border-sky-500 shadow-md shadow-sky-950'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Engine B • React
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-3 group-hover:text-sky-300 transition">
              Google AI Studio / React Vite
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Vite SPA with package.json. Bundled into native Android WebView host container with AndroidBridge.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-sky-400">
              <span>package.json • vite.config.ts</span>
            </div>
          </button>

          {/* Preset 3: Standalone HTML */}
          <button
            onClick={() => onSelectSample('standalone-html')}
            disabled={isLoading}
            className={`p-4 rounded-xl border text-left transition relative cursor-pointer group ${
              inspection?.sampleId === 'standalone-html'
                ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-950'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <FileCode2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Engine A • HTML
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-3 group-hover:text-amber-300 transition">
              Standalone HTML Web App
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Single-file offline HTML5 Canvas app with particle physics and native vibration haptics.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
              <span>standalone.html • zero dependencies</span>
            </div>
          </button>
        </div>
      </div>

      {/* Upload Zone & Git Import */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drag & Drop File Upload */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center min-h-[180px] ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/5'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-300 mb-3">
            <UploadCloud className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Drag & drop project <span className="text-emerald-400 font-mono">.ZIP</span> or{' '}
            <span className="text-emerald-400 font-mono">.HTML</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Native Android projects, Google AI Studio exports, or static web apps
          </p>
          <label className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition active:scale-95">
            <span>Browse Files</span>
            <input
              type="file"
              accept=".zip,.html,.htm"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {/* Git Repository Import */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FolderGit2 className="w-5 h-5 text-sky-400" />
              <h4 className="text-sm font-bold text-white">Import from Public Git Repository</h4>
            </div>
            <p className="text-xs text-slate-400">
              Provide a GitHub or GitLab repository containing Kotlin, Java, React or web code.
            </p>
            <div className="mt-3">
              <input
                type="text"
                placeholder="https://github.com/username/project"
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (gitUrl) onGitImport(gitUrl);
            }}
            disabled={!gitUrl || isLoading}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            Clone & Inspect Repository
          </button>
        </div>
      </div>

      {/* Real-Time Automated Project Inspector Results Card */}
      {inspection && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  inspection.classificationVerdict === 'READY_TO_BUILD'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Inspector Report
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      inspection.classificationVerdict === 'READY_TO_BUILD'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {inspection.classificationVerdict.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">{inspection.engineLabel}</h3>
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={inspection.classificationVerdict === 'UNSUPPORTED' || inspection.classificationVerdict === 'UNSAFE'}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Proceed to Configure (Step 2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Verdict Message */}
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
              inspection.classificationVerdict === 'READY_TO_BUILD'
                ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/50'
                : 'bg-amber-950/30 text-amber-300 border border-amber-800/50'
            }`}
          >
            {inspection.classificationVerdict === 'READY_TO_BUILD' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{inspection.verdictMessage}</p>
              {inspection.isHomeLauncher && (
                <p className="text-[11px] text-emerald-400/90 mt-1 font-mono">
                  ★ Verified Android Home Role (<code className="bg-emerald-950 px-1 py-0.5 rounded">android.intent.category.HOME</code>) detected and preserved.
                </p>
              )}
            </div>
          </div>

          {/* Structural Matrix Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Package ID</span>
              <span className="font-mono font-medium text-slate-200 truncate block mt-0.5">
                {inspection.packageId}
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Android SDK Target</span>
              <span className="font-mono font-medium text-slate-200 block mt-0.5">
                API {inspection.targetSdk} (Min {inspection.minSdk})
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Source Discovery</span>
              <span className="font-mono font-medium text-emerald-400 block mt-0.5">
                {inspection.hasKotlinSource ? 'Kotlin (.kt)' : inspection.hasJavaSource ? 'Java (.java)' : 'Web/JS'}
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">package.json Check</span>
              <span className="font-mono font-medium text-slate-300 block mt-0.5">
                {inspection.hasPackageJson ? 'Present' : 'Not required (Native)'}
              </span>
            </div>
          </div>

          {/* Detected Permissions & Activities */}
          {inspection.permissions.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1.5">
                Requested Android Permissions ({inspection.permissions.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspection.permissions.map((p) => (
                  <span
                    key={p}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    {p.replace('android.permission.', '')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
