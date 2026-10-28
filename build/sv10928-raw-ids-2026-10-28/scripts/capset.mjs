import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
await s.go('/workorders'); await s.page.waitForTimeout(3000);
for(const u of ['/api/staff/my-workplaces','/api/organizations/settings','/api/organizations/settings?x=1']){ const r=await s.page.request.get(s.host.api+u); console.log(u,r.status(),(await r.text()).slice(0,200)); }
await s.close();
