// s1_pics.mjs — 11 Nov 2026: pictures for the S1 name-order tests. For each group of names, scrolls the report until the first name is
// on screen, takes a picture and records each named row's box (screen points) for annotate_v2. Also the opening header of each report.
// Output exec/s1pics/ (png + boxes.json).
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./s1pics/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const boxes = {};
const SC = `(document.querySelector('main .q-table__middle.scroll, main .q-virtual-scroll, main .q-table__middle') || document.scrollingElement)`;
const find = async (name) => { await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(700);
  for (let i = 0; i < 300; i++) { const hit = await p.evaluate((n) => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => (t.querySelector('td')?.innerText || '').trim() === n); if (!tr) return false; tr.scrollIntoView({ block: 'center' }); return true; }, name);
    if (hit) { await p.waitForTimeout(900); return true; } const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`); await p.waitForTimeout(600); if (!moved) return false; } return false; };
const box = (name) => p.evaluate((n) => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => (t.querySelector('td')?.innerText || '').trim() === n); if (!tr) return null; const r = tr.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }, name);
const G = { ars: [['C715273', ['10 Trucking', '2 Trucking', 'A-1 Towing', 'a1 towing']], ['C715573', ['ZZPUNCT Diesel #1', 'ZZPUNCT Diesel -1', 'ZZPUNCT Diesel 1', 'ZZPUNCT Diesel @1']], ['C715275a', ['Eagle', "Émile's", 'Emma', 'Fargo']], ['C715275b', ['Øster', 'Ozone']]],
  aps: [['C715274', ['10 Trucking', '2 Trucking', 'A-1 Towing', 'a1 towing']], ['C715276a', ['Ackley', 'æble', 'Afton']], ['C715276b', ['Strand', 'Straße', 'Strasser']]] };
for (const [k, groups] of Object.entries(G)) { await s.go(REPORTS[k]); await p.waitForTimeout(2500);
  for (const [tag, names] of groups) { const ok = await find(names[0]); const bs = {}; for (const n of names) bs[n] = await box(n);
    const head = await p.evaluate(`(() => { const r = document.querySelector('main thead th').getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; })()`);
    const f = await s.shot(tag); boxes[tag] = { file: f, found: ok, rows: bs, firstHeader: head }; console.log(tag, ok, JSON.stringify(bs)); } }
for (const k of ['ars', 'ard', 'arc', 'aps', 'apd', 'apu']) { await s.go(REPORTS[k]); await p.waitForTimeout(2500);
  const ths = await p.evaluate(`[...document.querySelectorAll('main thead th')].map(th => { const r = th.getBoundingClientRect(); return { t: th.innerText.replace(/\\s+/g,' ').replace(/arrow_drop_up|arrow_drop_down|keyboard_arrow_right/g,'').trim(), aria: th.getAttribute('aria-sort'), b: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }; })`);
  boxes['head-' + k] = { file: await s.shot('head-' + k), ths }; }
fs.writeFileSync(OUT + 'boxes.json', JSON.stringify(boxes, null, 1)); await s.close(); process.exit(0);
