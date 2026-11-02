import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const Y=JSON.parse(rd('br-y.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); if(!/change-location/.test(u)) console.log('  ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,160)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
for(const id of ['9151935b-8ddf-4649-ab63-ba240f06612f','6945187b-f083-4561-bc9c-022d02d56116']) await post('/api/technician-tasks/move',{id,line_id:Y.yl,work_order_id:Y.Y});
process.exit(0);
