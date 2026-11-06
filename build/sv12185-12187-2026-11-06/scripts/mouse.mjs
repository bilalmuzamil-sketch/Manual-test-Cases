// node mouse.mjs <woId> -> part number typed (list open), then MOUSE-click Description, type, mouse-click Qty, type 1, Enter. ../ev/<env>-mouse.json/.png
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'branch'; const wo=process.argv[2]; const s=await sess(); const p=s.page;
if(E==='prod'){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
const reqs=[]; p.on('request',r=>{ if(/\/api\/work-orders\/part/.test(r.url())&&r.method()==='POST') reqs.push(r.url().replace(/^https:\/\/[^/]+/,'')); });
const out=[];
for(const PN of (process.env.PNS||'').split(',')){ await s.go('/workorders/'+wo+'/lines'); await p.waitForTimeout(3500); await p.locator('[data-test-id=button_add_part]').nth(1).click(); await p.waitForTimeout(1200);
 await p.keyboard.type(PN,{delay:40}); await p.waitForTimeout(1800);
 const listOpen=await p.evaluate(()=>[...document.querySelectorAll('[role=option], .q-menu .q-item')].length);
 await p.locator('[data-test-id=input_inline_part_description]').last().click(); await p.keyboard.type('ZZ mouse desc',{delay:20});
 await p.locator('[data-test-id=input_inline_part_quantity]').last().click(); await p.keyboard.type('1');
 const listAtQty=await p.evaluate(()=>[...document.querySelectorAll('[role=option], .q-menu .q-item')].length);
 await p.screenshot({path:`../ev/${E}-mouse-${PN}-before.png`}); reqs.length=0;
 await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
 const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')));
 const focus=await p.evaluate(()=>{const a=document.activeElement;return (a?.getAttribute('data-test-id')||a?.closest('[data-test-id]')?.getAttribute('data-test-id'))+'="'+a?.value+'"'});
 await p.screenshot({path:`../ev/${E}-mouse-${PN}-after.png`});
 const r={PN,listOpen,listAtQty,requests:[...reqs],toasts,focus}; out.push(r); console.log(JSON.stringify(r)); }
fs.writeFileSync(`../ev/${E}-mouse.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
