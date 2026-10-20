import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/qa6915/seed.json'));
const s=await open({env:'prod',dir:'/tmp/qa6915',vp:{width:1440,height:900},dpr:2,user:'bilal.muzamil@shopview.com'});
const j=x=>(JSON.stringify(x)||'').slice(0,300);
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});console.log('POST',u,r.status,j(r.json));return r;};
const cl=(await s.api('/api/work-orders/canned-lines')).json; const L=(cl?.data?.collection||cl?.data||[]);
let line=null;
for(const c of L){const r=await post(`/api/work-orders/${S.wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'}); if(r.status<300){line=r.json?.data?.line_id||r.json?.data?.id;break;}}
const ls=(await s.api('/api/work-orders/lines/'+S.wo)).json?.data?.collection||[];
console.log('lines',ls.length,j(ls.map(l=>({id:l.id,st:l.status,tot:l.total_price||l.total}))));
for(const l of ls) await post('/api/work-orders/lines/change-status',{line_id:l.id,status:'complete',workOrderId:S.wo});
const inv=await post('/api/invoices/create',{work_order_id:S.wo});
const v=(await s.api('/api/work-orders/view/'+S.wo)).json?.data; const W=v?.work_order||v; console.log('WO',W?.number,W?.status,W?.invoice_status,W?.customer_first_name);
S.number=W?.number; fs.writeFileSync('/tmp/qa6915/seed.json',JSON.stringify(S,null,1));
await s.close();
