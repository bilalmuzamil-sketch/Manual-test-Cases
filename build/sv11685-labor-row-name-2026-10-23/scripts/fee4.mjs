import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,r.status,JSON.stringify(r.json||r.text).slice(0,500)); return r;};
for(const u of ['/api/product-and-service','/api/products-and-services','/api/product-and-service/list','/api/bookkeeping/adjustment-item-mapping']){const r=await s.api(u); console.log('GET',u,r.status,JSON.stringify(r.json).slice(0,300));}
await P('/api/product-and-service/create',{});
await P('/api/bookkeeping/adjustment-item-mapping',{});
const L=(await s.api('/api/work-orders/lines/d973d775-8e53-443b-912d-a56f6dafd54d')).json.data; const line=(L.collection||L.lines||L)[0];
await P('/api/work-orders/adjustments/add',{workOrderId:'d973d775-8e53-443b-912d-a56f6dafd54d',kind:'fee',name:'ZZAUTOTEST labor fee',calculationType:'flat',amount:10,scope:'line',targetId:line.id||line.line_id,taxable:false});
process.exit(0);
