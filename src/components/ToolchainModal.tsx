import React from 'react';
import { X, Cpu, CheckCircle2, ShieldCheck, HardDrive, Terminal, Layers } from 'lucide-react';

interface ToolchainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolchainModal: React.FC<ToolchainModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tools = [
    {
      name: 'Android Framework SDK',
      version: 'API 33 (Android 13 / Tiramisu)',
      binary: '/opt/android-sdk/platforms/android-33/android.jar',
      desc: 'Official Android platform classes, framework stubs, and core runtime interfaces.',
    },
    {
      name: 'Kotlin Compiler',
      version: 'kotlinc-jvm 1.9.22',
      binary: '/usr/local/bin/kotlinc',
      desc: 'Native JetBrains Kotlin compiler targeting JVM 17 bytecode.',
    },
    {
      name: 'Java Development Kit',
      version: 'OpenJDK 17.0.20 Headless',
      binary: '/usr/bin/javac',
      desc: 'Official LTS Java compiler and runtime environment.',
    },
    {
      name: 'Google D8 DEX Compiler',
      version: 'D8 3.3.28',
      binary: '/opt/android-sdk/build-tools/33.0.0/d8.jar',
      desc: 'Converts compiled Java/Kotlin bytecode into Dalvik Executable (classes.dex) format.',
    },
    {
      name: 'Android Asset Packaging Tool (AAPT)',
      version: 'AAPT v0.2',
      binary: '/usr/bin/aapt',
      desc: 'Compiles XML manifests, parses Android resources into resources.arsc, and packages APKs.',
    },
    {
      name: 'Android APK Signer',
      version: 'apksigner 31.0.2',
      binary: '/usr/bin/apksigner',
      desc: 'Signs and verifies APKs with APK Signature Scheme v1, v2, and v3.',
    },
    {
      name: 'Android 4-Byte ZipAlign',
      version: 'zipalign 31.0.2',
      binary: '/usr/bin/zipalign',
      desc: 'Ensures uncompressed data begins at 4-byte page boundaries for mmap efficiency.',
    },
    {
      name: 'Gradle Build Automation Tool',
      version: 'Gradle 8.5',
      binary: '/usr/local/bin/gradle',
      desc: 'Modern build automation system with Kotlin DSL and Android Gradle Plugin compatibility.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Genuine Android Cloud Build Toolchain</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Active build worker specifications, installed binaries, and execution environments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Security & Sandbox Callout */}
          <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white mb-0.5">Sandboxed Production Build Workers</div>
              <p className="text-slate-400 leading-relaxed">
                All compilations run in isolated worker workspaces with path-traversal validation, decompression size quotas, execution timeouts, and tamper-proof signing verification.
              </p>
            </div>
          </div>

          {/* Toolchain List */}
          <div className="space-y-2.5">
            {tools.map((t) => (
              <div
                key={t.name}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-800/50">
                    {t.version}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5.5">{t.desc}</p>
                <div className="text-[10px] font-mono text-slate-500 pl-5.5 truncate">
                  Path: {t.binary}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
