// Set-up by API (the check itself is the report download): tab/CR-start lines, a "-10% fleet" discount, a "-A12" inventory part in stock.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const WO='99e6423d-3b81-4a2a-803f-5b22d7b04f86', LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
await s.go('/workorders'); await s.page.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
const H={'x-location-id':LOC}; const get=u=>s.api(u,{headers:H}); const post=(u,b)=>s.api(u,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(b)});
const base=JSON.parse(fs.readFileSync('/tmp/qa30/line-payload.json','utf8'));
for(const [n,d] of [['\tTab start','tab'],['\rCR start','carriage return']]){ const r=await post('/api/work-orders/lines/create',{...base,line_name:n,description:d}); console.log('line',JSON.stringify(n),r.status,JSON.stringify(r.json).slice(0,120)); }
const disc=await post('/api/work-orders/adjustments/add',{workOrderId:WO,kind:'discount',name:'-10% fleet',calculationType:'pct_subtotal',amount:10,maxCap:null,scope:'whole_wo',targetId:null,taxable:false,templateId:null,description:null}); console.log('discount',disc.status,JSON.stringify(disc.json).slice(0,200));
const inv=(await get('/api/inventory/parts?limit=3&search=')).json; const L=inv?.data?.parts||inv?.data?.collection||[]; const P0=L[0]; const cat=P0?.category; const bin=P0?.binLocations?.[0]?.binLocationId; const vid=(JSON.stringify(L).match(/"vendor_id":"([0-9a-f-]{36})"/)||[])[1];
const cp=await post('/api/parts-catalogue/add-catalogue-part',{name:'Hose clamp',part_number:'-A12',tags:[]}); const cpid=(JSON.stringify(cp.json).match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0]; console.log('catalog',cp.status,cpid,JSON.stringify(cp.json).slice(0,150));
const ip=await post('/api/inventory/parts/create',{catalog_part_id:cpid,category_id:cat,quantity:5,cost:4,tags:[],bins:[{id:bin,quantity:5,isDefault:true}],vendor_id:vid}); console.log('inventory',ip.status,JSON.stringify(ip.json).slice(0,150));
const lr=(await get(`/api/work-orders/${WO}/parts/list-requests-by-line`)).json; console.log('lines now',JSON.stringify(lr).match(/"(line_name|name)":"[^"]*"/g)?.slice(0,20).join(' '));
await s.close(); process.exit(0);
