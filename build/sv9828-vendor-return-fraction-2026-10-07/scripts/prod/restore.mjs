import {op,j} from '../lib.mjs'; import fs from 'fs';
const O=JSON.parse(fs.readFileSync('prod/orig.json')); const W=JSON.parse(fs.readFileSync('prod/wo.json')); const M=JSON.parse(fs.readFileSync('prod/manual.json'));
const ZZ={id:'0fd577b1-d57b-4806-b5a3-068c247dde03',q:7,bin:'1295e623-479b-11f1-9bed-020a144de1a3'};
const s=await op(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const q=async id=>(await s.api('/api/inventory/parts/'+id)).json.data.part.quantity;
const mid=M.tid.replace('button_manual_return_actions_','');
const c=await P(`/api/part/manual-return-request/${mid}/cancel`,{}); console.log('cancel manual',c.status,'ZZT now',await q(ZZ.id));
const rl=(await s.api('/api/inventory/returns?rowsPerPage=20')).json.data.collection; const vr=rl.find(x=>x.credit_memo_number==='ZZ9828PROD'); console.log('vendor return',vr&&vr.vendor_return_id);
if(vr){ const d=await P('/api/inventory/returns/delete',{id:vr.vendor_return_id}); console.log('delete return',d.status,'core now',await q(O.core.id)); }
const L=(await s.api('/api/work-orders/lines/'+W.wo)).json.data.collection; for(const l of L) for(const pt of (l.parts||[])){ const r=await P('/api/work-orders/parts/delete',{part_id:pt.id,work_order_id:W.wo}); console.log('remove part',pt.part_number,r.status,j(r.json,120)); }
console.log('main now',await q(O.main.id));
let dw=await P('/api/work-orders/delete',{work_order_id:W.wo}); if(dw.status>=300){ await P('/api/work-orders/change-status',{id:W.wo,status:'estimate'}); dw=await P('/api/work-orders/delete',{work_order_id:W.wo}); } console.log('delete WO',dw.status,j(dw.json,120));
const fix=[]; for(const [id,orig,bin] of [[O.main.id,O.main.q,O.main.bins[0].binLocationId],[O.core.id,O.core.q,O.core.bins[0].binLocationId],[ZZ.id,ZZ.q,ZZ.bin]]){ const now=await q(id); if(Number(now)!==Number(orig)) fix.push({id,bins:[{id:bin,quantity:orig}]}); console.log(id.slice(0,8),'now',now,'orig',orig); }
if(fix.length){ const r=await P('/api/inventory/parts/cycle-count',{part_quantities:fix}); console.log('cycle-count fix',r.status); }
for(const [id,orig] of [[O.main.id,O.main.q],[O.core.id,O.core.q],[ZZ.id,ZZ.q]]) console.log('FINAL',id.slice(0,8),await q(id),'== orig',orig, (await q(id))==orig);
const wv=await s.api('/api/work-orders/view/'+W.wo); console.log('WO re-read',wv.status);
await s.close();
