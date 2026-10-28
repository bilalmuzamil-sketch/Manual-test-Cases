import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const r=await s.api('/api/auth/me'); console.log('me',r.status,JSON.stringify(r.json||r.text).slice(0,160)); console.log('marker',await s.marker?.());
await s.close(); process.exit(0);
