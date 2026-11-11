// pr2c_api.mjs — 11 Nov 2026: C1062590 before-side, third look on PRODUCTION. The old A/R Aging Detail loads in ONE reply
// (/api/reporting/account-receivable/aging-detail-report?asOfDate=...). Read it directly at the current location: which transaction types it
// holds, whether CM-4412/CM-4413 or "ZZAUTOTEST Credit Today PR2" are in it; read the customers' own location; then change location to each
// other workplace (API) and read the report again; change back. Output exec/prod/pr2c.json.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = { reads: [] };
const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const p = B.page; const API = 'https://' + B.APIH;
const req = (m, u, b) => p.evaluate(async ([m, u, b]) => { const r = await fetch(u, { method: m, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); return { st: r.status, t }; }, [m, API + u, b]);
async function read(tag) { const d = new Date(); const day = d.toISOString().slice(0, 10); const r = await req('GET', `/api/reporting/account-receivable/aging-detail-report?asOfDate=${day}T23%3A59%3A59.999Z`); const t = r.t;
  const types = {}; for (const m of t.matchAll(/"(?:transactionType|transaction_type|type)"\s*:\s*"([^"]+)"/g)) types[m[1]] = (types[m[1]] || 0) + 1;
  const hits = ['CM-4412', 'CM-4413', 'Credit Today PR2'].map((s) => { const i = t.indexOf(s); return [s, i >= 0 ? t.slice(Math.max(0, i - 500), i + 200) : null]; }); o.reads.push({ tag, st: r.st, len: t.length, types, hits, sample: t.slice(0, 400) }); }
try { const me = await req('GET', '/api/auth/me/fe-permissions'); o.me = me.t.slice(0, 300); const wp = await req('GET', '/api/workplaces'); o.workplaces = wp.t.slice(0, 1500);
  await read('current'); const ids = [...wp.t.matchAll(/"(?:id|workplace_id)"\s*:\s*"([0-9a-f-]{36})"[^}]*?"name"\s*:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]); o.wpIds = ids;
  for (const [id, name] of ids.slice(0, 4)) { const c = await req('POST', '/api/iam/change-location', { workplace_id: id, workplace_timezone: 'America/Edmonton' }); await read('at ' + name + ' (' + c.st + ')'); }
  if (ids.find((x) => /Truck Hill 1/.test(x[1]))) await req('POST', '/api/iam/change-location', { workplace_id: ids.find((x) => /Truck Hill 1/.test(x[1]))[0], workplace_timezone: 'America/Edmonton' });
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'pr2c.json', JSON.stringify(o, null, 1)); console.log('pr2c', JSON.stringify(o.reads.map((r) => [r.tag, r.st, r.len, r.types, r.hits.map((h) => !!h[1])])).slice(0, 1500), o.err || ''); await B.browser.close(); process.exit(0);
