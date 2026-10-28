// Staging sign-in probe: build marker, who am I, location.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync(process.env.CK||'/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
console.log('url',s.page.url()); const me=await s.api('/api/auth/me'); console.log('me',me.status,JSON.stringify(me.json).slice(0,200));
console.log('marker',JSON.stringify(await s.marker?.()));
await s.close(); process.exit(0);
