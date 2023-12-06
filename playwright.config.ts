import { defineConfig, devices } from '@playwright/test'
import path from 'path'

const PORT = 5000

const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  timeout: 50 * 1000,
  testDir: path.join(__dirname, './tests/e2e/'),
  retries: 2,
  outputDir: 'test-results',

  webServer: {
    command: 'npm start',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
})
