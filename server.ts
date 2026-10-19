import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import {
  activeJobs,
  appendJobLog,
  inspectProject,
  safeExtractZip,
  createSampleProject,
  compileApkJob,
  runAutomatedTestSuite,
} from './src/server/buildEngine.js';
import { BuildConfig, BuildJob } from './src/types/builder.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ensure public/builds directory exists
const publicBuildsDir = path.join(__dirname, 'public', 'builds');
fs.mkdirSync(publicBuildsDir, { recursive: true });

// Setup Multer for secure uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadId = `upload-${Date.now()}`;
    const uploadDir = path.join('/tmp', 'uploads', uploadId);
    fs.mkdirSync(uploadDir, { recursive: true });
    (req as any).uploadDir = uploadDir;
    (req as any).uploadId = uploadId;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB limit
});

// -------------------------------------------------------------
// API ROUTES FOR APK BUILDER PRO
// -------------------------------------------------------------

// 1. Upload Project (ZIP or standalone HTML)
app.post('/api/upload', upload.single('projectFile'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const uploadDir = (req as any).uploadDir;
    const uploadId = (req as any).uploadId;
    const uploadedFilePath = req.file.path;
    const isZip = req.file.mimetype.includes('zip') || req.file.originalname.endsWith('.zip');
    const isHtml = req.file.originalname.endsWith('.html') || req.file.mimetype.includes('html');

    let inspectDir = uploadDir;

    if (isZip) {
      const extractedDir = path.join(uploadDir, 'extracted');
      await safeExtractZip(uploadedFilePath, extractedDir);
      inspectDir = extractedDir;
    } else if (isHtml) {
      // Standalone HTML file: ensure index.html exists
      const targetIndex = path.join(uploadDir, 'index.html');
      if (uploadedFilePath !== targetIndex) {
        fs.copyFileSync(uploadedFilePath, targetIndex);
      }
    }

    const inspection = inspectProject(inspectDir, undefined, uploadId);

    // Save project dir mapping in activeJobs or metadata
    (app.locals as any)[uploadId] = inspectDir;

    res.json({
      success: true,
      uploadId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      inspection,
    });
  } catch (err: any) {
    console.error('[Upload Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Load Preloaded Sample Project
app.post('/api/sample/:sampleId', async (req: Request, res: Response) => {
  try {
    const { sampleId } = req.params;
    if (!['fc-ios-launcher', 'react-vite', 'standalone-html'].includes(sampleId)) {
      return res.status(400).json({ success: false, error: 'Unknown sample ID' });
    }

    const projectDir = await createSampleProject(sampleId);
    const inspection = inspectProject(projectDir, sampleId);

    res.json({
      success: true,
      sampleId,
      projectDir,
      inspection,
    });
  } catch (err: any) {
    console.error('[Sample Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2b. Export Project Source (HTML file or ZIP archive)
app.get('/api/project/export/:targetId', async (req: Request, res: Response) => {
  try {
    const { targetId } = req.params;
    let projectDir = '';

    if (['fc-ios-launcher', 'react-vite', 'standalone-html'].includes(targetId)) {
      projectDir = path.join('/tmp', 'sample-projects', targetId);
      if (!fs.existsSync(projectDir)) {
        projectDir = await createSampleProject(targetId);
      }
    } else if ((app.locals as any)[targetId]) {
      projectDir = (app.locals as any)[targetId];
    }

    if (!projectDir || !fs.existsSync(projectDir)) {
      return res.status(404).json({ success: false, error: 'Project workspace not found' });
    }

    // If standalone HTML, allow direct HTML file download
    const htmlFile = path.join(projectDir, 'index.html');
    if (targetId === 'standalone-html' && fs.existsSync(htmlFile)) {
      res.setHeader('Content-Type', 'text/html');
      return res.download(htmlFile, 'index.html');
    }

    // Otherwise package as ZIP
    const zipOut = path.join('/tmp', `${targetId}-source.zip`);
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execP = promisify(exec);
    await execP(`cd "${projectDir}" && zip -q -r "${zipOut}" . -x "node_modules/*" ".git/*" "build/*"`);

    res.download(zipOut, `${targetId}-source.zip`);
  } catch (err: any) {
    console.error('[Export Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Start Compilation Job
app.post('/api/build/start', async (req: Request, res: Response) => {
  try {
    const { sampleId, uploadId, config } = req.body as {
      sampleId?: string;
      uploadId?: string;
      config: BuildConfig;
    };

    let targetProjectDir = '';

    if (sampleId) {
      targetProjectDir = path.join('/tmp', 'sample-projects', sampleId);
      if (!fs.existsSync(targetProjectDir)) {
        targetProjectDir = await createSampleProject(sampleId);
      }
    } else if (uploadId) {
      targetProjectDir = (app.locals as any)[uploadId];
      if (!targetProjectDir || !fs.existsSync(targetProjectDir)) {
        return res.status(400).json({ success: false, error: 'Uploaded project workspace expired or not found' });
      }
    } else {
      return res.status(400).json({ success: false, error: 'Either sampleId or uploadId must be specified' });
    }

    const jobId = `BUILD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newJob: BuildJob = {
      jobId,
      status: 'queued',
      progress: 0,
      currentStage: 'QUEUED',
      startTime: Date.now(),
      logs: [],
    };

    activeJobs.set(jobId, newJob);

    // Launch genuine background compilation
    compileApkJob(jobId, targetProjectDir, config).catch((err) => {
      console.error(`[Build Job ${jobId} Failed]`, err.message);
    });

    res.json({
      success: true,
      jobId,
      status: 'queued',
      message: 'Compilation job scheduled in build worker queue.',
    });
  } catch (err: any) {
    console.error('[Build Start Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get Job Status & Logs
app.get('/api/build/status/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = activeJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ success: false, error: 'Job ID not found' });
  }

  res.json({
    success: true,
    job,
  });
});

// 5. Cancel Job
app.post('/api/build/cancel/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = activeJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ success: false, error: 'Job ID not found' });
  }

  if (job.status === 'running' || job.status === 'queued') {
    job.status = 'cancelled';
    job.currentStage = 'CANCELLED';
    appendJobLog(job, 'CANCEL', 'warn', 'Build job safely cancelled by user request.');
  }

  res.json({ success: true, message: 'Job cancelled' });
});

// 6. Download APK
app.get('/api/build/download/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = activeJobs.get(jobId);

  if (!job || !job.artifact) {
    return res.status(404).json({ success: false, error: 'Artifact not available for this job' });
  }

  const apkPath = job.artifact.apkPath;
  if (!fs.existsSync(apkPath)) {
    return res.status(404).json({ success: false, error: 'APK binary not found on disk' });
  }

  res.download(apkPath, job.artifact.apkFileName);
});

// 7. Download Build Logs
app.get('/api/build/logs/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = activeJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }

  const logLines = job.logs.map(
    (l) => `[${new Date(l.timestamp).toISOString()}][${l.stage}][${l.level.toUpperCase()}] ${l.message}`
  );

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="${jobId}.log"`);
  res.send(logLines.join('\n'));
});

// 8. Run Automated Test Suite
app.get('/api/test-suite/run', async (req: Request, res: Response) => {
  try {
    const results = await runAutomatedTestSuite();
    const passedCount = results.filter((r) => r.status === 'PASS').length;
    res.json({
      success: true,
      timestamp: Date.now(),
      summary: {
        total: results.length,
        passed: passedCount,
        failed: results.length - passedCount,
      },
      results,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. System & Cloud Toolchain Status
app.get('/api/system/status', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    platform: 'FC Universal APK Builder Pro Cloud Toolchain',
    buildWorker: {
      type: 'Native Linux Cloud Worker Container',
      androidSdk: 'Android SDK Platform 33 (Android 13 / Tiramisu)',
      javaRuntime: 'OpenJDK 17.0.20 Headless',
      kotlinCompiler: 'kotlinc 1.9.22 (JVM 17 Target)',
      dexCompiler: 'Google D8 3.3.28',
      gradleVersion: 'Gradle 8.5',
      aaptVersion: 'Android Asset Packaging Tool (AAPT v0.2)',
      apksigner: 'Android APK Signer 31.0.2 (Signature Scheme v1 + v2 + v3)',
      zipalign: 'Android Zip Alignment Tool (4-byte alignment)',
    },
    engines: [
      { id: 'ENGINE_A_STATIC_WEB', name: 'Engine A: Static Web to APK', status: 'OPERATIONAL' },
      { id: 'ENGINE_B_REACT_VITE', name: 'Engine B: React / Vite / AI Studio to APK', status: 'OPERATIONAL' },
      { id: 'ENGINE_C_NATIVE_ANDROID', name: 'Engine C: Native Android Kotlin/Java (Preserves Launchers)', status: 'OPERATIONAL' },
      { id: 'ENGINE_D_FLUTTER', name: 'Engine D: Flutter Mobile App', status: 'REQUIRES_WORKER' },
    ],
  });
});

// Serve public static assets
app.use(express.static(path.join(__dirname, 'public')));

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FC Universal APK Builder Pro] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
