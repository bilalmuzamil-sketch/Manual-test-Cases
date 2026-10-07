import {ob,j} from './lib.mjs'; import fs from 'fs';
const L=process.argv[2]; const W=JSON.parse(fs.readFileSync(`wo-${L}.json`)); const s=await ob();
const now=new Date().toISOString().replace(/\.\d+Z/,'+00:00');
const out=await s.page.evaluate(async([base,wo,now])=>{const r=await fetch(base+'/api/work-orders/invoices/estimate',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:wo,type:'pdf',isEstimate:1,includeDeclined:0,issueDate:now,dueDate:now,historyEvent:null})});
  const ct=r.headers.get('content-type'); const a=new Uint8Array(await r.arrayBuffer()); let s='';for(const x of a)s+=String.fromCharCode(x); return [r.status,ct,btoa(s)];},[s.host.api,W.wo,now]);
console.log('estimate',out[0],out[1]); let buf=Buffer.from(out[2],'base64');
if(/json/.test(out[1]||'')){ const jj=JSON.parse(buf.toString()); console.log(j(jj,300)); const u=jj?.data?.url||jj?.data?.pdf||jj?.data; if(typeof u==='string' && u.startsWith('http')){ const b2=await s.page.evaluate(async u=>{const r=await fetch(u,{credentials:'include'});const a=new Uint8Array(await r.arrayBuffer());let s='';for(const x of a)s+=String.fromCharCode(x);return btoa(s);},u); buf=Buffer.from(b2,'base64'); } else if(typeof u==='string'){ buf=Buffer.from(u,'base64'); } }
fs.writeFileSync(`raw/estimate-${L}.pdf`,buf); console.log('bytes',buf.length, buf.slice(0,5).toString());
await s.close();
