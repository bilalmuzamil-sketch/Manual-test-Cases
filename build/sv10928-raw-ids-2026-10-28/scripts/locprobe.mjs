// Back-end probe: switch location, then call the PR's location-checked work order actions on a work order from the other location.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo,otherWp,tz,homeWp,homeTz]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
console.log('switch',(await post('/api/iam/change-location',{workplace_id:otherWp,workplace_timezone:tz})).status);
for(const [u,b] of [['/api/work-orders/change-priority',{work_order_id:wo,priority:'high'}],['/api/work-orders/change-priority',{id:wo,priority:'high'}],['/api/work-orders/change-sales-rep',{work_order_id:wo,sales_rep_id:null}],['/api/work-orders/change-status',{id:wo,status:'in_progress'}]]){
  const r=await post(u,b); console.log(u,JSON.stringify(b).slice(0,60),r.status,JSON.stringify(r.json||r.text).slice(0,200)); }
console.log('switch back',(await post('/api/iam/change-location',{workplace_id:homeWp,workplace_timezone:homeTz})).status);
await s.close(); process.exit(0);
