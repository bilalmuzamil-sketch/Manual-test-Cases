// WIP screen check (layer L1): what the screen SHOWS for each location, every tab — tab labels/counts, the
// seven strip figures, every row's visible cells and the Totals row — saved for comparison with the API
// read seconds later. Captures at deviceScaleFactor 2 for evidence. SECRET-FREE (own login, nothing printed).
// Usage: node screen_wip.mjs <workplaceId> <timezone> <outDir> [woNumberToHighlight ...]
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const [WP, TZ, OUT, ...HL] = process.argv.slice(2);
const APP = 'https://app.staging.shopview.com';
fs.mkdirSync(OUT, { recursive: true });
const t = await login('admin');
await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: TZ });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
const api200 = [];
page.on('response', async r => { if (r.url().includes('/work-in-progress?')) { try { api200.push({ url: r.url().replace(/^.*\/api/, ''), status: r.status(), body: await r.json() }); } catch (e) {} } });
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.evaluate(({ u, f, w }) => { localStorage.clear(); localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); }, { u: { data: t.data }, f: fe.body?.data, w: WP });
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
await page.goto(APP + '/reports/work-in-progress', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="wip_summary_strip"]', { timeout: 90000 }); await page.waitForTimeout(8000);
const meta = { observed_at_utc: new Date().toISOString(), wp: WP, tz: TZ, appVersion: await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null), title: await page.title(), tabs: {} };
meta.strip = {};
for (const el of await page.locator('[data-test-id^="wip_summary_value_"]').all()) meta.strip[(await el.getAttribute('data-test-id')).replace('wip_summary_value_', '')] = (await el.innerText()).trim();
meta.stripLabels = (await page.locator('[data-test-id="wip_summary_strip"]').innerText()).replace(/\n+/g, ' | ');
const tabEls = page.locator('[data-test-id="page_work_in_progress_report"] .q-tab');
const tabNames = (await tabEls.allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim());
meta.tabLabels = tabNames;
meta.toolbar = (await page.locator('main').innerText()).slice(0, 600).replace(/\n+/g, ' | ');
for (let i = 0; i < await tabEls.count(); i++) {
  await tabEls.nth(i).click(); await page.waitForTimeout(5000);
  const tbl = page.locator('[data-test-id="table_work_in_progress_report"]');
  const headers = (await tbl.locator('thead th').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').replace(/arrow_\w+/g, '').trim());
  // newest first: first click on Days Open sorts ascending (S4-R26)
  const dh = tbl.locator('thead th').filter({ hasText: 'Days Open' }).first();
  if (await dh.count()) { await dh.click(); await page.waitForTimeout(2500); }
  const rows = {};
  for (const tr of (await tbl.locator('tbody tr').all()).slice(0, 40)) {
    const cells = (await tr.locator('td').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim());
    if (cells.length > 2) rows[cells.join('¦')] = cells;
  }
  const totals = (await page.locator('[data-test-id="row_wip_totals"]').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').trim());
  meta.tabs[tabNames[i]] = { headers, rows: Object.values(rows), totals };
  const hl = {};
  for (const w of HL) { const r = tbl.locator('tbody tr').filter({ hasText: w }).first(); if (await r.count()) hl[w] = { box: B(await r.boundingBox({ timeout: 3000 }).catch(() => null)), text: (await r.innerText()).replace(/\s+/g, ' ') }; }
  meta.tabs[tabNames[i]].highlight = hl;
  meta.tabs[tabNames[i]].stripBox = B(await page.locator('[data-test-id="wip_summary_strip"]').boundingBox({ timeout: 3000 }).catch(() => null));
  meta.tabs[tabNames[i]].totalsBox = B(await page.locator('[data-test-id="row_wip_totals"]').first().boundingBox({ timeout: 3000 }).catch(() => null));
  await page.screenshot({ path: `${OUT}/tab-${i + 1}.png` });
}
meta.apiResponses = api200.map(a => ({ url: a.url, status: a.status, tab_counts: a.body?.data?.tab_counts, summary: a.body?.data?.summary, totals: a.body?.data?.totals, as_of: a.body?.data?.as_of_date, n: a.body?.data?.collection?.length, rowsNumber: a.body?.data?.pagination?.rowsNumber }));
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(meta.appVersion, meta.title, JSON.stringify(meta.tabLabels), JSON.stringify(meta.strip));
for (const [k, v] of Object.entries(meta.tabs)) console.log(k, 'rows', v.rows.length, 'totals', JSON.stringify(v.totals).slice(0, 300), 'hl', JSON.stringify(v.highlight).slice(0, 400));
await browser.close();
