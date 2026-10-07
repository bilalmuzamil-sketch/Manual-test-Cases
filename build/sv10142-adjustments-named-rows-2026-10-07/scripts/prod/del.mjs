import {op,j} from '../lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('prod/wo.json')); const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const before=(await s.api('/api/work-orders/view/'+W.wo)).json?.data?.work_order; console.log('status',before?.status,before?.number);
let d=await P('/api/work-orders/delete',{work_order_id:W.wo}); console.log('delete',d.status,j(d.json,160));
if(d.status>=300){ console.log('to estimate',(await P('/api/work-orders/change-status',{id:W.wo,status:'estimate'})).status); d=await P('/api/work-orders/delete',{work_order_id:W.wo}); console.log('delete2',d.status,j(d.json,160)); }
const after=await s.api('/api/work-orders/view/'+W.wo); console.log('re-read',after.status,j(after.json,120));
console.log('design',(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign);
await s.close();
