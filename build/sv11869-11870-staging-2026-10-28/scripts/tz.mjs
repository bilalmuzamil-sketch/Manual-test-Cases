// Reads every timezone-like setting for the org and the locations (configuration first, Rule 75).
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.env.ENVX||'staging'; const LOC=env==='prod'?'b617914c-16e9-4485-8e8b-193cd86aa416':'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env,ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const H={headers:{'x-location-id':LOC}};
for(const u of ['/api/organizations/settings','/api/staff/my-workplaces','/api/iam/view-profile/']){ const t=JSON.stringify((await s.api(u,H)).json); console.log(u,(t.match(/"[a-zA-Z_]*(timezone|time_zone|timeZone|name)[a-zA-Z_]*":"[^"]*"/g)||[]).slice(0,14).join(' ')); }
console.log('browser tz',await s.page.evaluate(()=>Intl.DateTimeFormat().resolvedOptions().timeZone));
await s.close(); process.exit(0);
