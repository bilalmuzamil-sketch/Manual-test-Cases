// s1g_loader.mjs — 11 Nov 2026: catch the row that appears between the 100th and 101st document of an over-100 group (seen once as an
// empty row at position 101 in s1e's scroll read): open the group, scroll down in small steps, and the moment a row inside the group has no
// document number, picture it and record its text/classes. Output exec/s1g/.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./s1g/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const o = {};
for (const [id, rep, kind, name] of [['C1062570', 'arc', 'Customer', 'ZZAUTOTEST OVER100 C'], ['C1062571', 'apu', 'Vendor', 'ZZAUTOTEST OVER100 V']]) {
  await s.go(REPORTS[rep]); await F.pick(kind, name); await S.expand(new RegExp(name)); o[id] = { hits: [] };
  for (let i = 0; i < 200; i++) {
    const odd = await p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(e => { const b = e.getBoundingClientRect(); return { t: e.innerText.replace(/\\s+/g,' ').trim(), y: Math.round(b.y), h: Math.round(b.height), c: e.className, html: e.innerHTML.slice(0, 300) }; }).filter(r => r.y > 150 && r.y < 880 && !/\\d{4}/.test(r.t) && !/^(Totals|Total for)/.test(r.t))`);
    if (odd.length) { o[id].hits.push({ i, odd }); if (o[id].hits.length === 1) o[id].shot = await s.shot(id + '-loader-' + i); if (o[id].hits.length > 3) break; }
    const moved = await p.evaluate(`(() => { const e = ${S.SC}; const b = e.scrollTop; e.scrollTop = b + 120; return e.scrollTop !== b; })()`); await p.waitForTimeout(120); if (!moved) break; }
}
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); for (const [k, v] of Object.entries(o)) console.log(k, JSON.stringify(v.hits.slice(0, 2)).slice(0, 900)); await s.close(); process.exit(0);
