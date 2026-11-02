import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa3',quick:'tech',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const pr=(await s.api('/api/iam/view-profile/')).json; console.log(JSON.stringify(pr).slice(0,400));
const u=await s.page.evaluate(()=>localStorage.getItem('user')); const m=(u||'').match(/"staff_?[iI]d":"([0-9a-f-]{36})"/g); console.log('staff ids in user',m); const m2=JSON.stringify(pr).match(/"staff_?[iI]d":"([0-9a-f-]{36})"/g); console.log('in profile',m2); process.exit(0);
