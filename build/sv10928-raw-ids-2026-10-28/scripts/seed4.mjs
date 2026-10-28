import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const otherCo=process.argv[3]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const show=(k,r)=>{console.log(k,r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const od=(await s.api(`/api/customers/view/${otherCo}`)).json.data; const oct=(od.contacts||od.company.contacts)[0].id;
const v=(await s.api(`/api/vehicles/view/${S.vid}`)); show('vehicle view',v);
const vd=v.json?.data||{};
for(const b of [{vehicle_id:S.vid,company_id:otherCo,customer_id:oct},{vehicle_id:S.vid,company_id:otherCo,customer_id:oct,unit:'Z10928',vehicle_type_id:S.type.id}]){ const r=show('vehicle change',await post('/api/vehicles/change',b)); if(r.status<300) break; }
show('delete contact',await post('/api/contacts/delete',{customer_id:S.ctid}));
const c=await s.api(`/api/customers/view/${S.cid}`); console.log("contacts now",JSON.stringify(c.json?.data?.contacts??c.json?.data?.company?.contacts));
const w=await s.api(`/api/work-orders/view/${S.wo.work_order_id}`); console.log('wo company',JSON.stringify(w.json).match(/"company[^,]*,[^,]*/)?.[0]);
await s.close();
