import {prod1,post} from '../common.mjs'; const s=await prod1('/tmp/qa75'); const p=s.page; await p.setViewportSize({width:1900,height:1100});
const box=async id=>p.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},id);
const id=(await post(s,'/api/part-sales',{company_id:'bd77eaa6-963f-43fc-9a91-b950810ebf67'})).j?.data?.[0]?.id; console.log('PS',id);
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3000); if(!(await box('select_part'))){ const b=await box('button_add_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500); }
let b=await box('select_part'); await p.mouse.click(b.x,b.y); await p.keyboard.type('1237944',{delay:60}); await p.waitForTimeout(3000);
const o=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>/1237944/.test(x.innerText)&&/Inventory/.test(x.innerText)); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(o.x,o.y); await p.waitForTimeout(2000);
const bins=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id'))); if(bins.length){ const l=p.locator(`[data-test-id="${bins[0]}"]`); const tag=await l.evaluate(e=>e.tagName); await (tag==='INPUT'?l:l.locator('input')).fill('1'); }
b=await box('button_workorder_part_save'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3500);
const v=(await s.api('/api/work-orders/view/'+id)).json?.data?.work_order||{}; console.log('STATE',v.display_number,v.status,'contact',v.customer_id); console.log('PORTAL btn',!!(await box('button_send_to_portal')));
await s.close(); process.exit(0);
