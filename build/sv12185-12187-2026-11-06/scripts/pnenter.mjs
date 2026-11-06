// node pnenter.mjs <woId> -> + Add Part on line LINE, type an existing part number PN, wait for the suggestion list, press Enter in the part-number box. Records: save request?, what fills in (description/qty), list state. ../ev/<env>-pnenter.json/.png
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'branch'; const wo=process.argv[2]; const s=await sess(); const p=s.page;
if(E==='prod'){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
const reqs=[]; p.on('request',r=>{ if(/\/api\/work-orders\/part/.test(r.url())&&r.method()==='POST') reqs.push(r.url().replace(/^https:\/\/[^/]+/,'')); });
await s.go('/workorders/'+wo+'/lines'); await p.waitForTimeout(3500); await p.locator('[data-test-id=button_add_part]').nth(+(process.env.LINE||1)).click(); await p.waitForTimeout(1200);
await p.keyboard.type(process.env.PN,{delay:40}); await p.waitForTimeout(1800);
const listBefore=await p.evaluate(()=>[...document.querySelectorAll('[data-inline-part-typeahead] .q-item, .q-menu .q-item, [role=option]')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,60)));
await p.screenshot({path:`../ev/${E}-pnenter-before.png`});
await p.keyboard.press('Enter'); await p.waitForTimeout(2000);
const val=n=>p.locator(`[data-test-id=input_inline_part_${n}]`).last().inputValue().catch(()=>'?');
const r={listBefore,requests:[...reqs],pn:await p.locator('[data-test-id=select_inline_part_number]').last().inputValue().catch(()=>'?'),description:await val('description'),quantity:await val('quantity'),focus:await p.evaluate(()=>{const a=document.activeElement;return a?.getAttribute('data-test-id')||a?.closest('[data-test-id]')?.getAttribute('data-test-id')})};
await p.screenshot({path:`../ev/${E}-pnenter-after.png`});
reqs.length=0; await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
await p.keyboard.type('ZZ desc after pn enter',{delay:30}); await p.keyboard.press('Tab'); await p.waitForTimeout(300); await p.keyboard.type('1',{delay:30});
r.focusBeforeQtyEnter=await p.evaluate(()=>{const a=document.activeElement;return (a?.getAttribute('data-test-id')||a?.closest('[data-test-id]')?.getAttribute('data-test-id'))+'="'+a?.value+'"'});
await p.screenshot({path:`../ev/${E}-qty-before-enter.png`});
await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
r.qtyEnterRequests=[...reqs]; r.qtyEnterToasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')));
r.focusAfterQtyEnter=await p.evaluate(()=>{const a=document.activeElement;return (a?.getAttribute('data-test-id')||a?.closest('[data-test-id]')?.getAttribute('data-test-id'))+'="'+a?.value+'"'});
await p.screenshot({path:`../ev/${E}-qty-after-enter.png`}); console.log(JSON.stringify(r)); fs.writeFileSync(`../ev/${E}-pnenter.json`,JSON.stringify(r,null,1)); await s.close(); process.exit(0);
