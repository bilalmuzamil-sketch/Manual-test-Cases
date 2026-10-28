import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const show=(k,r)=>{console.log(k,r.status,JSON.stringify(r.json||r.text).slice(0,220)); return r.json;};
const cid=S.cid; const wp=S.wp.data.collection[0];
const ty=(await s.api('/api/organizations/vehicle-types')).json.data.collection[0];
const ct=show('contact',await post('/api/contacts/create',{company_id:cid,first_name:'Zz',last_name:'Temp',email:`zz10928.${env}@example.com`}));
const ctid=ct?.data?.id||ct?.data?.contact_id;
const v=show('vehicle',await post('/api/vehicles/create',{company_id:cid,customer_id:ctid,unit:'Z10928',vehicle_type_id:ty.id}));
const vid=v?.data?.id||v?.data?.vehicle_id;
const vr=await s.api(`/api/vehicles?company_id=${cid}`); console.log('vehicles',JSON.stringify(vr.json).slice(0,300));
const wo=show('wo',await post('/api/work-orders/create',{company_id:cid,customer_id:ctid,vehicle_id:vid,workplace_id:wp.id,start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true}));
for(const [p,b] of [['/api/contacts/delete',{id:ctid}],['/api/contacts/delete',{contact_id:ctid}],['/api/contacts/remove',{id:ctid}]]){ const r=show('del '+p+' '+Object.keys(b)[0],await post(p,b)); if((r&&!r.errors)) break; }
const cc=await s.api(`/api/customers/view/${cid}`); console.log('customer now',JSON.stringify(cc.json).slice(0,400));
fs.writeFileSync(`/tmp/s10928/seed-${env}.json`,JSON.stringify(Object.assign(S,{ctid,vid,wo:wo?.data,type:ty})));
await s.close();
