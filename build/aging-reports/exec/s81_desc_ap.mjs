// s81_desc_ap.mjs — 11 Nov 2026: C715611 (A/P Unpaid Invoices: the description is not in the PDF or CSV). On sv11315 the whole report is over
// the 2,000-line PDF limit, so s78b's PDF was refused ("This report is too large for PDF...") as the PRD says; vendor A is ticked first so the
// PDF can download (precondition wording only - the check is unchanged). Downloads PDF and CSV, searches both for vendor A and "grouped by vendor".
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs'; import { execFileSync } from 'child_process';
const OUT = new URL('./s81/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const E = mkExp(p, OUT); const o = { id: 'C715611' };
const WHO = 'ZZAUTOTEST S1R5 V Alpha', PH = 'grouped by vendor';
try { await s.go(REPORTS.apu); await p.waitForTimeout(3000); await F.pick('Vendor', WHO); await p.waitForTimeout(2000); o.chips = await F.chips(); await s.shot('C715611-0-ticked');
  o.pdf = await E.exportAs('PDF', 'C715611-pdf', 120000); await p.waitForTimeout(4000); o.csv = await E.exportAs('CSV', 'C715611-csv', 120000);
  if (o.pdf?.file) { const t = execFileSync('pdftotext', ['-layout', o.pdf.file, '-']).toString(); o.nameInPdf = t.includes(WHO); o.phraseInPdf = t.toLowerCase().includes(PH); }
  if (o.csv?.file) { const t = fs.readFileSync(o.csv.file, 'utf8'); o.nameInCsv = t.includes(WHO); o.phraseInCsv = t.toLowerCase().includes(PH); }
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'C715611.json', JSON.stringify(o, null, 1)); console.log('C715611', o.err || 'ok', JSON.stringify({ n1: o.nameInPdf, n2: o.nameInCsv, p1: o.phraseInPdf, p2: o.phraseInCsv })); await s.close(); process.exit(0);
