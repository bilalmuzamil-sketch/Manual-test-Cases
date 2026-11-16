// s24_tzparam.mjs — 16 Nov 2026 (SV-12663 re-run, C715471/72): which timezone the report page sends with its data calls in this session, and what the
// Detail rows say with and without it. Opens A/R Detail (as of 11/12/2026) like a user, records the page's own data-call address, and reads one bucket both ways. Read-only.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s24/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const o = { calls: [] };
p.on('request', (r) => { if (/reporting\/reports\/a[rp]-aging/.test(r.url())) o.calls.push(r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 220)); });
await s.go('/reports/ar-aging-detail?asOfDate=2026-11-12'); await p.waitForTimeout(6000); o.pic = await s.shot('ard-1112');
const tz = (o.calls.map((u) => (u.match(/timezone=([^&]+)/) || [])[1]).find(Boolean)) || null; o.tz = tz && decodeURIComponent(tz);
for (const [k, q] of [['noTz', ''], ['pageTz', tz ? '&timezone=' + tz : '']]) { const r = await s.api(`/api/reporting/reports/ar-aging-detail/buckets/current/rows?asOfDate=2026-11-12${q}&pagination[page]=1&pagination[rowsPerPage]=100`); o[k] = (r.j?.data?.collection || []).filter((x) => /S2-4020[25]/.test(x.documentNumber)).map((x) => [x.documentNumber, x.dueDate, x.daysPastDue]); }
o.browserTz = await p.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); o.ls = await p.evaluate(() => Object.keys(localStorage).filter((k) => /zone|tz/i.test(k)).map((k) => [k, String(localStorage.getItem(k)).slice(0, 60)]));
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 1800)); await s.close(); process.exit(0);
