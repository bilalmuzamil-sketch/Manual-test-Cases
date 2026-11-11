// s93_locorder.mjs — 11 Nov 2026 ~16:25: C715343 A/R Detail exports list the ticked locations in A to Z order (expected-fail SV-12141). The site
// has three locations with A/R documents (A = Staging Heavy Duty - 9919, B = Staging Lethbridge - 4310, C = ZZAUTOTEST V1R-87 Location C; A < C
// in A to Z). Clear selection, tick C, tick A; read the chip after each; PDF and CSV Locations lines. Output exec/s93/C715343.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkExp } from './explib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs'; import { execFileSync } from 'child_process';
const OUT = new URL('./s93/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const E = mkExp(p, OUT); const F = mkFilt(p); const o = { id: 'C715343' };
const shot = async (n, move = true) => { const f = OUT + 'C715343-' + n + '.png'; if (move) await p.mouse.move(5, 890); await p.screenshot({ path: f }); (o.shots ||= []).push(f); };
const LA = 'Staging Heavy Duty - 9919', LC = 'ZZAUTOTEST V1R-87 Location C';
try { await ensureLoc(p, LA); await s.go(REPORTS.ard); await p.waitForTimeout(3500); const chip = p.locator('main button', { hasText: /Location:/ }).first();
  await chip.click(); await p.waitForTimeout(1000); await p.locator('.q-menu:visible').getByText('Clear selection', { exact: true }).click(); await p.waitForTimeout(1200); o.menu0 = (await p.locator('.q-menu:visible').innerText()).replace(/\s+/g, ' ');
  await p.locator('.q-menu:visible').locator('.q-item, label, .q-checkbox').filter({ hasText: LC }).first().click(); await p.waitForTimeout(1500); o.chip1 = (await F.chips()).find((c) => /Location/.test(c)); await shot('1-C-ticked', false);
  await p.locator('.q-menu:visible').locator('.q-item, label, .q-checkbox').filter({ hasText: LA }).first().click(); await p.waitForTimeout(1500); o.chip2 = (await F.chips()).find((c) => /Location/.test(c)); o.menu2 = (await p.locator('.q-menu:visible').innerText()).replace(/\s+/g, ' '); await shot('2-A-ticked', false);
  await p.keyboard.press('Escape'); await p.waitForTimeout(3000); const pdf = await E.exportAs('PDF', 'C715343'); o.pdf = pdf.file; if (pdf.file) { o.pdfLines = E.readPdf(pdf.file).split('\n').filter((l) => /Locations?:/.test(l)).map((l) => l.trim()); execFileSync('pdftoppm', ['-r', '100', '-f', '1', '-l', '1', '-png', pdf.file, OUT + 'C715343-pdf']); }
  await p.waitForTimeout(4000); const csv = await E.exportAs('CSV', 'C715343'); o.csv = csv.file; if (csv.file) o.csvLines = E.readCsv(csv.file).slice(0, 4).map((r) => r.join(','));
} catch (e) { o.err = String(e).slice(0, 300); try { await shot('error'); } catch {} }
fs.writeFileSync(OUT + 'C715343.json', JSON.stringify(o, null, 1)); console.log('C715343', o.err || 'ok', JSON.stringify({ c1: o.chip1, c2: o.chip2, pdf: o.pdfLines, csv: o.csvLines }).slice(0, 500)); await s.close(); process.exit(0);
