// s94_lateday.mjs — 11 Nov 2026: C715473 A/R PDF prints the as-of date you picked, late in the day too. MUST RUN in the location's evening, when
// UTC is already tomorrow (Staging Heavy Duty - 9919 = America/Edmonton, UTC-7: run between 00:05 and 06:55 UTC; the chip should still read the
// location's today). Browser clock zone = America/Edmonton (TZ env). Reads the chip, exports the PDF, reads its As of line and first rows, and the
// screen's first rows (same order). Refuses to run outside the window. Output exec/s94/C715473.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkExp } from './explib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs'; import { execFileSync } from 'child_process';
const h = new Date().getUTCHours(); if (h >= 7 && !process.env.FORCE) { console.log('C715473 skip: UTC hour ' + h + ' - not the location evening'); process.exit(0); }
const OUT = new URL('./s94/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const E = mkExp(p, OUT); const F = mkFilt(p); const o = { id: 'C715473', utc: new Date().toISOString(), edmonton: new Date().toLocaleString('en-CA', { timeZone: 'America/Edmonton' }), browserNow: await p.evaluate(() => new Date().toString()) };
try { await ensureLoc(p, 'Staging Heavy Duty - 9919'); await s.go(REPORTS.ard); await p.waitForTimeout(4000); o.chips = await F.chips(); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715473-1-chip.png' });
  o.screenIds = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).slice(0, 8); const pdf = await E.exportAs('PDF', 'C715473'); o.pdf = pdf.file; o.notes = pdf.notes;
  if (pdf.file) { const t = E.readPdf(pdf.file).split('\n').map((l) => l.trim()).filter(Boolean); o.asOfLine = t.find((l) => /^As of/.test(l)); o.pdfTop = t.slice(0, 14); execFileSync('pdftoppm', ['-r', '100', '-f', '1', '-l', '1', '-png', pdf.file, OUT + 'C715473-pdf']); }
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'C715473.json', JSON.stringify(o, null, 1)); console.log('C715473', o.err || 'ok', JSON.stringify({ utc: o.utc, edm: o.edmonton, chips: o.chips?.[0], asOf: o.asOfLine })); await s.close(); process.exit(0);
