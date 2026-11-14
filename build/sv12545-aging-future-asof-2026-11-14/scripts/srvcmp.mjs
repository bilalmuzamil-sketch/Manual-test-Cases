import {sess,get} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(3000);
const f=c=>'$'+(c/100).toLocaleString('en-US',{minimumFractionDigits:2});
for(const d of ['2026-11-14','2026-10-31','2026-12-31']){ const x=await get(s,`/api/reporting/reports/ar-aging-summary?asOfDate=${d}&timezone=Asia%2FKarachi&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=customer_name&pagination[descending]=false`); const t=x.j.data.totals; console.log(d,'server',[t.currentCents,t.days1To30Cents,t.days31To60Cents,t.days61To90Cents,t.days91PlusCents,t.totalCents].map(f).join(' ')); }
await s.close(); process.exit(0);
