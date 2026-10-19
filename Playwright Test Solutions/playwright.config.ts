import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // TypeScript configuration file
  tsconfig: './tsconfig.json',

  testDir: './tests',
  
  // Add Spec TS files here to run for 'npx playwright test' or 'npm test'
  testMatch: [
    // '**/specs/reset_all_challenges.spec.ts', 
    // '**/specs/challenge-1.spec.ts', 
    // '**/specs/challenge-2.spec.ts',
    // '**/specs/challenge-3.spec.ts',
    // '**/specs/challenge-4.spec.ts',
    // '**/specs/challenge-5.spec.ts',
    // '**/specs/challenge-6.spec.ts',
    // '**/specs/challenge-7.spec.ts',
    // '**/specs/challenge-8.spec.ts',
    // '**/specs/challenge-9.spec.ts',
    '**/specs/challenge-10.spec.ts',              
  ],


  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

  ],

});