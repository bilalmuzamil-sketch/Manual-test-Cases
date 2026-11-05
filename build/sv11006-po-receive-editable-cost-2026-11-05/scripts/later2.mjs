// usage: node later2.mjs <tag> [noinvoice] -> WO Receive parts window > "Receive Later" on every part (screen); complete all lines + WO; invoice
import {sess,post} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.argv[2]; const F=`/tmp/sv11006/seed-${ENV}-${TAG}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8'));
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-later-${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const log=(...a)=>console.log(...a);
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(3500);
await p.locator(`[data-test-id="line_title"]`).nth(Number(process.env.LI??1)).click({button:'right'}); await p.waitForTimeout(1200);
await p.locator(`[data-test-id="menu-item_receive_parts_${S.line}"]`).click(); await p.waitForTimeout(3500); await p.screenshot({path:OUT+'/modal.png'});
const n0=s.writes.length;
for(let k=0;k<4;k++){ const b=p.locator('.q-dialog [data-test-id^="button_received_later_"]'); const c=await b.count(); if(!c) break; const id=await b.first().getAttribute('data-test-id'); await b.first().click(); await p.waitForTimeout(2000);
  const dl=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,160))); log('clicked',id,'dialogs',dl.length,dl.slice(-1));
  const conf=p.locator('.q-dialog button').filter({hasText:/^(Yes|Confirm|Are You Sure\?)$/}); if(await conf.count()){ await conf.last().click(); await p.waitForTimeout(2000);} }
log('later writes',JSON.stringify(s.writes.slice(n0).map(w=>w.slice(0,200)))); await p.screenshot({path:OUT+'/after-later.png'}); await p.keyboard.press('Escape');
for(const l of S.lines){ await post(s,'/api/work-orders/lines/change-story',{line_id:l,tech_story:'ZZAUTOTEST done',work_order_id:S.wo}); const r=await post(s,'/api/work-orders/lines/change-status',{line_id:l,status:'complete',workOrderId:S.wo}); log('line complete',l.slice(0,6),r.status,JSON.stringify(r.json).slice(0,120)); }
const r=await post(s,'/api/work-orders/change-status',{id:S.wo,status:'complete'}); log('wo complete',r.status,JSON.stringify(r.json).slice(0,160));
if(r.status<300&&process.argv[3]!=='noinvoice'){ const inv=await post(s,'/api/invoices/create',{work_order_id:S.wo}); log('invoice',inv.status,JSON.stringify(inv.json).slice(0,160)); S.invoice=inv.json?.data; }
fs.writeFileSync(F,JSON.stringify(S,null,1)); await s.close(); process.exit(0);
