// s3b_run.mjs — 11 Nov 2026: C715335-C715340 (each export states the as-of date and the filters). As of 10/15/2026 (calendar: previous month,
// 15), only Staging Heavy Duty - 9919 in Location, Past due "91+ days" then "31-60 days", two customers/vendors ticked B then A, then
// Download (PDF) and (CSV); the lines under the PDF title and the top CSV rows are kept. Output exec/s3/<id>/.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs';
const ROOT = new URL('./s3/', import.meta.url).pathname; const s = await start(ROOT); const p = s.page; const F = mkFilt(p); const ONLY = process.env.ONLY?.split(',');
const AR = ['McGarvie Mechanical Services', 'Desert Edge Truck Service & Repair'], AP = ['Athens Roadside Truck Repair', 'Alameda Mechanical Services']; // ticked in this order: B, then A
const PLAN = { C715335: ['ars', 'Customer', AR], C715336: ['ard', 'Customer', AR], C715337: ['arc', 'Customer', AR], C715338: ['aps', 'Vendor', AP], C715339: ['apd', 'Vendor', AP], C715340: ['apu', 'Vendor', AP] };
for (const [id, [rep, kind, names]] of Object.entries(PLAN)) { if (ONLY && !ONLY.includes(id)) continue; const OUT = ROOT + id + '/'; fs.mkdirSync(OUT, { recursive: true }); const E = mkExp(p, OUT); const o = { id, shots: [] };
  try { await s.go(REPORTS[rep]); await p.waitForTimeout(2000); await F.asOfPrev(15); o.c1 = await F.chips(); o.loc = await F.menuClick('Location', 'Staging Lethbridge - 4310'); o.c2 = await F.chips();
    o.pd1 = await F.menuClick('Past due', '91+'); o.pd2 = await F.menuClick('Past due', '31-60'); o.c3 = await F.chips(); for (const n of names) await F.pick(kind, n); o.c4 = await F.chips();
    o.ths = await p.evaluate(() => [...document.querySelectorAll('main thead th')].map((th) => th.innerText.replace(/\s+/g, ' ').trim()));
    const f = await s.shot(id + '-filters'); o.shots.push({ name: 'filters', f, boxes: await p.evaluate(`[...document.querySelectorAll('main thead th, main button, main tbody tr')].map(e => { const b = e.getBoundingClientRect(); return [e.innerText.replace(/\\s+/g,' ').trim().slice(0, 90), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }).filter(x => x[2] >= 0 && x[2] < 900 && x[3] > 0)`) });
    o.pdf = await E.exportAs('PDF', 'f'); if (o.pdf.file) o.pdfTop = E.readPdf(o.pdf.file).split('\n').filter((l) => l.trim()).slice(0, 10);
    o.csv = await E.exportAs('CSV', 'f'); if (o.csv.file) o.csvTop = E.readCsv(o.csv.file).slice(0, 7);
  } catch (e) { o.err = String(e).slice(0, 300); }
  fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', JSON.stringify(o.c4), JSON.stringify(o.pdfTop?.slice(0, 6)), JSON.stringify(o.csvTop?.slice(0, 5)).slice(0, 400)); }
await s.close(); process.exit(0);
