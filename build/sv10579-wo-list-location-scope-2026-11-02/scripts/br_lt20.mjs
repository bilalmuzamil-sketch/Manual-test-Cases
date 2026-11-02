import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const CK=JSON.parse(rd('br-ck.json')); const Y=JSON.parse(rd('br-y.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:A.id,workplace_timezone:A.timezone})});
for(const [n,id] of [['C 17587',CK.C.id],['K 17588',CK.K.id],['Y 17586',Y.Y],['X 17581',S.wos[0].woId]]){ const r=await s.api(`/api/work-orders/${id}/line-technicians`); console.log(n,r.status,JSON.stringify(r.json?.data).slice(0,400)); }
process.exit(0);
