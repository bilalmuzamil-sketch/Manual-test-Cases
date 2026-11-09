import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/parts/inventory');
for(const [tag,q] of JSON.parse(process.env.Q)){
  const r=await p.evaluate(async([base,q])=>{const t0=performance.now(); const x=await fetch(base+'/api/inventory/count-sheet-pdf?'+q,{credentials:'include'});
    const a=new Uint8Array(await x.arrayBuffer()); let s=''; for(let i=0;i<a.length;i+=8192) s+=String.fromCharCode(...a.subarray(i,i+8192));
    return {status:x.status,ms:Math.round(performance.now()-t0),b64:btoa(s)};},[s.host.api,q]);
  fs.writeFileSync(`../ev/${tag}.pdf`,Buffer.from(r.b64,'base64')); console.log(tag,q,r.status,r.ms);
}
await s.browser.close();
