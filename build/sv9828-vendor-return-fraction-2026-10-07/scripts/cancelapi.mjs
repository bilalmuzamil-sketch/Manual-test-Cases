import {ob,j} from './lib.mjs';
const rid=process.argv[2]; const pid=process.argv[3]; const s=await ob();
const q=async()=>(await s.api('/api/inventory/parts/'+pid)).json.data.part.quantity;
const v=await s.api(`/api/part/manual-return-request/${rid}`); console.log('view',v.status,j(v.json,300));
const b=await q(); const r=await s.api(`/api/part/manual-return-request/${rid}/cancel`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
console.log('cancel',r.status,j(r.json,200)); const a=await q(); console.log('stock before',b,'after',a,'restored',+(a-b).toFixed(4));
await s.close();
