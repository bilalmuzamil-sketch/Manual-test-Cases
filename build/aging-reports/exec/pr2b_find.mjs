// pr2b_find.mjs — 11 Nov 2026: C1062590 before-side, second look on PRODUCTION. pr2 made credits CM-4412/CM-4413 (dated today, $25) but did
// not find them on A/R Aging Detail (its response capture was cut at 15 and the bucket clicks may have missed). Here: A/R Aging Detail from the
// Reports page, every reporting reply kept, each bucket row clicked by its text, then every reply searched for CM-4412 / CM-4413; the current
// location and the location list are read; pictures of the bucket holding the credit. Output exec/prod/pr2b.json + pictures.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = { found: [] }; const save = () => fs.writeFileSync(OUT + 'pr2b.json', JSON.stringify(o, null, 1));
const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const p = B.page; const resp = [];
p.on('response', async (r) => { if (/\/api\/reporting\//.test(r.url())) { try { resp.push({ u: r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 220), t: await r.text() }); } catch {} } });
try { o.header = (await p.locator('header, .q-header').innerText()).replace(/\s+/g, ' ').slice(-60);
  await p.getByText('A/R Aging Detail', { exact: true }).first().click(); await p.waitForTimeout(7000); o.url = p.url(); o.chips = await p.evaluate(() => [...document.querySelectorAll('main button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /:/.test(t)).slice(0, 8));
  const rows = p.locator('main tbody tr').filter({ hasText: /past due \(|Current \(/ }); const n = await rows.count(); o.nBuckets = n;
  for (let i = 0; i < n; i++) { const r = rows.nth(i); const t = (await r.innerText()).replace(/\s+/g, ' '); if (!/Current|1-30/.test(t)) continue; await r.locator('td').nth(1).click().catch(async () => { await r.click(); }); await p.waitForTimeout(5000); }
  await p.screenshot({ path: OUT + 'pr2b-1-buckets-open.png' }); o.urls = resp.map((r) => r.u);
  for (const cm of ['CM-4412', 'CM-4413']) { for (const r of resp) { const i = r.t.indexOf(cm); if (i >= 0) o.found.push({ cm, u: r.u, ctx: r.t.slice(Math.max(0, i - 600), i + 250) }); }
    const row = p.locator('main tbody tr').filter({ hasText: cm }).first(); if (await row.count()) { await row.scrollIntoViewIfNeeded(); o['row-' + cm] = (await row.innerText()).replace(/\s+/g, ' '); await p.screenshot({ path: OUT + `pr2b-2-${cm}.png` }); } }
  o.visibleDocs = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')).filter((t) => /CM-|ZZAUTOTEST/.test(t)).slice(0, 10);
} catch (e) { o.err = String(e).slice(0, 300); }
save(); console.log('pr2b', JSON.stringify({ url: o.url, chips: o.chips, n: o.nBuckets, found: o.found.map((f) => f.cm + ' ' + f.u), rows: [o['row-CM-4412'], o['row-CM-4413']], err: o.err }).slice(0, 1200)); await B.browser.close(); process.exit(0);
