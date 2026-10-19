import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  CheckCircle2,
  QrCode,
  FileText,
  RotateCcw,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  Info,
  Terminal,
  Home,
  Check,
  Copy,
  FolderDown,
  Share2,
} from 'lucide-react';
import { BuildArtifact, BuildJob, ProjectInspection } from '../types/builder';

interface Step5FinishProps {
  artifact: BuildArtifact;
  job: BuildJob;
  inspection?: ProjectInspection | null;
  onReset: () => void;
  onOpenDistribution: () => void;
}

export const Step5Finish: React.FC<Step5FinishProps> = ({
  artifact,
  job,
  inspection,
  onReset,
  onOpenDistribution,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);

  // Generate QR code pointing to APK download URL
  useEffect(() => {
    const fullDownloadUrl = window.location.origin + artifact.apkDownloadUrl;
    QRCode.toDataURL(
      fullDownloadUrl,
      {
        width: 220,
        margin: 2,
        color: {
          dark: '#022c22',
          light: '#34d399',
        },
      },
      (err, url) => {
        if (!err && url) setQrCodeDataUrl(url);
      }
    );
  }, [artifact.apkDownloadUrl]);

  const copyFingerprint = () => {
    navigator.clipboard.writeText(artifact.certFingerprintSha256);
    setCopiedFingerprint(true);
    setTimeout(() => setCopiedFingerprint(false), 2000);
  };

  const copyAdbCommand = () => {
    navigator.clipboard.writeText(`adb install -r ${artifact.apkFileName}`);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Success Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium mb-1">
                <span>Compilation Succeeded & Verified</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Android APK is Ready for Installation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Cryptographically signed, 4-byte zipaligned, and verified with Android Signature Scheme v2 & v3.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <a
              href={`/api/build/download/${job.jobId}`}
              download={artifact.apkFileName}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition cursor-pointer active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>Download APK ({artifact.fileSizeFormatted})</span>
            </a>

            <button
              onClick={onOpenDistribution}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-emerald-300 border border-emerald-500/40 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-lg shadow-slate-950"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Give to Users (5 Ways)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Verified Specifications & Installation Guide */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Binary Badging & Artifact Specifications</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                Official Android Format
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Package Name</span>
                <span className="font-mono font-bold text-emerald-400 block mt-1 truncate">
                  {artifact.packageId}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Binary File Size</span>
                <span className="font-mono font-bold text-white block mt-1">
                  {artifact.fileSizeFormatted}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Version</span>
                <span className="font-mono font-bold text-white block mt-1">
                  v{artifact.versionName} (Code {artifact.versionCode})
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Android SDK Target</span>
                <span className="font-mono font-bold text-slate-200 block mt-1">
                  API {artifact.targetSdk} (Min {artifact.minSdk})
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Signing Scheme</span>
                <span className="font-mono font-bold text-emerald-400 block mt-1 truncate">
                  {artifact.signingScheme}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Home Launcher Role</span>
                <span className="font-mono font-bold text-emerald-400 block mt-1">
                  {artifact.hasHomeLauncher ? 'Preserved (HOME)' : 'Standard App'}
                </span>
              </div>
            </div>

            {/* SHA-256 Fingerprint */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="truncate">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">
                  Certificate SHA-256 Digest
                </span>
                <span className="font-mono text-slate-300 text-[11px] truncate block mt-0.5">
                  {artifact.certFingerprintSha256}
                </span>
              </div>
              <button
                onClick={copyFingerprint}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition shrink-0 cursor-pointer"
              >
                {copiedFingerprint ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Physical Phone Installation Guide */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Step-by-Step Android Installation Guide</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              {/* Method 1: Phone Download / Wireless */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[10px]">
                    1
                  </span>
                  <span>Install via Phone Camera / Browser</span>
                </div>
                <p className="text-slate-400 pl-7 text-[11px]">
                  Scan the QR code on the right with your phone camera, tap Download, open the downloaded APK, and tap <strong>Install</strong>.
                  If prompted, allow &quot;Install Unknown Apps&quot; for your browser.
                </p>
              </div>

              {/* Method 2: ADB Command Line */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono text-[10px]">
                    2
                  </span>
                  <span>Install via USB Cable (ADB Command Line)</span>
                </div>
                <div className="pl-7">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px] text-emerald-400">
                    <span>adb install -r {artifact.apkFileName}</span>
                    <button
                      onClick={copyAdbCommand}
                      className="text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {copiedAdb ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 9 Launcher Note */}
              {artifact.hasHomeLauncher && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-[11px] text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Home Launcher Selection (FC iOS Launcher Pro)</span>
                  </div>
                  <p className="text-slate-400">
                    To make this your default phone launcher: Open Android Settings → Apps → Default Apps → Home app → Select <strong>FC iOS Launcher Pro</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Phone QR Code & Action Links */}
        <div className="space-y-4">
          {/* QR Code Container */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-1">
              Wireless Phone Download
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Scan with Android phone camera to download directly
            </p>

            <div className="p-3 bg-emerald-950 rounded-2xl border border-emerald-500/30 shadow-xl inline-block mb-3">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="APK Download QR Code"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-600">
                  <QrCode className="w-10 h-10 animate-pulse text-emerald-400" />
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
              1-Tap Direct Sideload URL
            </div>
          </div>

          {/* Download Source, Logs & New Build */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            {/* Save / Export Project Source */}
            <a
              href={`/api/project/export/${inspection?.sampleId || inspection?.uploadId || 'standalone-html'}`}
              download
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-sky-300 text-xs font-mono font-medium border border-sky-800/60 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FolderDown className="w-4 h-4 text-sky-400" />
              <span>Save Source ({inspection?.engine === 'ENGINE_A_STATIC_WEB' ? 'index.html' : 'Project .zip'})</span>
            </a>

            <a
              href={`/api/build/logs/${job.jobId}`}
              download={`${job.jobId}.log`}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium border border-slate-800 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Download Full Build Log (.log)</span>
            </a>

            <button
              onClick={onReset}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Convert Another Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
