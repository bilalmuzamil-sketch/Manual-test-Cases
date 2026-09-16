// probe_gs_surfaces.mjs — REUSABLE Global Search (Enhancement, Aug 2026) surface walker.
//
// WHY (QA lead, 2026-09-16, "never rediscover"): the 2026-09-14 build-verify observed the palette but
// left no committed probe, so a re-verify on a moved build would re-discover it. This is the durable
// walker: it opens the Global Search palette and dumps every distinct V2 surface as JSON so a
// build-verify pass reuses it. Host-agnostic (QA branch or staging).
//
// V2 runs on OpenSearch (records copied in): a new record takes a moment to become findable, and search
// can be down while the rest of the app works. So: query terms that already have data; allow index lag.
//
// SURFACES: palette open (Ctrl+K) + placeholder · scope tabs with counts (All · Work orders · Customers ·
// Assets · Parts · Vendors · Part sales · Purchase orders · Vendor invoices) · empty state (Recent searches
// / Clear All / date header) · grouped results + "N results found across M categories" · no-results state ·
// keyboard-hint footer · Vendor Invoices tri-state badge (Paid / Partially paid / Unpaid, C44900).
//
// RUN:  SV_BRANCH=sv9160 QUERY="star" node build/global-search/probe_gs_surfaces.mjs
//       SV_ENV=staging QUERY="ford" node build/global-search/probe_gs_surfaces.mjs
// PREREQS: fresh MITM bridge (source build/testing-tools/ensure_bridge.sh) + sv_sso_session cookie
//   (/tmp/qa-cookies/<branch>-sso.txt for a QA branch, /tmp/staging-cookie.txt for staging). Rule 82.
import fs from 'fs';
const ENV = process.env.SV_ENV || 'qa';
const BRANCH = process.env.SV_BRANCH || 'sv9160';
const QUERY = process.env.QUERY || 'star';
const NORESULT = process.env.NORESULT || 'zzqqxxnotathing';
const OUT = process.env.OUT || 'build/global-search/build-verify-adhoc';
fs.mkdirSync(OUT, { recursive: true });
const LAB = 'e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';

let browser, page, feData;
if (ENV === 'staging') {
  const { boot2 } = await import('/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs');
  ({ browser, page, feData } = await boot2('admin', { route: '/workorders' }));
} else {
  const { boot } = await import('/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs');
  ({ browser, page } = await boot(BRANCH, '/workorders', 'admin'));
}
await page.waitForTimeout(6000);
const build = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.getAttribute('content'));
const R = { env: ENV, branch: BRANCH, build, at: new Date().toISOString() };
console.log('BOOT', build);

async function openPalette() {
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(2000);
}
// placeholder + open
await openPalette();
R.placeholder = await page.evaluate(() => { const i = [...document.querySelectorAll('input')].find(e => /search/i.test(e.getAttribute('placeholder') || '')); return i ? i.getAttribute('placeholder') : null; });
R.emptyState = await page.evaluate(L => { const lab = eval(L); const t = document.body.innerText;
  return { recentSearches: /Recent searches/i.test(t), clearAll: /Clear All/i.test(t), today: /TODAY|Yesterday/i.test(t),
    headings: [...new Set([...document.querySelectorAll('.q-item__label,.text-subtitle2,.text-weight-medium,h6,.text-h6')].map(lab).filter(x => x && x.length < 40))].slice(0, 12) }; }, LAB);
await page.screenshot({ path: `${OUT}/gs-empty-${build}.png` }).catch(() => {});
R.keyboardHint = await page.evaluate(() => { const t = document.body.innerText; const m = t.match(/Arrow[^.]*?closes|Navigate[^.]*?Close|Enter selects[^.]*/i); return m ? m[0].slice(0, 90) : null; });

// typed query -> grouped results + summary + scope tabs with counts
await page.keyboard.type(QUERY, { delay: 90 });
await page.waitForTimeout(4000);
R.query = QUERY;
R.results = await page.evaluate(L => { const lab = eval(L); const t = document.body.innerText;
  const summary = (t.match(/\d+\s+results?\s+found\s+across\s+\d+\s+categor/i) || [])[0] || null;
  const tabs = [...new Set([...document.querySelectorAll('.q-tab,[role=tab],.q-chip')].map(lab).filter(x => x && /All|Work orders|Customers|Assets|Parts|Vendors|Part sales|Purchase orders|Vendor invoices/i.test(x)).map(x => x.slice(0, 40)))].slice(0, 12);
  const groups = [...new Set([...document.querySelectorAll('.q-item__label,.text-subtitle2,.text-weight-medium')].map(lab).filter(x => x && /\(\d+\)/.test(x)))].slice(0, 12);
  return { summary, scopeTabs: tabs, groupHeaders: groups }; }, LAB);
await page.screenshot({ path: `${OUT}/gs-results-${build}.png` }).catch(() => {});

// vendor invoices tri-state badge (C44900): switch to Vendor invoices tab
R.vendorInvoiceBadges = await page.evaluate(L => { const lab = eval(L);
  const tab = [...document.querySelectorAll('.q-tab,[role=tab],.q-chip')].find(e => /Vendor invoices/i.test(lab(e)));
  if (tab) tab.click();
  return null; }, LAB);
await page.waitForTimeout(2500);
R.vendorInvoiceBadges = await page.evaluate(() => { const t = document.body.innerText;
  return { paid: /\bPaid\b/.test(t), partiallyPaid: /Partially paid/i.test(t), unpaid: /Unpaid/i.test(t) }; });
await page.screenshot({ path: `${OUT}/gs-vendorinvoices-${build}.png` }).catch(() => {});

// no-results state
await page.evaluate(() => { const i = [...document.querySelectorAll('input')].find(e => /search/i.test(e.getAttribute('placeholder') || '')); if (i) { i.focus(); i.select && i.select(); } });
await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace');
await page.keyboard.type(NORESULT, { delay: 60 });
await page.waitForTimeout(3500);
R.noResults = await page.evaluate(() => { const t = document.body.innerText;
  const m = t.match(/No results[^\n]{0,40}/i); return { present: /No results/i.test(t), text: m ? m[0] : null }; });
await page.screenshot({ path: `${OUT}/gs-noresults-${build}.png` }).catch(() => {});

fs.writeFileSync(`${OUT}/gs-surfaces-${build}.json`, JSON.stringify(R, null, 1));
console.log(JSON.stringify(R, null, 1));
await browser.close();
