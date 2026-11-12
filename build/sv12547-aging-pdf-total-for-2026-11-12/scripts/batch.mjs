// direct export downloads (same URLs the screen sends), PDF + CSV each
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/reports/ar-aging-collection?asOfDate=2026-11-11'); await p.waitForTimeout(5000);
const G=JSON.parse(fs.readFileSync('../ev/groups.json')); const id=(r,n)=>G[r].find(g=>g.name===n).id;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a';
// pick AP vendors covering every bucket
const get=async u=>p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return r.json()},s.host.api+u);
const buck=d=>d<=0?'Current':d<=30?'1-30':d<=60?'31-60':d<=90?'61-90':'91+'; const cover={}; 
for(let pg=1;pg<30;pg++){ const j=await get(`/api/reporting/reports/ap-unpaid-invoices?asOfDate=2026-11-11&pagination[page]=${pg}&pagination[rowsPerPage]=30&pagination[sortBy]=name&pagination[descending]=false`); const a=(j.data??j).collection||[]; if(pg===1) console.log('row keys',Object.keys(a[0].rows[0]).join(',')); for(const g of a){ if(g.rowsNumber>15) continue; for(const r of g.rows||[]){ const b=buck(r.pastDue??r.daysPastDue??0); (cover[b]=cover[b]||[]).push([g.vendorId,g.name]); } } if(a.length<30) break; }
const pick=[]; for(const b of ['Current','1-30','31-60','61-90','91+']){ const c=(cover[b]||[])[0]; console.log('AP bucket',b,c?c[1]:'NONE'); if(c&&!pick.find(x=>x[0]===c[0])) pick.push(c); }
const jobs=[
 ['arcol-bancescu','ar-aging-collection',`customers=${id('ar-aging-collection','Bancescu & Sons Truck & Trailer Repair')}`,'date'],
 ['arcol-longname','ar-aging-collection',`customers=${id('ar-aging-collection','ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd')}`,'date'],
 ['arcol-locmix-all','ar-aging-collection',`customers=${id('ar-aging-collection','ZZAUTOTEST LOC MIX')}`,'date'],
 ['apun-kernville-all','ap-unpaid-invoices',`vendors=${id('ap-unpaid-invoices','Kernville Truck & Trailer Repair')}`,'date'],
 ['apun-kernville-1loc','ap-unpaid-invoices',`vendors=${id('ap-unpaid-invoices','Kernville Truck & Trailer Repair')}&locations=${HD}`,'date'],
 ['apun-p97-1loc','ap-unpaid-invoices',`vendors=4c29e427-0b67-4ef7-bcdb-ec4a7334ee60&locations=${HD}`,'date'],
 ['apdet-amani-1loc','ap-aging-detail',`vendors=351f8911-5d87-4dfa-8897-5baecb5c9d25&locations=${HD}`,'vendor_name'],
 ['apdet-allbuckets','ap-aging-detail',`vendors=${pick.map(x=>x[0]).join(',')}`,'vendor_name'],
 ['ardet-all','ar-aging-detail','','customer_name'],
 ['ardet-all-1loc','ar-aging-detail',`locations=${HD}`,'customer_name'],
 ['arsum-bancescu','ar-aging-summary',`customers=${id('ar-aging-collection','Bancescu & Sons Truck & Trailer Repair')}`,'name'],
 ['apsum-kernville','ap-aging-summary',`vendors=${id('ap-unpaid-invoices','Kernville Truck & Trailer Repair')}`,'name'],
];
for(const [tag,rep,q,sort] of jobs){ for(const fmt of ['pdf','csv']){ const u=s.host.api+`/api/reporting/reports/${rep}/export?asOfDate=2026-11-11${q?'&'+q:''}&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=${sort}&pagination[descending]=false&format=${fmt}`; const t0=Date.now();
  const r=await p.evaluate(async u=>{ const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,ct:r.headers.get('content-type'),b:btoa(s)}; },u);
  fs.writeFileSync(`../ev/${tag}.${fmt}`,Buffer.from(r.b,'base64')); console.log(tag,fmt,r.st,r.ct,((Date.now()-t0)/1000).toFixed(1)+'s'); } }
fs.writeFileSync('../ev/batch-meta.json',JSON.stringify({marker:await s.marker(),pick,jobs},null,1)); await s.close(); process.exit(0);
