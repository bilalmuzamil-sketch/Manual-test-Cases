import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(3000);
const st=await s.api('/api/staff?limit=200'); const rows=st.json?.data?.collection||st.json?.data||[];
console.log(rows.map(r=>`${r.first_name} ${r.last_name}|${r.role_label}|${r.id}|${r.confirmed_invitation_on?'conf':'unconf'}`).join('\n'));
await s.close();
