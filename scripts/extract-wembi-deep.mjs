#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, createWriteStream } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import https from "node:https";
import http from "node:http";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const research = join(root, "docs/research/wembi.ai");
const imagesDir = join(root, "public/images/wembi");
const videosDir = join(root, "public/videos/wembi");
const seoDir = join(root, "public/seo");
const fontsDir = join(root, "public/fonts/wembi");

for (const d of [imagesDir, videosDir, seoDir, fontsDir, join(research, "components")]) {
  mkdirSync(d, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const file = createWriteStream(dest);
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        download(res.headers.location, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        resolve(false);
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(true);
      });
    });
    req.on("error", () => {
      file.close();
      resolve(false);
    });
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://www.wembi.ai/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

// Accept cookies
try {
  await page.locator('button:has-text("Accept")').first().click({ timeout: 2000 });
} catch {}

const content = await page.evaluate(() => {
  const text = (sel) => {
    const el = document.querySelector(sel);
    return el ? el.innerText.trim() : null;
  };

  const logo = document.querySelector("#logo, svg#logo, .logo svg, header svg, .hero svg");
  const logoHtml = logo?.outerHTML || document.querySelector(".hero svg")?.outerHTML;

  // Hero
  const hero = {
    minititle: text(".hero__minititle") || text(".mini-t"),
    text: text(".hero__text"),
  };

  // WHAT
  const what = document.querySelector(".what, .section-text.what");
  const whatData = what
    ? {
        label: what.querySelector(".mini-t, .minititle, [class*='mini']")?.innerText?.trim(),
        title: what.querySelector("h1, h2, .title, .ff-ductile, [class*='title']")?.innerText?.trim(),
        body: what.innerText.trim(),
        html: what.innerHTML.slice(0, 3000),
      }
    : null;

  // HOW / service list
  const how = document.querySelector(".service-list");
  const howItems = how
    ? [...how.querySelectorAll("a, .service, li, [class*='item']")].map((el) => ({
        text: el.innerText.trim().slice(0, 200),
        href: el.href || null,
      }))
    : [];

  // Steps sections
  const steps = [...document.querySelectorAll(".steps")].map((sec) => {
    const items = [...sec.querySelectorAll(".step, [class*='step'], li")].slice(0, 12);
    // Also try slide-like children
    const panels = [...sec.children].map((c) => ({
      text: c.innerText.trim().slice(0, 500),
      classes: (c.className?.toString() || "").slice(0, 80),
    }));
    return {
      classes: sec.className?.toString(),
      fullText: sec.innerText.trim().slice(0, 2000),
      panels,
      items: items.map((i) => i.innerText.trim().slice(0, 400)),
    };
  });

  // WHY list
  const why = document.querySelector(".section-text-list");
  const whyData = why
    ? {
        full: why.innerText.trim(),
        items: [...why.querySelectorAll("li, .item, h2, h3, [class*='title']")].map((el) =>
          el.innerText.trim()
        ),
      }
    : null;

  // WHERE accordion
  const where = document.querySelector(".accordion-list");
  const whereItems = where
    ? [...where.querySelectorAll(".accordion, details, [class*='accordion'], li, button")].map(
        (el) => ({
          text: el.innerText.trim().slice(0, 300),
          tag: el.tagName,
          open: el.open || el.classList.contains("is-open") || el.classList.contains("active"),
        })
      )
    : [];

  // FAQ — click each to expand
  const faq = document.querySelector(".faq");
  const faqButtons = faq
    ? [...faq.querySelectorAll("button, .faq__item, [class*='question'], details summary")]
    : [];

  const contact = document.querySelector(".contact");
  const footer = document.querySelector("footer");

  // All font-face from stylesheets
  let cssText = "";
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.cssText?.includes("@font-face") || rule.cssText?.includes("Haas") || rule.cssText?.includes("ductile")) {
          cssText += rule.cssText + "\n";
        }
      }
    } catch {}
  }

  // Computed styles for key elements
  function styles(el) {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      fontFamily: s.fontFamily,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
      color: s.color,
      backgroundColor: s.backgroundColor,
      padding: s.padding,
      margin: s.margin,
      maxWidth: s.maxWidth,
      width: s.width,
      display: s.display,
      gap: s.gap,
      borderRadius: s.borderRadius,
      textAlign: s.textAlign,
    };
  }

  return {
    logoHtml: logoHtml?.slice(0, 8000),
    hero,
    heroStyles: {
      minititle: styles(document.querySelector(".hero__minititle")),
      text: styles(document.querySelector(".hero__text")),
      hero: styles(document.querySelector(".hero")),
    },
    what: whatData,
    whatStyles: styles(what?.querySelector("p, .text, .ff-regular")),
    howItems,
    howText: how?.innerText?.trim().slice(0, 1500),
    steps,
    why: whyData,
    whereItems,
    whereText: where?.innerText?.trim().slice(0, 2000),
    faqText: faq?.innerText?.trim().slice(0, 3000),
    faqHtml: faq?.innerHTML?.slice(0, 5000),
    contactText: contact?.innerText?.trim(),
    contactHtml: contact?.innerHTML?.slice(0, 3000),
    footerText: footer?.innerText?.trim(),
    footerHtml: footer?.innerHTML?.slice(0, 4000),
    fontFaceCss: cssText.slice(0, 5000),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    accentEls: [...document.querySelectorAll(".c-accent, [class*='accent']")].slice(0, 5).map((el) => ({
      text: el.innerText.trim().slice(0, 80),
      color: getComputedStyle(el).color,
      bg: getComputedStyle(el).backgroundColor,
    })),
  };
});

