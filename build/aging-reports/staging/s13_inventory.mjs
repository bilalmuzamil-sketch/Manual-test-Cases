// s13_inventory.mjs — 14 Nov 2026, staging, READ-ONLY prep for the 22 new run-557 tests (C1145247-C1145260, C1145292-C1145299): build, the
// session, whether the 120-letter / 78-char no-space customers and vendors already exist, whether the seed ids used on sv11315 (tax, category,
// canned line) exist here, and the earliest as-of date at which A/R Detail's Location list holds only one location (C1145297).
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s13/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const o = {};
const list = (j) => (Array.isArray(j?.data) ? j.data : j?.data?.collection ?? j?.data?.response?.collection ?? []);
o.profile = (await s.api('/api/iam/view-profile/')).st;
await s.go('/reports/ar-aging-summary'); o.build = await s.page.evaluate(() => (document.body.innerText.match(/v\d+\.\d+\.\d+-[0-9a-f]{7}/) || [null])[0]);
for (const q of ['ZZAUTOTESTAbcdefghij', 'ZZBREAK', 'Superlongunbroken']) { o['cust ' + q] = list((await s.api('/api/customers?search=' + encodeURIComponent(q))).j).map((c) => (c.name || c.company_name || '').slice(0, 140)).slice(0, 6); o['vend ' + q] = list((await s.api('/api/parts-catalogue/vendors?search=' + encodeURIComponent(q))).j).map((v) => (v.name || v.vendor_name || '').slice(0, 140)).slice(0, 6); }
o.taxes = list((await s.api('/api/taxes')).j).slice(0, 5).map((x) => [x.id || x.tax_id, x.name]);
o.categories = list((await s.api('/api/parts-catalogue/categories')).j).slice(0, 5).map((x) => [x.id || x.category_id, x.name]);
o.canned = (await s.api('/api/canned-lines/3a212080-8c00-4981-a46d-de91db43f3e7')).st;
const locs = async (d) => { const r = await s.api('/api/reporting/reports/ar-aging-detail/locations?asOfDate=' + d); return list(r.j).map((l) => l.name || l.locationName || l.workplace_name || JSON.stringify(l).slice(0, 60)); };
o.locsToday = await locs('2026-11-14'); o.locsJson = JSON.stringify((await s.api('/api/reporting/reports/ar-aging-detail/locations?asOfDate=2026-11-14')).j).slice(0, 300);
let lo = new Date('2023-01-01'), hi = new Date('2026-11-14'); o.locsLo = await locs(lo.toISOString().slice(0, 10));
for (let i = 0; i < 12; i++) { const mid = new Date((lo.getTime() + hi.getTime()) / 2); const L = await locs(mid.toISOString().slice(0, 10)); if (L.length <= 1) lo = mid; else hi = mid; }
o.oneLocUntil = lo.toISOString().slice(0, 10); o.oneLocList = await locs(o.oneLocUntil); o.nextList = await locs(hi.toISOString().slice(0, 10)); o.nextDate = hi.toISOString().slice(0, 10);
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 3500)); await s.close(); process.exit(0);
