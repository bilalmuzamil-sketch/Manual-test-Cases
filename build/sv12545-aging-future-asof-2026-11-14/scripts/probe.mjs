import {sess,get,post,LETH} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(4000);
const out={marker:await s.marker()};
out.loc=await post(s,'/api/iam/change-location',{workplace_id:LETH,workplace_timezone:'America/Edmonton'});
await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(5000);
out.chip=await p.locator('[data-test-id=filter_chip_asOfDate]').innerText().catch(e=>'ERR '+e.message);
out.url=p.url();
const reps={'ar-aging-summary':'name','ap-aging-summary':'name','ar-aging-detail':'customer_name','ap-aging-detail':'vendor_name','ar-aging-collection':'date','ap-unpaid-invoices':'date'};
for(const [r,sort] of Object.entries(reps)) for(const d of ['','2026-12-31','2026-10-31','2026-11-31','9999-12-31','9999-12-30']){
  const q=`/api/reporting/reports/${r}?${d?'asOfDate='+d+'&':''}pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=${sort}&pagination[descending]=false`;
  const x=await get(s,q); const dd=x.j?.data??x.j; out[r+'|'+d]={st:x.st,totals:dd?.totals,asOf:dd?.asOfDate??dd?.asOf, n:(dd?.collection||[]).length, rowsNumber:dd?.pagination?.rowsNumber, err:x.st>=400?x.t:undefined};
}
fs.writeFileSync('../ev/probe.json',JSON.stringify(out,null,1));
console.log(JSON.stringify({marker:out.marker,loc:out.loc.st,chip:out.chip,url:out.url}));
for(const [k,v] of Object.entries(out)) if(k.includes('|')) console.log(k.padEnd(34),v.st,JSON.stringify(v.totals).slice(0,170),v.err||'');
await s.close(); process.exit(0);
