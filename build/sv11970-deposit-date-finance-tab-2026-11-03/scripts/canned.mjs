import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11970/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900}});
const cl=(await s.api('/api/work-orders/canned-lines')).json?.data; const cls=cl?.collection||cl?.canned_lines||cl||[];
console.log('n',cls.length, Object.keys(cls[0]||{}).join(','));
for(const c of cls.slice(0,40)) console.log(c.id,'|',(c.name||c.title||'').slice(0,40),'| parts',JSON.stringify(c.parts||c.part_requests||c.parts_count||'').slice(0,80));
await s.close(); process.exit(0);
