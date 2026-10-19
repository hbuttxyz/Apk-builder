import React from 'react';
import {
  Layers,
  ShieldCheck,
  Zap,
  Home,
  Maximize2,
  Cpu,
  Wifi,
  Camera,
  FolderLock,
  Volume2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { BuildConfig, ProjectInspection } from '../types/builder';

interface Step3IntegrateProps {
  config: BuildConfig;
  onChangeConfig: (newConfig: BuildConfig) => void;
  inspection: ProjectInspection | null;
  onPrev: () => void;
  onNext: () => void;
}

export const Step3Integrate: React.FC<Step3IntegrateProps> = ({
  config,
  onChangeConfig,
  inspection,
  onPrev,
  onNext,
}) => {
  const togglePermission = (perm: string) => {
    const perms = config.permissions.includes(perm)
      ? config.permissions.filter((p) => p !== perm)
      : [...config.permissions, perm];
    onChangeConfig({ ...config, permissions: perms });
  };

  const toggleNativeIntegration = (key: keyof BuildConfig['nativeIntegrations']) => {
    onChangeConfig({
      ...config,
      nativeIntegrations: {
        ...config.nativeIntegrations,
        [key]: !config.nativeIntegrations[key],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-purple-400 font-semibold">Step 3 of 5</span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Android Permissions & Native Integration Matrix
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Verify Android system capabilities, manifest flags, and runtime device integrations.
        </p>
      </div>

      {/* Native Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Native Hardware & OS Roles */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Native Android Host Integrations</span>
          </h3>

          <div className="space-y-2.5">
            {/* Home Launcher Role */}
            <div
              onClick={() => toggleNativeIntegration('homeLauncher')}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                config.nativeIntegrations.homeLauncher
                  ? 'bg-emerald-950/30 border-emerald-500/60'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                  config.nativeIntegrations.homeLauncher
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Home className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Default Home Launcher Role</span>
                  <input
                    type="checkbox"
                    checked={config.nativeIntegrations.homeLauncher}
                    readOnly
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Declares <code className="text-emerald-400">android.intent.category.HOME</code>. Allows app to replace phone's home screen.
                </p>
              </div>
            </div>

            {/* Hardware Acceleration */}
            <div
              onClick={() => toggleNativeIntegration('hardwareAcceleration')}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                config.nativeIntegrations.hardwareAcceleration
                  ? 'bg-emerald-950/30 border-emerald-500/60'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                  config.nativeIntegrations.hardwareAcceleration
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">GPU Hardware Acceleration</span>
                  <input
                    type="checkbox"
                    checked={config.nativeIntegrations.hardwareAcceleration}
                    readOnly
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Enables OpenGL/Vulkan GPU rasterization (<code className="text-emerald-400">android:hardwareAccelerated="true"</code>).
                </p>
              </div>
            </div>

            {/* Immersive Sticky Fullscreen */}
            <div
              onClick={() => toggleNativeIntegration('immersiveFullscreen')}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                config.nativeIntegrations.immersiveFullscreen
                  ? 'bg-emerald-950/30 border-emerald-500/60'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                  config.nativeIntegrations.immersiveFullscreen
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Maximize2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Immersive Sticky Fullscreen</span>
                  <input
                    type="checkbox"
                    checked={config.nativeIntegrations.immersiveFullscreen}
                    readOnly
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hides system navigation bar and status bar with edge-to-edge rendering.
                </p>
              </div>
            </div>

            {/* JavaScript AndroidBridge */}
            <div
              onClick={() => toggleNativeIntegration('javascriptBridge')}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                config.nativeIntegrations.javascriptBridge
                  ? 'bg-emerald-950/30 border-emerald-500/60'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                  config.nativeIntegrations.javascriptBridge
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Native Android JavaScript Bridge</span>
                  <input
                    type="checkbox"
                    checked={config.nativeIntegrations.javascriptBridge}
                    readOnly
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Exposes <code className="text-emerald-400">window.AndroidBridge</code> for native toasts, device vibration, and version inspection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Android Permissions Checklist */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-400" />
            <span>Requested Android Manifest Permissions</span>
          </h3>

          <div className="space-y-2">
            {[
              {
                id: 'android.permission.INTERNET',
                label: 'Internet Access (INTERNET)',
                desc: 'Fetch remote web APIs and dynamic assets',
                icon: Wifi,
              },
              {
                id: 'android.permission.QUERY_ALL_PACKAGES',
                label: 'Query Installed Apps (QUERY_ALL_PACKAGES)',
                desc: 'Mandatory for Home Launchers (FC iOS Launcher Pro)',
                icon: Home,
              },
              {
                id: 'android.permission.VIBRATE',
                label: 'Haptic Feedback (VIBRATE)',
                desc: 'Trigger device vibration motors for UI taps',
                icon: Zap,
              },
              {
                id: 'android.permission.SET_WALLPAPER',
                label: 'Wallpaper Management (SET_WALLPAPER)',
                desc: 'Set system and lock-screen wallpapers',
                icon: Layers,
              },
              {
                id: 'android.permission.CAMERA',
                label: 'Camera Capture (CAMERA)',
                desc: 'Access device cameras for photos and barcode scanner',
                icon: Camera,
              },
              {
                id: 'android.permission.RECORD_AUDIO',
                label: 'Audio Recording (RECORD_AUDIO)',
                desc: 'Microphone and speech input',
                icon: Volume2,
              },
            ].map((p) => {
              const Icon = p.icon;
              const isChecked = config.permissions.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => togglePermission(p.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-sky-950/20 border-sky-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isChecked ? 'text-sky-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-semibold">{p.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.desc}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="accent-sky-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compatibility Verdict & Pre-Build Hardening Checklist */}
      <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Pre-Flight Compatibility Check Passed</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Target toolchain: OpenJDK 17 • kotlinc 1.9.22 • Google D8 Dex • Android SDK 33
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
          Ready for APK Compilation
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onPrev}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-2 cursor-pointer transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Configure</span>
        </button>

        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
        >
          <span>Next: Start Compilation (Step 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
