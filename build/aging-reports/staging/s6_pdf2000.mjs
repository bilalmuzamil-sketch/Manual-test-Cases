// s6_pdf2000.mjs — 12 Nov 2026, staging after the release (PDF service limit 120 s here, SV-12539 developer note), C715469: A/P Detail as of
// today with the chosen vendors Fate Roadside Truck Repair (715) + New Castle Diesel Performance (707) + Grand Haven Diesel Services LLC (578) =
// 2,000 open lines (s1 read), vendor B = Tehachapi Truck Center (1 line). Steps: tick the three -> bucket counts on screen; Download (CSV) ->
// count document rows; Download (PDF) -> messages, file, seconds; tick vendor B -> counts; Download (PDF) -> exactly one message, no file in 60 s.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import fs from 'fs';
const OUT = new URL('./s6/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const o = {};
const counts = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).map((t) => t.match(/(days past due|Current) \((\d+)\)/)).filter(Boolean).map((m) => +m[2]));
const notesNow = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim());
async function exp(item, tag, waitS) { const q = { notes: [] }; let file = null, saved = null;
  p.waitForEvent('download', { timeout: waitS * 1000 }).then(async (d) => { file = d.suggestedFilename(); saved = OUT + tag + '-' + file; await d.saveAs(saved).catch(() => {}); }).catch(() => {});
  await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900); await p.locator('.q-menu:visible').last().getByText(item, { exact: true }).click(); const t0 = Date.now(); let shot = false;
  while (Date.now() - t0 < waitS * 1000 && !file) { for (const n of await notesNow()) if (!q.notes.some((x) => x.text === n)) { q.notes.push({ text: n, atS: Math.round((Date.now() - t0) / 1000) }); if (!shot) { q.picMsg = await s.shot(tag + '-message'); shot = true; } } await p.waitForTimeout(700); }
  await p.waitForTimeout(2500); for (const n of await notesNow()) if (!q.notes.some((x) => x.text === n)) q.notes.push({ text: n, atS: Math.round((Date.now() - t0) / 1000) });
  q.file = file; q.saved = saved; q.secs = Math.round((Date.now() - t0) / 1000); q.pic = await s.shot(tag + '-after'); return q; }
try { await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000);
  for (const v of ['Fate Roadside Truck Repair', 'New Castle Diesel Performance', 'Grand Haven Diesel Services LLC']) { await F.pick('Vendor', v); await p.waitForTimeout(1500); }
  o.chipsA = await F.chips(); o.url = p.url(); o.countsA = await counts(); o.sumA = o.countsA.reduce((a, b) => a + b, 0); o.picA = await s.shot('1-three-vendors');
  o.csv = await exp('Download (CSV)', '2-csv', 60);
  if (o.csv.saved) { await new Promise((r) => setTimeout(r, 1500)); const L = fs.readFileSync(o.csv.saved, 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/); o.csvLines = L.length; o.csvHead = L.slice(0, 4); o.csvTail = L.slice(-2); }
  o.pdfA = await exp('Download (PDF)', '3-pdf-2000', 150);
  await F.pick('Vendor', 'Tehachapi Truck Center'); await p.waitForTimeout(3000); o.chipsB = await F.chips(); o.countsB = await counts(); o.sumB = o.countsB.reduce((a, b) => a + b, 0); o.picB = await s.shot('4-plus-vendor-b');
  o.pdfB = await exp('Download (PDF)', '5-pdf-2001', 60);
} catch (e) { o.err = String(e).slice(0, 300); await s.shot('error'); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify({ chipsA: o.chipsA, countsA: o.countsA, sumA: o.sumA, csvLines: o.csvLines, csvHead: o.csvHead, csvTail: o.csvTail, csv: o.csv && { notes: o.csv.notes, file: o.csv.file }, pdfA: o.pdfA && { notes: o.pdfA.notes, file: o.pdfA.file, secs: o.pdfA.secs }, chipsB: o.chipsB, sumB: o.sumB, pdfB: o.pdfB && { notes: o.pdfB.notes, file: o.pdfB.file, secs: o.pdfB.secs }, err: o.err }).slice(0, 3000)); await s.close(); process.exit(0);
