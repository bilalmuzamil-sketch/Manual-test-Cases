import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const show=(k,r)=>{console.log(k,r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
for(const b of [{vehicle_id:S.vid,company_id:S.cid}]){ const r=show('vehicle delete',await post('/api/vehicles/delete',b)); if(r.status<300) break; }
show('delete contact',await post('/api/contacts/delete',{customer_id:S.ctid}));
const c=await s.api(`/api/customers/view/${S.cid}`); console.log('contacts now',JSON.stringify(c.json?.data?.contacts??c.json?.data?.company?.contacts));
const w=await s.api(`/api/work-orders/view/${S.wo.work_order_id}`); console.log('wo',w.status,JSON.stringify(w.json).match(/"company_name":"[^"]*"/)?.[0]);
// second clean customer for the New WO / New Part Sale dialogs
const c2={json:{data:{company_id:S.cid2}}};
fs.writeFileSync(`/tmp/s10928/seed-${env}.json`,JSON.stringify(Object.assign(S,{cid2:c2.json?.data?.company_id})));
await s.close();
