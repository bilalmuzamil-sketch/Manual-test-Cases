// q6_ivlimit.mjs — 11 Nov 2026 21:20 UTC: Inventory Value PDF size on the QA site vs production. Production printed ALL its parts (2,856 rows,
// prod/q3p3) and has no bigger set; the QA site refused Lethbridge (3,627 rows, "This report is too large to export…"). Here, Lethbridge narrowed by
// Category to (A) 11 categories = 2,896 rows (about production's size) and (B) 13 categories = 3,089 rows; PDF each (wait 300 s), messages, CSV
// row count to confirm the size. Pictures of each attempt.
import { start } from './lib.mjs'; import { settle, chipsOf, oneLoc, dl } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./q6/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const A = ['HD-Hose & Fittings', 'HD-Lighting & Electrical', 'HD-Steering & Suspension', 'HD-Air Brakes & Air Suspension', 'HD-Filters', 'HD-Wheel Comp', 'HD-Trailer Comp', 'HD-Engine Comp', 'Uncategorized', 'HD-Fasteners', 'HD-Fluids'];
const B2 = [...A, 'HD-Heavy Duty Brake Comp', 'HD-Truck Accessories'];
for (const [tag, cats] of [['A-2896', A], ['B-3089', B2]]) { const q = (o[tag] = {});
  try { await s.go('/reports/inventory-value'); await p.waitForTimeout(4000); await settle(p); q.loc = (await oneLoc(p, 'Staging Lethbridge - 4310')).after;
    await p.locator('main button', { hasText: /Category:/ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu:visible').last(); q.menuHead = (await m.innerText()).split('\n').slice(0, 6);
    const inp = m.locator('input'); for (const c of cats) { if (await inp.count()) { await inp.first().fill(''); await inp.first().type(c.slice(0, 14)); await p.waitForTimeout(900); } await m.getByText(c, { exact: true }).first().click(); await p.waitForTimeout(500); }
    if (await inp.count()) await inp.first().fill(''); await p.keyboard.press('Escape'); await settle(p); q.chips = await chipsOf(p); q.url = p.url(); await p.screenshot({ path: OUT + tag + '-1-filtered.png' });
    q.csv = await dl(p, /CSV/, OUT, tag); q.pdf = await dl(p, /PDF/, OUT, tag); await p.screenshot({ path: OUT + tag + '-2-after-pdf.png' });
  } catch (e) { q.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + tag + '-error.png' }).catch(() => {}); }
  fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('q6', tag, q.err || 'ok', JSON.stringify({ chips: q.chips, csvLines: q.csv?.csvLines, pdf: q.pdf && { name: q.pdf.name, pages: q.pdf.pdfPages, notes: q.pdf.notes, secs: q.pdf.secs } })); }
await s.close(); process.exit(0);
