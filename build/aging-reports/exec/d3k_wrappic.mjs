// d3k_wrappic.mjs — 11 Nov 2026 ~21:45: picture for C715544 step 3 - d3i measured that long vendor names wrap onto two lines (Amani & Sons Truck & Trailer
// Repair, Baldwin Park Truck & Trailer Repair, …) but its picture showed the top of the report. A/P Unpaid Invoices at 1440, Vendor = "Amani & Sons Truck &
// Trailer Repair", group opened, picture; read the Vendor Name cell's line count again.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./d3k/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const S = mkSort(p); const o = { id: 'C715544c' };
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
const V = 'Amani & Sons Truck & Trailer Repair';
try { await s.go(REPORTS.apu); await p.waitForTimeout(3500); await settle(); await F.pick('Vendor', V); await settle(); o.expand = await S.expand(/^Amani & Sons/).catch((e) => String(e).slice(0, 80)); await settle();
  o.cells = await p.evaluate(() => { const ths = [...document.querySelectorAll('main thead th')].map((t) => t.innerText.trim()); const vi = ths.findIndex((t) => /^Vendor Name/.test(t)); const ni = ths.findIndex((t) => /^No\./.test(t));
    return [...document.querySelectorAll('main tbody tr')].map((tr) => { const td = tr.querySelectorAll('td')[vi]; if (!td || !td.innerText.trim()) return null; const r = document.createRange(); r.selectNodeContents(td); const tops = new Set([...r.getClientRects()].map((x) => Math.round(x.top)));
      const no = tr.querySelectorAll('td')[ni]; return { vendor: td.innerText.replace(/\s+/g, ' ').trim(), lines: tops.size, y: Math.round(tr.getBoundingClientRect().top), no: no && no.innerText.trim(), link: no ? !!no.querySelector('a, [role=link]') : null, loc: tr.querySelectorAll('td')[2]?.innerText.replace(/\s+/g, ' ').trim() }; }).filter(Boolean); });
  await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715544-wrap.png' });
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('C715544c', o.err || 'ok', JSON.stringify(o).slice(0, 600)); await s.close(); process.exit(0);
