// scripts/measure-route-js.mjs
// Uso: node scripts/measure-route-js.mjs http://localhost:3000/ [outras URLs]
import { chromium } from "@playwright/test"

const urls = process.argv.slice(2)
const browser = await chromium.launch({ channel: "chrome", headless: true })

try {
  for (const url of urls) {
    const context = await browser.newContext()
    try {
      const page = await context.newPage()
      const cdp = await context.newCDPSession(page)
      await cdp.send("Network.enable")
      const types = new Map()
      let script = 0
      let font = 0
      cdp.on("Network.responseReceived", (e) => types.set(e.requestId, e.type))
      cdp.on("Network.loadingFinished", (e) => {
        const type = types.get(e.requestId)
        if (type === "Script") script += e.encodedDataLength
        if (type === "Font") font += e.encodedDataLength
      })
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 5000 })
      } catch {
        await page.waitForLoadState("load")
        await page.waitForTimeout(1000)
      }
      console.log(
        `${url}\tJS ${(script / 1024).toFixed(1)} KiB\tfontes ${(font / 1024).toFixed(1)} KiB`,
      )
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
