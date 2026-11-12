// s7_hdr.mjs — 12 Nov 2026, staging: which request headers/params the aging report sends (does the browser tell the server a time zone?),
// and whether a direct GET with another zone header changes the Past Due counted. Read-only; QA lead's session; no location change.
import { stgStart, API } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s7/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const o = { reqs: [] };
p.on('request', (r) => { if (/\/api\/reporting\/reports\/ar-aging-detail/.test(r.url())) o.reqs.push({ u: r.url().replace(API, ''), h: Object.fromEntries(Object.entries(r.headers()).filter(([k]) => !/cookie|authorization|clearance|sso/i.test(k))) }); });
await s.go('/reports/ar-aging-detail'); await p.waitForTimeout(5000);
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o.reqs.slice(0, 2)).slice(0, 2500)); await s.close(); process.exit(0);
