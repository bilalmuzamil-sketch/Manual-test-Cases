import {sess,get} from './common.mjs';
const s=await sess({tz:'America/Edmonton'}); const p=s.page; const reqs=[];
p.on('request',r=>{ if(/reporting\/reports\/ar-aging-summary\?/.test(r.url())) reqs.push(r.url()); });
await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(5000);
console.log('screen request:',decodeURIComponent(reqs[0]||'none').replace(/^.*\?/,''));
const tzp=(decodeURIComponent(reqs[0]||'').match(/timezone=([^&]+)/)||[])[1];
for(const d of ['2026-11-13','2026-11-14','2026-11-15']) for(const tz of [null,tzp,'UTC']){ const q=`/api/reporting/reports/ar-aging-summary?asOfDate=${d}${tz?'&timezone='+encodeURIComponent(tz):''}&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=name&pagination[descending]=false`; const x=await get(s,q); console.log(d,tz,x.st,x.j?.data?.totals?.totalCents,x.j?.data?.totals?.currentCents, x.st>=400?x.t:''); }
console.log('now',new Date().toISOString());
await s.close(); process.exit(0);
