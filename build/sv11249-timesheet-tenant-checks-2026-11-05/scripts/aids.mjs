// usage: node aids.mjs -> org A: one approved work order with lines in the current location (Heavy Duty) and one in Lethbridge; prints wo id/number/workplace and line ids
import {sess,post,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const pick=async(tag)=>{ const r=await s.api('/api/work-orders?limit=15&page=1'); const L=r.json?.data?.work_orders||[]; for(const w of L){ const l=await s.api(`/api/work-orders/lines/${w.id}`); const d=l.json?.data; const lines=Array.isArray(d)?d:(d?.lines||d?.collection||arr(d)); if(lines.length>=1){ console.log(tag,'WO',w.id,w.number||w.work_order_number,w.workplace_id||'', 'lines',lines.slice(0,3).map(x=>x.id+':'+(x.status||'')).join(' ')); return; } } console.log(tag,'none',r.status,JSON.stringify(r.json).slice(0,200)); };
await pick('HD');
await post(s,'/api/iam/change-location',{workplace_id:'f8a8b802-7780-4b16-bf10-343caeb616b2',workplace_timezone:'America/Edmonton'}); await pick('LETH');
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.close(); process.exit(0);
