import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const INV=[{id:'0192beff-2385-4069-814c-ed1415dadeb0',pn:'1238042',name:'A256',cat:'00e200b1-59fe-4c4a-88a1-952a6d38fee0',sell:80.37},{id:'022d1f00-bfca-4951-82b0-5b92226aa635',pn:'1237932',name:'A146',cat:'00e200b1-59fe-4c4a-88a1-952a6d38fee0',sell:77.94}];
const stock={}; for(const p of INV){ const r=await s.api('/api/inventory/parts/'+p.id); stock[p.pn]=r.json?.data?.quantity??r.json?.data?.part?.quantity??j(r.json,200); } console.log('stock before',j(stock)); fs.writeFileSync('prod/stock-before.json',JSON.stringify(stock));
const plan={A:[['discount','Core discount',5,0],['fee','Environmental fee',3,1],['fee','Environmental fee',3,0]],B:[['discount','Waste discount',1,0],['discount','core discount',2,1],['fee','Tiny fee',0.01,0,'pct_parts']]};
for(const k of ['A','B']){ const W=JSON.parse(fs.readFileSync(`prod/wo-${k}.json`));
  for(const [pn,id] of Object.entries(W.parts)){ const r=await P(`/api/work-orders/part/remove-request/${id}`,{}); console.log(k,'remove',pn,r.status,r.status>=300?j(r.json,150):''); }
  const ids=[]; for(const p of INV){ const r=await P('/api/work-orders/part/make-request',{work_order:W.wo,line:W.lines[0],description:p.name,part_number:p.pn,quantity:1,part_source_type:'inventory',is_authorized:true,part_category_id:p.cat,inventory_part_id:p.id,sell_price:p.sell}); console.log(k,'inv part',p.pn,r.status,r.status>=300?j(r.json,200):''); }
  await s.page.waitForTimeout(1200); const L=(await s.api('/api/work-orders/lines/'+W.wo)).json.data.collection; const pr=[]; for(const l of L) for(const p of (l.part_requests||[])) pr.push({id:p.id,pn:p.part_number,st:p.status});
  console.log(k,'parts now',j(pr,300)); const pk=await P(`/api/work-orders/${W.wo}/pick-inventory-parts`,{part_request_ids:pr.map(x=>x.id)}); console.log(k,'pick',pk.status,pk.status>=300?j(pk.json,200):'');
  const byPn=Object.fromEntries(pr.map(x=>[x.pn,x.id])); W.invparts=byPn;
  for(const [kind,name,amt,ix,calc] of plan[k]){ const a=await P('/api/work-orders/adjustments/add',{workOrderId:W.wo,kind,name,calculationType:calc||'flat',amount:amt,scope:'part_line',targetId:byPn[INV[ix].pn],taxable:false}); console.log(k,'adj',kind,name,a.status,a.status>=300?j(a.json,150):''); await s.page.waitForTimeout(400); }
  const v=await s.api('/api/work-orders/view/'+W.wo); console.log(k,'summary',j(v.json?.data?.work_order?.adjustmentsSummary,200)); fs.writeFileSync(`prod/wo-${k}.json`,JSON.stringify(W)); }
await s.close();
