#!/usr/bin/env node
/**
 * @file tools/check-parity.mjs
 * @description Read-only parity checks for SPhOH. Not loaded by the site.
 *
 * Usage: node tools/check-parity.mjs
 *
 * Checks:
 *  - Public pages load 21 deferred module scripts in order; Admin.html loads 22;
 *    Admin/index.html loads none (redirect). Every module script is deferred.
 *  - Every page carries a Content-Security-Policy meta, loads the external
 *    early-init script before CSS, and has no inline <script> blocks.
 *  - analytics.js loads on the five public pages only, and the CSP of those pages
 *    allows googletagmanager/google-analytics in script-src, img-src and connect-src.
 *  - Locale key sets are identical, and every data-i18n* key (incl. alt) exists
 *    in both. Function-valued keys stay functions in both languages.
 *  - Theme colors, font tokens, and theme-color are unchanged on every page.
 *  - Settings.LINKS, the GA measurement id, and the topic registry agree across
 *    settings.js, contact.html, analytics.js, catalog.js, and card.component.js.
 *  - The maintainability wiring stays in place: delegated library search and
 *    reader select, palette close/backdrop, sphoh:refresh, storage-failure
 *    handling, shared stem normalization, and a non-interactive admin preview.
 *  - Curriculum hardening (Phase C): PDF path whitelist, 75-char description
 *    preservation, per-language stems, strict payload validation, id counter.
 *  - Locales.en and the English UI (HTML text/attributes, UI JS string literals)
 *    contain no Arabic characters.
 *  - Catalog.FALLBACK_RESOURCES deep-equals data/resources.json.
 *  - Every declared PDF path exists; orphan PDFs are reported as warnings.
 *  - admin.page.js / admin.css are loaded only by Admin.html.
 *  - assets/js/main.js is gone and unreferenced.
 *
 * Exit code: 1 when any FAIL is reported, 0 otherwise.
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const BASE_SCRIPTS = [
  "assets/js/config/settings.js",
  "assets/js/config/catalog.js",
  "assets/js/i18n/locales.js",
  "assets/js/core/dom.js",
  "assets/js/core/storage.js",
  "assets/js/services/state.service.js",
  "assets/js/services/i18n.service.js",
  "assets/js/services/theme.service.js",
  "assets/js/services/download.service.js",
  "assets/js/services/curriculum.service.js",
  "assets/js/components/toast.component.js",
  "assets/js/services/progress.service.js",
  "assets/js/services/effects.service.js",
  "assets/js/components/layout.component.js",
  "assets/js/components/card.component.js",
  "assets/js/pages/home.page.js",
  "assets/js/pages/files.page.js",
  "assets/js/pages/preview.page.js",
  "assets/js/pages/about.page.js",
  "assets/js/pages/contact.page.js",
  "assets/js/app.js",
];

const ADMIN_SCRIPTS = [
  ...BASE_SCRIPTS.slice(0, -1),
  "assets/js/pages/admin.page.js",
  "assets/js/app.js",
];

const PUBLIC_PAGES = [
  "index.html",
  "files.html",
  "preview.html",
  "about.html",
  "contact.html",
];
const ADMIN_PAGE = "Admin.html";
const ADMIN_REDIRECT = "Admin/index.html";

let failures = 0;
let warnings = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL  ${message}`);
}

function warn(message) {
  warnings += 1;
  console.warn(`WARN  ${message}`);
}

function ok(message) {
  console.log(`OK    ${message}`);
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

// Non-module scripts that live in assets/js/ but are not part of the module chain.
const EARLY_INIT_SCRIPT = "assets/js/early-init.js";
const ANALYTICS_SCRIPT = "assets/js/analytics.js";
const AUXILIARY_SCRIPTS = new Set([EARLY_INIT_SCRIPT, ANALYTICS_SCRIPT]);

function extractModuleScripts(html) {
  const scripts = [];
  const re = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = re.exec(html))) {
    const src = match[1];
    if (src.startsWith("assets/js/") && !AUXILIARY_SCRIPTS.has(src))
      scripts.push(src);
  }
  return scripts;
}

/** Returns every <script> tag as { src } (src is '' for inline blocks). */
function scriptTags(html) {
  const tags = [];
  const re = /<script\b([^>]*)>/gi;
  let match;
  while ((match = re.exec(html))) {
    const srcMatch = match[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    tags.push({ src: srcMatch ? srcMatch[1] : "" });
  }
  return tags;
}

function checkScripts(page, expected) {
  if (!exists(page)) {
    fail(`${page}: file is missing`);
    return;
  }
  const html = read(page);
  const actual = extractModuleScripts(html);
  if (actual.length !== expected.length) {
    fail(
      `${page}: expected ${expected.length} module scripts, found ${actual.length}`,
    );
    return;
  }
  const index = expected.findIndex((src, i) => src !== actual[i]);
  if (index !== -1) {
    fail(
      `${page}: script #${index + 1} is ${actual[index]}, expected ${expected[index]}`,
    );
    return;
  }

  // Module scripts must be deferred so parsing never blocks on them.
  const tagRe = /<script\b([^>]*)>/gi;
  let match;
  let undeferred = 0;
  while ((match = tagRe.exec(html))) {
    const attrs = match[1];
    const srcMatch = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!srcMatch) continue;
    const src = srcMatch[1];
    if (!src.startsWith("assets/js/") || AUXILIARY_SCRIPTS.has(src)) continue;
    if (!/\bdefer\b/i.test(attrs)) {
      fail(`${page}: ${src} must carry the defer attribute`);
      undeferred += 1;
    }
  }

  if (!undeferred)
    ok(`${page}: ${expected.length} module scripts in order and deferred`);
}

for (const file of BASE_SCRIPTS) {
  if (!exists(file)) fail(`BASE_SCRIPTS entry is missing on disk: ${file}`);
}

function loadGlobal(relPath) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(relPath), sandbox, { filename: relPath });
  return sandbox.window.SPhOH;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = stable(value[key]);
    return out;
  }
  return value;
}

function sameJson(a, b) {
  return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
}

const ARABIC_RE = /[؀-ۿ]/;

/** Removes line and block comments while keeping string literals intact. */
function stripJsComments(src) {
  let out = "";
  let i = 0;
  let state = null;
  let quote = "";
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (state === "line") {
      if (c === "\n") {
        state = null;
        out += c;
      }
      i += 1;
      continue;
    }
    if (state === "block") {
      if (c === "*" && n === "/") {
        state = null;
        i += 2;
      } else {
        i += 1;
      }
      continue;
    }
    if (state === "str") {
      out += c;
      if (c === "\\") {
        out += src[i + 1] || "";
        i += 2;
        continue;
      }
      if (c === quote) state = null;
      i += 1;
      continue;
    }
    if (c === "/" && n === "/") {
      state = "line";
      i += 2;
      continue;
    }
    if (c === "/" && n === "*") {
      state = "block";
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      state = "str";
      quote = c;
      out += c;
      i += 1;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

function stripHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, "");
}

