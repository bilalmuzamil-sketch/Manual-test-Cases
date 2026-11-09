import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/parts/inventory');
const q=process.env.QS; const n=+process.env.NC||2;
const r=await p.evaluate(async([base,q,n])=>{ const one=async()=>{const t0=performance.now(); const x=await fetch(base+'/api/inventory/count-sheet-pdf?'+q,{credentials:'include'}); const ct=x.headers.get('content-type')||''; const b=ct.includes('pdf')?'PDF '+(await x.arrayBuffer()).byteLength:(await x.text()).slice(0,200); return {status:x.status,ms:Math.round(performance.now()-t0),b};};
  return Promise.all(Array.from({length:n},one)); },[s.host.api,q,n]);
const o={env:process.env.ENV||'branch',q,n,r,at:new Date().toISOString()}; console.log(JSON.stringify(o)); fs.appendFileSync('../ev/api-runs.jsonl',JSON.stringify(o)+'\n'); await s.browser.close();
