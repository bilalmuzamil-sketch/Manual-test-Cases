// A/R + A/P rebuild (16 Nov) — item 2: every header label on the six aging reports, clicked three times (PRD 947650561 S2-R2/R3:
// first click = the useful order, second = reverse, third = first again). Method proven 16 Nov (report-gaps area2/resort_check.mjs):
// click the header LABEL text, not the cell middle. Per click: aria-sort of every header, the sort request(s) the screen sent,
// the server's answers (saved to /tmp for sort_check.py) and the document numbers / names drawn on screen, in order.
// Detail/Collection/Unpaid: "Expand all" first so the rows load. Usage: TZ=Asia/Karachi node sort.mjs   SECRET-FREE.
import fs from 'fs';
import { boot, LOC, APP, sleep, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const EV = new URL('../evidence/', import.meta.url).pathname; const RAW = '/tmp/cln/arap/sort/'; fs.mkdirSync(RAW, { recursive: true });
const loc = LOC.HD; const { browser, page } = await boot(loc, { viewport: { width: 1920, height: 1080 } }); const out = { start: await rule99(page, loc), runs: [] };
let net = []; page.on('response', async r => { const u = r.url(); if (!/\/reporting\/reports\/a[rp]-aging|ap-unpaid/.test(u) || /locations|vendors|customers|export/.test(u)) return; try { net.push({ u: decodeURIComponent(u.replace('https://api.staging.shopview.com/api', '')), j: await r.json() }); } catch {} });
const settle = async () => { await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(3500); };
const drawn = () => page.evaluate(() => { const T = s => (s || '').replace(/\s+/g, ' ').trim(); const heads = [...document.querySelectorAll('thead th')].map(t => ({ label: T(t.innerText).replace(/\s*arrow_drop_(up|down)\s*/g, '').replace(/^keyboard_arrow_\w+\s*/, ''), aria: t.getAttribute('aria-sort') }));
  const rows = [...document.querySelectorAll('tbody tr')].map(r => [...r.querySelectorAll('td')].map(c => T(c.innerText))).filter(c => c.length > 2).slice(0, 40); return { heads, rows }; });
const REPORTS = { 'ar-aging-summary': ['Customer', 'Location', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total'],
  'ap-aging-summary': ['Vendor', 'Location', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total'],
  'ar-aging-detail': ['Date', 'Location', 'Transaction Type', 'ID', 'Customer Full Name', 'Due Date', 'Amount', 'Open Balance'],
  'ar-aging-collection': ['Date', 'Location', 'Transaction Type', 'ID', 'Due Date', 'Past Due', 'Amount', 'Open Balance'],
  'ap-aging-detail': ['Date', 'Location', 'Transaction Type', 'No.', 'Vendor Name', 'Due Date', 'Past Due', 'Amount', 'Open Balance'],
  'ap-unpaid-invoices': ['Date', 'Location', 'Transaction Type', 'No.', 'Vendor Name', 'Due Date', 'Past Due', 'Amount', 'Open Balance'] };
for (const [slug, labels] of Object.entries(REPORTS)) {
  await page.goto(`${APP}/reports/${slug}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(); await sleep(3000);
  const exp = page.getByRole('button', { name: /expand all/i }).first(); if (!slug.includes('summary') && await exp.count()) { await exp.click().catch(() => {}); await settle(); }
  const open0 = await drawn(); out.runs.push({ slug, label: '(opening order)', click: 0, aria: open0.heads, first: open0.rows.slice(0, 8).map(r => r.slice(0, 6)) });
  for (const label of labels) {
    for (let click = 1; click <= 3; click++) {
      net = []; const th = page.locator('thead th').filter({ hasText: label }).first(); const rec = { slug, label, click };
      const target = th.getByText(label, { exact: true }).first();
      if (!(await target.count())) { rec.error = 'label not found'; out.runs.push(rec); break; }
      const cursor = await target.evaluate(e => getComputedStyle(e.closest('th')).cursor).catch(() => null); rec.cursor = cursor;
      await target.click({ timeout: 10000 }).catch(e => { rec.click_error = String(e).slice(0, 120); }); await settle();
      const d = await drawn(); rec.aria = d.heads.filter(h => h.aria && h.aria !== 'none'); rec.requests = net.map(n => n.u.slice(0, 300));
      const f = `${RAW}${slug}__${label.replace(/[^\w]+/g, '_')}__${click}.json`; fs.writeFileSync(f, JSON.stringify({ requests: net, drawn: d.rows })); rec.raw = f;
      rec.first_drawn = d.rows.slice(0, 6).map(r => r.slice(0, 7));
      if (click === 1) await page.screenshot({ path: `${RAW}${slug}__${label.replace(/[^\w]+/g, '_')}__1.png` });
      out.runs.push(rec); console.log(slug, label, click, JSON.stringify(rec.aria), rec.requests.length, rec.click_error || '');
    }
  }
  save(EV + 'sort-HD.json', out);
}
out.end = await rule99(page, loc); save(EV + 'sort-HD.json', out); await browser.close();
