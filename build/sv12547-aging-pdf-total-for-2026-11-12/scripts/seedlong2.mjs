import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/parts/vendors'); await p.waitForTimeout(4000);
const pr=async(u,b)=>p.evaluate(async([u,b])=>{const r=await fetch(u,{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); return {st:r.status,t:(await r.text()).slice(0,400)}},[s.host.api+u,b]);
const NAME='ZZAUTOTEST SV12547 Wrap Vendor With An Extremely Long Name Built To Check That The Total For Label Wraps Inside Its Row Instead Of Widening The Date Column Of The Report PDF';
let r=await pr('/api/parts-catalogue/add-vendor',{name:NAME,credit_term:'Net 30',credit_limit:0,tax_id:'819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b'}); console.log('add-vendor',NAME.length,JSON.stringify(r));
let id=(r.t.match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0];
if(!id){ const l=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return r.text()},s.host.api+'/api/parts-catalogue/vendors?search=SV12547'); id=(l.match(/"id":"([0-9a-f-]{36})"[^}]*SV12547/)||[])[1]; console.log('lookup',l.slice(0,200)); }
console.log('vendor id',id);
r=await pr('/api/parts-catalogue/vendor/credit/create',{vendor_id:id,memo:'ZZAUTOTEST SV12547 wrap check',amount:25}); console.log('credit',JSON.stringify(r));
fs.writeFileSync('../ev/seed.json',JSON.stringify({NAME,id})); await s.close(); process.exit(0);
