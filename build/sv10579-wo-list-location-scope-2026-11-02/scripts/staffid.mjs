import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const col=(await s.api('/api/staff?limit=200')).json.data; const T=(col.collection||col).find(x=>x.email==='tech@shopview.com'); console.log(T.staff_id,T.first_name,T.last_name,T.role_label); fs.writeFileSync('/tmp/sv10579/techstaff',T.staff_id); process.exit(0);
