// p73_phonectl.mjs — 11 Nov 2026: positive control for C715446 (no "Phone:" for a customer without a phone). The same A/R Collection PDF route
// with a customer that HAS a phone ("Andrews' Truck & Trailer Repair LLC", Phone 343-203-3967 on its group row) - the PDF must print "Phone:" for it,
// otherwise the C715446 absence proves nothing. Output p73/out.json + the PDF.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./p73/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const E = mkExp(p, OUT); const o = {};
try { await ensureLoc(p, 'Staging Heavy Duty - 9919'); await s.go(REPORTS.arc); await p.waitForTimeout(3500); await F.pick('Customer', "Andrews' Truck & Trailer Repair LLC"); o.chips = await F.chips();
  o.group = (await p.locator('main tbody tr').filter({ hasText: /Andrews/ }).first().innerText()).replace(/\s+/g, ' '); await s.shot('1-row'); const pdf = await E.exportAs('PDF', 'ctl'); o.pdf = pdf.file;
  const t = E.readPdf(pdf.file); o.lines = t.split('\n').filter((l) => /Andrews|Phone|Credit term/i.test(l)).slice(0, 6); o.pdfPhone = /Phone:/.test(t); } catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p73', JSON.stringify({ g: o.group, lines: o.lines, phone: o.pdfPhone, err: o.err })); await s.close(); process.exit(0);
