// usage: ENV node fixup.mjs <woId> <tag>  env CANNED -> after a reverse: add a priced line (the customer's correction), then Create Invoice ON SCREEN; read state
import {sess,post} from './common.mjs'; import fs from 'fs';
const [WO,TAG]=process.argv.slice(2); const OUT=`ev/${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const s=await sess(); const p=s.page; const R={marker:await s.marker(),wo:WO};
const st=async()=>{const v=(await s.api('/api/work-orders/view/'+WO)).json?.data; const w=v?.work_order||v; return [w?.status,w?.invoice_status,w?.total_cost,w?.display_number];};
R.start=await st();
const L=await post(s,`/api/work-orders/${WO}/lines/create-from-canned-line`,{canned_line_id:process.env.CANNED,status:'authorized'}); R.line=L.t; const lid=L.j?.data?.line_id;
await post(s,'/api/work-orders/lines/change-story',{line_id:lid,tech_story:'ZZAUTOTEST SV-11986 corrected',work_order_id:WO}); R.lineDone=(await post(s,'/api/work-orders/lines/change-status',{line_id:lid,status:'complete'})).t;
R.complete=(await post(s,'/api/work-orders/change-status',{id:WO,status:'complete'})).t; R.mid=await st();
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000); await p.screenshot({path:`${OUT}/01-finance-before-create.png`});
const ci=p.locator('[data-test-id="button_create_invoice"]'); R.createBtn=await ci.count(); if(R.createBtn){ await ci.first().click(); await p.waitForTimeout(4000);
  R.dlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,160))); const x=p.locator('.q-dialog [data-test-id="button_close_payment_dialog"]').first(); if(await x.count()) await x.click(); await p.waitForTimeout(1500); }
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000); R.badge=await p.locator('[data-test-id="badge_wo_status"]').first().innerText().catch(()=>null); await p.screenshot({path:`${OUT}/02-finance-reinvoiced.png`});
R.end=await st(); fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1)); await s.close(); process.exit(0);
