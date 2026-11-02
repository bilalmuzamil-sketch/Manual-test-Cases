import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; let U=null; p.on('request',r=>{ if(r.url().includes('technician-tasks/list')) U=r.url(); });
await s.go(`/workorders/${S.wos[0].woId}/timesheets`); await p.waitForTimeout(4000); console.log(decodeURIComponent(U||'none')); process.exit(0);
