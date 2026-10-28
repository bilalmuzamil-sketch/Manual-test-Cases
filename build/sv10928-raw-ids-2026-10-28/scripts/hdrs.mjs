import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa28'});
let shown=0; s.page.on('request',r=>{ if(/\/api\/work-orders/.test(r.url())&&shown<2){ shown++; const h=r.headers(); console.log(r.url().slice(0,90)); console.log(JSON.stringify(Object.fromEntries(Object.entries(h).filter(([k])=>!/cookie|accept-|sec-|user-agent|referer|origin/.test(k)))).slice(0,500)); }});
await s.go('/workorders/8f3a379b-4bf2-4a0b-839b-47fd57c01098/lines'); await s.page.waitForTimeout(5000);
console.log('ls keys',await s.page.evaluate(()=>Object.keys(localStorage).join(',')));
await s.close(); process.exit(0);
