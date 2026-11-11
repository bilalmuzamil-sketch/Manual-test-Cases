// p01_walk.mjs — 11 Nov 2026: open each of the six aging reports at 1440 px, record title, filter chips, headings, the first 60 rows
// as shown, every /api/reporting call (address + reply) and a picture. Read only. Output exec/p01/.
import { start, REPORTS } from './lib.mjs';
const OUT = new URL('./p01/', import.meta.url).pathname;
const s = await start(OUT); const o = {};
for (const [k, p] of Object.entries(REPORTS)) {
  const n0 = s.net.length; await s.go(p); await s.page.waitForTimeout(2500);
  o[k] = { url: s.page.url(), title: await s.title(), chips: await s.chips(), headers: await s.headers(), rows: await s.rows(60), calls: s.net.slice(n0).map((x) => ({ m: x.m, u: x.u, st: x.st, keys: x.body && typeof x.body === 'object' ? Object.keys(x.body.data ?? x.body) : null })) };
  await s.shot(k); s.save(`net-${k}`, s.net.slice(n0)); console.log(k, o[k].title, '| headers', JSON.stringify(o[k].headers), '| rows', o[k].rows.length, '| calls', o[k].calls.map((c) => c.st + ' ' + c.u.replace(/^.*\/api\//, '')).join(' ; ').slice(0, 400));
}
s.save('walk', o); await s.close(); process.exit(0);
