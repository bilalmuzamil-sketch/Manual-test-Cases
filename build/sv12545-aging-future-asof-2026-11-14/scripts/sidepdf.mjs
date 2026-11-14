import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa83'}); const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(3000);
console.log('marker',JSON.stringify(await s.marker()));
for(const [rep,sort] of [['ar-aging-summary','customer_name'],['ar-aging-detail','customer_name'],['ar-aging-collection','date'],['ap-aging-summary','vendor_name'],['ap-aging-detail','vendor_name'],['ap-unpaid-invoices','date']]){
 const u=s.host.api+`/api/reporting/reports/${rep}/export?asOfDate=2026-11-14&timezone=Asia%2FKarachi&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=${sort}&pagination[descending]=false&format=pdf`;
 const r=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,b:btoa(s)}},u);
 const f=`../ev/side-${rep}-all.pdf`; fs.writeFileSync(f,Buffer.from(r.b,'base64')); console.log(rep,r.st,fs.statSync(f).size); }
await s.close(); process.exit(0);