// Expand FAQ items
const faqItems = [];
const faqLocators = page.locator(".faq button, .faq summary, .faq [class*='question'], .faq .accordion__title");
const faqCount = await faqLocators.count();
for (let i = 0; i < Math.min(faqCount, 10); i++) {
  try {
    await faqLocators.nth(i).click({ timeout: 1000 });
    await page.waitForTimeout(300);
  } catch {}
}
const faqExpanded = await page.evaluate(() => {
  const faq = document.querySelector(".faq");
  if (!faq) return [];
  // Try common accordion patterns
  const items = [...faq.querySelectorAll(".faq__item, details, [class*='item'], li")];
  if (items.length) {
    return items.map((el) => ({
      q: el.querySelector("button, summary, h3, h4, [class*='title'], [class*='question']")?.innerText?.trim(),
      a: el.querySelector("[class*='answer'], [class*='content'], p, .text")?.innerText?.trim(),
      full: el.innerText.trim().slice(0, 800),
    }));
  }
  return [{ full: faq.innerText.trim().slice(0, 3000) }];
});

// Expand WHERE accordion
const whereLoc = page.locator(".accordion-list button, .accordion-list summary, .accordion-list [class*='title']");
const whereCount = await whereLoc.count();
for (let i = 0; i < Math.min(whereCount, 8); i++) {
  try {
    await whereLoc.nth(i).click({ timeout: 800 });
    await page.waitForTimeout(250);
  } catch {}
}
const whereExpanded = await page.evaluate(() => {
  const where = document.querySelector(".accordion-list");
  if (!where) return [];
  return [...where.querySelectorAll(".accordion, details, [class*='item'], li")].map((el) => ({
    title: el.querySelector("button, summary, h3, [class*='title']")?.innerText?.trim(),
    body: el.innerText.trim().slice(0, 600),
  }));
});

// Step panels — click through tabs if any
const stepTabs = await page.evaluate(() => {
  return [...document.querySelectorAll(".steps")].map((sec, si) => {
    const tabs = [...sec.querySelectorAll("button, [role='tab'], .tab, [class*='nav'] a, [class*='label']")];
    return {
      si,
      tabs: tabs.map((t) => t.innerText.trim().slice(0, 80)),
      text: sec.innerText.trim().slice(0, 2500),
    };
  });
});

writeFileSync(
  join(research, "content.json"),
  JSON.stringify({ ...content, faqExpanded, whereExpanded, stepTabs }, null, 2)
);

// Logo SVG
if (content.logoHtml) {
  writeFileSync(join(research, "logo.svg"), content.logoHtml);
}

// Network: find font files from CSS
const cssUrls = [
  "https://www.wembi.ai/_nuxt/entry.UBSe8SLB.css",
  "https://www.wembi.ai/_nuxt/index.P4_dpxRc.css",
];
let allCss = "";
for (const u of cssUrls) {
  try {
    const res = await fetch(u);
    const t = await res.text();
    allCss += t + "\n";
    writeFileSync(join(research, u.split("/").pop()), t.slice(0, 200000));
  } catch (e) {
    console.warn("css fail", u, e.message);
  }
}
const fontUrls = [...allCss.matchAll(/url\(([^)]+\.(?:woff2?|ttf|otf))\)/gi)].map((m) =>
  m[1].replace(/['"]/g, "")
);
const absFonts = fontUrls.map((u) => {
  if (u.startsWith("http")) return u;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return "https://www.wembi.ai" + u;
  return "https://www.wembi.ai/_nuxt/" + u;
});
writeFileSync(join(research, "font-urls.json"), JSON.stringify([...new Set(absFonts)], null, 2));

await browser.close();

// Download assets
const g = JSON.parse(await import("node:fs").then((fs) => fs.readFileSync(join(research, "global.json"), "utf8")));
const assets = [];
for (const img of g.images) {
  if (!img.src) continue;
  const name = img.src.split("/").pop();
  const dest = join(imagesDir, name);
  const ok = await download(img.src, dest);
  console.log(ok ? "✓" : "✗", "img", name);
  if (ok) assets.push({ type: "image", src: img.src, local: `/images/wembi/${name}` });
}
const videos = [
  ...new Set(g.videos.map((v) => v.src).filter(Boolean)),
];
for (const src of videos) {
  const name = src.replace("https://www.wembi.ai/", "").replace(/\//g, "_");
  const dest = join(videosDir, name);
  const ok = await download(src, dest);
  console.log(ok ? "✓" : "✗", "vid", name);
  if (ok) assets.push({ type: "video", src, local: `/videos/wembi/${name}` });
}
for (const fu of [...new Set(absFonts)].slice(0, 20)) {
  const name = fu.split("/").pop().split("?")[0];
  const dest = join(fontsDir, name);
  const ok = await download(fu, dest);
  console.log(ok ? "✓" : "✗", "font", name);
  if (ok) assets.push({ type: "font", src: fu, local: `/fonts/wembi/${name}` });
}

// favicon
await download("https://www.wembi.ai/favicon.ico", join(seoDir, "favicon.ico"));

writeFileSync(join(research, "assets-manifest.json"), JSON.stringify(assets, null, 2));
console.log("assets", assets.length);
console.log("DONE deep");
