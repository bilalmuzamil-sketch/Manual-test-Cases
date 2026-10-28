import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const r=await post('/api/contacts/delete',{customer_id:S.ctid}); console.log('delete contact',r.status,JSON.stringify(r.json||r.text).slice(0,200));
const c=await s.api(`/api/customers/view/${S.cid}`); const j=JSON.stringify(c.json); console.log('contacts in customer view:',(j.match(/contact/gi)||[]).length, j.slice(j.indexOf('contact')-20,j.indexOf('contact')+200));
await s.close();
