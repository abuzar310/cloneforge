#!/usr/bin/env node
/**
 * Full reconnaissance extraction for https://www.wembi.ai/
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const URL = "https://www.wembi.ai/";
const research = join(root, "docs/research/wembi.ai");
const shots = join(root, "docs/design-references/wembi.ai");
const imagesDir = join(root, "public/images/wembi");
const seoDir = join(root, "public/seo");

for (const d of [research, join(research, "components"), shots, imagesDir, seoDir]) {
  mkdirSync(d, { recursive: true });
}

const browser = await chromium.launch();
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
});

async function shot(page, name) {
  const path = join(shots, name);
  await page.screenshot({ path, fullPage: true });
  console.log("shot", name);
}

// Desktop recon
const page = await context.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

// Dismiss cookie banners if any
for (const sel of [
  'button:has-text("Accept")',
  'button:has-text("Got it")',
  'button:has-text("OK")',
  '[aria-label="Close"]',
]) {
  try {
    const b = page.locator(sel).first();
    if (await b.isVisible({ timeout: 800 })) await b.click();
  } catch {}
}

await shot(page, "desktop-full.png");

const global = await page.evaluate(() => {
  const fonts = [
    ...new Set(
      [...document.querySelectorAll("*")]
        .slice(0, 400)
        .map((el) => getComputedStyle(el).fontFamily)
    ),
  ];
  const fontLinks = [...document.querySelectorAll('link[rel="stylesheet"], link[href*="font"]')].map(
    (l) => l.href
  );
  const favicons = [...document.querySelectorAll('link[rel*="icon"]')].map((l) => ({
    href: l.href,
    sizes: l.sizes?.toString(),
    type: l.type,
  }));

  // Sections: top-level children of main/body
  const main =
    document.querySelector("main") ||
    document.querySelector("#__next") ||
    document.querySelector("[data-reactroot]") ||
    document.body;

  const sectionEls = [...main.querySelectorAll("section, header, footer, nav, [class*='hero'], [class*='Hero']")];
  const sections = sectionEls.map((el, i) => {
    const r = el.getBoundingClientRect();
    return {
      i,
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      classes: (el.className?.toString() || "").slice(0, 120),
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
      textPreview: (el.innerText || "").slice(0, 180).replace(/\s+/g, " "),
    };
  });

  // Also map direct large blocks
  const blocks = [...main.children].map((el, i) => {
    const r = el.getBoundingClientRect();
    return {
      i,
      tag: el.tagName.toLowerCase(),
      classes: (el.className?.toString() || "").slice(0, 100),
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
      textPreview: (el.innerText || "").slice(0, 160).replace(/\s+/g, " "),
    };
  });

  const colors = new Set();
  [...document.querySelectorAll("*")].slice(0, 300).forEach((el) => {
    const s = getComputedStyle(el);
    [s.color, s.backgroundColor, s.borderColor].forEach((c) => {
      if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") colors.add(c);
    });
  });

  const images = [...document.querySelectorAll("img")].map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.alt,
    w: img.naturalWidth,
    h: img.naturalHeight,
    position: getComputedStyle(img).position,
    zIndex: getComputedStyle(img).zIndex,
  }));

  const videos = [...document.querySelectorAll("video")].map((v) => ({
    src: v.currentSrc || v.src || v.querySelector("source")?.src,
    poster: v.poster,
    autoplay: v.autoplay,
    loop: v.loop,
    muted: v.muted,
  }));

  const bgImages = [...document.querySelectorAll("*")]
    .filter((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      return bg && bg !== "none" && bg.includes("url");
    })
    .slice(0, 80)
    .map((el) => ({
      url: getComputedStyle(el).backgroundImage,
      tag: el.tagName,
      classes: (el.className?.toString() || "").slice(0, 80),
    }));

  const svgs = [...document.querySelectorAll("svg")].slice(0, 40).map((svg, i) => ({
    i,
    viewBox: svg.getAttribute("viewBox"),
    outer: svg.outerHTML.slice(0, 500),
    parent: svg.parentElement?.tagName,
    aria: svg.getAttribute("aria-label"),
    w: svg.getBoundingClientRect().width,
    h: svg.getBoundingClientRect().height,
  }));

  const links = [...document.querySelectorAll("a")].slice(0, 80).map((a) => ({
    text: (a.textContent || "").trim().slice(0, 80),
    href: a.href,
  }));

  const buttons = [...document.querySelectorAll("button, a[class*='btn'], a[class*='button']")].slice(0, 40).map((b) => ({
    text: (b.textContent || "").trim().slice(0, 60),
    tag: b.tagName,
    classes: (b.className?.toString() || "").slice(0, 80),
  }));

  const stylesheets = [...document.styleSheets].length;
  const styleTags = [...document.querySelectorAll("style")].map((s) => s.textContent?.slice(0, 2000));

  // body / html styles
  const body = getComputedStyle(document.body);
  const html = getComputedStyle(document.documentElement);

  return {
    title: document.title,
    metaDescription: document.querySelector('meta[name="description"]')?.content,
    fonts,
    fontLinks,
    favicons,
    sections,
    blocks,
    colors: [...colors].slice(0, 60),
    images,
    videos,
    bgImages,
    svgs,
    links,
    buttons,
    stylesheets,
    styleTagsSample: styleTags.slice(0, 5),
    body: {
      backgroundColor: body.backgroundColor,
      color: body.color,
      fontFamily: body.fontFamily,
      fontSize: body.fontSize,
      overflow: body.overflow,
    },
    htmlBg: html.backgroundColor,
    hasLenis: !!document.querySelector(".lenis, .locomotive-scroll"),
    scrollHeight: document.documentElement.scrollHeight,
    htmlSnippet: document.documentElement.outerHTML.slice(0, 15000),
  };
});

writeFileSync(join(research, "global.json"), JSON.stringify(global, null, 2));
console.log("title:", global.title);
console.log("sections:", global.sections.length, "blocks:", global.blocks.length);
console.log("images:", global.images.length, "videos:", global.videos.length);

// Scroll sweep — capture styles at intervals
const scrollFindings = [];
const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
const steps = 8;
for (let i = 0; i <= steps; i++) {
  const y = Math.round((maxScroll * i) / steps);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(400);
  const snap = await page.evaluate((yy) => {
    const header =
      document.querySelector("header") ||
      document.querySelector("nav") ||
      document.querySelector("[class*='nav']");
    const hs = header ? getComputedStyle(header) : null;
    return {
      y: yy,
      header: hs
        ? {
            bg: hs.backgroundColor,
            height: hs.height,
            boxShadow: hs.boxShadow,
            position: hs.position,
            backdropFilter: hs.backdropFilter,
          }
        : null,
    };
  }, y);
  scrollFindings.push(snap);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

writeFileSync(join(research, "scroll-sweep.json"), JSON.stringify(scrollFindings, null, 2));

// Deep extract each major block
const deep = await page.evaluate(() => {
  const props = [
    "fontSize",
    "fontWeight",
    "fontFamily",
    "lineHeight",
    "letterSpacing",
    "color",
    "textTransform",
    "textDecoration",
    "backgroundColor",
    "background",
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "margin",
    "marginTop",
    "marginBottom",
    "width",
    "height",
    "maxWidth",
    "minWidth",
    "display",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "gap",
    "gridTemplateColumns",
    "borderRadius",
    "border",
    "boxShadow",
    "overflow",
    "position",
    "top",
    "zIndex",
    "opacity",
    "transform",
    "transition",
    "objectFit",
    "backdropFilter",
    "WebkitBackgroundClip",
    "backgroundClip",
    "WebkitTextFillColor",
  ];
  function extractStyles(element) {
    const cs = getComputedStyle(element);
    const styles = {};
    props.forEach((p) => {
      const v = cs[p];
      if (v && v !== "none" && v !== "normal" && v !== "auto" && v !== "0px" && v !== "rgba(0, 0, 0, 0)")
        styles[p] = v;
    });
    return styles;
  }
  function walk(element, depth) {
    if (depth > 3) return null;
    const children = [...element.children];
    return {
      tag: element.tagName.toLowerCase(),
      classes: element.className?.toString().split(" ").slice(0, 6).join(" "),
      text:
        element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
          ? element.textContent.trim().slice(0, 200)
          : null,
      textContent: depth <= 1 ? (element.innerText || "").slice(0, 400) : null,
      styles: extractStyles(element),
      images:
        element.tagName === "IMG"
          ? { src: element.src, alt: element.alt, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight }
          : null,
      childCount: children.length,
      children: children.slice(0, 16).map((c) => walk(c, depth + 1)).filter(Boolean),
    };
  }

  const main =
    document.querySelector("main") ||
    document.querySelector("#__next") ||
    document.body;
  const targets = [...main.querySelectorAll("section, header, footer, nav")];
  // if few sections, use large children
  const list =
    targets.length >= 3
      ? targets
      : [...main.children].filter((el) => el.getBoundingClientRect().height > 80);

  return list.slice(0, 20).map((el, i) => ({
    index: i,
    tag: el.tagName.toLowerCase(),
    classes: (el.className?.toString() || "").slice(0, 120),
    tree: walk(el, 0),
  }));
});

writeFileSync(join(research, "deep-sections.json"), JSON.stringify(deep, null, 2));

// Mobile screenshot
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);
await shot(page, "mobile-full.png");

const mobileLayout = await page.evaluate(() => {
  const main = document.querySelector("main") || document.body;
  return [...main.querySelectorAll("section, header, footer, nav")]
    .slice(0, 15)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        classes: (el.className?.toString() || "").slice(0, 80),
        display: s.display,
        flexDirection: s.flexDirection,
        width: s.width,
        height: Math.round(r.height),
        textPreview: (el.innerText || "").slice(0, 100).replace(/\s+/g, " "),
      };
    });
});
writeFileSync(join(research, "mobile-layout.json"), JSON.stringify(mobileLayout, null, 2));

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1000);
await shot(page, "tablet-full.png");

await browser.close();

// Download assets
async function download(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    return true;
  } catch (e) {
    console.warn("fail", url, e.message);
    return false;
  }
}

const assetList = [];
for (const img of global.images) {
  if (!img.src || img.src.startsWith("data:")) continue;
  assetList.push(img.src);
}
for (const bg of global.bgImages) {
  const m = bg.url.match(/url\(["']?(https?:\/\/[^"')]+)/);
  if (m) assetList.push(m[1]);
}
for (const f of global.favicons) {
  if (f.href && !f.href.startsWith("data:")) assetList.push(f.href);
}

const unique = [...new Set(assetList)];
const manifest = [];
let i = 0;
for (const src of unique.slice(0, 60)) {
  try {
    const u = new URL(src);
    const base = u.pathname.split("/").pop() || `asset-${i}`;
    const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const isIcon = src.includes("favicon") || src.includes("icon");
    const dest = join(isIcon ? seoDir : imagesDir, safe.includes(".") ? safe : `${safe}.png`);
    const ok = await download(src, dest);
    if (ok) {
      manifest.push({ src, local: dest.replace(root, "").replace(/\\/g, "/") });
      i++;
    }
  } catch {}
}
writeFileSync(join(research, "assets-manifest.json"), JSON.stringify(manifest, null, 2));
console.log("downloaded", manifest.length, "assets");
console.log("DONE");
