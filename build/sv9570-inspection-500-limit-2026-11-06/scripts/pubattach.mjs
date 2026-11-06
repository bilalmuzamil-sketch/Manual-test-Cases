import {sess,post,arr} from './common.mjs'; const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3000);
let r={status:'skip',json:{}}; console.log('publish',r.status,JSON.stringify(r.json).slice(0,120));
const lines=arr((await s.api('/api/work-orders/lines/'+process.env.WO)).json?.data); r=await post(s,`/api/work-orders/lines/${lines[0].line_id}/inspections`,{templateId:process.env.TPL}); const id=r.json?.data?.inspection?.id; console.log('attach',r.status,id,JSON.stringify(r.json).slice(0,150));
await s.go('/inspections/'+id); await p.waitForTimeout(8000); console.log('filler count',(await p.locator('[data-test-id="sidebar_meta"]').count()), (await p.evaluate(()=>document.querySelector('[data-test-id="inspection_desktop_filler"]')?.innerText.replace(/\s+/g,' ').slice(0,200))));
await p.screenshot({path:'../ev/branch-instr-filler.png'}); await s.close(); process.exit(0);
