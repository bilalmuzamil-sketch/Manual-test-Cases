// Final attempt to receive a special-order part (C45251 clause 2).
// Known: POST /api/inventory/orders/receive-view returns 200 with the receiving data — vendors ->
// purchaseOrders -> items, each carrying orderItemId / orderId / partRequestId / quantityRemaining.
// /receive, /receive-parts and /receive-items all answer 405 with "Allow: GET", so none of them is
// the write. The write must be order-scoped, so this reads MY request's own order item out of the
// view first and then tries the order-scoped shapes with the right ids and methods.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/120-receive-final.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const LINE='0e2c10ac-b34c-4195-91f6-d9d55c06f943';
const REQ='1b1e1e07-6bbc-47dd-bf65-17f907d4bbaf';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315','/workorders','admin');
const {page, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const reqStatus=async()=>{const l=rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
  return {req:(l.part_requests||[]).find(r=>r.id===REQ)?.status, parts:(l.parts||[]).map(p=>p.part_number), line:l.status};};

R.start = await reqStatus();
log('start: %s', JSON.stringify(R.start));

// find MY request's order item in the receive view
const view = await call('POST','/api/inventory/orders/receive-view',{workOrderId:WO});
const vendors = ((view.json&&view.json.data)||{}).vendors || [];
let mine=null, orderId=null;
for (const v of vendors) for (const po of (v.purchaseOrders||[])) for (const it of (po.items||[])){
  if (it.partRequestId===REQ){ mine=it; orderId=po.id; } }
R.myOrderItem = mine && {orderItemId:mine.orderItemId, orderId:mine.orderId, pn:mine.partNumber,
  ordered:mine.quantityOrdered, remaining:mine.quantityRemaining, coreItemId:mine.coreItemId};
R.orderId = orderId;
log('my order item: %s', JSON.stringify(R.myOrderItem));
save();
if (!mine){ R.fatal='my special-order request does not appear in the receive view at all';
  log(R.fatal); save(); await s.browser.close(); process.exit(0); }

const item = {orderItemId:mine.orderItemId, quantity:mine.quantityRemaining,
  quantityReceived:mine.quantityRemaining, cost:mine.cost, price:mine.price};
const attempts = [
  ['POST', `/api/inventory/orders/${orderId}/receive`, {items:[item], workOrderId:WO}],
  ['PUT',  `/api/inventory/orders/${orderId}/receive`, {items:[item], workOrderId:WO}],
  ['POST', `/api/inventory/orders/receive`,            {orderId, items:[item], workOrderId:WO}],
  ['PUT',  `/api/inventory/orders/receive`,            {orderId, items:[item], workOrderId:WO}],
  ['POST', `/api/inventory/orders/receive-items`,      {orderId, items:[item], workOrderId:WO}],
  ['PUT',  `/api/inventory/orders/receive-items`,      {orderId, items:[item], workOrderId:WO}],
  ['POST', `/api/inventory/orders/receive-parts`,      {orderId, items:[item], workOrderId:WO}],
  ['PUT',  `/api/inventory/orders/receive-parts`,      {orderId, items:[item], workOrderId:WO}],
  ['POST', `/api/inventory/order-items/receive`,       {items:[item], orderId, workOrderId:WO}],
  ['POST', `/api/inventory/orders/receive-view/confirm`,{orderId, items:[item], workOrderId:WO}],
];
R.tries={};
for (const [m,p,b] of attempts){
  const r = await call(m,p,b);
  R.tries[`${m} ${p}`] = {status:r.status, text:r.text.slice(0,200)};
  save();
  if (r.status>=200 && r.status<300){
    const now = await reqStatus();
    R.tries[`${m} ${p}`].now = now;
    log('%s %s -> %d | %s', m, p, r.status, JSON.stringify(now));
    if (now.req !== 'waiting_to_receive'){ R.worked={m,p,now}; break; }
  }
}
log('tries: %s', JSON.stringify(Object.fromEntries(
  Object.entries(R.tries).map(([k,v])=>[k,v.status]))));
R.end = await reqStatus();
log('end: %s', JSON.stringify(R.end));
save();
await s.browser.close();
log('done');
