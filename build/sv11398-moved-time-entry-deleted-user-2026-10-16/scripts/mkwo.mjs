import {start,J,post} from './drv.mjs'; import fs from 'fs';
export async function mkwo(s,lines=['17e46eee-af7d-4aad-8ffd-89e29e72357d','1f91a6d5-1cf2-46fd-8bcd-0813143eb2aa']){
  const r=await post(s,'/api/work-orders/create',{company_id:'b1e75e42-e463-4027-be7a-fe3963cc1c17',vehicle_id:'f0de0c99-152e-45fe-aea5-79e089524f68',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
  const wid=r.json?.data?.work_order_id; for(const c of lines) await post(s,`/api/work-orders/${wid}/lines/create-from-canned-line`,{canned_line_id:c,status:'authorized'});
  const w=(await s.api('/api/work-orders/view/'+wid)).json?.data?.work_order; const d=(await s.api('/api/work-orders/lines/'+wid)).json?.data;
  return {wid,number:w.number.replace('S-','S2-'),lines:(Array.isArray(d)?d:d?.collection||[]).map(l=>({id:l.line_id,name:l.line_name.trim()}))};
}
