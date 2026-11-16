// A/R + A/P rebuild (16 Nov): what the SCREEN shows and what it DOWNLOADS, for the six aging reports at one location's
// zone: as-of today (link ?asOfDate=, PRD S5-R10b) and 2026-09-30, All locations; plus today narrowed to this location
// (?locations=<id>, S5-R10). Records the screen's own report requests and their JSON answers (for the screen-vs-data check),
// the Totals row, group header rows and the first rows as drawn, then Export report > Download (CSV) and Download (PDF).
// Usage: TZ=<zone> node screen.mjs HD|LE   Downloads -> /tmp/cln/arap/dl/<KEY>/ (customer/vendor names: never committed).
// Facts -> evidence/screen-<KEY>.json (totals and counts only). SECRET-FREE.
import fs from 'fs';
import { boot, LOC, APP, sleep, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const KEY = process.argv[2]; const loc = LOC[KEY]; const EV = new URL('../evidence/', import.meta.url).pathname;
const DL = `/tmp/cln/arap/dl/${KEY}/`; fs.mkdirSync(DL, { recursive: true });
const { browser, page } = await boot(loc, { viewport: { width: 1920, height: 1080 } }); const ctx = page.context();
const out = { start: await rule99(page, loc), runs: [] };
const today = new Intl.DateTimeFormat('en-CA', { timeZone: loc.tz }).format(new Date());
let net = [];
page.on('response', async r => { const u = r.url(); if (!/\/reporting\/reports\/a[rp]-/.test(u) || /export/.test(u)) return; try { net.push({ u: u.replace('https://api.staging.shopview.com/api', ''), s: r.status(), j: await r.json() }); } catch {} });
const T = s => (s || '').replace(/\s+/g, ' ').trim();
const shot = async name => page.screenshot({ path: DL + name + '.png', fullPage: false });
const SLUGS = ['ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection', 'ap-aging-summary', 'ap-aging-detail', 'ap-unpaid-invoices'];
const variants = process.env.ONLY_OWN ? [{ asOf: today, scope: 'own' }] : [{ asOf: today, scope: 'all' }, { asOf: '2026-09-30', scope: 'all' }, { asOf: today, scope: 'own' }];
const OUTF = EV + `screen-${KEY}${process.env.ONLY_OWN ? '-own' : ''}.json`;
for (const v of variants) for (const slug of SLUGS) {
  const R = { slug, ...v }; out.runs.push(R); net = [];
  try {
    const url = `${APP}/reports/${slug}?asOfDate=${v.asOf}` + (v.scope === 'own' ? `&locationIds=${loc.id}` : '')   // address key is locationIds (useAgingReportFilters AGING_LOCATION_KEY);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(6000);
    const exp = page.getByRole('button', { name: /expand all/i }).first();
    if (/detail|collection|unpaid/.test(slug) && await exp.count()) { await exp.click().catch(() => {}); await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(5000); R.expanded = true; }
    Object.assign(R, await page.evaluate(() => { const T = s => (s || '').replace(/\s+/g, ' ').trim();
      const chips = [...document.querySelectorAll('.q-chip, [class*="chip"]')].map(c => T(c.innerText)).filter(t => /As of|Location|Customer|Vendor|Past due/i.test(t)).slice(0, 6);
      const rows = [...document.querySelectorAll('tr')].map(r => [...r.querySelectorAll('td,th')].map(c => T(c.innerText)));
      const totals = rows.filter(c => /^Totals?$/i.test(c.find(x => x) || '') || /^Totals?\b/i.test(c.join(' ')));
      const groups = rows.filter(c => /^(keyboard_arrow_(down|right|up)\s*)?(Total for|Current|1-30|31-60|61-90|91 or more)/.test(c.join(' '))).slice(0, 12);
      return { app_version: document.querySelector('meta[name="app-version"]')?.content, url_now: location.href, chips, head: [...document.querySelectorAll('thead th')].map(t => T(t.innerText).replace(/\s*arrow_drop_(up|down)\s*/g, '').replace(/^keyboard_arrow_\w+\s*/, '')),
        totals: totals.slice(0, 2), groups, first_rows: rows.filter(c => c.length > 3 && !/^Totals?/.test(c.join(' '))).slice(1, 9), drawn_rows: document.querySelectorAll('tbody tr').length }; }));
    R.requests = net.map(n => ({ u: n.u.slice(0, 260), s: n.s, totals: n.j?.data?.totals, rowsNumber: n.j?.data?.pagination?.rowsNumber, groups: n.j?.data?.groups?.map(g => [g.bucket, g.rowsNumber, g.amountCents, g.openBalanceCents]) }));
    await shot(`${slug}__${v.asOf}__${v.scope}`);
    R.downloads = [];
    for (const item of ['Download (CSV)', 'Download (PDF)']) {
      const btn = page.locator('[aria-label="Export report"]').first(); if (!await btn.count()) { R.downloads.push({ item, error: 'no Export report button' }); continue; }
      await btn.click(); await sleep(900); const dP = page.waitForEvent('download', { timeout: 150000 }).catch(() => null); const t0 = Date.now();
      await page.locator('.q-menu').last().getByText(item, { exact: true }).first().click().catch(e => R.downloads.push({ item, click_error: String(e).slice(0, 120) }));
      let d = null; const toastWait = (async () => { for (let i = 0; i < 150; i++) { const t = await page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(n => n.innerText.replace(/\s+/g, ' ').trim())); if (t.some(x => /too large|couldn|Empty export/i.test(x))) return t; await sleep(1000); } return null; })();
      const first = await Promise.race([dP.then(x => ({ d: x })), toastWait.then(t => ({ t }))]); d = first.d || null;
      const toasts = await page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(n => n.innerText.replace(/\s+/g, ' ').trim()));
      const rec = { item, filename: d ? d.suggestedFilename() : null, seconds: Math.round((Date.now() - t0) / 1000), toasts };
      if (d) { rec.path = DL + `${slug}__${v.asOf}__${v.scope}${process.env.ONLY_OWN ? '2' : ''}__` + rec.filename; await d.saveAs(rec.path); rec.bytes = fs.statSync(rec.path).size; }
      R.downloads.push(rec); await page.keyboard.press('Escape'); await sleep(3000);
    }
  } catch (e) { R.error = String(e).slice(0, 300); }
  save(OUTF, out); console.log(KEY, slug, v.asOf, v.scope, R.error || '', (R.downloads || []).map(d => d.filename || d.toasts?.join('|')).join(' ; '));
}
out.end = await rule99(page, loc); out.today = today; save(OUTF, out); await browser.close();
