// s91_grouppaging.mjs — 11 Nov 2026: C1062570 (A/R Collection, "ZZAUTOTEST OVER100 C") and C1062571 (A/P Unpaid Invoices, "Grand Haven Diesel
// Services LLC", 578 bills - well over 2 x 100, so "100 more each time" is seen more than once; control "ZZAUTOTEST OVER100 V", 105). Re-run after
// p72 showed the page draws 100 then adds the rest on scroll (SV-12540 developer comment). Per group: count in brackets, document rows ON THE PAGE
// after opening, after each scroll to the end (until "Total for" shows and the count stops), every document number read from the ID / No. column:
// unique, no repeats, total = count in brackets. Output exec/s91/<id>.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkSort, clean } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./s91/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const ONLY = process.env.ONLY?.split(',');
const docs = (name) => p.evaluate((name) => { const ths = [...document.querySelectorAll('main thead th')].map((t) => t.innerText.replace(/arrow_drop_(up|down)/g, '').trim()); const idx = ths.findIndex((t) => t === 'ID' || t === 'No.');
  const all = [...document.querySelectorAll('main tbody tr')]; const i0 = all.findIndex((t) => /keyboard_arrow_(down|right)/.test(t.innerText) && t.innerText.includes(name)); if (i0 < 0) return { n: -1 }; const ids = []; let totalFor = false;
  for (let k = i0 + 1; k < all.length; k++) { const tx = all[k].innerText.replace(/\s+/g, ' ').trim(); if (/^Total for /.test(tx)) { totalFor = true; break; } if (/keyboard_arrow_(right|down)/.test(all[k].innerText) || /^Totals( |$)/.test(tx)) break; if (!tx) continue; const td = all[k].querySelectorAll('td')[idx]; ids.push(td ? td.innerText.trim() : '?' + tx.slice(0, 40)); }
  return { idx, n: ids.length, ids, totalFor }; }, name);
async function run(o, rep, kind, name) { await ensureLoc(p, 'Staging Heavy Duty - 9919'); await s.go(REPORTS[rep]); await p.waitForTimeout(3500); await F.pick(kind, name); o.chips = await F.chips();
  const hdr = p.locator('main tbody tr').filter({ hasText: name }).first(); o.header = clean(await hdr.innerText()).slice(0, 90); o.count = +((o.header.match(/\((\d+)\)/) || [])[1] || -1); await s.shot(o.id + '-1-count');
  await S.expand(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\(')); await p.waitForTimeout(2500); const g0 = await docs(name); o.open = { n: g0.n, totalFor: g0.totalFor, last: g0.ids.slice(-1)[0] }; await s.shot(o.id + '-2-open');
  o.rounds = []; let last = g0; for (let i = 1; i <= 14; i++) { await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = e.scrollHeight; })()`); await p.waitForTimeout(3000); const g = await docs(name); o.rounds.push({ n: g.n, totalFor: g.totalFor, added: g.n - last.n });
    if (i <= 2) await s.shot(`${o.id}-3-scroll${i}`); if (g.totalFor && g.n === last.n) break; last = g; }
  const ids = last.ids; const seen = new Set(), dups = []; for (const x of ids) { if (seen.has(x)) dups.push(x); seen.add(x); } o.final = { n: ids.length, unique: seen.size, dups: dups.slice(0, 10), nDups: dups.length, equalsCount: ids.length === o.count, idx: last.idx, first: ids[0], hundredth: ids[99], hundredFirst: ids[100] }; await s.shot(o.id + '-4-end'); }
const T = { C1062570: (o) => run(o, 'arc', 'Customer', 'ZZAUTOTEST OVER100 C'), C1062571: (o) => run(o, 'apu', 'Vendor', 'Grand Haven Diesel Services LLC'), CTL_V: (o) => run(o, 'apu', 'Vendor', 'ZZAUTOTEST OVER100 V') };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id }; try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await s.shot(id + '-error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok', JSON.stringify({ h: o.header, open: o.open?.n, rounds: (o.rounds || []).map((r) => r.n).join('>'), final: o.final && [o.final.n, o.final.unique, o.final.nDups, o.final.equalsCount] })); }
await s.close(); process.exit(0);
