// s2c_run.mjs — 11 Nov 2026: the S2 sort tests that need filters or a date change: C715317 (A/R Detail), C715320 (A/P Detail),
// C715322 (A/R Collection, Past due filter), C1062577 (A/R Summary, Location filter), C1062579 (A/R Summary, a date with one location).
// Records headers (aria-sort), the watched rows (Open Balance order), chips, menu texts, pictures. Output exec/s2/<id>.json.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./s2/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const a = mk(p); const ONLY = process.env.ONLY?.split(',');
const money = (t) => { const m = (t || '').match(/\$-?[\d,]+\.\d\d/g); return m ? Number(m[m.length - 1].replace(/[$,]/g, '')) : null; };
const desc = (xs) => xs.every((x, i) => i === 0 || xs[i - 1] >= x);
const snap = async (o, label, segRe) => { const rows = await S.collect(); const st = { label, sorted: await S.sorted(), chips: await F.chips(), heads: rows.filter((r) => /days past due \(|Current \(|\(\d+\)/.test(r.text)).map((r) => r.raw).slice(0, 12) };
  if (segRe) { const sg = S.segment(rows, segRe); st.seg = sg && { head: sg.head, n: sg.rows.length, bal: sg.rows.map((r) => money(r.text)), first: sg.rows.slice(0, 4).map((r) => r.text), locs: [...new Set(sg.rows.map((r) => r.cells[1]))] }; if (st.seg) st.seg.desc = desc(st.seg.bal.filter((x) => x !== null)); }
  const l = segRe && await S.find(segRe); if (l) await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = Math.max(0, e.scrollTop - 40); })()`);
  st.shot = await s.shot(o.id + '-' + label.replace(/[^a-z0-9]+/gi, '_').slice(0, 30)); st.boxes = await p.evaluate(`[...document.querySelectorAll('main tbody tr, main thead th, main button')].map(e => { const b = e.getBoundingClientRect(); return [e.innerText.replace(/\\s+/g,' ').trim().slice(0, 80), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }).filter(x => x[2] > 0 && x[2] < 900 && x[0])`);
  o.steps.push(st); return st; };
const T = {
  C715317: async (o) => { await s.go(REPORTS.ard); await S.clickTh('Open Balance'); await S.expand(/31-60 days past due/); await snap(o, '1 open balance', /^31-60 days past due/);
    await F.asOf(9); await snap(o, '2 yesterday', null); const big = (o.steps[1].heads.map((h) => [h, +(h.match(/\((\d+)\)/) || [])[1]]).sort((x, y) => y[1] - x[1])[0] || [])[0]; o.big = big;
    const bre = new RegExp(clean(big).split(' (')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); await S.expand(bre); await snap(o, '3-4 largest bucket scrolled', new RegExp('^' + clean(big).split(' (')[0]));
    o.custMenu = await F.pick('Customer', 'ZZAUTOTEST AR Customer A'); await S.expand(/1-30 days past due/); await S.expand(/31-60 days past due/); await S.expand(/Current \(/); await snap(o, '6 customer A', /^1-30 days past due/);
    o.locMenu = await F.menuClick('Location', 'Staging Lethbridge - 4310'); await S.expand(/1-30 days past due/); await snap(o, '7 location A only', /^1-30 days past due/); },
  C715320: async (o) => { await s.go(REPORTS.apd); await S.clickTh('Open Balance'); await S.expand(/1-30 days past due/); await snap(o, '1 open balance', /^1-30 days past due/);
    await F.asOf(9); await snap(o, '2 yesterday', null); const big = (o.steps[1].heads.map((h) => [h, +(h.match(/\((\d+)\)/) || [])[1]]).sort((x, y) => y[1] - x[1])[0] || [])[0]; o.big = big;
    await S.expand(new RegExp(clean(big).split(' (')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await snap(o, '3-4 largest bucket scrolled', new RegExp('^' + clean(big).split(' (')[0]));
    await F.pick('Vendor', 'ZZAUTOTEST AP Vendor A'); await S.expand(/1-30 days past due/); await S.expand(/Current \(/); await snap(o, '6 vendor A', /^1-30 days past due/);
    o.locMenu = await F.menuClick('Location', 'Staging Lethbridge - 4310'); await S.expand(/1-30 days past due/); await snap(o, '7 location A only', /^1-30 days past due/); },
  C715322: async (o) => { await s.go(REPORTS.arc); await S.expand(/Desert Edge Truck Service/); await S.clickTh('Open Balance'); await snap(o, '1 open balance', /^Desert Edge Truck Service/);
    o.pdMenu = await F.menuClick('Past due', '31-60'); await snap(o, '2 past due 31-60', /^Desert Edge Truck Service/); await S.expand(/Desert Edge Truck Service/); await snap(o, '3 expanded', /^Desert Edge Truck Service/); },
  C1062577: async (o) => { await s.go(REPORTS.ars); await snap(o, 'open', null); await S.clickTh('Location'); const r1 = await S.collect(); o.afterLoc = r1.map((r) => r.cells.slice(0, 2).join(' | ')).filter((x) => /^(Apollo Beach|Bancescu|Colesville)/.test(x)); o.order1 = r1.map((r) => r.cells[0]); o.s1 = await snap(o, '1 location sort', null);
    o.locMenu = await F.menuClick('Location', 'Staging Lethbridge - 4310'); const r2 = await S.collect(); o.order2 = r2.map((r) => r.cells[0]); o.ths2 = await S.ths(); await snap(o, '2 lethbridge unticked', null); },
  C1062579: async (o) => { const found = []; for (const d of ['2025-01-15', '2025-03-01', '2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01', '2025-09-01', '2025-10-01', '2025-11-01', '2026-01-01']) { const r = await a.get(`/api/reporting/reports/ar-aging-summary/locations?asOfDate=${d}`); found.push([d, r.st, JSON.stringify(r.j).slice(0, 200)]); } o.dates = found; },
};
function clean(t) { return (t || '').replace(/keyboard_arrow_(down|right)|arrow_drop_(up|down)/g, ' ').replace(/\s+/g, ' ').trim(); }
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id, steps: [] }; try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); } fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', o.steps.map((x) => x.label + ' [' + x.sorted + '] ' + (x.seg ? x.seg.n + ' desc=' + x.seg.desc : '')).join(' | ')); }
await s.close(); process.exit(0);
