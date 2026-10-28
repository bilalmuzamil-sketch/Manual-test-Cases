import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo,otherWp]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json','x-location-id':otherWp},body:JSON.stringify(b)});
for(const [u,b] of [['/api/work-orders/change-priority',{work_order_id:wo,priority:'high'}],['/api/work-orders/change-sales-rep',{work_order_id:wo,sales_rep_id:null}],['/api/work-orders/change-status',{id:wo,status:'in_progress'}],['/api/work-orders/change-authorizer',{work_order_id:wo,authorizer_contact_id:null}]]){
  const r=await post(u,b); console.log(u.split('/').pop(),r.status,JSON.stringify(r.json||r.text).slice(0,220)); }
await s.close(); process.exit(0);
