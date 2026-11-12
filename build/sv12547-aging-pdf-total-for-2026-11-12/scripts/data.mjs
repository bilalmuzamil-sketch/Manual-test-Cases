import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/reports/ar-aging-collection?asOfDate=2026-11-11'); await p.waitForTimeout(6000);
const f=async u=>p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return {st:r.status,j:await r.json().catch(()=>null)}},s.host.api+u);
for(const r of ['ar-aging-collection','ap-unpaid-invoices']){ const x=await f(`/api/reporting/reports/${r}?asOfDate=2026-11-11&pagination[page]=1&pagination[rowsPerPage]=500&pagination[sortBy]=name&pagination[descending]=false`);
 const d=x.j?.data??x.j; const a=d?.rows||d?.groups||d?.collection||d?.items||(Array.isArray(d)?d:[]); console.log(r,x.st,'keys',Object.keys(d||{}).join(','),'n',a.length); if(a[0]) console.log(' sample',JSON.stringify(a[0]).slice(0,400));
 const nm=g=>g.name||g.customerName||g.vendorName||g.customer_name||g.label||''; const bal=g=>+(g.openBalance??g.open_balance??g.totals?.openBalance??g.total?.openBalance??0);
 const neg=a.filter(g=>bal(g)<0).map(g=>[nm(g),bal(g),g.count??g.documentCount]).slice(0,6); const lng=[...a].sort((x,y)=>nm(y).length-nm(x).length).slice(0,5).map(g=>[nm(g),nm(g).length,g.count??g.documentCount]); const ph=a.filter(g=>g.phone).slice(0,3).map(g=>[nm(g),g.phone,g.count??g.documentCount]);
 console.log(' negative:',JSON.stringify(neg)); console.log(' longest:',JSON.stringify(lng)); console.log(' with phone:',JSON.stringify(ph)); }
await s.close(); process.exit(0);
