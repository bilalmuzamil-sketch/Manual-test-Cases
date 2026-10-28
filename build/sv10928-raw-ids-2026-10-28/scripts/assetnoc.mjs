// Set-up: on the no-contacts customer, add a contact + an asset, then delete the contact (asset stays, customer has 0 contacts)
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8')); const cid=S.cid2;
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const ct=await post('/api/contacts/create',{company_id:cid,first_name:'Zz',last_name:'Gone',email:`zz10928.gone.${Date.now()}@example.com`}); console.log('contact',ct.status,JSON.stringify(ct.json).slice(0,120));
const ctid=ct.json?.data?.contact_id;
const v=await post('/api/vehicles/create',{company_id:cid,customer_id:ctid,unit:'ZZNOCONTACT'}); console.log('vehicle',v.status,JSON.stringify(v.json).slice(0,160));
const d=await post('/api/contacts/delete',{customer_id:ctid,company_id:cid}); console.log('contact delete',d.status,JSON.stringify(d.json||d.text).slice(0,200));
const vs=await s.api('/api/vehicles?company_id='+cid); const L=vs.json?.data?.vehicles||vs.json?.data?.collection||vs.json?.data||[]; console.log('vehicles',JSON.stringify(L).slice(0,200));
const vid=(Array.isArray(L)?L:[]).map(x=>x.id||x.vehicle_id)[0]; S.vidNoContact=vid; fs.writeFileSync(`/tmp/s10928/seed-${env}.json`,JSON.stringify(S)); console.log('vidNoContact',vid);
await s.close(); process.exit(0);
