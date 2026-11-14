import {sess,get} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(3000);
for(const r of ['ar-aging-summary','ap-aging-summary']) for(const d of ['2026-11-14','2026-12-31']){ const x=await get(s,`/api/reporting/reports/${r}?asOfDate=${d}&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=name&pagination[descending]=false`); console.log(new Date().toISOString(),r,d,JSON.stringify(x.j.data.totals)); }
await s.close(); process.exit(0);
