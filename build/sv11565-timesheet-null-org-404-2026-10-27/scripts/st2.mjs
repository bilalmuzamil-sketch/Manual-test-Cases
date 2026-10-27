import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
const ME='7f85bc58-9ff5-4b50-b3f3-d85821069066'; let ent=null;
for(let pg=1;pg<15&&!ent;pg++){ const L=(await s.api(`/api/technician-tasks/list?pagination[page]=${pg}&pagination[rowsPerPage]=100&staff_id=${ME}`)).json?.data?.collection||[]; if(!L.length)break; ent=L.find(x=>x.end_date&&x.start_date); if(pg===1) console.log("page1",L.length,JSON.stringify(L[0]).slice(0,300)); }
console.log(JSON.stringify(ent).slice(0,600));
const fmt=d=>d;
if(ent) fs.writeFileSync('../data/entry-staging.json',JSON.stringify({id:ent.id,start_date:fmt(ent.start_date),end_date:fmt(ent.end_date),tech_assigned_id:ent.staff_id,description:ent.description||'',department_id:ent.department_id},null,1));
await s.browser.close(); process.exit(0);
