import {ob,j} from './lib.mjs';
const s=await ob(); const pid='0019667d-d90f-41ae-a289-78d5a962bb8b';
const rl=(await s.api('/api/inventory/returns?rowsPerPage=20')).json.data.collection; const zzb=rl.find(x=>x.credit_memo_number==='ZZB');
const q=async()=>(await s.api('/api/inventory/parts/'+pid)).json.data.part.quantity; const b=await q();
const r=await s.api('/api/inventory/returns/add-item',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({return_id:zzb.vendor_return_id,quantity:0.75,inventory_part_id:pid,price:11.1})});
const a=await q(); console.log('gate add-item 0.75',r.status,'MD668D',b,'->',a,'drop',+(b-a).toFixed(4)); await s.close();
