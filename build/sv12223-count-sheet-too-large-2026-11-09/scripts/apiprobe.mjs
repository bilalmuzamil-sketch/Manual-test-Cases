// in-page GET of the same endpoint the Print button calls; Q = JSON list of query strings
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/parts/inventory');
const ver=await p.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
for(const q of JSON.parse(process.env.Q)){
  const r=await p.evaluate(async([base,q])=>{const t0=performance.now(); const x=await fetch(base+'/api/inventory/count-sheet-pdf?'+q,{credentials:'include'});
    const ct=x.headers.get('content-type')||''; let b; if(ct.includes('pdf')){const a=await x.arrayBuffer(); b="PDF "+a.byteLength;} else b=(await x.text()).slice(0,260);
    return {status:x.status,ms:Math.round(performance.now()-t0),b};},[s.host.api,q]);
  const o={env:process.env.ENV||'branch',ver,q,...r,at:new Date().toISOString()}; console.log(JSON.stringify(o)); fs.appendFileSync('../ev/api-runs.jsonl',JSON.stringify(o)+'\n');
}
await s.browser.close();
