import {ob,j} from './lib.mjs';
const s=await ob(); const rid='601395c8-eede-4f32-ba84-8150ca503ae8';
const q=async id=>(await s.api('/api/inventory/parts/'+id)).json.data.part.quantity; const C='b919e7ca-395c-44aa-828d-43cd362c97ba', M='0019667d-d90f-41ae-a289-78d5a962bb8b';
const b=[await q(C),await q(M)]; let r; for(const k of ['returnId','id','vendor_return_id','vendorReturnId']){ r=await s.api('/api/inventory/returns/delete',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({[k]:rid})}); console.log('key',k,r.status,JSON.stringify(r.json||'').slice(0,120)); if(r.status<300) break; }
const a=[await q(C),await q(M)]; console.log('delete',r.status,j(r.json,150)); console.log('core',b[0],'->',a[0],'+',+(a[0]-b[0]).toFixed(4),'| MD668D',b[1],'->',a[1],'+',+(a[1]-b[1]).toFixed(4));
await s.close();
