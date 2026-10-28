// Seeds a creditable invoice: part sale (existing customer) -> first part on screen (new stocked inventory part, creates the line)
// -> vendor part x2 ordered (back end) -> received ON SCREEN -> complete -> invoice. Usage: CUST="<customer>" node cmseed2.mjs <branch|prod>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const cname=process.env.CUST;
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const A=s.page; const H=env==='prod'?{'x-location-id':LOC}:{};
if(env==='prod'){ await s.go('/workorders'); await A.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const get=u=>s.api(u,{headers:H}); const post=(u,b)=>s.api(u,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(b)});
const cid=((await get('/api/customers?limit=5&search='+encodeURIComponent(cname))).json?.data?.collection||[]).find(x=>x.name===cname)?.id; console.log('customer',cname,cid);
// stocked inventory part (set-up)
const inv=(await get('/api/inventory/parts?limit=3&search=')).json; const L=inv?.data?.parts||inv?.data?.collection||[]; const P0=L[0]; const cat=P0?.category; const bin=P0?.binLocations?.[0]?.binLocationId;
const vid=(JSON.stringify(L).match(/"vendor_id":"([0-9a-f-]{36})"/)||[])[1]; console.log('category',cat,'bin',bin,'vendor',vid);
const pn='ZZCM'+Date.now()%1000000; const cp=await post('/api/parts-catalogue/add-catalogue-part',{name:'ZZAUTOTEST credit seed',part_number:pn,tags:[]}); const cpid=(JSON.stringify(cp.json).match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0];
const ip=await post('/api/inventory/parts/create',{catalog_part_id:cpid,category_id:cat,quantity:5,cost:10,tags:[],bins:[{id:bin,quantity:5,isDefault:true}],vendor_id:vid}); console.log('inventory part',pn,ip.status);
// part sale + first part on screen
await s.go('/parts/part-sales'); await A.waitForTimeout(4000); await A.locator('[data-test-id="button_new_part_sale"]').click(); await A.waitForTimeout(1500);
await A.locator('[data-test-id="select_customer"]').click(); await A.waitForTimeout(500); await A.keyboard.type(cname,{delay:40}); await A.waitForTimeout(3000);
console.log('customer options',JSON.stringify(await A.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ')).slice(0,6)))); await A.screenshot({path:'/tmp/qa25/custsel.png'}); await A.locator('.q-menu .q-item',{hasText:cname}).first().click(); await A.waitForTimeout(800); await A.locator('[data-test-id="button_save_part_sale"]').click(); await A.waitForTimeout(5000);
const psId=(A.url().match(/part-sale\/([0-9a-f-]{36})/)||[])[1]; console.log('part sale',psId);
if(!(await A.locator('[data-test-id="select_part"]').count())){ await A.locator('[data-test-id="button_add_part"]').first().click(); await A.waitForTimeout(1500); }
await A.locator('[data-test-id="select_part"]').first().click(); await A.waitForTimeout(500); await A.keyboard.type(pn,{delay:60}); await A.waitForTimeout(3000);
await A.locator('.q-menu .q-item',{hasText:pn}).first().click(); await A.waitForTimeout(2000);
const bins=await A.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id')));
const bl=A.locator(`[data-test-id="${bins[0]}"]`); await ((await bl.evaluate(e=>e.tagName))==='INPUT'?bl:bl.locator('input')).fill('1'); await A.waitForTimeout(600);
await A.locator('[data-test-id="button_workorder_part_save"]').click(); await A.waitForTimeout(3500);
const lr=JSON.stringify((await get(`/api/work-orders/${psId}/parts/list-requests-by-line`)).json); const line=(lr.match(/"line_id":"([0-9a-f-]{36})"/)||lr.match(/"lines?":\[\{"id":"([0-9a-f-]{36})"/)||[])[1]; console.log('line',line);
// vendor part x2, order it (set-up)
const vpn='ZZCMV'+Date.now()%1000000; const mr=await post('/api/work-orders/part/make-request',{work_order:psId,line,description:'ZZAUTOTEST vendor part for credit',part_number:vpn,quantity:2,part_source_type:'vendor',is_authorized:false,part_category_id:cat,cost:10,sell_price:20,vendor_id:vid});
const prq=(JSON.stringify(mr.json).match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0]; console.log('vendor part',vpn,mr.status,prq,JSON.stringify(mr.json).slice(0,160));
console.log('authorize line',(await post('/api/work-orders/lines/change-status',{line_id:line,status:'authorized',workOrderId:psId})).status);
const od=await post('/api/work-orders/part/perform-request-status-action',{part_request_id:prq,action:'order',workOrderId:psId,sellPrice:20}); console.log('order',od.status,JSON.stringify(od.json).slice(0,160));
const lr2=JSON.stringify((await get(`/api/work-orders/${psId}/parts/list-requests-by-line`)).json); const po=(lr2.match(/"order_id":"([0-9a-f-]{36})"/)||[])[1]; console.log('po',po);
// receive on screen
await s.go(`/order/${po}?receive=1&workOrderId=${psId}&returnTo=PartSale`); await A.waitForTimeout(6000);
const ids=await A.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^(input_invoice_|input_cost_|input_qty_|button_receive_po_)/.test(t))); console.log('receive ids',ids.join(','));
const fill=async(t,v)=>{ const l=A.locator(`[data-test-id="${t}"]`).first(); await ((await l.evaluate(e=>e.tagName))==='INPUT'?l:l.locator('input')).fill(v); await A.waitForTimeout(500); };
for(const t of ids){ if(t.startsWith('input_invoice_')) await fill(t,'ZZCM'+Date.now()%100000); if(t.startsWith('input_cost_')) await fill(t,'10'); if(t.startsWith('input_qty_')) await fill(t,'2'); }
await A.waitForTimeout(1500); const rb=ids.find(t=>t.startsWith('button_receive_po_')); await A.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).click(),rb); await A.waitForTimeout(5000);
console.log('received?',(JSON.stringify((await get(`/api/work-orders/${psId}/parts/list-requests-by-line`)).json).match(/"status":"[a-z_]+"/g)||[]).join(' '));
for(const st of ['approved','complete']) console.log('status',st,(await post('/api/work-orders/change-status',{id:psId,status:st})).status);
const iv=await post('/api/invoices/create',{work_order_id:psId}); const ivId=iv.json?.data?.invoice_id; console.log('invoice',iv.status,ivId);
const cr=await get(`/api/part-sales/${ivId}/list-credit-available-parts`); const cr2=await get(`/api/part-sales/${psId}/list-credit-available-parts`); console.log('creditable (invoice id)',cr.status,JSON.stringify(cr.json).slice(0,300)); console.log('creditable (ps id)',cr2.status,JSON.stringify(cr2.json).slice(0,300));
fs.writeFileSync(`ev/messages/${env}-cmseed.json`,JSON.stringify({env,cname,cid,psId,pn,vpn,po,ivId},null,1));
await s.close(); process.exit(0);
