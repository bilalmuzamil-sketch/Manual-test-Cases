import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11253',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1600,height:1100},dpr:1});
const J=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
let r=await s.api('/api/auth/me'); console.log('me',r.status,JSON.stringify(r.json).slice(0,200));
r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=5'); const w0=r.json.data.work_orders[0]; console.log('sample wo',JSON.stringify(w0).slice(0,500));
r=await s.api('/api/staff?limit=200'); const st=(r.json?.data?.collection||r.json?.data||[]); console.log('staff',st.length, JSON.stringify(st.slice(0,3).map(x=>({id:x.id,u:x.user_id,n:x.first_name+' '+x.last_name,role:x.role_label,clock:x.clockable,email:x.email}))));
fs.writeFileSync('../data/staff.json',JSON.stringify(st.map(x=>({id:x.id,user_id:x.user_id,name:(x.first_name||'')+' '+(x.last_name||''),role:x.role_label,clockable:x.clockable,email:x.email})),null,1));
await s.browser.close(); process.exit(0);
