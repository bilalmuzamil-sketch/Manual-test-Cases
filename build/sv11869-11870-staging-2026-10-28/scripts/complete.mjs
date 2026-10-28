// Reads Require Tech Story / picking settings, completes every line + the work order, creates the invoice (set-up for the report check).
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const WO='99e6423d-3b81-4a2a-803f-5b22d7b04f86', LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
await s.go('/workorders'); await s.page.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
const H={'x-location-id':LOC}; const get=u=>s.api(u,{headers:H}); const post=(u,b)=>s.api(u,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(b)});
const st=JSON.stringify((await get('/api/organizations/settings')).json); console.log('settings',(st.match(/"[a-zA-Z_]*([Ss]tory|[Pp]ick)[a-zA-Z_]*":[^,]*/g)||[]).join(' '));
const lr=(await get(`/api/work-orders/${WO}/parts/list-requests-by-line`)).json; const txt=JSON.stringify(lr);
const lines=[...new Set([...txt.matchAll(/"line_id":"([0-9a-f-]{36})"/g)].map(m=>m[1]))]; console.log('lines',lines.length, (txt.match(/"line_status":"[a-z_]+"|"status":"[a-z_]+"/g)||[]).slice(0,30).join(' '));
fs.writeFileSync('/tmp/qa30/lines.json',txt);
await s.close(); process.exit(0);
