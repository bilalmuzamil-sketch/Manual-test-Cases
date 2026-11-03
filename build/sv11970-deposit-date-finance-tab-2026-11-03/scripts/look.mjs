import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900}});
console.log(JSON.stringify(await s.marker()));
const me=await s.api('/api/staff/my-workplaces'); console.log('workplaces',me.status,JSON.stringify(me.json).slice(0,900));
await s.close(); process.exit(0);
