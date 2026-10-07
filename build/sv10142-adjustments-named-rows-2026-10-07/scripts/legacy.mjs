import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const get=async()=>(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign;
console.log('before',await get());
console.log('set legacy',(await P('/api/organizations/invoice-settings/change-design',{documentDesign:'legacy'})).status,await get());
for(const L of ['C','D','E']){ const W=JSON.parse(fs.readFileSync(`wo-${L}.json`));
  const b=await s.page.evaluate(async([base,id])=>{const r=await fetch(base+'/api/invoices/preview?invoice_id='+id+'&type=pdf',{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s='';for(const x of a)s+=String.fromCharCode(x); return btoa(s);},[s.host.api,W.invoice]);
  fs.writeFileSync(`raw/invoice-${L}-legacy.pdf`,Buffer.from(b,'base64')); }
console.log('set modern',(await P('/api/organizations/invoice-settings/change-design',{documentDesign:'modern'})).status,await get());
await s.close();
