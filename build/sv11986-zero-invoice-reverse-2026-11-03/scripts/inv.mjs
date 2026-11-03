import {sess,post} from './common.mjs'; import fs from 'fs'; const [WO,TAG]=process.argv.slice(2); const s=await sess(); const p=s.page;
const I=await post(s,'/api/invoices/create',{work_order_id:WO}); const v=(await s.api('/api/work-orders/view/'+WO)).json?.data; const w=v?.work_order||v;
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000); const badge=await p.locator('[data-test-id="badge_wo_status"]').first().innerText().catch(()=>null); await p.screenshot({path:`ev/${TAG}/03-finance-invoiced.png`});
const R={invoice:I.t,state:[w?.status,w?.invoice_status,w?.total_cost,w?.display_number],badge}; fs.writeFileSync(`ev/${TAG}/invoice.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R)); await s.close(); process.exit(0);
