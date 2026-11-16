import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa90'}); const p=s.page; await s.go('/reports/ar-aging-detail'); await p.waitForTimeout(2500);
console.log('marker',JSON.stringify(await s.marker()));
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a', LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const runs=[['ar-aging-detail','customer_name','all',''],['ar-aging-detail','customer_name','hd',HD],['ar-aging-detail','customer_name','le',LE],
 ['ar-aging-collection','date','all',''],['ar-aging-collection','date','hd',HD],['ar-aging-collection','date','le',LE],
 ['ar-aging-summary','customer_name','hd',HD],['ar-aging-summary','customer_name','le',LE]];
for(const [rep,sort,tag,loc] of runs){
 const u=s.host.api+`/api/reporting/reports/${rep}/export?asOfDate=2026-11-16&timezone=America%2FEdmonton${loc?'&locations='+loc:''}&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=${sort}&pagination[descending]=false&format=pdf`;
 const r=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,b:btoa(s)}},u);
 const f=`../ev/n/${rep}-${tag}.pdf`; fs.writeFileSync(f,Buffer.from(r.b,'base64')); console.log(rep,tag,r.st,fs.statSync(f).size); }
await s.close(); process.exit(0);
