import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa28'});
const a=(await s.api('/api/staff?limit=300')).json?.data?.collection||[];
console.log('total',a.length,'deletable',a.filter(x=>x.deletable).length,'deletable+active+confirmed',a.filter(x=>x.deletable&&x.is_active&&x.confirmed_invitation_on).length);
console.log(a.filter(x=>x.deletable&&x.is_active&&x.confirmed_invitation_on).slice(0,6).map(x=>[x.id,x.staff_id,x.email,x.role_label].join(' | ')).join('\n'));
await s.close(); process.exit(0);
