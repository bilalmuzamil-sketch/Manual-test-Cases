// d3f_sbcempty.mjs — 11 Nov 2026 ~19:05: C715517 step 5 needs Sales By Customer's OWN empty-export warning. With "No locations" SBC still lists rows
// and downloads (d3d), so empty it the way s84b found: Product Type -> "Clear selection" (the empty state shows), then Download Summary (PDF) and
// Download Summary (CSV); picture each message, its box (position, size, colours). Then A/R Aging Summary's warning again at the same moment for a
// side-by-side (Location -> Clear selection, Download (PDF)).
import { start, REPORTS } from './lib.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs';
const OUT = new URL('./d3f/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const E = mkExp(p, OUT); const o = { id: 'C715517b' };
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
const box = () => p.locator('.q-notification').evaluateAll((ns) => ns.map((n) => { const r = n.getBoundingClientRect(); const c = getComputedStyle(n); return { t: n.innerText.replace(/\s+/g, ' ').trim(), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: c.backgroundColor, color: c.color }; })).catch(() => []);
async function clear(chipRe) { await p.locator('main button', { hasText: chipRe }).first().click(); await p.waitForTimeout(1200); const c = p.locator('.q-menu:visible').getByText(/^(Clear selection|None)$/).first(); const n = await c.count(); if (n) await c.click(); await p.keyboard.press('Escape'); await settle(); return n; }
async function exp(kind, label, tag) { const r = await E.exportAs(kind, tag, 15000, label); const b = await box(); await p.waitForTimeout(5000); return { file: !!r.file, notes: r.notes, toast: r.toast, box: b }; }
try { await s.go('/reports/sales-by-customer'); await p.waitForTimeout(3500); await settle(); o.sbcClear = await clear(/Product Type:/); o.sbcEmpty = (await p.locator('main').innerText()).includes('No record matches these filters');
  await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'sbc-empty.png' }); o.sbcPdf = await exp('PDF', 'Download Summary (PDF)', 'sbc-pdf'); o.sbcCsv = await exp('CSV', 'Download Summary (CSV)', 'sbc-csv');
  await s.go(REPORTS.ars); await p.waitForTimeout(3500); await settle(); o.arsClear = await clear(/Location:/); o.arsPdf = await exp('PDF', 'Download (PDF)', 'ars-pdf');
} catch (e) { o.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + 'error.png' }).catch(() => {}); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('C715517b', o.err || 'ok', JSON.stringify(o).slice(0, 700)); await s.close(); process.exit(0);
