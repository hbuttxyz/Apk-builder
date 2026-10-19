export type EngineType =
  | 'ENGINE_A_STATIC_WEB'
  | 'ENGINE_B_REACT_VITE'
  | 'ENGINE_C_NATIVE_ANDROID'
  | 'ENGINE_D_FLUTTER'
  | 'UNKNOWN';

export type ClassificationVerdict =
  | 'READY_TO_BUILD'
  | 'REQUIRES_CONFIG'
  | 'MISSING_SOURCE'
  | 'UNSUPPORTED'
  | 'UNSAFE';

export interface ProjectInspection {
  engine: EngineType;
  engineLabel: string;
  classificationVerdict: ClassificationVerdict;
  verdictMessage: string;
  appName: string;
  packageId: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  detectedFilesCount: number;
  hasGradleSettings: boolean;
  hasBuildGradle: boolean;
  hasAndroidManifest: boolean;
  hasPackageJson: boolean;
  hasIndexHtml: boolean;
  hasKotlinSource: boolean;
  hasJavaSource: boolean;
  hasFlutterPubspec: boolean;
  isHomeLauncher: boolean;
  activities: string[];
  permissions: string[];
  warnings: string[];
  errors: string[];
  rootDirectory: string;
  sampleId?: string;
  uploadId?: string;
}

export interface BuildConfig {
  appName: string;
  packageId: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  orientation: 'unspecified' | 'portrait' | 'landscape';
  isRelease: boolean;
  keystoreConfig?: {
    alias: string;
    keyPass: string;
    storePass: string;
  };
  permissions: string[];
  nativeIntegrations: {
    homeLauncher: boolean;
    hardwareAcceleration: boolean;
    immersiveFullscreen: boolean;
    deepLinking: boolean;
    cameraAudioAccess: boolean;
    javascriptBridge: boolean;
  };
}

export interface BuildLogEntry {
  timestamp: number;
  stage: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface BuildArtifact {
  apkPath: string;
  apkDownloadUrl: string;
  apkFileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  packageId: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  isSigned: boolean;
  signingScheme: string;
  certFingerprintSha256: string;
  certDn: string;
  hasHomeLauncher: boolean;
  activitiesCount: number;
  permissionsCount: number;
}

export interface BuildJob {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentStage: string;
  startTime: number;
  endTime?: number;
  logs: BuildLogEntry[];
  error?: string;
  artifact?: BuildArtifact;
}

export interface TestFixtureResult {
  fixtureId: string;
  title: string;
  engine: EngineType;
  expectedOutcome: 'BUILD_SUCCESS' | 'EXPECTED_ERROR' | 'REJECT_UNSAFE';
  status: 'PASS' | 'FAIL';
  actualOutcome: string;
  durationMs: number;
  details: string;
  apkSize?: string;
  signatureVerified?: boolean;
}
