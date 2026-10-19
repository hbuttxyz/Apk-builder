import React from 'react';
import { Smartphone, ShieldCheck, Terminal, Cpu, PlayCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenTestSuite: () => void;
  onOpenToolchain: () => void;
  onOpenDistribution: () => void;
  workerOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTestSuite,
  onOpenToolchain,
  onOpenDistribution,
  workerOnline,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>FC Universal APK Builder</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Native Kotlin • React / Vite • Standalone Web • Cloud Compiler
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {/* Worker Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                workerOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-mono text-[11px]">Android SDK 33 Ready</span>
          </div>

          {/* Share with Users Button */}
          <button
            onClick={onOpenDistribution}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/50 hover:bg-sky-900/50 text-sky-300 border border-sky-800/60 text-xs font-medium transition cursor-pointer active:scale-95"
            title="How to Give This to Users"
          >
            <span>Share with Users</span>
          </button>

          {/* Toolchain Modal Button */}
          <button
            onClick={onOpenToolchain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition cursor-pointer active:scale-95"
            title="Inspect Cloud Build Toolchain"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Toolchain</span>
          </button>

          {/* Test Suite Button */}
          <button
            onClick={onOpenTestSuite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-800/60 text-xs font-medium transition cursor-pointer active:scale-95 shadow-sm shadow-emerald-950"
            title="Run 14-Fixture Automated Audit Matrix"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Audit Suite (14/14)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
