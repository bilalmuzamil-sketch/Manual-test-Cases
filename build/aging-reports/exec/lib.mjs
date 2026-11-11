// lib.mjs — 11 Nov 2026, A/R & A/P aging reports (SV-11315) execution on sv11315. Signs in with qa-branch-boot (admin quick-login,
// sv_sso_session from /tmp/qa-cookies/sv11315-sso.txt) and offers small readers. Every /api/reporting response is kept in `net` so a
// reading can be checked against what the server sent. Pictures at 2x (deviceScaleFactor set by WOB_SCALE in boot? no — set here).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
export const A = 'https://sv11315.qa.shopview.com';
export const API = 'https://sv11315api.qa.shopview.com';
export const REPORTS = { ars: '/reports/ar-aging-summary', ard: '/reports/ar-aging-detail', arc: '/reports/ar-aging-collection',
  aps: '/reports/ap-aging-summary', apd: '/reports/ap-aging-detail', apu: '/reports/ap-unpaid-invoices' };
export const T = (s) => (s || '').replace(/\s+/g, ' ').trim();
export async function start(OUT, route = '/reports/ar-aging-summary') {
  fs.mkdirSync(OUT, { recursive: true });
  const r = await boot('sv11315', route, 'admin'); const page = r.page; page.setDefaultTimeout(15000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const net = [];
  page.on('response', async (res) => { const u = res.url(); if (!/\/api\/reporting\//.test(u)) return;
    let body = null; try { body = await res.json(); } catch {} net.push({ t: Date.now(), m: res.request().method(), u, st: res.status(), body }); });
  let k = 0;
  const shot = async (name, opts = {}) => { const n = String(++k).padStart(2, '0') + '-' + name; await page.screenshot({ path: `${OUT}/${n}.png`, ...opts }).catch(() => {}); return `${OUT}/${n}.png`; };
  const go = async (p) => { await page.goto(A + p, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(1500); };
  const headers = () => page.evaluate(`[...document.querySelectorAll('main thead th')].map(th => th.innerText.replace(/\\s+/g,' ').trim())`);
  const rows = (n = 400) => page.evaluate(`[...document.querySelectorAll('main tbody tr')].slice(0, ${n}).map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\\s+/g,' ').trim()))`);
  const chips = () => page.evaluate(`[...document.querySelectorAll('main button')].map(b => b.innerText.replace(/\\s+/g,' ').trim()).filter(t => /^(As of|Customer|Vendor|Past due|Location):/.test(t))`);
  const title = () => page.evaluate(`(document.querySelector('main h1, main .page-title, main h2')||{}).innerText || ''`);
  const save = (name, obj) => fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(obj, null, 1));
  const close = async () => { await Promise.race([r.browser.close(), new Promise((x) => setTimeout(x, 8000))]); };
  return { r, page, net, shot, go, headers, rows, chips, title, save, close };
}
