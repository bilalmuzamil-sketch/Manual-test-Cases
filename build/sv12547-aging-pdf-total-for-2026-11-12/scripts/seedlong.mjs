// make a vendor with a very long name and one vendor credit, so its "Total for" label must wrap
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/parts/vendors'); await p.waitForTimeout(4000);
const pr=async(u,b)=>p.evaluate(async([u,b])=>{const r=await fetch(u,{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); return {st:r.status,t:(await r.text()).slice(0,600)}},[s.host.api+u,b]);
const gt=async u=>p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return {st:r.status,t:(await r.text()).slice(0,900)}},s.host.api+u);
console.log('add-vendor empty:',JSON.stringify(await pr('/api/parts-catalogue/add-vendor',{})));
console.log('credit empty:',JSON.stringify(await pr('/api/parts-catalogue/vendor/credit/create',{})));
console.log('vendor detail:',JSON.stringify(await gt('/api/parts-catalogue/vendor/4c29e427-0b67-4ef7-bcdb-ec4a7334ee60')));
await s.close(); process.exit(0);
