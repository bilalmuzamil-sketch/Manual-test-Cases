/** Staff record fields (time clock, active, location) and whether the build has a Collapse all control (2026-10-08). */
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
const { browser, page: p } = await open('/customers');
const a = api(p);
const s = await a.get('/api/staff?search=' + encodeURIComponent('Ayesha')); console.log('RAW', s.status, JSON.stringify(s.body).slice(0, 600));
const d = s.body?.data; const row = (Array.isArray(d) ? d : d?.collection ?? d?.staff ?? [])[0];
console.log('STAFF KEYS', String(JSON.stringify(row)).slice(0, 1500));
const one = row ? await a.get(`/api/staff/${row.staff_id ?? row.id}`) : null;
console.log('STAFF ONE', one?.status, JSON.stringify(one?.body).slice(0, 2000));
await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
const chunks = await p.evaluate(`performance.getEntriesByType('resource').map(e => e.name).filter(n => /\\.js/.test(n) && /WorkOrders|TechView|Board|workorder/i.test(n))`) as string[];
console.log('CHUNKS', chunks.map((c) => c.replace(APP, '')).join(' '));
for (const c of chunks) {
  const txt = await p.evaluate(`fetch(${JSON.stringify(c)}).then(r => r.text())`) as string;
  const hits = [...new Set((txt.match(/.{0,60}(Collapse all|Expand all|collapseAll|expandAll|collapse_all|unfold_less|unfold_more).{0,60}/gi) || []).map((x) => x.slice(0, 140)))].slice(0, 6);
  if (hits.length) console.log('HIT', c.replace(APP, ''), JSON.stringify(hits));
}
await done(browser);
