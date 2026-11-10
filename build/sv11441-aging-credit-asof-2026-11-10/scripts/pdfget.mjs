import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000);
const u=s.host.api+'/api/reporting/reports/'+process.env.PATHQ; const t0=Date.now();
const b64=await p.evaluate(async u=>{ const r=await fetch(u,{credentials:'include'}); const ab=await r.arrayBuffer(); let s=''; const a=new Uint8Array(ab); for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {status:r.status,ct:r.headers.get('content-type'),b:btoa(s)}; },u);
console.log(b64.status,b64.ct,Math.round((Date.now()-t0)/1000)+'s',b64.b.length); fs.writeFileSync(process.env.OUTF,Buffer.from(b64.b,'base64'));
await s.close(); process.exit(0);
