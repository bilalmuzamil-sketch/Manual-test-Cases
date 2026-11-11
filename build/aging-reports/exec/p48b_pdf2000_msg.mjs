// p48b_pdf2000_msg.mjs — 11 Nov 2026: C715469 step 4 evidence. A/P Detail with the three vendors whose lines add up to exactly 2,000 today
// (p48: Fate Roadside Truck Repair 715, New Castle Diesel Performance 707, Grand Haven Diesel Services LLC 578), Download (PDF), then a picture
// every second from 20 s to 45 s and every pop-up message text with its time; download watched for 120 s. Output p48b/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./p48b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, REPORTS.apd); const p = s.page; const F = mkFilt(p); const o = { notes: [], calls: [] };
const t0r = {}; p.on('request', (r) => { if (/export/.test(r.url())) t0r[r.url()] = Date.now(); }); p.on('response', (r) => { if (/export/.test(r.url())) o.calls.push({ st: r.status(), ms: Date.now() - (t0r[r.url()] || Date.now()) }); });
try { await p.waitForTimeout(2500); for (const v of ['Fate Roadside Truck Repair', 'New Castle Diesel Performance', 'Grand Haven Diesel Services LLC']) await F.pick('Vendor', v);
  o.chips = await F.chips(); o.buckets = [...(await p.locator('main').innerText()).matchAll(/past due \((\d+)\)|Current \((\d+)\)/g)].map((x) => +(x[1] || x[2])); await s.shot('0-2000-lines');
  await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900); let file = null; p.waitForEvent('download', { timeout: 120000 }).then((d) => { file = d.suggestedFilename(); }).catch(() => {});
  await p.locator('.q-menu:visible').getByText('Download (PDF)', { exact: true }).click(); const t0 = Date.now();
  while (Date.now() - t0 < 120000 && !file) { const ns = (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()); const sec = Math.round((Date.now() - t0) / 1000);
    for (const n of ns) if (!o.notes.some((x) => x.text === n)) o.notes.push({ text: n, atS: sec }); if (sec >= 20 && sec <= 45) await s.shot('pdf-' + String(sec).padStart(3, '0') + 's'); await p.waitForTimeout(1000); }
  o.file = file; o.waitedS = 120; } catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 800)); await s.close(); process.exit(0);
