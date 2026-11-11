// p44_pageedge.mjs — 11 Nov 2026: read-only. For C715360 (A/R Detail 31-60 bucket) and C715361 (A/P Detail 91+ bucket), fetch the bucket's
// pages exactly as the screen asks for them (100 rows, sorted by name A to Z) and check the join: the last name of page N vs the first of page N+1,
// and no row repeated across pages. A/R: every page; A/P: first 5 pages. Output p44/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p44/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const a = mk(s.page); const o = {};
for (const [k, slug, bucket, sortBy, pages] of [['C715360', 'ar-aging-detail', 'days_31_to_60', 'customer_name', 9], ['C715361', 'ap-aging-detail', 'days_91_plus', 'vendor_name', 5]]) {
  const all = []; const joins = [];
  for (let pg = 1; pg <= pages; pg++) { const r = await a.get(`/api/reporting/reports/${slug}/buckets/${bucket}/rows?asOfDate=2026-11-11&pagination[page]=${pg}&pagination[rowsPerPage]=100&pagination[sortBy]=${sortBy}&pagination[descending]=false`);
    const rows = r.j?.data?.collection || r.j?.data?.rows || []; if (!rows.length) break; const nm = (x) => (x.customerName || x.customerFullName || x.vendorName || x.name || '').toLowerCase();
    if (all.length) joins.push([pg, nm(all[all.length - 1]), nm(rows[0]), nm(all[all.length - 1]) <= nm(rows[0])]); all.push(...rows); }
  const ids = all.map((x) => x.documentId + '|' + x.documentNumber); const dups = ids.filter((x, i) => ids.indexOf(x) !== i).length;
  const names = all.map((x) => (x.customerName || x.customerFullName || x.vendorName || x.name || '').toLowerCase()); let breaks = 0; for (let i = 0; i < names.length - 1; i++) if (names[i] > names[i + 1]) breaks++;
  o[k] = { n: all.length, dups, breaks, joins, keys: Object.keys(all[0] || {}).slice(0, 20) }; }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2000)); await s.close(); process.exit(0);
