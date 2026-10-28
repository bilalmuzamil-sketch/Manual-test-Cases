// Completes every line + the work order and creates the invoice (set-up). Prints each status.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const WO=process.argv[2]||'99e6423d-3b81-4a2a-803f-5b22d7b04f86', LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
await s.go('/workorders'); await s.page.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
const H={'x-location-id':LOC}; const get=u=>s.api(u,{headers:H}); const post=(u,b)=>s.api(u,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(b)});
const L=(await get(`/api/work-orders/lines/${WO}`)).json; const arr=(L?.data?.lines||L?.data||[]); const lines=(Array.isArray(arr)?arr:Object.values(arr).find(Array.isArray)||[]);
console.log('lines',lines.length,JSON.stringify(Object.keys(lines[0]||{})).slice(0,300));
if(!process.env.SKIPLINES) for(const l of lines){ const id=l.id||l.line_id; const r=await post('/api/work-orders/lines/change-status',{line_id:id,status:'complete',workOrderId:WO}); console.log('line',JSON.stringify(l.line_name),r.status,JSON.stringify(r.json||r.text).slice(0,160)); }
const pr=JSON.stringify((await get(`/api/work-orders/${WO}/parts/list-requests-by-line`)).json); const prq=[...new Set([...pr.matchAll(/"part_request_id":"([0-9a-f-]{36})"/g)].map(m=>m[1]))]; const prq2=prq.length?prq:[...new Set([...pr.matchAll(/"id":"([0-9a-f-]{36})"[^{}]*"status":"in_stock"/g)].map(m=>m[1]))];
console.log('pick',prq2, (await post(`/api/work-orders/${WO}/pick-inventory-parts`,{part_request_ids:prq2})).status);
for(const st of ['approved','complete']){ const r=await post('/api/work-orders/change-status',{id:WO,status:st}); console.log('wo',st,r.status,JSON.stringify(r.json||r.text).slice(0,200)); }
const iv=await post('/api/invoices/create',{work_order_id:WO}); console.log('invoice',iv.status,JSON.stringify(iv.json).slice(0,250));
await s.close(); process.exit(0);
