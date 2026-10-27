import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const WO='d973d775-8e53-443b-912d-a56f6dafd54d';
const v=(await s.api('/api/work-orders/view/'+WO)).json?.data?.work_order; console.log('wo',v?.number||v?.display_number,v?.status,'invoice',v?.invoice_id,'customer',v?.company?.name||v?.company_name);
const L=(await s.api('/api/work-orders/lines/'+WO)).json; const arr=L.data?.collection||L.data?.lines||L.data; console.log('lines',JSON.stringify((Array.isArray(arr)?arr:[]).map(l=>({id:l.id||l.line_id,no:l.line_number||l.position,name:(l.name||l.title||'').slice(0,40),st:l.status,adj:(l.adjustments||[]).length}))).slice(0,900));
console.log('mapping',JSON.stringify((await s.api('/api/bookkeeping/adjustment-item-mapping-status')).json));
for(const u of ['/api/work-orders/'+WO+'/adjustments','/api/work-orders/adjustments?workOrderId='+WO,'/api/adjustment-templates','/api/organizations/adjustment-templates']){const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,300));}
process.exit(0);
