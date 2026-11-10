import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/staging/'+f,'utf8').trim();
const s=await open({env:'staging',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa84',vp:{width:1600,height:900},dpr:2});
console.log('url',s.page.url()); console.log('marker',JSON.stringify(await s.marker()));
const r=await s.api('/api/staff/my-workplaces'); console.log('wp',r.status,JSON.stringify(r.json).slice(0,150));
await s.close(); process.exit(0);
