import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa28'});
const r=await s.api('/api/staff?limit=300'); console.log(typeof r.json?.data, Array.isArray(r.json?.data), Object.keys(r.json?.data||{}).slice(0,5).join(','));
const a=Array.isArray(r.json?.data)?r.json.data:(r.json?.data?.staff||r.json?.data?.collection||[]); console.log(a.filter(x=>/admin/i.test(x.email+x.first_name)).map(x=>[x.staff_id,x.id,x.email,x.first_name,x.last_name,x.role_label].join(' | ')).join('\n'));
await s.close(); process.exit(0);
