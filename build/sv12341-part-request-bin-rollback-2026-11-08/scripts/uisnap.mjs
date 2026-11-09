// Before/after picture: line set Complete -> one rejected request (missing bin) -> what the Lines tab shows. TAG, WO, LINEP (id prefix), INV, CAT
import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); const p=s.page; const {WO,LINEP,INV,CAT,TAG}=process.env;
const J=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const lines=async()=>((await s.api(`/api/work-orders/lines/${WO}`)).json?.data?.collection||[]); const L=(await lines()).find(x=>x.line_id.startsWith(LINEP)); const LID=L.line_id;
const info=async()=>{ const l=(await lines()).find(x=>x.line_id===LID); return {status:l.status,status_display:l.status_display,parts:(l.part_requests||[]).length,name:l.line_name}; };
console.log('marker',JSON.stringify(await s.marker()));
console.log('complete',(await J('/api/work-orders/lines/change-status',{line_id:LID,status:'complete',workOrderId:WO})).status, JSON.stringify(await info()));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(4000); const box=async()=>p.evaluate(id=>{const e=document.querySelector(`[data-test-id*="${id}"]`); const r=e?.closest('.q-card,.line-card,[class*=line]')?.getBoundingClientRect()||e?.getBoundingClientRect(); return r?{x:r.x,y:r.y,w:r.width,h:r.height}:null},LID);
await p.evaluate(id=>document.querySelector(`[data-test-id*="${id}"]`)?.scrollIntoView({block:'start'}),LID); await p.waitForTimeout(800); fs.writeFileSync(`../ev/${TAG}-box-before.json`,JSON.stringify(await box())); await p.screenshot({path:`../ev/${TAG}-1-before.png`});
const r=await J('/api/work-orders/part/make-request',{work_order:WO,line:LID,description:'ZZAUTOTEST SV12341',part_source_type:'inventory',inventory_part_id:INV,part_category_id:CAT,sell_price:50,quantity:1,bins:[{id:'11111111-2222-4333-8444-555555555555',name:'Nowhere',quantity:1}]});
console.log('rejected request',r.status,JSON.stringify(r.json).slice(0,100),JSON.stringify(await info()));
await p.reload(); await p.waitForTimeout(5000); await p.evaluate(id=>document.querySelector(`[data-test-id*="${id}"]`)?.scrollIntoView({block:'start'}),LID); await p.waitForTimeout(800); fs.writeFileSync(`../ev/${TAG}-box-after.json`,JSON.stringify(await box())); await p.screenshot({path:`../ev/${TAG}-2-after.png`});
console.log('LID',LID); await s.close();
