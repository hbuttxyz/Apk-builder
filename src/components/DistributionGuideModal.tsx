import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Smartphone,
  Globe,
  QrCode,
  Download,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Mail,
} from 'lucide-react';

interface DistributionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  apkDownloadUrl?: string;
  appName?: string;
}

export const DistributionGuideModal: React.FC<DistributionGuideModalProps> = ({
  isOpen,
  onClose,
  apkDownloadUrl,
  appName = 'FC iOS Launcher Pro',
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWebLink, setCopiedWebLink] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullApkUrl = apkDownloadUrl ? `${currentOrigin}${apkDownloadUrl}` : `${currentOrigin}/builds/latest.apk`;
  const webAppUrl = currentOrigin;

  const handleCopyApkLink = () => {
    navigator.clipboard.writeText(fullApkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyWebLink = () => {
    navigator.clipboard.writeText(webAppUrl);
    setCopiedWebLink(true);
    setTimeout(() => setCopiedWebLink(false), 2000);
  };

  const shareText = encodeURIComponent(`Check out ${appName}! You can download the Android APK here: ${fullApkUrl}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(`Install ${appName}`)}&body=${shareText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How to Give This App to Your Users</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                5 simple ways to send the APK or Web App to clients, testers, and end users.
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
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Method 1: Instant Direct Download Link */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono text-[11px]">
                  1
                </span>
                <h4 className="text-xs font-bold text-white">Direct APK Download Link (Fastest)</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Direct Sideload
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Send this direct link to any Android user via WhatsApp, SMS, or Telegram. When they tap it, the APK file downloads immediately onto their phone.
            </p>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-emerald-400 truncate text-[11px]">{fullApkUrl}</span>
              <button
                onClick={handleCopyApkLink}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 shrink-0 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5 font-medium transition text-[11px]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share via WhatsApp</span>
              </a>

              <a
                href={mailUrl}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 font-medium transition text-[11px]"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Email to Users</span>
              </a>
            </div>
          </div>

          {/* Method 2: QR Code Scanning */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center font-mono text-[11px]">
                2
              </span>
              <h4 className="text-xs font-bold text-white">In-Person QR Code Scanning</h4>
            </div>
            <p className="text-slate-400 text-[11px]">
              If you are meeting the user or testing on a physical phone: open <strong>Step 5 (Download)</strong> and have the user scan the QR code with their phone camera. Their browser will prompt: <em>&quot;Do you want to download this APK?&quot;</em> → Tap <strong>Download & Install</strong>.
            </p>
          </div>

          {/* Method 3: Share as Instant Web App (Zero Install Required) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center font-mono text-[11px]">
                  3
                </span>
                <h4 className="text-xs font-bold text-white">Instant Web App (Works on Both Android & iPhone)</h4>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                PWA / Browser
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Users can use your app without downloading an APK. Send them your public Web App URL. When they open it in Chrome or Safari, they can tap <strong>&quot;Add to Home Screen&quot;</strong> to get an app icon on their phone home screen!
            </p>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-purple-400 truncate text-[11px]">{webAppUrl}</span>
              <button
                onClick={handleCopyWebLink}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1.5 shrink-0 transition cursor-pointer"
              >
                {copiedWebLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebLink ? 'Copied' : 'Copy Web Link'}</span>
              </button>
            </div>
          </div>

          {/* Method 4: Google Drive or Dropbox Upload */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono text-[11px]">
                4
              </span>
              <h4 className="text-xs font-bold text-white">Google Drive, Dropbox, or Telegram Channel</h4>
            </div>
            <p className="text-slate-400 text-[11px]">
              Download the APK to your computer, then upload it to your company’s Google Drive, Dropbox folder, or Telegram Channel. Share the Google Drive link with your users or beta testers.
            </p>
          </div>

          {/* Method 5: Google Play Store / Firebase App Distribution */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 font-bold flex items-center justify-center font-mono text-[11px]">
                5
              </span>
              <h4 className="text-xs font-bold text-white">Google Play Store & Firebase App Distribution</h4>
            </div>
            <p className="text-slate-400 text-[11px]">
              For public release to millions of users: select <strong>Signed Release APK</strong> in Step 4. You can upload the generated artifact directly to the <strong>Google Play Console</strong> or <strong>Firebase App Distribution</strong> for managed beta testing.
            </p>
          </div>

          {/* Note on Android Security Prompt */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300/90 leading-relaxed">
            <strong>What will your users see when installing?</strong><br />
            Because the APK is downloaded directly from your web link (sideloaded), Android will show: <em>&quot;For your security, your phone is not allowed to install unknown apps from this source.&quot;</em> The user simply taps <strong>Settings → Allow from this source</strong>, then taps <strong>Install</strong>.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
