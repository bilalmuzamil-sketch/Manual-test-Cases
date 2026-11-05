// usage: node later.mjs <tag> -> WO Lines > line menu > Receive parts > "Receive Later" on every part; then tries completing line2 + WO + invoice
import {sess,post} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.argv[2]; const F=`/tmp/sv11006/seed-${ENV}-${TAG}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8'));
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-later-${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const log=(...a)=>console.log(...a);
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(3500);
await p.locator(`[data-test-id="line_title"]`).nth(1).click({button:'right'}); await p.waitForTimeout(1200);
await p.locator(`[data-test-id="menu-item_receive_parts_${S.line}"]`).click(); await p.waitForTimeout(3500);
const btns=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(b=>b.offsetParent).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().replace(/\s+/g,' ').slice(0,30)));
log(btns.filter(b=>/later|receive|cost/i.test(b))); await p.screenshot({path:OUT+'/modal.png'});
const later=p.locator('.q-dialog').getByText('Receive Later',{exact:true}); const n=await later.count(); log('receive later buttons',n);
for(let i=0;i<n;i++){ await p.locator('.q-dialog').getByText('Receive Later',{exact:true}).first().click(); await p.waitForTimeout(2500); log('after click',i,s.writes.slice(-1)); }
await p.screenshot({path:OUT+'/after-later.png'}); await p.keyboard.press('Escape');
log('story',(await post(s,'/api/work-orders/lines/change-story',{line_id:S.line,tech_story:'ZZAUTOTEST done',work_order_id:S.wo})).status);
const lc=await post(s,'/api/work-orders/lines/change-status',{line_id:S.line,status:'complete'}); log('line2 complete',lc.status,JSON.stringify(lc.json).slice(0,140));
const r=await post(s,'/api/work-orders/change-status',{id:S.wo,status:'complete'}); log('wo complete',r.status,JSON.stringify(r.json).slice(0,140));
if(r.status<300){ const inv=await post(s,'/api/invoices/create',{work_order_id:S.wo}); log('invoice',inv.status,JSON.stringify(inv.json).slice(0,160)); S.invoice=inv.json?.data; fs.writeFileSync(F,JSON.stringify(S,null,1)); }
await s.close(); process.exit(0);
