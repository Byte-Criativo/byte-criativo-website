import { defineConfig, devices } from "@playwright/test"

const port = process.env.PORT ?? "3000"

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ["contract/**"],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  use: { baseURL: `http://localhost:${port}` },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
      },
    },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    // O E2E do formulário exercita a falha do provedor sem enviar leads reais.
    env: { RESEND_API_KEY: "" },
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
})
