import {sess,st} from './lib.mjs'; import fs from 'fs';
const s=await sess();
const cl=JSON.parse(fs.readFileSync('../data/canned.json')); const pick=n=>cl.find(c=>c.canned_line_name.trim()===n).id;
let r=await s.J('/api/work-orders/create',{company_id:'e07ebbc4-5a07-41aa-98fd-f1acdde40934',customer_id:'9359801d-87a6-4081-9333-f092f3d465ba',vehicle_id:'f3d489ed-f2b8-449b-a368-295b274568d0',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true,type:'service'}); s.L('wo',r);
const wo=r.json.data.work_order_id||r.json.data.id; const lines=[];
for(const n of ['Service - Full grease service','Service - PDI','Service - Battery service']){ r=await s.J(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:pick(n),status:'authorized'}); s.L('line',r); lines.push(r.json.data.line_id); }
const amanda=st.find(x=>x.name.startsWith('Amanda Williams'));
r=await s.J(`/api/work-orders/lines/${lines[1]}/technicians`,{staffIds:[amanda.id]},'PUT'); s.L('assign B',r);
r=await s.api('/api/work-orders/view/'+wo); console.log('number',r.json.data.work_order.display_number);
fs.writeFileSync('../data/wo1.json',JSON.stringify({wo,lines,number:r.json.data.work_order.display_number},null,1));
console.log(JSON.stringify(await s.rows(wo),null,1));
await s.go(`/workorders/${wo}/lines`); await s.page.waitForTimeout(3000);
const ids=await s.page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.dataset.testId.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>')))]);
console.log(ids.filter(i=>/labor|labour|task|move|tech|clock|line_menu|kebab|actions/i.test(i)).join('\n'));
await s.page.screenshot({path:'/tmp/qa11685/w/l1.png'});
await s.browser.close(); process.exit(0);
