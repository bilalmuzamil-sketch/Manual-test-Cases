import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection;
for(const L of wps){ await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:L.id,workplace_timezone:L.timezone})});
 const r=await s.api('/api/work-orders/view/1ff1553d-8868-4108-82b2-8601f7f319d2'); console.log(L.name,r.status,JSON.stringify(r.json).slice(0,160), 'keys:',Object.keys(r.json?.data||{}).filter(k=>/workplace|location/i.test(k)).join(',')); }
process.exit(0);
