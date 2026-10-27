import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
const J=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const cur=JSON.parse(fs.readFileSync('../data/brett-entry-now.json')).e;
let r=await J('/api/technician-tasks/change',{id:cur.id,start_date:'28/01/2025 19:27',end_date:'28/01/2025 20:22',tech_assigned_id:cur.staff_id,description:null,work_order_id:cur.work_order_id,line_id:cur.line_id}); console.log('change',r.status,JSON.stringify(r.json));
const res=await s.page.evaluate(async(api)=>{for(let pg=60;pg<80;pg++){const j=await (await fetch(api+`/api/technician-tasks/list?pagination[page]=${pg}&pagination[rowsPerPage]=100`,{credentials:'include'})).json(); const e=(j?.data?.collection||[]).find(x=>x.id==='7a42170f-9461-40cb-8f1a-ecba3307ea7e'); if(e) return e;} return null;},s.host.api);
console.log('after',JSON.stringify({wo:res?.work_order_number,line:res?.line_name,s:res?.start_date,e:res?.end_date,d:res?.description}));
await s.browser.close(); process.exit(0);
