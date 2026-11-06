import {sess,post,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500); const lines=arr((await s.api('/api/work-orders/lines/'+process.env.WO)).json?.data);
const r=await post(s,`/api/work-orders/lines/${lines[0].line_id}/inspections`,{templateId:process.env.TPLID}); console.log(r.status, r.json?.data?.inspection?.id); await s.close(); process.exit(0);
