// g6_retest.mjs — 12 Nov 2026 07:55 UTC: retests asked by the QA lead (a Failed test whose ticket is Ready for QA is retested; fixed ⇒ Passed).
//  R1 C1079009 (SV-12547 Ready for QA): A/R Aging Collection, Customer chip = "ZZAUTOTEST AR R36 Collect X" only, Download (PDF): only that customer,
//     its lines, a "Total for ZZAUTOTEST AR R36 Collect X" line, a Totals row.
//  R2 C1095436 (SV-12544 Ready for QA): A/R Aging Detail, customer "ZZAUTOTEST AR R42 Memo Line", credit memo CM11315-4209: screen Amount "$-5.00";
//     PDF line: amount "(-$5.00)", dates like "Oct 26 2026" (no comma).
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import { mkSort } from './sortlib.mjs'; import { settle } from './q3_common.mjs'; import fs from 'fs'; import { execFileSync } from 'child_process';
const OUT = new URL('./g6/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const E = mkExp(p, OUT); const S = mkSort(p); const o = {};
const pdfPic = (f, tag) => { execFileSync('pdftoppm', ['-png', '-r', '110', '-f', '1', '-l', '1', f, OUT + tag]); return fs.readdirSync(OUT).filter((x) => x.startsWith(tag)).map((x) => OUT + x)[0]; };
{ const q = (o.R1 = {}); try { await s.go(REPORTS.arc); await p.waitForTimeout(4000); await settle(p); await F.pick('Customer', 'ZZAUTOTEST AR R36 Collect X'); await settle(p); q.chips = await F.chips();
    await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'R1-1-picked.png' }); const x = await E.exportAs('PDF', 'R1'); q.file = x.file; q.notes = x.notes;
    if (x.file) { const t = E.readPdf(x.file); q.lines = t.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean); q.pic = pdfPic(x.file, 'R1-pdf-p1'); }
  } catch (e) { q.err = String(e).slice(0, 300); } console.log('g6 R1', JSON.stringify(q).slice(0, 1500)); }
{ const q = (o.R2 = {}); try { await s.go(REPORTS.ard); await p.waitForTimeout(4000); await settle(p); await F.asOf('11').catch(() => {}); await F.pick('Customer', 'ZZAUTOTEST AR R42 Memo Line'); await settle(p); q.chips = await F.chips();
    const btn = p.locator('main thead th').first().locator('button').first(); await btn.click().catch(() => {}); await settle(p);
    q.row = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((r) => r.innerText.replace(/\s+/g, ' ').trim()).find((t) => /CM11315-4209/.test(t)) || null);
    await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'R2-1-screen.png' }); const x = await E.exportAs('PDF', 'R2'); q.file = x.file; q.notes = x.notes;
    if (x.file) { const t = E.readPdf(x.file); q.pdfLine = t.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).find((l) => /CM11315-4209/.test(l)) || null; q.pic = pdfPic(x.file, 'R2-pdf-p1'); }
  } catch (e) { q.err = String(e).slice(0, 300); } console.log('g6 R2', JSON.stringify(q).slice(0, 1500)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await s.close(); process.exit(0);
