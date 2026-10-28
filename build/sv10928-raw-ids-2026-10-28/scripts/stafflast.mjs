import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const r=await s.api('/api/staff?limit=300'); const L=r.json?.data?.staff||r.json?.data?.collection||r.json?.data||[]; const a=Array.isArray(L)?L:[];
console.log('staff',a.length,'keys',a[0]?Object.keys(a[0]).join(','):'');
const none=a.filter(x=>!x.last_name||!String(x.last_name).trim()||!x.first_name); console.log('no last/first',none.length,JSON.stringify(none.slice(0,5).map(x=>[x.id,x.user_id,x.first_name,x.last_name,x.email,x.role_label,x.is_active,x.confirmed])));
await s.close(); process.exit(0);
