import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
console.log('marker',JSON.stringify(await s.marker()));
const w=await s.api('/api/staff/my-workplaces'); console.log('workplaces',w.status,JSON.stringify(w.json).slice(0,600));
const me=await s.api('/api/auth/me'); console.log('me',me.status,JSON.stringify(me.json).slice(0,300));
await s.close?.(); process.exit(0);
