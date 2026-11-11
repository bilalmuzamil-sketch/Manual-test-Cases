// pr5_drill.mjs — 11 Nov 2026 ~16:30: C715582 "before the release" side on PRODUCTION: the address A/R Summary's customer-name click and A/P
// Summary's vendor-name click open (the bookmark a user may have saved). pr1/pr1b timed out looking for a link/td; production's old summaries make
// the whole ROW clickable (cursor: pointer on the row). Here: click the first data row's name text (getByText exact), wait, record the address
// and the page title/chips. Output prod/pr5.json + pictures.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; let k = 90; const save = () => fs.writeFileSync(OUT + 'pr5.json', JSON.stringify(o, null, 1));
const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const p = B.page; o.version = B.version;
const shot = async (n) => { const f = `${OUT}${String(++k).padStart(2, '0')}-${n}.png`; await p.screenshot({ path: f }); return f; };
for (const [kk, label] of [['ar', 'A/R Aging Summary'], ['ap', 'A/P Aging Summary']]) { const r = (o[kk] = {}); try {
  await p.goto(B.APP + '/reports', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await p.getByText(label, { exact: true }).first().click(); await p.waitForTimeout(6000); r.url0 = p.url();
  const first = await p.evaluate(() => { const tr = [...document.querySelectorAll('main tr')].find((t) => t.querySelector('td') && t.innerText.trim() && !/^\s*Totals?\b/.test(t.innerText)); return tr ? tr.querySelector('td').innerText.trim() : null; }); r.name = first;
  await p.getByText(first, { exact: true }).first().click({ timeout: 15000 }); await p.waitForTimeout(6000); r.drill = p.url(); r.title = (await p.locator('main').innerText()).split('\n').slice(0, 6).map((t) => t.trim()); r.pic = await shot('C715582-prod-' + kk + '-drill');
} catch (e) { r.err = String(e).slice(0, 200); try { r.pic = await shot('C715582-prod-' + kk + '-error'); } catch {} } save(); }
save(); console.log('pr5', JSON.stringify(o).slice(0, 900)); await B.browser.close(); process.exit(0);
