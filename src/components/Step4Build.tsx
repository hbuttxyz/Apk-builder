import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  StopCircle,
  Copy,
  Check,
  Terminal,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { BuildConfig, BuildJob, ProjectInspection } from '../types/builder';

interface Step4BuildProps {
  config: BuildConfig;
  onChangeConfig: (newConfig: BuildConfig) => void;
  inspection: ProjectInspection | null;
  currentJob: BuildJob | null;
  onStartBuild: () => Promise<void>;
  onCancelBuild: () => Promise<void>;
  onPrev: () => void;
  onNext: () => void;
  isBuilding: boolean;
}

export const Step4Build: React.FC<Step4BuildProps> = ({
  config,
  onChangeConfig,
  inspection,
  currentJob,
  onStartBuild,
  onCancelBuild,
  onPrev,
  onNext,
  isBuilding,
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentJob?.logs, autoScroll]);

  const copyLogs = () => {
    if (!currentJob) return;
    const text = currentJob.logs
      .map((l) => `[${new Date(l.timestamp).toLocaleTimeString()}][${l.stage}][${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageLabel = (stage: string) => {
    const map: Record<string, string> = {
      QUEUED: 'Queued in Worker Queue',
      INSPECT_AND_VALIDATE: 'Validating AST & Manifest',
      PREPARE_WORKSPACE: 'Assembling Android Workspace',
      COMPILE_RESOURCES: 'Compiling XML & AAPT Assets',
      COMPILE_SOURCE: 'Compiling Kotlin / Java Bytecode',
      DEX_BYTECODE: 'Converting to Dalvik DEX via Google D8',
      PACKAGE_AND_SIGN: 'Zipalign & Cryptographic Signing',
      VERIFY_AUDIT: 'Verifying Signature & Badging',
      COMPLETED: 'Build Successfully Completed',
      CANCELLED: 'Compilation Cancelled',
      FAILED: 'Build Failed',
    };
    return map[stage] || stage;
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">Step 4 of 5</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Genuine Cloud APK Compilation</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Executes real Android SDK 33 toolchain: AAPT, kotlinc 1.9.22 / javac 17, Google D8 Dex, zipalign, and apksigner.
        </p>
      </div>

      {/* Signing Credentials Selection */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Cryptographic Signing & Build Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Debug Mode */}
          <button
            type="button"
            onClick={() => onChangeConfig({ ...config, isRelease: false })}
            disabled={isBuilding}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
              !config.isRelease
                ? 'bg-emerald-950/30 border-emerald-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Debug APK (Quick Test)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Recommended
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Signed with standard Android Debug keystore (<code className="text-emerald-400">androiddebugkey</code>). Installs immediately on any Android phone.
            </p>
          </button>

          {/* Release Mode */}
          <button
            type="button"
            onClick={() => onChangeConfig({ ...config, isRelease: true })}
            disabled={isBuilding}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
              config.isRelease
                ? 'bg-emerald-950/30 border-emerald-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Production Release APK</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                Play Store / Sideload
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Signed with RSA-2048 production certificate using official APK Signature Scheme v2 & v3 with SHA-256 digest.
            </p>
          </button>
        </div>
      </div>

      {/* Build Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span>Ready to Compile:</span>
            <span className="text-emerald-400 font-mono">{config.appName}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            {config.packageId} • v{config.versionName} • {config.isRelease ? 'Release' : 'Debug'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {isBuilding ? (
            <button
              onClick={onCancelBuild}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800/80 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              <StopCircle className="w-4 h-4" />
              <span>Cancel Build</span>
            </button>
          ) : (
            <button
              onClick={onStartBuild}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Genuine Compilation</span>
            </button>
          )}

          {currentJob?.status === 'completed' && (
            <button
              onClick={onNext}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition cursor-pointer active:scale-95"
            >
              <span>View Artifact & Download</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Stage Status */}
      {currentJob && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-400">Current Stage:</span>
              <span className="text-emerald-400 font-bold">
                {getStageLabel(currentJob.currentStage)}
              </span>
            </div>
            <span className="font-mono font-bold text-white">{currentJob.progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                currentJob.status === 'failed'
                  ? 'bg-rose-500'
                  : currentJob.status === 'completed'
                  ? 'bg-emerald-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse'
              }`}
              style={{ width: `${currentJob.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Live Terminal Console */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Cloud Build Console Output</span>
            {currentJob && (
              <span className="text-[10px] text-slate-500">[{currentJob.jobId}]</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Auto-scroll</span>
            </label>

            <button
              onClick={copyLogs}
              disabled={!currentJob || currentJob.logs.length === 0}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-4 font-mono text-xs max-h-72 sm:max-h-96 overflow-y-auto space-y-1 select-text">
          {!currentJob || currentJob.logs.length === 0 ? (
            <div className="text-slate-600 italic py-8 text-center">
              Click &quot;Start Genuine Compilation&quot; to begin building your Android APK.
            </div>
          ) : (
            currentJob.logs.map((log, idx) => {
              const time = new Date(log.timestamp).toLocaleTimeString();
              const levelColor =
                log.level === 'error'
                  ? 'text-rose-400 bg-rose-950/40'
                  : log.level === 'warn'
                  ? 'text-amber-400 bg-amber-950/40'
                  : log.level === 'success'
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-300';

              return (
                <div key={idx} className="flex items-start gap-2 leading-relaxed hover:bg-slate-900/40 px-1 rounded">
                  <span className="text-slate-600 shrink-0 text-[10px]">{time}</span>
                  <span className="text-slate-500 shrink-0 text-[10px] uppercase font-bold">
                    [{log.stage}]
                  </span>
                  <span className={`break-all ${levelColor}`}>{log.message}</span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onPrev}
          disabled={isBuilding}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-2 cursor-pointer transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Integrations</span>
        </button>

        {currentJob?.status === 'completed' && (
          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
          >
            <span>Proceed to Download (Step 5)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