/** Returns the body of the first `marker { ... }` block (nested braces aware). */
function mediaBlockSource(css, marker) {
  const markerIdx = css.indexOf(marker);
  if (markerIdx === -1) return "";
  const open = css.indexOf("{", markerIdx);
  if (open === -1) return "";
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  return "";
}

/**
 * Blanks Arabic string literals that are bilingual *data* by design:
 * `ar: '...'` properties and `...Ar = '...'` / `?.ar || '...'` fallbacks.
 * Anything else that still contains Arabic is treated as a UI leak.
 */
function blankArabicDataLiterals(src) {
  return src
    .replace(/(\bar\s*:\s*)(['"`])(?:\\.|(?!\2)[\s\S])*?\2/g, '$1""')
    .replace(/(\b\w*Ar\s*=\s*)(['"`])(?:\\.|(?!\2)[\s\S])*?\2/g, '$1""')
    .replace(/(\?\.ar\s*\|\|\s*)(['"`])(?:\\.|(?!\2)[\s\S])*?\2/g, '$1""');
}

const FILE_SUFFIX = { ar: "AR", en: "ENG" };

/** Mirrors CurriculumService.getFileStemForLang: `lang → en → ar` fallback. */
function resolveStem(file, lang) {
  if (file && typeof file === "object") {
    const value =
      file[lang] !== undefined
        ? file[lang]
        : file.en !== undefined
          ? file.en
          : file.ar;
    return value ? String(value) : "";
  }
  return file ? String(file) : "";
}

function buildPdfPath(stem, lang, aliases) {
  if (!stem) return null;
  const raw = String(stem).trim();
  if (!raw) return null;
  if (
    /^(https?:)?\/\//i.test(raw) ||
    raw.startsWith("/") ||
    raw.startsWith("PDFs/") ||
    (/\//.test(raw) && /\.pdf$/i.test(raw))
  ) {
    return raw;
  }
  const canonical = (aliases && aliases[raw]) || raw.replace(/\.pdf$/i, "");
  return `PDFs/${lang}/${canonical}_${FILE_SUFFIX[lang]}.pdf`;
}

/** Mirrors CurriculumService.getSolutionStemForLang, including `true` stems. */
function getSolutionStem(resource, lang) {
  const raw =
    resource.solution !== undefined
      ? resource.solution
      : resource.solutions ||
        resource.solutionFile ||
        resource.solution_file ||
        resource.answer ||
        "";
  const fallbackStem = resolveStem(resource.file, lang);
  if (raw === true) return fallbackStem ? `${fallbackStem}_Solutions` : "";
  if (raw && typeof raw === "object") {
    const value = raw[lang];
    if (value === true) return fallbackStem ? `${fallbackStem}_Solutions` : "";
    return value || "";
  }
  return raw || "";
}

/** Root-relative `/PDFs/...` resolves to the same file on disk as `PDFs/...`. */
function diskPath(pdfPath) {
  return pdfPath.replace(/^\/+/, "");
}

// 1) Script parity -----------------------------------------------------------
for (const page of PUBLIC_PAGES) checkScripts(page, BASE_SCRIPTS);
checkScripts(ADMIN_PAGE, ADMIN_SCRIPTS);

if (!exists(ADMIN_REDIRECT)) {
  fail(`${ADMIN_REDIRECT}: redirect page is missing`);
} else {
  const redirectHtml = read(ADMIN_REDIRECT);
  const redirectScripts = extractModuleScripts(redirectHtml);
  if (redirectScripts.length !== 0) {
    fail(
      `${ADMIN_REDIRECT}: expected 0 module scripts, found ${redirectScripts.length}`,
    );
  } else if (
    !/http-equiv=["']refresh["']/i.test(redirectHtml) ||
    !/Admin\.html/.test(redirectHtml)
  ) {
    fail(`${ADMIN_REDIRECT}: missing meta refresh target for Admin.html`);
  } else {
    ok(`${ADMIN_REDIRECT}: redirect with 0 module scripts`);
  }
}

// 1b) CSP + external head scripts -------------------------------------------
function checkHeadAssets(page, { analytics }) {
  if (!exists(page)) return;
  const html = read(page);
  const stripped = stripHtmlComments(html);

  const cspMatch = html.match(
    /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i,
  );
  if (!cspMatch) {
    fail(`${page}: missing Content-Security-Policy meta`);
  } else {
    const policy = cspMatch[1];
    for (const directive of [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-src 'self'",
      "form-action 'self'",
    ]) {
      if (!policy.includes(directive))
        fail(`${page}: CSP is missing "${directive}"`);
    }
    // The GA4 loader and its beacon need both hosts in all three directives.
    const ANALYTICS_HOSTS = ["googletagmanager.com", "google-analytics.com"];
    if (analytics) {
      for (const directiveName of ["script-src", "img-src", "connect-src"]) {
        const directiveMatch = policy.match(
          new RegExp(`(?:^|;)\\s*${directiveName}\\s+([^;]+)`),
        );
        if (!directiveMatch) {
          fail(`${page}: CSP is missing ${directiveName} for analytics`);
          continue;
        }
        for (const host of ANALYTICS_HOSTS) {
          if (!directiveMatch[1].includes(host)) {
            fail(`${page}: CSP ${directiveName} does not allow ${host}`);
          }
        }
      }
    } else if (/googletagmanager|google-analytics/.test(policy)) {
      fail(
        `${page}: CSP allows Google hosts on a page that must not load analytics`,
      );
    }
  }

  const tags = scriptTags(stripped);
  const inline = tags.filter((tag) => !tag.src);
  if (inline.length) {
    fail(
      `${page}: ${inline.length} inline <script> block(s) would be blocked by the CSP`,
    );
  }

  const srcs = tags.map((tag) => tag.src);
  if (!srcs.includes(EARLY_INIT_SCRIPT))
    fail(`${page}: does not load ${EARLY_INIT_SCRIPT}`);

  const earlyPos = stripped.indexOf(`src="${EARLY_INIT_SCRIPT}"`);
  const stylePos = stripped.indexOf("assets/css/style.css");
  if (earlyPos === -1 || stylePos === -1 || earlyPos > stylePos) {
    fail(`${page}: ${EARLY_INIT_SCRIPT} must load before the stylesheet`);
  }
  const cspPos = stripped.indexOf("Content-Security-Policy");
  if (cspPos === -1 || cspPos > earlyPos) {
    fail(`${page}: the CSP meta must appear before ${EARLY_INIT_SCRIPT}`);
  }

  if (analytics && !srcs.includes(ANALYTICS_SCRIPT)) {
    fail(`${page}: does not load ${ANALYTICS_SCRIPT}`);
  }
  if (!analytics && srcs.includes(ANALYTICS_SCRIPT)) {
    fail(`${page}: must not load ${ANALYTICS_SCRIPT}`);
  }
}

{
  const before = failures;
  for (const page of PUBLIC_PAGES) checkHeadAssets(page, { analytics: true });
  checkHeadAssets(ADMIN_PAGE, { analytics: false });

  if (exists(ADMIN_REDIRECT)) {
    const redirectTags = scriptTags(stripHtmlComments(read(ADMIN_REDIRECT)));
    if (redirectTags.some((tag) => tag.src.startsWith("assets/js/"))) {
      fail(`${ADMIN_REDIRECT}: must not load any assets/js script`);
    }
  }

  if (failures === before)
    ok("CSP + external head scripts are consistent on all pages");
}

const previewSrc = read("assets/js/pages/preview.page.js");
{
  const before = failures;
  if (!/setAttribute\(\s*['"]sandbox['"]/.test(previewSrc)) {
    fail("preview.page.js: reader iframe is missing the sandbox attribute");
  }
  if (!/allow-same-origin/.test(previewSrc)) {
    fail("preview.page.js: reader iframe sandbox must keep allow-same-origin");
  }
  // Chrome blocks the native PDF viewer inside any sandboxed frame; the page must
  // detect the broken viewer and reload the frame once without sandbox.
  if (!/contentType\s*===\s*['"]application\/pdf['"]/.test(previewSrc)) {
    fail("preview.page.js: missing the PDF-viewer contentDocument probe");
  }
  if (
    !/replaceWith\(/.test(previewSrc) ||
    !/pdfSandboxSupported/.test(previewSrc)
  ) {
    fail(
      "preview.page.js: missing the sandbox fallback that reloads the PDF frame",
    );
  }
  if (failures === before)
    ok("reader iframe is sandboxed with a working PDF fallback");
}

// 2) Locale parity -----------------------------------------------------------
const locales = loadGlobal("assets/js/i18n/locales.js").Locales;
const enKeys = Object.keys(locales.en).sort();
const arKeys = Object.keys(locales.ar).sort();

if (enKeys.length !== arKeys.length) {
  fail(`locale key count differs: en=${enKeys.length}, ar=${arKeys.length}`);
} else {
  const missingInAr = enKeys.filter((key) => !arKeys.includes(key));
  const missingInEn = arKeys.filter((key) => !enKeys.includes(key));
  if (missingInAr.length || missingInEn.length) {
    missingInAr.forEach((key) => fail(`locale key missing in ar: ${key}`));
    missingInEn.forEach((key) => fail(`locale key missing in en: ${key}`));
  } else {
    ok(`locale key sets match (${enKeys.length} keys each)`);
  }
}

for (const key of [
  "nav_preview",
  "admin_quick_toggles",
  "reader_zoom_out",
  "reader_zoom_in",
  "reader_total_pages",
  "reader_page_alt",
  "unknown_route_toast",
  "sim_badge",
  "progress_title",
  "progress_stats",
  "preview_select_aria",
]) {
  if (key in locales.en || key in locales.ar) {
    fail(`dead locale key still present: ${key}`);
  }
}

for (const page of [...PUBLIC_PAGES, ADMIN_PAGE]) {
  if (!exists(page)) continue;
  const html = read(page);
  const re =
    /data-i18n(?:-placeholder|-aria-label|-title|-alt)?=["']([^"']+)["']/g;
  let match;
  const seen = new Set();
  while ((match = re.exec(html))) {
    const key = match[1];
    if (seen.has(key)) continue;
    seen.add(key);
    if (!(key in locales.en) || !(key in locales.ar)) {
      fail(`${page}: data-i18n key missing from a locale: ${key}`);
    }
  }
}
ok("data-i18n keys scanned");

// 2a) Phase C locale keys ----------------------------------------------------
const PHASE_C_KEYS = [
  "admin_storage_error",
  "admin_confirm_delete",
  "admin_confirm_reset",
  "admin_confirm_import",
  "admin_undo_btn",
  "admin_undo_toast",
  "admin_import_empty",
  "admin_backup_export_btn",
  "admin_backup_success",
  "preview_not_found",
  "preview_not_found_desc",
];
{
  const before = failures;
  for (const key of PHASE_C_KEYS) {
    if (!(key in locales.en) || !(key in locales.ar)) {
      fail(`Phase C locale key missing from a locale: ${key}`);
    }
  }
  const FUNCTION_KEYS = ["downloads_label", "n_sets", "admin_lockout"];
  for (const key of FUNCTION_KEYS) {
    if (
      typeof locales.en[key] !== "function" ||
      typeof locales.ar[key] !== "function"
    ) {
      fail(`locale key ${key} must be a function in both languages`);
    }
  }
  if (failures === before) {
    ok(
      `Phase C locale keys present in both locales (${PHASE_C_KEYS.length + FUNCTION_KEYS.length})`,
    );
  }
}

// 2b) English purity ---------------------------------------------------------
let arabicLeak = false;

for (const [key, value] of Object.entries(locales.en)) {
  const text = typeof value === "function" ? value.toString() : String(value);
  if (ARABIC_RE.test(text)) {
    fail(`Locales.en["${key}"] contains Arabic characters`);
    arabicLeak = true;
  }
}

for (const page of [...PUBLIC_PAGES, ADMIN_PAGE]) {
  if (!exists(page)) continue;
  if (ARABIC_RE.test(stripHtmlComments(read(page)))) {
    fail(`${page}: static markup contains Arabic characters`);
    arabicLeak = true;
  }
}

const uiJsFiles = ["assets/js/app.js"];
for (const dir of [
  "assets/js/components",
  "assets/js/pages",
  "assets/js/services",
]) {
  for (const name of fs.readdirSync(path.join(ROOT, dir))) {
    if (name.endsWith(".js")) uiJsFiles.push(`${dir}/${name}`);
  }
}

for (const file of uiJsFiles) {
  const code = blankArabicDataLiterals(stripJsComments(read(file)));
  if (ARABIC_RE.test(code)) {
    fail(`${file}: Arabic characters in a non-data UI string`);
    arabicLeak = true;
  }
}

if (!arabicLeak)
  ok("English locale and English UI are free of Arabic characters");

// 3) Fallback resources parity ----------------------------------------------
const catalog = loadGlobal("assets/js/config/catalog.js").Catalog;
const settingsApi = loadGlobal("assets/js/config/settings.js").Settings;
const resources = JSON.parse(read("data/resources.json"));

if (!sameJson(catalog.FALLBACK_RESOURCES, resources)) {
  fail("Catalog.FALLBACK_RESOURCES does not match data/resources.json");
} else {
  ok(`FALLBACK_RESOURCES matches resources.json (${resources.length} entries)`);
}

const resource10 = resources.find((item) => Number(item.id) === 10);
if (!resource10) {
  fail("resource id 10 is missing");
} else if (
  !Array.isArray(resource10.langs) ||
  !resource10.langs.includes("ar") ||
  !resource10.langs.includes("en")
) {
  fail('resource id 10 must declare langs ["ar", "en"]');
} else {
  ok("resource id 10 declares both languages");
}

// 3b) Settings links, GA id, and topic registry ------------------------------
{
  const before = failures;
  const contactHtml = read("contact.html");
  const linkOwners = [
    ["TELEGRAM", settingsApi.LINKS.TELEGRAM, contactHtml],
    ["FEEDBACK_FORM", settingsApi.LINKS.FEEDBACK_FORM, contactHtml],
    ["EMAIL", settingsApi.LINKS.EMAIL, contactHtml],
  ];
  for (const [name, value, html] of linkOwners) {
    if (!value || !html.includes(value)) {
      fail(`Settings.LINKS.${name} is missing or unused in contact.html`);
    }
  }

  const gaId = settingsApi.LINKS.GA_MEASUREMENT_ID;
  if (!read(ANALYTICS_SCRIPT).includes(gaId)) {
    fail(
      `${ANALYTICS_SCRIPT}: GA measurement id does not match Settings.LINKS`,
    );
  }
  for (const page of PUBLIC_PAGES) {
    if (!read(page).includes(gaId)) {
      fail(
        `${page}: analytics loader does not use Settings.LINKS.GA_MEASUREMENT_ID`,
      );
    }
  }
  if (read(ADMIN_PAGE).includes(gaId)) {
    fail(`${ADMIN_PAGE}: must not reference the GA measurement id`);
  }

  const topicKeys = Object.keys(catalog.DEFAULT_TOPICS).sort();
  const orderKeys = [...settingsApi.TOPIC_DISPLAY_ORDER].sort();
  if (!sameJson(topicKeys, orderKeys)) {
    fail("Settings.TOPIC_DISPLAY_ORDER does not match Catalog.DEFAULT_TOPICS");
  }
  const cardJs = read("assets/js/components/card.component.js");
  const iconBlock =
    (cardJs.match(/const TOPIC_ICONS = \{([\s\S]*?)\};/) || [])[1] || "";
  if (!iconBlock) {
    fail("card.component.js: TOPIC_ICONS map is missing");
  } else {
    for (const key of topicKeys) {
      if (!new RegExp(`(^|[\\s,{])${key}\\s*:`).test(iconBlock)) {
        fail(`card.component.js: TOPIC_ICONS is missing the "${key}" topic`);
      }
    }
  }

  if (failures === before)
    ok("settings links, GA id, and topic registry agree");
}

// 4) PDF paths ---------------------------------------------------------------
const aliases = catalog.LEGACY_FILE_ALIASES || {};
const declared = new Set();

for (const resource of resources) {
  const langs = Array.isArray(resource.langs) ? resource.langs : ["ar", "en"];
  for (const lang of langs) {
    if (lang !== "ar" && lang !== "en") continue;

    const problemPath = buildPdfPath(
      resolveStem(resource.file, lang),
      lang,
      aliases,
    );
    // External URLs are valid at runtime but have no file on disk to verify.
    if (problemPath && !/^https?:\/\//i.test(problemPath))
      declared.add(diskPath(problemPath));

    const solutionPath = buildPdfPath(
      getSolutionStem(resource, lang),
      lang,
      aliases,
    );
    if (solutionPath && !/^https?:\/\//i.test(solutionPath))
      declared.add(diskPath(solutionPath));
  }
}

const actual = new Set();
for (const lang of ["ar", "en"]) {
  const dir = path.join(ROOT, "PDFs", lang);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) {
    if (name.toLowerCase().endsWith(".pdf")) actual.add(`PDFs/${lang}/${name}`);
  }
}

const missing = [...declared].filter((p) => !actual.has(p)).sort();
const orphans = [...actual].filter((p) => !declared.has(p)).sort();

if (missing.length) {
  missing.forEach((p) => fail(`declared PDF is missing: ${p}`));
} else {
  ok(`all ${declared.size} declared PDF paths exist`);
}

if (orphans.length) {
  orphans.forEach((p) => warn(`orphan PDF (keep it): ${p}`));
} else {
  ok("no orphan PDFs");
}

// 4b) PDFs untouched and theme tokens unchanged ------------------------------
try {
  const status = execSync("git status --porcelain -- PDFs", {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  if (status)
    status
      .split("\n")
      .forEach((line) => fail(`PDFs/** changed: ${line.trim()}`));
  else ok("PDFs/** untouched");
} catch (_) {
  warn("git unavailable — skipped PDFs change check");
}

const themeCss = read("assets/css/base/variables.css");
const THEME_TOKENS = [
  "--bg: #f6f3ec",
  "--band: #eee9df",
  "--surface: #fffdf9",
  "--surface-elevated: #faf6ee",
  "--fg: #101419",
  "--muted: #59616d",
  "--line: #ddd6c8",
  "--accent: #1b4a8b",
  "--accent-ink: #ffffff",
  "--copper: #a3592a",
  "--bg: #0d1116",
  "--band: #121820",
  "--surface: #161d26",
  "--surface-elevated: #1b232e",
  "--fg: #eef0f3",
  "--muted: #98a2b0",
  "--line: #26303b",
  "--accent: #7fb0e8",
  "--accent-ink: #0b1018",
  "--copper: #d29a6c",
  "--kin-fg: #a33a2a",
  "--mech-fg: #1b4a8b",
  "--coll-fg: #0e646d",
  "--math-fg: #2d6537",
  "--elec-fg: #83560f",
  "--therm-fg: #973a50",
  "--opt-fg: #3c4f68",
];
const missingTokens = THEME_TOKENS.filter((token) => !themeCss.includes(token));
if (missingTokens.length) {
  missingTokens.forEach((token) =>
    fail(`theme token changed or missing: ${token}`),
  );
} else {
  ok("theme colors unchanged");
}

const THEME_COLOR_META = '<meta name="theme-color" content="#f6f3ec">';
for (const page of [...PUBLIC_PAGES, ADMIN_PAGE]) {
  if (!exists(page)) continue;
  if (!read(page).includes(THEME_COLOR_META)) {
    fail(`${page}: theme-color meta changed from #f6f3ec`);
  }
}

const FONT_TOKENS = [
  "--font-display: 'Alexandria', 'IBM Plex Sans Arabic', system-ui, sans-serif;",
  "--font-body: 'IBM Plex Sans Arabic', system-ui, -apple-system, 'Segoe UI', sans-serif;",
  "--font-mono: 'IBM Plex Mono', ui-monospace, Menlo, monospace;",
];
const missingFonts = FONT_TOKENS.filter((token) => !themeCss.includes(token));
if (missingFonts.length) {
  missingFonts.forEach((token) =>
    fail(`font token changed or missing: ${token}`),
  );
} else {
  ok("theme-color and font tokens unchanged on all pages");
}

// 5) Admin-only assets -------------------------------------------------------
const styleCss = read("assets/css/style.css");
if (/@import[^;]*pages\/admin\.css/.test(styleCss)) {
  fail("style.css still imports pages/admin.css");
}

if (!/assets\/css\/pages\/admin\.css/.test(read(ADMIN_PAGE))) {
  fail("Admin.html does not link assets/css/pages/admin.css");
}

for (const page of PUBLIC_PAGES) {
  const html = read(page);
  if (/assets\/js\/pages\/admin\.page\.js/.test(html)) {
    fail(`${page} still loads admin.page.js`);
  }
  if (/assets\/css\/pages\/admin\.css/.test(html)) {
    fail(`${page} links admin.css`);
  }
}
ok("admin assets are admin-only");

// 5c) Accessibility & CSS cleanup (Phase E) ----------------------------------
{
  const before = failures;
  const check = (condition, message) => {
    if (!condition) fail(message);
  };

  const layoutJs = read("assets/js/components/layout.component.js");
  const resetCss = read("assets/css/base/reset.css");
  const localesJs = read("assets/js/i18n/locales.js");
  const effectsJs = read("assets/js/services/effects.service.js");
  const appJs = read("assets/js/app.js");
  const homeJs = read("assets/js/pages/home.page.js");
  const filesJs = read("assets/js/pages/files.page.js");
  const filesCss = read("assets/css/pages/files.css");
  const previewJs = read("assets/js/pages/preview.page.js");
  const previewHtml = read("preview.html");
  const adminHtml = read(ADMIN_PAGE);
  const adminJs = read("assets/js/pages/admin.page.js");
  const buttonsCss = read("assets/css/components/buttons.css");
  const cardsCss = read("assets/css/components/cards.css");
  const earlyInitJs = read(EARLY_INIT_SCRIPT);
  const themeServiceJs = read("assets/js/services/theme.service.js");

  // E1 — skip link, its locale key, and the focus target on every page.
  check(
    layoutJs.includes("skip.className = 'skip-link'") &&
      layoutJs.includes("skip.href = '#main'"),
    "E1: layout.component.js no longer creates the skip link to #main",
  );
  check(
    (localesJs.match(/skip_to_content/g) || []).length >= 2,
    "E1: skip_to_content must exist in both locales",
  );
  check(
    resetCss.includes(".skip-link"),
    "E1: reset.css lost the .skip-link styles",
  );
  for (const page of [...PUBLIC_PAGES, ADMIN_PAGE]) {
    check(
      /<main[^>]*\bid="main"[^>]*\btabindex="-1"/.test(read(page)),
      `${page}: <main> must carry id="main" tabindex="-1"`,
    );
  }

  // E2 — the sketch container is no longer aria-hidden; only the SVG is decorative.
  const indexHtml = read("index.html");
  check(
    !/class="sketch"[^>]*aria-hidden/.test(indexHtml),
    "E2: .sketch must not be aria-hidden",
  );
  check(
    /<svg[^>]*aria-hidden="true"[^>]*focusable="false"/.test(indexHtml),
    'E2: the decorative trajectory SVG must be aria-hidden with focusable="false"',
  );
  check(
    (homeJs.match(/<output id="sim(?:Angle|Vel)Val"/g) || []).length === 2,
    "E2: simulator values must be <output> elements",
  );

  // E3 — ARIA tabs, aria-pressed filters, and heading order.
  check(
    previewHtml.includes('role="tablist"'),
    'E3: preview tablist is missing role="tablist"',
  );
  check(
    (previewHtml.match(/role="tab"/g) || []).length === 2,
    'E3: the two preview tabs must carry role="tab"',
  );
  check(
    previewHtml.includes('aria-controls="previewBody"'),
    "E3: preview tabs lost aria-controls",
  );
  check(
    previewJs.includes("setAttribute('aria-selected'") &&
      previewJs.includes("handleTabKeydown"),
    "E3: preview.page.js must sync aria-selected and expose handleTabKeydown",
  );
  check(
    previewJs.includes("ArrowLeft") &&
      previewJs.includes("ArrowRight") &&
      previewJs.includes("Home"),
    "E3: preview tab keyboard navigation must support arrows and Home/End",
  );
  check(
    appJs.includes("'.preview-doc-tab'"),
    "E3: app.js must delegate keydown to the preview tabs",
  );
  check(
    filesJs.includes("aria-pressed"),
    "E3: library filters must expose aria-pressed",
  );
  check(
    filesJs.includes('<h2 class="topic-title"') &&
      !filesJs.includes('<h3 class="topic-title"'),
    "E3: library topic titles must be h2",
  );
  check(
    /<h2 data-i18n="fb_title">/.test(read("contact.html")),
    "E3: contact.html headings must start at h2 (no h1 -> h3 jump)",
  );

  // E4/E5 — admin login labelling, live error, and keyboard-reachable file inputs.
  check(
    /<label[^>]*class="admin-pass-label"[^>]*for="adminPasswordInput"/.test(
      adminHtml,
    ),
    'E4: the admin password field needs a visible <label for="adminPasswordInput">',
  );
  check(
    /id="adminPasswordInput"[\s\S]{0,200}aria-describedby="adminLoginError"/.test(
      adminHtml,
    ),
    "E4: the password input must be described by its error message",
  );
  check(
    /id="adminLoginError"[^>]*role="alert"/.test(adminHtml),
    'E4: the login error must be role="alert"',
  );
  check(
    /id="adminPdfFilePicker"[\s\S]{0,120}class="sr-only"/.test(adminHtml),
    "E5: the PDF picker input must be .sr-only, not [hidden]",
  );
  check(
    /id="adminImportJsonInput"[\s\S]{0,120}class="sr-only"/.test(adminJs),
    "E5: the JSON import input must be .sr-only, not [hidden]",
  );
  check(
    resetCss.includes(".sr-only"),
    "E5: reset.css lost the .sr-only utility",
  );

  // E6/E7 — drawer and command palette focus management.
  check(
    /id="openAddCurriculumBtn"[\s\S]{0,200}aria-haspopup="dialog"[\s\S]{0,80}aria-expanded="false"/.test(
      adminHtml,
    ),
    "E6: the add-curriculum trigger must expose aria-haspopup/aria-expanded",
  );
  check(
    /id="adminFormModalCard"[\s\S]{0,120}role="dialog"/.test(adminHtml),
    'E6: the admin form drawer must be role="dialog"',
  );
  check(
    adminJs.includes("setAttribute('aria-expanded'") &&
      adminJs.includes("DOM.qs('#adminTopic')"),
    "E6: admin.page.js must sync aria-expanded and focus the drawer on open",
  );
  check(
    appJs.includes("AdminPage?.resetFormDrawer()"),
    "E7: Escape must close the admin drawer",
  );
  check(
    effectsJs.includes("paletteOpener") &&
      effectsJs.includes("DOM.qs('#cmdPaletteBtn')"),
    "E7: the command palette must remember and restore focus",
  );
  check(
    effectsJs.includes("setAttribute('aria-expanded', String(nextState))"),
    "E7: the command palette trigger must sync aria-expanded",
  );

  // E8 — the library result count is announced.
  check(
    /id="count"[^>]*aria-live="polite"/.test(read("files.html")),
    'E8: the library result count must be aria-live="polite"',
  );

  // E9 — palette collapse, dead token removal, danger tokens, cascade cleanup.
  check(
    (themeCss.match(/--bg:/g) || []).length === 2,
    "E9: variables.css must define the palette twice only",
  );
  check(
    !themeCss.includes("@media (prefers-color-scheme: dark)"),
    "E9: variables.css must not duplicate the palette inside a media query",
  );
  check(
    !themeCss.includes("--spotlight-color"),
    "E9: the dead --spotlight-color token must be gone",
  );
  check(
    (themeCss.match(/--danger-bg:/g) || []).length === 2 &&
      (themeCss.match(/--danger-fg:/g) || []).length === 2,
    "E9: --danger-bg/--danger-fg must be defined for both themes",
  );
  check(
    buttonsCss.includes("background: var(--danger-bg)") &&
      !/\.btn-danger[\s\S]{0,120}--kin-/.test(buttonsCss),
    "E9: .btn-danger must use the semantic danger tokens, not --kin-*",
  );
  check(
    !/\.card p\s*\{/.test(cardsCss),
    "E9: the duplicate .card p rule must be gone",
  );
  check(
    cardsCss.includes(".card .card-desc-text"),
    "E9: .card .card-desc-text must carry the flex rule instead",
  );
  check(
    !filesJs.includes("is-list-view") && !filesCss.includes("is-list-view"),
    "E9: is-list-view must be unified away",
  );
  check(
    filesCss.includes("grid-list-mode"),
    "E9: grid-list-mode must remain the list-view class",
  );

  // E9 — auto theme is resolved in JS because the CSS palette has two blocks only.
  check(
    earlyInitJs.includes("matchMedia") &&
      earlyInitJs.includes("setAttribute('data-theme', theme)"),
    "E9: early-init.js must resolve auto to an explicit data-theme",
  );
  check(
    themeServiceJs.includes("resolveTheme") &&
      themeServiceJs.includes("matchMedia"),
    "E9: Theme.applyTheme must resolve auto via matchMedia",
  );
  check(
    earlyInitJs.includes(`'${settingsApi.STORAGE_KEYS.LANG}'`) &&
      earlyInitJs.includes(`'${settingsApi.STORAGE_KEYS.THEME}'`),
    "E9: early-init.js storage keys must match Settings.STORAGE_KEYS",
  );
  check(
    earlyInitJs.includes(`'${settingsApi.DEFAULT_LANG}'`),
    "E9: early-init.js default language must match Settings.DEFAULT_LANG",
  );

  // E10 — 44px touch targets, visible focus, reduced motion.
  const coarseButtons = mediaBlockSource(
    buttonsCss,
    "@media (pointer: coarse)",
  );
  check(
    /\.btn-sm\s*\{\s*min-height:\s*44px/.test(coarseButtons),
    "E10: .btn-sm must be 44px inside @media (pointer: coarse)",
  );
  const coarseCards = mediaBlockSource(cardsCss, "@media (pointer: coarse)");
  check(
    /\.card-status-btn\s*\{\s*width:\s*44px;\s*height:\s*44px/.test(
      coarseCards,
    ),
    "E10: .card-status-btn must be 44px inside @media (pointer: coarse)",
  );
  const reducedMotion = mediaBlockSource(
    resetCss,
    "@media (prefers-reduced-motion: reduce)",
  );
  check(reducedMotion.length > 0, "E10: reduced-motion guard is missing");
  check(
    /animation:\s*none\s*!important/.test(reducedMotion) &&
      /transition:\s*none\s*!important/.test(reducedMotion),
    "E10: the reduced-motion guard must disable animation and transition",
  );
  check(
    resetCss.includes("outline: 2px solid var(--focus)"),
    "E10: the focus-visible outline is missing",
  );

  if (failures === before) ok("accessibility & CSS cleanup (Phase E)");
}

// 5d) Maintainability wiring -------------------------------------------------
{
  const before = failures;
  const appSrc = read("assets/js/app.js");
  const previewPageSrc = read("assets/js/pages/preview.page.js");
  const adminSrc = read("assets/js/pages/admin.page.js");
  const effectsSrc = read("assets/js/services/effects.service.js");
  const progressSrc = read("assets/js/services/progress.service.js");
  const cardSrc = read("assets/js/components/card.component.js");
  const homeSrc = read("assets/js/pages/home.page.js");
  const curriculumSrc = read("assets/js/services/curriculum.service.js");

  if (!/registerAction\('input',\s*'#searchInput'/.test(appSrc)) {
    fail("library search must be wired through the action registry");
  }
  if (/addEventListener\(\s*'change'/.test(previewPageSrc)) {
    fail("preview.page.js must not attach a direct change listener");
  }
  if (
    /previewResourceSelect/.test(read("preview.html")) ||
    /previewResourceSelect/.test(previewPageSrc)
  ) {
    fail(
      "previewResourceSelect must remain removed from preview.html and preview.page.js",
    );
  }
  if (!/registerAction\('click',\s*'\[data-preview-step\]'/.test(appSrc)) {
    fail("preview step buttons must be delegated from app.js");
  }
  if (
    /sim-lab-badge/.test(homeSrc) ||
    /sim-lab-badge/.test(read("assets/css/pages/home.css"))
  ) {
    fail("sim-lab-badge must remain removed from home.page.js and home.css");
  }
  if (
    /progress-banner-top/.test(read("assets/js/pages/files.page.js")) ||
    /progress-banner-top/.test(read("assets/css/pages/files.css"))
  ) {
    fail(
      "progress-banner-top must remain removed from files.page.js and files.css",
    );
  }
  if (
    !/preview-viewport-bar/.test(previewPageSrc) ||
    !/preview-mobile-stage/.test(previewPageSrc) ||
    !/has-focus-mode/.test(previewPageSrc)
  ) {
    fail(
      "preview.page.js must include preview-viewport-bar, preview-mobile-stage, and has-focus-mode",
    );
  }
  const faviconSvg = read("assets/icons/favicon.svg");
  if (
    !faviconSvg.includes("#1b4a8b") ||
    !faviconSvg.includes("#ffffff") ||
    /#3fcf90|#0e1512/i.test(faviconSvg)
  ) {
    fail(
      "favicon.svg must use the Precision Physics Lab palette (#1b4a8b / #ffffff), not the legacy green/black palette",
    );
  }
  for (const iconFile of [
    "assets/icons/favicon.svg",
    "assets/icons/favicon-96x96.png",
    "assets/icons/favicon.ico",
    "assets/icons/apple-touch-icon.png",
    "assets/icons/web-app-manifest-192x192.png",
    "assets/icons/web-app-manifest-512x512.png",
    "assets/icons/site.webmanifest",
  ]) {
    if (
      !exists(iconFile) ||
      fs.statSync(path.join(ROOT, iconFile)).size === 0
    ) {
      fail(`missing or empty icon asset: ${iconFile}`);
    }
  }
  if (
    !/#cmdPaletteCloseBtn/.test(appSrc) ||
    !/cmd-palette-backdrop/.test(appSrc)
  ) {
    fail("palette close and backdrop actions must be registered");
  }
  if (!/addEventListener\('sphoh:refresh'/.test(appSrc)) {
    fail("app.js must listen for sphoh:refresh");
  }
  if (!/dispatchEvent\(new Event\('sphoh:refresh'\)\)/.test(effectsSrc)) {
    fail("effects.service.js must dispatch sphoh:refresh");
  }
  if (/SPhOH\.App/.test(effectsSrc) || /SPhOH\.App/.test(adminSrc)) {
    fail("services/pages must not depend upward on SPhOH.App");
  }
  if (
    !/revertToggle/.test(progressSrc) ||
    !/Storage\.setJSON/.test(progressSrc)
  ) {
    fail("progress.service.js must handle storage failures");
  }
  if (
    !/interactive: false/.test(adminSrc) ||
    !/options\.interactive/.test(cardSrc)
  ) {
    fail("the admin live preview must use a non-interactive card");
  }
  if (!/CurriculumService\.findById/.test(homeSrc)) {
    fail("the home roadmap must resolve resource ids at render time");
  }
  if (!/normalizeStem/.test(adminSrc) || !/normalizeStem/.test(curriculumSrc)) {
    fail("stem normalization must be shared between the admin and the service");
  }
  if (!/getFileStemForLang/.test(adminSrc)) {
    fail("the admin must read per-language stems through getFileStemForLang");
  }
  if (/data-i18n="admin_wrong_pass"/.test(read(ADMIN_PAGE))) {
    fail("the login error must be owned by showLoginError, not data-i18n");
  }

  if (failures === before) ok("maintainability wiring checks pass");
}

// 5b) Curriculum hardening (Phase C) ----------------------------------------
function loadCurriculumSandbox({ rejectWrites = false } = {}) {
  const map = new Map();
  const storageStub = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      if (rejectWrites) throw new Error("quota exceeded");
      map.set(key, String(value));
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    fetch: () => Promise.reject(new Error("network disabled inside checks")),
    setTimeout,
  };
  sandbox.window = { localStorage: storageStub, sessionStorage: storageStub };
  vm.createContext(sandbox);
  for (const file of [
    "assets/js/config/settings.js",
    "assets/js/config/catalog.js",
    "assets/js/core/storage.js",
    "assets/js/services/state.service.js",
    "assets/js/services/curriculum.service.js",
  ]) {
    vm.runInContext(read(file), sandbox, { filename: file });
  }
  return sandbox.window.SPhOH;
}

{
  const before = failures;
  const api = loadCurriculumSandbox();
  const CS = api.CurriculumService;
  const keys = api.Settings.STORAGE_KEYS;

  // C7 — id counter key is centralized
  if (keys.NEXT_ID !== "sphoh-next-id-v1")
    fail("Settings.STORAGE_KEYS.NEXT_ID is missing or renamed");

  // C6 — absent key vs explicit empty list
  if (CS.getCustomResources() !== null) {
    fail(
      "C6: getCustomResources() must return null while the storage key is absent",
    );
  }
  api.Storage.setJSON(keys.CUSTOM_RESOURCES, []);
  const emptyList = CS.getCustomResources();
  if (!Array.isArray(emptyList) || emptyList.length !== 0) {
    fail(
      "C6: getCustomResources() must return [] for an explicitly empty saved list",
    );
  }
  api.Storage.remove(keys.CUSTOM_RESOURCES);

  // C1 — PDF path whitelist
  const rejectedPaths = [
    "javascript:alert(1)",
    "data:text/html;base64,AA",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "blob:https://example.com/x",
    "../PDFs/ar/X_AR.pdf",
    "PDFs/ar/../../X_AR.pdf",
    "PDFs\\ar\\X_AR.pdf",
    "//evil.example/X.pdf",
    "PDFs/fr/X_AR.pdf",
    "PDFs/ar/not-a-pdf.txt",
    "/etc/passwd",
  ];
  for (const value of rejectedPaths) {
    if (CS.buildResourcePath(value, "en") !== null) {
      fail(`C1: buildResourcePath accepted an unsafe value: ${value}`);
    }
  }
  if (
    CS.buildResourcePath("Kinematics_I", "en") !==
    "PDFs/en/Kinematics_I_ENG.pdf"
  ) {
    fail("C1: canonical stem no longer resolves to its canonical PDF path");
  }
  if (
    CS.buildResourcePath("NSMO_II", "ar") !==
    "PDFs/ar/NSMO_Collection_II_AR.pdf"
  ) {
    fail("C1: LEGACY_FILE_ALIASES no longer applies");
  }
  if (
    CS.buildResourcePath("PDFs/ar/Trig_I_AR.pdf", "ar") !==
    "PDFs/ar/Trig_I_AR.pdf"
  ) {
    fail("C1: a whitelisted PDFs/ar path must pass through unchanged");
  }
  if (
    CS.buildResourcePath("/PDFs/en/Trig_I_ENG.pdf", "en") !==
    "/PDFs/en/Trig_I_ENG.pdf"
  ) {
    fail(
      "C1: a whitelisted root-relative PDF path must pass through unchanged",
    );
  }
  if (
    CS.buildResourcePath("https://example.com/X.pdf", "en") !==
    "https://example.com/X.pdf"
  ) {
    fail("C1: absolute https URLs must still pass through");
  }
  if (
    CS.isSafePdfPath("PDFs/en/X_ENG.pdf") !== true ||
    CS.isSafePdfPath("PDFs/../X.pdf") !== false
  ) {
    fail("C1: isSafePdfPath disagrees with the whitelist");
  }

  // C12 — per-language stems, no [object Object]
  const dual = {
    id: 555,
    file: { ar: "Dual_AR", en: "Dual_EN" },
    solution: true,
  };
  if (CS.getFileStemForLang(dual, "en") !== "Dual_EN")
    fail("C12: getFileStemForLang(en) failed");
  if (CS.getFileStemForLang(dual, "ar") !== "Dual_AR")
    fail("C12: getFileStemForLang(ar) failed");
  if (CS.getSolutionStemForLang(dual, "en") !== "Dual_EN_Solutions") {
    fail("C12: solution stem for an object file must use the English stem");
  }
  if (
    CS.getSolutionPdfPath(dual, "en") !== "PDFs/en/Dual_EN_Solutions_ENG.pdf"
  ) {
    fail("C12: solution PDF path for an object file is wrong");
  }

  // C12 — editing one language must preserve the other stem in a `{ ar, en }` file.
  const dualApi = loadCurriculumSandbox();
  dualApi.Store.setState((s) => {
    s.lang = "ar";
  });
  dualApi.CurriculumService.saveAll([
    {
      id: 601,
      t: "kin",
      l: 1,
      file: { ar: "Old_AR", en: "Old_EN" },
      title: { ar: "A", en: "B" },
    },
  ]);
  const edited = dualApi.CurriculumService.upsertResource(
    {
      topic: "kin",
      level: 1,
      fileStem: "NewSet",
      titleAr: "A",
      titleEn: "B",
      descAr: "",
      descEn: "",
      solutionMode: "none",
      problemLangs: "both",
    },
    601,
  );
  const editedItem = dualApi.CurriculumService.findById(601);
  if (
    !edited ||
    !editedItem ||
    editedItem.file.ar !== "NewSet" ||
    editedItem.file.en !== "Old_EN"
  ) {
    fail("C12: editing a per-language stem must preserve the other language");
  }

  // C3 — strict schema validation
  const emptyV = CS.validateResourcesPayload([]);
  if (emptyV.ok || !emptyV.empty)
    fail("C3: [] must be rejected with empty=true");
  const nonArrayV = CS.validateResourcesPayload({ resources: [] });
  if (nonArrayV.ok || nonArrayV.empty)
    fail("C3: a non-array payload must be rejected with empty=false");
  const dupeV = CS.validateResourcesPayload([
    { id: 1, t: "kin", l: 1, file: "A", title: { ar: "A", en: "A" } },
    { id: 1, t: "kin", l: 1, file: "B", title: { ar: "B", en: "B" } },
  ]);
  if (dupeV.ok) fail("C3: duplicate ids must be rejected");
  const levelV = CS.validateResourcesPayload([
    { id: 2, t: "kin", l: 9, file: "A", title: { ar: "A", en: "A" } },
  ]);
  if (levelV.ok) fail("C3: out-of-range level must be rejected");
  const repoV = CS.validateResourcesPayload(resources);
  if (!repoV.ok)
    fail(`C3: data/resources.json fails schema validation: ${repoV.errors[0]}`);

  // C15 — a short manual description must survive normalization
  const catalogFirst = resources[0];
  const saved = CS.saveAll([
    {
      id: catalogFirst.id,
      t: catalogFirst.t,
      l: catalogFirst.l,
      file: CS.getFileStemForLang(catalogFirst, "en"),
      title: { ar: "AR title", en: "Title" },
      desc: { ar: "AR short", en: "Short user note" },
    },
  ]);
  if (saved !== true)
    fail("saveAll must return true when storage accepts the write");
  const normalized = api.Store.getState().resources[0];
  if (
    !normalized ||
    normalized.desc.en !== "Short user note" ||
    normalized.desc.ar !== "AR short"
  ) {
    fail("C15: normalizeResource overwrote a short manual description");
  }

  // C11 — missing resources resolve to null
  if (CS.findById(987654321) !== null)
    fail("C11: findById must return null for a missing id");

  // C7 — monotonic id counter
  const idStart = CS.getNextId();
  const idNext = CS.getNextId();
  if (idNext !== idStart + 1)
    fail(`C7: getNextId is not monotonic (${idStart} then ${idNext})`);
  if (Number(api.Storage.getString(keys.NEXT_ID, "0")) < idNext) {
    fail("C7: NEXT_ID was not persisted to storage");
  }

  // C8 — default data source
  const fresh = loadCurriculumSandbox();
  if (fresh.Store.getState().dataSource !== "fallback") {
    fail('C8: the initial dataSource must be "fallback"');
  }

  // C4 — storage failures must surface as false
  const failing = loadCurriculumSandbox({ rejectWrites: true });
  const failedWrite = failing.CurriculumService.saveAll([
    { id: 77, t: "kin", l: 1, file: "Failing", title: { ar: "A", en: "A" } },
  ]);
  if (failedWrite !== false)
    fail("C4: saveAll must return false when storage rejects writes");
  if (failing.Store.getState().dataSource === "custom") {
    fail('C4: dataSource must not become "custom" after a failed write');
  }

  if (failures === before)
    ok(
      "curriculum hardening checks pass (C1, C3, C4, C6, C7, C8, C11, C12, C15)",
    );
}

{
  const jsRoot = path.join(ROOT, "assets", "js");
  const jsFiles = fs
    .readdirSync(jsRoot, { recursive: true })
    .map((entry) => String(entry).replace(/\\/g, "/"))
    .filter((entry) => entry.endsWith(".js"))
    .map((entry) => `assets/js/${entry}`);
  const owners = jsFiles.filter((file) =>
    read(file).includes("sphoh-next-id-v1"),
  );
  if (owners.length !== 1 || owners[0] !== "assets/js/config/settings.js") {
    fail(
      `the NEXT_ID literal must live only in settings.js (found: ${owners.join(", ") || "none"})`,
    );
  }
}

// 6) Dead bundle -------------------------------------------------------------
if (exists("assets/js/main.js")) {
  fail("assets/js/main.js still exists (dead bundle)");
}

for (const page of [...PUBLIC_PAGES, ADMIN_PAGE]) {
  if (/assets\/js\/main\.js/.test(read(page))) {
    fail(`${page} references assets/js/main.js`);
  }
}
ok("main.js is absent and unreferenced");

console.log(`\n${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures ? 1 : 0);
