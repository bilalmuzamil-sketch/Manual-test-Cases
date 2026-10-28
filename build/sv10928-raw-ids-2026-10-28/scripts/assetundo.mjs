import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,vid,ctid]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8')); const cid=S.cid2;
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
console.log('vehicle delete',JSON.stringify(await post('/api/vehicles/delete',{vehicle_id:vid,company_id:cid})).slice(0,150));
console.log('contact delete',JSON.stringify(await post('/api/contacts/delete',{customer_id:ctid,company_id:cid})).slice(0,150));
const c=await s.api('/api/contacts?company_id='+cid); console.log('contacts now',JSON.stringify(c.json).slice(0,200));
delete S.vidNoContact; fs.writeFileSync(`/tmp/s10928/seed-${env}.json`,JSON.stringify(S)); await s.close(); process.exit(0);
