// s1f_boundary.mjs — 11 Nov 2026: C1062570/C1062571 picture of the 100th/101st boundary inside the open over-100 group: open the group,
// scroll to the 100th document, read the rows around it (and the row that sits between 100 and 101), picture. Output exec/s1f/.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./s1f/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const o = {};
for (const [id, rep, kind, name, d100, d101] of [['C1062570', 'arc', 'Customer', 'ZZAUTOTEST OVER100 C', 'S11315-17714', 'S11315-17635'], ['C1062571', 'apu', 'Vendor', 'ZZAUTOTEST OVER100 V', 'ZZO100-099', 'ZZO100-020']]) {
  await s.go(REPORTS[rep]); await F.pick(kind, name); await S.expand(new RegExp(name)); const t0 = Date.now();
  const l = await S.find(new RegExp(d100)); o[id] = { found100: !!l, ms: Date.now() - t0 };
  if (l) { await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = e.scrollTop + 300; })()`); await p.waitForTimeout(150); o[id].early = await s.shot(id + '-boundary-early'); await p.waitForTimeout(2500);
    o[id].shot = await s.shot(id + '-boundary'); o[id].rows = await p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(e => { const b = e.getBoundingClientRect(); return [e.innerText.replace(/\\s+/g,' ').trim().slice(0, 90), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height), e.className.slice(0, 60)]; }).filter(x => x[2] > 100 && x[2] < 900)`); }
}
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); for (const [k, v] of Object.entries(o)) console.log(k, v.found100, v.ms, JSON.stringify(v.rows?.map((r) => r[0].slice(0, 50) + ' @' + r[2] + ' ' + r[5])).slice(0, 1500)); await s.close(); process.exit(0);
