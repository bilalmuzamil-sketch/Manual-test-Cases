// q6_ivlimit.mjs (SETS=b: 1,194 / 1,464 / 2,071 rows + export answers, 22:05 UTC) — 11 Nov 2026 21:20 UTC: Inventory Value PDF size on the QA site vs production. Production printed ALL its parts (2,856 rows,
// prod/q3p3) and has no bigger set; the QA site refused Lethbridge (3,627 rows, "This report is too large to export…"). Here, Lethbridge narrowed by
// Category to (A) 11 categories = 2,896 rows (about production's size) and (B) 13 categories = 3,089 rows; PDF each (wait 300 s), messages, CSV
// row count to confirm the size. Pictures of each attempt.
import { start } from './lib.mjs'; import { settle, chipsOf, oneLoc, dl } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./' + (process.env.OUTDIR || 'q6') + '/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const A = ['HD-Hose & Fittings', 'HD-Lighting & Electrical', 'HD-Steering & Suspension', 'HD-Air Brakes & Air Suspension', 'HD-Filters', 'HD-Wheel Comp', 'HD-Trailer Comp', 'HD-Engine Comp', 'Uncategorized', 'HD-Fasteners', 'HD-Fluids'];
const B2 = [...A, 'HD-Heavy Duty Brake Comp', 'HD-Truck Accessories'];
const ans = []; p.on('response', (r) => { if (/\/export\?/.test(r.url())) ans.push({ st: r.status(), url: r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 140), t: Date.now(), ms: Date.now() - (r.request().timing?.().startTime ? 0 : 0) }); }); const reqT = {}; p.on('request', (r) => { if (/\/export\?/.test(r.url())) reqT[r.url()] = Date.now(); }); p.on('requestfinished', (r) => { if (/\/export\?/.test(r.url())) ans.push({ done: r.url().includes('format=pdf') ? 'pdf' : 'csv', ms: Date.now() - (reqT[r.url()] || Date.now()) }); }); p.on('requestfailed', (r) => { if (/\/export\?/.test(r.url())) ans.push({ failed: r.failure()?.errorText, ms: Date.now() - (reqT[r.url()] || Date.now()) }); });
const SETS = process.env.SETS === 'b' ? [['C-1194', A.slice(0, 2)], ['D-1464', [A[0], A[1], A[3]]], ['E-2071', [A[0], A[1], A[2], A[3], A[5]]]] : [['A-2896', A], ['B-3089', B2]];
for (const [tag, cats] of SETS) { const q = (o[tag] = {}); ans.length = 0;
  try { await s.go('/reports/inventory-value'); await p.waitForTimeout(4000); await settle(p); q.loc = (await oneLoc(p, 'Staging Lethbridge - 4310')).after;
    await p.locator('main button', { hasText: /Category:/ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu:visible').last(); q.menuHead = (await m.innerText()).split('\n').slice(0, 6);
    const inp = m.locator('input'); for (const c of cats) { if (await inp.count()) { await inp.first().fill(''); await inp.first().type(c.slice(0, 14)); await p.waitForTimeout(900); } await m.getByText(c, { exact: true }).first().click(); await p.waitForTimeout(500); }
    if (await inp.count()) await inp.first().fill(''); await p.keyboard.press('Escape'); await settle(p); q.chips = await chipsOf(p); q.url = p.url(); await p.screenshot({ path: OUT + tag + '-1-filtered.png' });
    q.csv = await dl(p, /CSV/, OUT, tag); q.pdf = await dl(p, /PDF/, OUT, tag); await p.screenshot({ path: OUT + tag + '-2-after-pdf.png' }); q.answers = [...ans];
  } catch (e) { q.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + tag + '-error.png' }).catch(() => {}); }
  fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('q6', tag, q.err || 'ok', JSON.stringify({ chips: q.chips, csvLines: q.csv?.csvLines, pdf: q.pdf && { name: q.pdf.name, pages: q.pdf.pdfPages, notes: q.pdf.notes, secs: q.pdf.secs }, answers: q.answers })); }
await s.close(); process.exit(0);
