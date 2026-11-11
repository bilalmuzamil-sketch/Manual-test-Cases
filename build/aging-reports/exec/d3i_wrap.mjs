// d3i_wrap.mjs — 11 Nov 2026 ~21:20: C715544 step 3 - a vendor name WRAPS onto a second line (S8-R3: "the customer or vendor name and Transaction Type wrap
// long values onto a second line"). Abadi's Diesel Repair fits on one line in the build's wider column. Here: A/P Unpaid Invoices at 1440, Expand all, read
// every Vendor Name cell's line count (text height / line-height) for the first ~300 rows; picture the first vendor whose name takes two lines.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./d3i/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = { id: 'C715544b' };
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
try { await s.go(REPORTS.apu); await p.waitForTimeout(3500); await settle(); await p.locator('main thead th').first().locator('button').first().click(); await settle();
  const SC = `(document.querySelector('main .q-table__middle.scroll, main .q-virtual-scroll, main .q-table__middle') || document.scrollingElement)`; const seen = new Map();
  for (let i = 0; i < 40; i++) { const got = await p.evaluate(() => { const ths = [...document.querySelectorAll('main thead th')].map((t) => t.innerText.trim()); const vi = ths.findIndex((t) => /^Vendor Name/.test(t));
      return [...document.querySelectorAll('main tbody tr')].map((tr) => { const td = tr.querySelectorAll('td')[vi]; if (!td || !td.innerText.trim()) return null; const r = document.createRange(); r.selectNodeContents(td); const rects = [...r.getClientRects()]; const tops = new Set(rects.map((x) => Math.round(x.top)));
        return [td.innerText.trim(), tops.size, Math.round(td.getBoundingClientRect().width), Math.round(tr.getBoundingClientRect().top)]; }).filter(Boolean); });
    for (const g of got) if (!seen.has(g[0])) seen.set(g[0], g); const two = got.find((g) => g[1] > 1); if (two && !o.pic) { o.pic = two; await p.evaluate((y) => window.scrollBy(0, 0), 0); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715544-wrap.png' }); }
    if (o.pic) break; await p.evaluate(`${SC}.scrollTop += 700`); await p.waitForTimeout(600); }
  const all = [...seen.values()]; o.n = all.length; o.multi = all.filter((g) => g[1] > 1).slice(0, 10); o.longest = all.sort((a, b) => b[0].length - a[0].length).slice(0, 5);
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('C715544b', o.err || 'ok', JSON.stringify(o).slice(0, 700)); await s.close(); process.exit(0);
