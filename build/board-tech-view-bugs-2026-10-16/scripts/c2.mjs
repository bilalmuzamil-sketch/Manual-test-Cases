import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
const r=await s.api('/api/users/me/preferences/work-orders-list'); console.log(JSON.stringify(r.json).slice(0,2500));
const st=await s.api('/api/staff?limit=200'); const rows=st.json?.data?.collection||st.json?.data||[]; console.log('staff',rows.length, JSON.stringify(rows.slice(0,3)).slice(0,600));
await s.close();
