import {sess,get} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(4000);
const ar=(await get(s,'/api/reporting/reports/ar-aging-summary?asOfDate=2026-12-31&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=name&pagination[descending]=false')).j.data.collection;
const ap=(await get(s,'/api/reporting/reports/ap-aging-summary?asOfDate=2026-12-31&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=name&pagination[descending]=false')).j.data.collection;
console.log('AR keys',Object.keys(ar[0]).join(','),'| first',ar.slice(0,4).map(x=>x.customerName).join(' / '));
console.log('AP first',ap.slice(0,4).map(x=>x.vendorName).join(' / '));
const cust=ar.find(x=>x.customerName==='10 Trucking'), vend=ap.find(x=>x.vendorName==='123 Cannabis Forestlawn');
const ids={cust:cust?.customerId,vend:vend?.vendorId}; console.log(JSON.stringify(ids), 'cust row',JSON.stringify(cust||null).slice(0,300));
fs.writeFileSync('../ev/ids.json',JSON.stringify(ids));
const dl=async(rep,q,fmt,tag)=>{ const u=s.host.api+`/api/reporting/reports/${rep}/export?${q}&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=${/summary/.test(rep)?'name':/detail/.test(rep)?(rep[1]==='r'?'customer_name':'vendor_name'):'date'}&pagination[descending]=false&format=${fmt}`;
  const r=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,b:btoa(s)}},u);
  const f=`../ev/${tag}.${fmt}`; fs.writeFileSync(f,Buffer.from(r.b,'base64')); console.log(tag,fmt,r.st,fs.statSync(f).size); };
const reps=['ar-aging-summary','ar-aging-detail','ar-aging-collection','ap-aging-summary','ap-aging-detail','ap-unpaid-invoices'];
for(const rep of reps){ for(const d of ['2026-11-14','2026-12-31']) await dl(rep,`asOfDate=${d}`,'csv',`${rep}-${d}-all`);
  const f=rep.startsWith('ar')?`customers=${ids.cust}`:`vendors=${ids.vend}`;
  for(const d of ['2026-11-14','2026-12-31']) for(const fmt of ['pdf','csv']) await dl(rep,`asOfDate=${d}&${f}`,fmt,`${rep}-${d}-one`);
}
await s.close(); process.exit(0);
