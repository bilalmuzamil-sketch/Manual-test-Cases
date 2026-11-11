// p47_pdf500.mjs — 11 Nov 2026: p43 showed A/P Detail PDF at 1,783 lines (as of 04/01/2025, under the 2,000-line limit) answered HTTP 500 after ~31 s
// and no file came; but p43 only watched for messages during the first 15 s. Here: watch the screen every 250 ms for 120 s after clicking
// Download (PDF), picture the first message the moment it shows (+3 more, 0.4 s apart), and keep the server's reply (status, time, body start).
// Two tries. Control: as of 02/01/2025 (444 lines) downloads. Output p47/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./p47/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, REPORTS.apd); const p = s.page; const F = mkFilt(p); const o = { tries: [] };
const reqT = {}; p.on('request', (r) => { if (/export/.test(r.url())) reqT[r.url()] = Date.now(); });
let replies = []; p.on('response', async (r) => { if (/export/.test(r.url())) { let body = ''; try { body = (await r.text()).slice(0, 300); } catch {} replies.push({ st: r.status(), ms: Date.now() - (reqT[r.url()] || Date.now()), body }); } });
async function tryIt(tag, back) { await s.go(REPORTS.apd); await p.waitForTimeout(2500); await F.asOfBack(back, 1); const t = { tag, chips: await F.chips(), notes: [] }; replies = [];
  let dl = null; p.once('download', (d) => { dl = d; }); await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900); await p.locator('.q-menu:visible').getByText('Download (PDF)', { exact: true }).click();
  const t0 = Date.now(); let pics = 0;
  while (Date.now() - t0 < 120000 && !dl) { const ns = (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim());
    for (const n of ns) if (!t.notes.find((x) => x.text === n)) t.notes.push({ text: n, atMs: Date.now() - t0 });
    if (ns.length && pics < 4) { pics++; await p.screenshot({ path: `${OUT}${tag}-msg-${pics}.png` }); await p.waitForTimeout(400); continue; } await p.waitForTimeout(250); }
  t.secs = Math.round((Date.now() - t0) / 1000); t.file = dl ? dl.suggestedFilename() : null; if (dl) await dl.saveAs(OUT + tag + '-' + dl.suggestedFilename()); t.replies = replies.slice(); await p.screenshot({ path: `${OUT}${tag}-end.png` }); o.tries.push(t); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); }
try { await p.waitForTimeout(2000); await tryIt('control-444', 21); await tryIt('big-1783-a', 19); await tryIt('big-1783-b', 19); } catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
