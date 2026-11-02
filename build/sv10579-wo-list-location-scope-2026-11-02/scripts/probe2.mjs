import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
for(const u of ['/api/work-orders/tasks/move','/api/technician-tasks/check-out']){ const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:'{}'}); console.log(u,r.status,JSON.stringify(r.json||r.text).slice(0,300)); }
process.exit(0);
