import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const W=JSON.parse(fs.readFileSync('wo-A.json')); const now=new Date().toISOString().replace(/\.\d+Z/,'+00:00');
console.log((await P('/api/organizations/invoice-settings/change-design',{documentDesign:'legacy'})).status);
const out=await s.page.evaluate(async([base,wo,now])=>{const r=await fetch(base+'/api/work-orders/invoices/estimate',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:wo,type:'pdf',isEstimate:1,includeDeclined:0,issueDate:now,dueDate:now,historyEvent:null})}); const a=new Uint8Array(await r.arrayBuffer()); let s='';for(const x of a)s+=String.fromCharCode(x); return btoa(s);},[s.host.api,W.wo,now]);
fs.writeFileSync('raw/estimate-A-legacy.pdf',Buffer.from(out,'base64'));
console.log((await P('/api/organizations/invoice-settings/change-design',{documentDesign:'modern'})).status,(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign);
const v=await s.api('/api/work-orders/view/'+W.wo); W.number=v.json?.data?.work_order?.number; fs.writeFileSync('wo-A.json',JSON.stringify(W)); console.log('A number',W.number);
await s.close();
