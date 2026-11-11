import { defineConfig, devices, ReporterDescription } from '@playwright/test';
import { config as loadEnv } from 'dotenv';
import { ENV } from './src/utils/env';

loadEnv();
// One id per run so every worker appends to the same logs/run-<id>.log
process.env.PW_RUN_ID ||= new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { outputFolder: 'reports/html', open: 'never' }],
  ['json', { outputFile: 'reports/results.json' }],
  ['junit', { outputFile: 'reports/junit.xml' }],
  // Custom reporter: writes reports/summary.md + one log line per test into logs/
  ['./src/utils/summary-reporter.ts'],
];
if (process.env.ALLURE === '1') {
  reporters.push(['allure-playwright', { resultsDir: 'reports/allure-results' }]);
}

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: reporters,
  use: {
    baseURL: ENV.baseUrl,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // Mandatory requirement: evidence captured when a test fails
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
});
