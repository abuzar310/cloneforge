import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "docs/design-references/wembi.ai");
mkdirSync(out, { recursive: true });

const server = spawn("npx", ["next", "start", "-p", "3456"], {
  cwd: root,
  shell: true,
  stdio: "pipe",
});

await new Promise((r) => setTimeout(r, 4000));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3456/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: join(out, "clone-desktop.png"), fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: join(out, "clone-mobile.png"), fullPage: true });
await browser.close();
server.kill();
console.log("QA screenshots saved");
