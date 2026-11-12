import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/reports/ar-aging-collection?asOfDate=2026-11-11'); await p.waitForTimeout(6000);
const f=async u=>p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return await r.json().catch(()=>null)},s.host.api+u);
const out={};
for(const r of ['ar-aging-collection','ap-unpaid-invoices']){ let all=[]; for(let pg=1;pg<200;pg++){ const j=await f(`/api/reporting/reports/${r}?asOfDate=2026-11-11&pagination[page]=${pg}&pagination[rowsPerPage]=30&pagination[sortBy]=name&pagination[descending]=false`); const a=(j?.data??j)?.collection||[]; all=all.concat(a.map(g=>({id:g.customerId||g.vendorId,name:g.name,phone:g.phone,term:g.creditTerm,bal:g.openBalanceCents,amt:g.amountCents,n:g.rowsNumber,locs:[...new Set((g.rows||[]).map(x=>x.locationName))]}))); if(a.length<30) break; }
 out[r]=all; console.log(r,'groups',all.length);
 console.log(' negative:',JSON.stringify(all.filter(g=>g.bal<0).slice(0,5)));
 console.log(' longest:',JSON.stringify([...all].sort((a,b)=>b.name.length-a.name.length).slice(0,3).map(g=>[g.name,g.name.length,g.n])));
 console.log(' multi-location:',JSON.stringify(all.filter(g=>g.locs.length>1).slice(0,3).map(g=>[g.name,g.n,g.locs])));
 console.log(' phone+term small:',JSON.stringify(all.filter(g=>g.phone&&g.term&&g.n<=5).slice(0,3).map(g=>[g.name,g.phone,g.term,g.n]))); }
fs.writeFileSync('../ev/groups.json',JSON.stringify(out)); await s.close(); process.exit(0);
