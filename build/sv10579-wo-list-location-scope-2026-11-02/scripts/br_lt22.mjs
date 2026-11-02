import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const pref=(await s.api('/api/users/me/preferences/work-orders-list')).json.data; console.log('pref',JSON.stringify(pref).slice(0,900));
const caps=[]; s.page.on('request',r=>{ if(r.url().includes('/api/work-orders?')||r.url().includes('/api/work-orders/list')) caps.push(r.url().replace(/.*\/api\//,'').slice(0,400)); });
await s.go('/workorders'); await s.page.waitForTimeout(5000); console.log('list requests',caps.slice(0,3).join('\n'));
process.exit(0);
