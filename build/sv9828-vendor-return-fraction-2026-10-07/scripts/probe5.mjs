import {ob,j} from './lib.mjs';
const s=await ob(); const rid='601395c8-eede-4f32-ba84-8150ca503ae8'; const pid='0019667d-d90f-41ae-a289-78d5a962bb8b';
const q=async()=>(await s.api('/api/inventory/parts/'+pid)).json.data.part.quantity;
for(const k of ['inventory_part_id','part_id','inventoryPartId']){
  const b0=await q(); const r=await s.api('/api/inventory/returns/add-item',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({return_id:rid,quantity:2.5,[k]:pid,price:11.1})});
  const a0=await q(); console.log(k,r.status,j(r.json,150),'MD668D',b0,'->',a0,'drop',+(b0-a0).toFixed(4)); if(b0!==a0) break; }
const v=await s.api('/api/inventory/returns/'+rid); let c=v.json?.data?.content; try{c=JSON.parse(c);}catch(e){} const d=c?.data||c;
console.log('items',j((d.return_details?.items||d.return_items||[]).map(i=>({q:i.quantity,pn:i.part_number,inv:(i.inventory_part_id||'').slice(0,8)})),600));
await s.close();
