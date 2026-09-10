// Last attempt at C45251 clause 2: receive the special-order part through the API.
// probe118 showed the UI's "Receive" (data-test-id=button_part_request_action) calls
// POST /api/inventory/orders/receive-view, renders NOTHING (no dialog, drawer or menu appears),
// and the app posts two Sentry error envelopes at the same moment — i.e. the receive view throws.
// So the button is a dead end on this branch. This tries the receive endpoints directly, reading
// each refusal, and stops the moment the request stops being `waiting_to_receive`.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/119-receive-api.json`, JSON.stringify(R,null,1));
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
  return{status:r.status,json:j,text:t.slice(0,500)};},{api:APIH,m,p,b:b||null});
const getReq=async()=>{const l=rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
  return {status:(l.part_requests||[]).find(r=>r.id===REQ)?.status, parts:(l.parts||[]).map(p=>p.part_number),
    lineStatus:l.status};};

R.start = await getReq();
log('request starts as %s', JSON.stringify(R.start));

// what does the view endpoint actually return? It may name the order this request belongs to.
R.receiveView = await call('POST','/api/inventory/orders/receive-view',
  {part_request_id:REQ, workOrderId:WO, line_id:LINE});
log('receive-view -> %s %s', R.receiveView.status, R.receiveView.text.slice(0,400));
save();
// and with no body, the way the page may call it
R.receiveViewBare = await call('POST','/api/inventory/orders/receive-view',{});
log('receive-view (no body) -> %s %s', R.receiveViewBare.status, R.receiveViewBare.text.slice(0,300));
save();

const bodies = [
  {part_request_id:REQ, workOrderId:WO, quantity:5},
  {part_request_ids:[REQ], workOrderId:WO, quantity:5},
  {part_request_id:REQ, workOrderId:WO, received_quantity:5, quantity_received:5},
  {parts:[{part_request_id:REQ, quantity:5}], workOrderId:WO},
];
const paths = ['/api/inventory/orders/receive','/api/inventory/orders/receive-parts',
  '/api/work-orders/part/receive','/api/inventory/orders/receive-items'];
R.tries={};
outer:
for (const p of paths){
  for (const [i,b] of bodies.entries()){
    const r = await call('POST', p, b);
    R.tries[`${p} #${i}`] = {status:r.status, text:r.text.slice(0,220)};
    save();
    if (r.status>=200 && r.status<300){
      const now = await getReq();
      R.tries[`${p} #${i}`].requestNow = now.status;
      log('%s body#%d -> %d | request is now %s', p, i, r.status, now.status);
      if (now.status !== 'waiting_to_receive'){ R.worked={path:p, body:b, now}; break outer; }
    }
    if (r.status===404 || r.status===405) break;   // wrong path, don't retry every body on it
  }
}
log('tries: %s', JSON.stringify(Object.fromEntries(
  Object.entries(R.tries).map(([k,v])=>[k, v.status + (v.requestNow?' -> '+v.requestNow:'')]))));
R.end = await getReq();
log('request ends as %s', JSON.stringify(R.end));
save();
await s.browser.close();
log('done');
