import { spawn } from 'node:child_process';
import { rm, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, 'output', 'playwright', 'responsive-smoke');
const previewPort = Number(process.env.QA_RESPONSIVE_PORT ?? 4173);
const previewHost = process.env.QA_RESPONSIVE_HOST ?? '127.0.0.1';
const baseUrl =
  process.env.QA_RESPONSIVE_URL ?? `http://${previewHost}:${previewPort}`;
const previewTimeoutMs = 15_000;
const skipBuild = process.argv.includes('--skip-build');
const viewports = [
  { width: 1280, height: 820 },
  { width: 1100, height: 820 },
];
const routes = [
  { id: 'overview', path: '/' },
  { id: 'pipeline', path: '/pipeline' },
  { id: 'performance', path: '/performance' },
  { id: 'forecast', path: '/forecast' },
  { id: 'about', path: '/about' },
];

function log(message) {
  console.log(`[qa:responsive] ${message}`);
}

function getNpmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

async function runCommand(command, args, label) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env: process.env,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${label} failed with exit code ${code ?? 'unknown'}`));
    });
  });
}

function startPreviewServer() {
  const child = spawn(
    getNpmCommand(),
    [
      'run',
      'preview',
      '--',
      '--host',
      previewHost,
      '--port',
      String(previewPort),
      '--strictPort',
    ],
    {
      cwd: rootDir,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  let output = '';

  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  return {
    child,
    getOutput() {
      return output.trim();
    },
  };
}

async function waitForPreview(preview) {
  const deadline = Date.now() + previewTimeoutMs;

  while (Date.now() < deadline) {
    if (preview.child.exitCode !== null) {
      throw new Error(
        `Preview server exited early.\n${preview.getOutput() || 'No preview output captured.'}`,
      );
    }

    try {
      const response = await fetch(baseUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // Poll until the preview server is reachable or times out.
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }

  throw new Error(
    `Timed out waiting for preview server at ${baseUrl}.\n${preview.getOutput() || 'No preview output captured.'}`,
  );
}

async function stopPreview(preview) {
  if (preview.child.exitCode !== null) {
    return;
  }

  await new Promise((resolve) => {
    preview.child.once('close', () => resolve());
    preview.child.kill('SIGTERM');

    setTimeout(() => {
      if (preview.child.exitCode === null) {
        preview.child.kill('SIGKILL');
      }
    }, 2_000);
  });
}

function isMissingBrowserError(error) {
  return /Executable doesn't exist|browserType\.launch/i.test(String(error));
}

function getExpectedNavHref(pathname) {
  return pathname === '/' ? '/' : pathname;
}

function summarizeResult(result) {
  const overflowedTables = result.tables.filter((table) => table.overflowed);
  const unscrollableTables = overflowedTables.filter(
    (table) => !table.wrapperScrollable,
  );

  return {
    viewport: `${result.width}x${result.height}`,
    route: result.path,
    pageOverflow: result.pageOverflow,
    wideCharts: result.wideCharts,
    overflowedTables: overflowedTables.length,
    unscrollableTables: unscrollableTables.length,
    navStable: result.activeNavHref === getExpectedNavHref(result.path),
    requestErrors: result.requestErrors.length,
    pageErrors: result.pageErrors.length,
  };
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  if (!skipBuild) {
    log('Building the app for preview-backed browser QA.');
    await runCommand(getNpmCommand(), ['run', 'build'], 'Build');
  }

  const preview = startPreviewServer();

  try {
    log(`Waiting for local preview at ${baseUrl}.`);
    await waitForPreview(preview);
    log('Launching managed Chromium for responsive smoke checks.');

    let browser;

    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      if (isMissingBrowserError(error)) {
        throw new Error(
          'Chromium is not installed for this repo. Run `npm run qa:responsive:install` first.',
        );
      }

      throw error;
    }

    try {
      const page = await browser.newPage();
      const results = [];
      let currentRequestErrors = [];
      let currentPageErrors = [];

      page.on('response', (response) => {
        if (response.status() < 400) {
          return;
        }

        if (response.url().endsWith('/favicon.ico')) {
          return;
        }

        currentRequestErrors.push({
          status: response.status(),
          url: response.url(),
        });
      });

      page.on('pageerror', (error) => {
        currentPageErrors.push(error.message);
      });

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);

        for (const route of routes) {
          currentRequestErrors = [];
          currentPageErrors = [];

          const targetUrl = new URL(route.path, baseUrl).toString();
          log(`Checking ${route.path} at ${viewport.width}x${viewport.height}.`);

          await page.goto(targetUrl, { waitUntil: 'networkidle' });
          await page.waitForTimeout(150);

          const layout = await page.evaluate(() => {
            const doc = document.documentElement;
            const wrappers = Array.from(
              document.querySelectorAll('.recharts-wrapper'),
            );
            const tables = Array.from(document.querySelectorAll('table')).map(
              (table, index) => {
                const wrapper = table.parentElement;
                const wrapperStyle = wrapper
                  ? window.getComputedStyle(wrapper)
                  : null;

                return {
                  index,
                  overflowed: wrapper
                    ? table.scrollWidth > wrapper.clientWidth + 1
                    : false,
                  wrapperScrollable: wrapperStyle
                    ? wrapperStyle.overflowX === 'auto' ||
                      wrapperStyle.overflowX === 'scroll' ||
                      wrapperStyle.overflow === 'auto' ||
                      wrapperStyle.overflow === 'scroll'
                    : false,
                  tableWidth: table.scrollWidth,
                  wrapperWidth: wrapper?.clientWidth ?? null,
                };
              },
            );
            const activeNavHref =
              Array.from(
                document.querySelectorAll('nav[aria-label="Primary"] a'),
              ).find(
                (link) => link.getAttribute('aria-current') === 'page',
              )?.getAttribute('href') ?? null;

            return {
              pageOverflow: doc.scrollWidth > window.innerWidth + 1,
              chartCount: wrappers.length,
              wideCharts: wrappers.filter((wrapper) => {
                const parent = wrapper.parentElement;

                return parent
                  ? wrapper.scrollWidth > parent.clientWidth + 1
                  : false;
              }).length,
              tables,
              activeNavHref,
            };
          });

          const screenshotPath = join(
            outputDir,
            `${route.id}-${viewport.width}.png`,
          );

          await page.screenshot({
            path: screenshotPath,
            fullPage: true,
          });

          results.push({
            ...viewport,
            ...route,
            ...layout,
            requestErrors: currentRequestErrors,
            pageErrors: currentPageErrors,
            screenshotPath,
          });
        }
      }

      const reportPath = join(outputDir, 'report.json');
      await writeFile(reportPath, JSON.stringify(results, null, 2));

      const summary = results.map(summarizeResult);
      console.table(summary);

      const failures = results.filter((result) => {
        const overflowedTables = result.tables.filter((table) => table.overflowed);
        const unscrollableTables = overflowedTables.filter(
          (table) => !table.wrapperScrollable,
        );

        return (
          result.pageOverflow ||
          result.wideCharts > 0 ||
          result.activeNavHref !== getExpectedNavHref(result.path) ||
          result.requestErrors.length > 0 ||
          result.pageErrors.length > 0 ||
          unscrollableTables.length > 0
        );
      });

      if (failures.length > 0) {
        log(`Responsive smoke check failed. Report saved to ${reportPath}.`);
        failures.forEach((failure) => {
          log(
            `${failure.width}x${failure.height} ${failure.path} failed: ${JSON.stringify(
              summarizeResult(failure),
            )}`,
          );
        });
        process.exitCode = 1;
        return;
      }

      log(`Responsive smoke check passed. Report saved to ${reportPath}.`);
    } finally {
      await browser.close();
    }
  } finally {
    await stopPreview(preview);
  }
}

main().catch((error) => {
  console.error(`[qa:responsive] ${error.message}`);
  process.exitCode = 1;
});
