import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e/contract",
  timeout: 60_000,
  retries: 1,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "https://www.bcriativo.com",
  },
})
