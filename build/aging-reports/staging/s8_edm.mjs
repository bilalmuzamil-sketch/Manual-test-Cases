// s8_edm.mjs — 12 Nov 2026, staging: the day-count split seen from a NORTH AMERICAN location. This test browser views from "Staging
// Lethbridge - 4310" (America/Edmonton; STG_LOC -> localStorage location -> x-location-id header; the QA lead's session is NOT changed) with
// the browser on America/Edmonton (BROWSER_TZ), as a Lethbridge user would be. Document: credit memo CM3-4400 at Lethbridge, made
// 2026-09-22T00:00Z = Sep 21, 6 pm Mountain time. A/R Collection, customer "ZZAUTOTEST SV-9647 Credit Split BEFORE", as of 11/12/2026:
// read the Due Date shown and the Past Due. Also the same row through the report's own call with x-location-id = Lethbridge vs Heavy Duty.
import { stgStart, API } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import { mkSort } from '../exec/sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./s8/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const S = mkSort(p); const o = {};
const LETH = 'f8a8b802-7780-4b16-bf10-343caeb616b2', HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const viaHeader = async (loc) => { const r = await s.ctx.request.get(API + '/api/reporting/reports/ar-aging-detail/buckets/days_31_to_60/rows?asOfDate=2026-11-12&pagination[page]=1&pagination[rowsPerPage]=100&customerIds[]=' + o.cust, { headers: { Accept: 'application/json', Origin: 'https://app.staging.shopview.com', 'x-location-id': loc } }); const j = await r.json().catch(() => null); return (j?.data?.collection || []).filter((d) => d.documentNumber === 'CM3-4400').map((d) => [d.dueDate, d.daysPastDue]); };
await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(4000);
o.browserZone = await p.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); o.lsLocation = await p.evaluate(() => localStorage.getItem('location')); o.header = o.lsLocation === LETH ? 'Lethbridge' : o.lsLocation;
o.topRight = (await p.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(-60);
await F.pick('Customer', 'ZZAUTOTEST SV-9647 Credit Split BEFORE'); await p.waitForTimeout(3000); o.url = p.url(); o.cust = new URL(o.url).searchParams.get('customerIds') || (o.url.match(/customerIds[^=]*=([^&]+)/) || [])[1];
o.exp = await S.expand(/^ZZAUTOTEST SV-9647 Credit Split BEFORE/); await p.waitForTimeout(3500);
o.heads = await p.evaluate(() => [...document.querySelectorAll('main thead th')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()));
o.rows = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
o.box = await p.evaluate(() => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => t.innerText.includes('CM3-4400')); if (!tr) return null; const r = tr.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
o.pic = await s.shot('collection-lethbridge');
try { o.apiLeth = await viaHeader(LETH); o.apiHD = await viaHeader(HD); } catch (e) { o.apiErr = String(e).slice(0, 200); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
