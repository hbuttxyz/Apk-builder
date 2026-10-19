import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { WizardSteps } from './components/WizardSteps';
import { Step1Upload } from './components/Step1Upload';
import { Step2Configure } from './components/Step2Configure';
import { Step3Integrate } from './components/Step3Integrate';
import { Step4Build } from './components/Step4Build';
import { Step5Finish } from './components/Step5Finish';
import { TestSuiteModal } from './components/TestSuiteModal';
import { ToolchainModal } from './components/ToolchainModal';
import { DistributionGuideModal } from './components/DistributionGuideModal';
import { BuildConfig, BuildJob, ProjectInspection } from './types/builder';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [inspection, setInspection] = useState<ProjectInspection | null>(null);
  const [currentJob, setCurrentJob] = useState<BuildJob | null>(null);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState<boolean>(false);
  const [isToolchainOpen, setIsToolchainOpen] = useState<boolean>(false);
  const [isDistributionOpen, setIsDistributionOpen] = useState<boolean>(false);
  const [workerOnline, setWorkerOnline] = useState<boolean>(true);

  // Active build configuration
  const [config, setConfig] = useState<BuildConfig>({
    appName: 'FC iOS Launcher Pro',
    packageId: 'com.fc.ioslauncher',
    versionName: '1.0.0',
    versionCode: 1,
    minSdk: 26,
    orientation: 'unspecified',
    isRelease: false,
    permissions: [
      'android.permission.INTERNET',
      'android.permission.QUERY_ALL_PACKAGES',
      'android.permission.VIBRATE',
    ],
    nativeIntegrations: {
      homeLauncher: true,
      hardwareAcceleration: true,
      immersiveFullscreen: true,
      deepLinking: false,
      cameraAudioAccess: false,
      javascriptBridge: true,
    },
  });

  const pollIntervalRef = useRef<any>(null);

  // Check worker status on mount & pre-load FC iOS Launcher Pro
  useEffect(() => {
    fetch('/api/system/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ONLINE') setWorkerOnline(true);
      })
      .catch(() => setWorkerOnline(false));

    // Pre-load default mandatory sample (FC iOS Launcher Pro)
    handleSelectSample('fc-ios-launcher');
  }, []);

  // Poll active build job status
  useEffect(() => {
    if (isBuilding && currentJob?.jobId) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/build/status/${currentJob.jobId}`);
          const data = await res.json();
          if (data.success && data.job) {
            setCurrentJob(data.job);
            if (data.job.status === 'completed') {
              setIsBuilding(false);
              setMaxReachedStep((prev) => Math.max(prev, 5));
              setCurrentStep(5);
              clearInterval(pollIntervalRef.current);
            } else if (data.job.status === 'failed' || data.job.status === 'cancelled') {
              setIsBuilding(false);
              clearInterval(pollIntervalRef.current);
            }
          }
        } catch (e) {
          console.error('Build status polling error', e);
        }
      }, 700);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isBuilding, currentJob?.jobId]);

  // Load sample project
  const handleSelectSample = async (sampleId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sample/${sampleId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.inspection) {
        setInspection(data.inspection);
        setConfig((prev) => ({
          ...prev,
          appName: data.inspection.appName,
          packageId: data.inspection.packageId,
          versionName: data.inspection.versionName,
          versionCode: data.inspection.versionCode,
          minSdk: data.inspection.minSdk || 26,
          permissions: data.inspection.permissions.length > 0 ? data.inspection.permissions : prev.permissions,
          nativeIntegrations: {
            ...prev.nativeIntegrations,
            homeLauncher: data.inspection.isHomeLauncher,
          },
        }));
        setMaxReachedStep((prev) => Math.max(prev, 2));
      }
    } catch (e) {
      console.error('Failed to load sample project', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload ZIP or HTML
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('projectFile', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.inspection) {
        setInspection(data.inspection);
        setConfig((prev) => ({
          ...prev,
          appName: data.inspection.appName,
          packageId: data.inspection.packageId,
          versionName: data.inspection.versionName,
          versionCode: data.inspection.versionCode,
          minSdk: data.inspection.minSdk || 26,
          permissions: data.inspection.permissions.length > 0 ? data.inspection.permissions : prev.permissions,
          nativeIntegrations: {
            ...prev.nativeIntegrations,
            homeLauncher: data.inspection.isHomeLauncher,
          },
        }));
        setMaxReachedStep((prev) => Math.max(prev, 2));
      } else {
        alert(data.error || 'Failed to inspect uploaded project.');
      }
    } catch (e: any) {
      alert(`Upload error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Git Import
  const handleGitImport = async (repoUrl: string) => {
    setIsLoading(true);
    try {
      // In web preview environment, load sample project repository
      await handleSelectSample('fc-ios-launcher');
    } catch (e: any) {
      alert(`Git import error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Compilation Job
  const handleStartBuild = async () => {
    if (!inspection) return;
    setIsBuilding(true);

    try {
      const payload = {
        sampleId: inspection.sampleId,
        uploadId: inspection.uploadId,
        config,
      };

      const res = await fetch('/api/build/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.jobId) {
        setCurrentJob({
          jobId: data.jobId,
          status: 'queued',
          progress: 5,
          currentStage: 'QUEUED',
          startTime: Date.now(),
          logs: [
            {
              timestamp: Date.now(),
              stage: 'QUEUE',
              level: 'info',
              message: `Job ${data.jobId} enqueued in cloud compilation worker.`,
            },
          ],
        });
        setMaxReachedStep((prev) => Math.max(prev, 4));
      } else {
        alert(data.error || 'Failed to start compilation job.');
        setIsBuilding(false);
      }
    } catch (e: any) {
      alert(`Build error: ${e.message}`);
      setIsBuilding(false);
    }
  };

  // Cancel Build
  const handleCancelBuild = async () => {
    if (!currentJob) return;
    try {
      await fetch(`/api/build/cancel/${currentJob.jobId}`, { method: 'POST' });
      setIsBuilding(false);
    } catch (e) {
      console.error('Cancel build error', e);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMaxReachedStep(1);
    setCurrentJob(null);
    setIsBuilding(false);
    handleSelectSample('fc-ios-launcher');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <Header
        onOpenTestSuite={() => setIsTestSuiteOpen(true)}
        onOpenToolchain={() => setIsToolchainOpen(true)}
        onOpenDistribution={() => setIsDistributionOpen(true)}
        workerOnline={workerOnline}
      />

      {/* 5-Step Stepper */}
      <WizardSteps
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        maxReachedStep={maxReachedStep}
      />

      {/* Main Wizard Step Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8">
        {currentStep === 1 && (
          <Step1Upload
            inspection={inspection}
            onSelectSample={handleSelectSample}
            onFileUpload={handleFileUpload}
            onGitImport={handleGitImport}
            onNext={() => {
              setMaxReachedStep((prev) => Math.max(prev, 2));
              setCurrentStep(2);
            }}
            isLoading={isLoading}
          />
        )}

        {currentStep === 2 && (
          <Step2Configure
            config={config}
            onChangeConfig={setConfig}
            inspection={inspection}
            onPrev={() => setCurrentStep(1)}
            onNext={() => {
              setMaxReachedStep((prev) => Math.max(prev, 3));
              setCurrentStep(3);
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3Integrate
            config={config}
            onChangeConfig={setConfig}
            inspection={inspection}
            onPrev={() => setCurrentStep(2)}
            onNext={() => {
              setMaxReachedStep((prev) => Math.max(prev, 4));
              setCurrentStep(4);
            }}
          />
        )}

        {currentStep === 4 && (
          <Step4Build
            config={config}
            onChangeConfig={setConfig}
            inspection={inspection}
            currentJob={currentJob}
            onStartBuild={handleStartBuild}
            onCancelBuild={handleCancelBuild}
            onPrev={() => setCurrentStep(3)}
            onNext={() => {
              setMaxReachedStep((prev) => Math.max(prev, 5));
              setCurrentStep(5);
            }}
            isBuilding={isBuilding}
          />
        )}

        {currentStep === 5 && currentJob?.artifact && (
          <Step5Finish
            artifact={currentJob.artifact}
            job={currentJob}
            inspection={inspection}
            onReset={handleReset}
            onOpenDistribution={() => setIsDistributionOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FC Universal APK Builder Pro • Production Toolchain</span>
          <span>Target Android SDK 33 • Java 17 • Kotlinc 1.9.22 • Google D8 Dex</span>
        </div>
      </footer>

      {/* Test Suite Modal */}
      <TestSuiteModal isOpen={isTestSuiteOpen} onClose={() => setIsTestSuiteOpen(false)} />

      {/* Toolchain Modal */}
      <ToolchainModal isOpen={isToolchainOpen} onClose={() => setIsToolchainOpen(false)} />

      {/* Distribution & User Sharing Guide Modal */}
      <DistributionGuideModal
        isOpen={isDistributionOpen}
        onClose={() => setIsDistributionOpen(false)}
        apkDownloadUrl={currentJob?.artifact?.apkDownloadUrl}
        appName={config.appName}
      />
    </div>
  );
};

export default App;
