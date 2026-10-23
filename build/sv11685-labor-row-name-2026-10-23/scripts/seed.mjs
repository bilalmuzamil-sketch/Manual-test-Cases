import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,r.status,JSON.stringify(r.json||r.text).slice(0,220)); return r;};
const w=await P('/api/work-orders/create',{company_id:'4255e024-938c-4514-83d9-95f1a0a7f324',vehicle_id:'a0679c67-a67e-414d-b940-1811195ae227',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:'2026-10-23',is_vehicle_here:true});
const wo=w.json?.data?.id||w.json?.data?.work_order_id||w.json?.id; console.log('WO',wo);
for(const c of ['0f9a7759-1982-4855-96d5-4a4cf1773a23','17e46eee-af7d-4aad-8ffd-89e29e72357d','7eea9a2b-8974-4c79-bb7e-72377a78b28e','5fd21946-4da4-43b6-9331-cf7df66c3032','1f91a6d5-1cf2-46fd-8bcd-0813143eb2aa'])
  await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:c,status:'authorized'});
const lines=(await s.api('/api/work-orders/lines/'+wo)).json; fs.writeFileSync('/tmp/qa11685/w/seed-lines.json',JSON.stringify(lines,null,1));
fs.writeFileSync('/tmp/qa11685/w/seed-wo.txt',wo);
const arr=lines.data?.collection||lines.data?.lines||lines.data||[]; console.log('lines',Array.isArray(arr)?arr.length:Object.keys(lines.data||{}));
if(Array.isArray(arr)) arr.forEach(l=>console.log(l.id,JSON.stringify({n:l.name||l.title||l.what,st:l.status,labor:(l.labor||l.labors||[]).length})));
process.exit(0);
