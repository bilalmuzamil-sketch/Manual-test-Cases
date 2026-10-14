import {os,J,post} from './lib.mjs'; import fs from 'fs';
const s=await os(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/workorders'); await p.waitForTimeout(3000);
console.log('location',(await p.locator('[data-test-id="profile_menu_button"]').innerText()).replace(/\s+/g,' '));
const parts=p.locator('[data-test-id="button_desktop_nav_link"]',{hasText:'Parts'}); await parts.click(); await p.waitForTimeout(2000);
console.log('after Parts click url',p.url(),'| visible menu items',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, [role=menuitem], [data-test-id*="nav"]')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').trim()).filter(Boolean).slice(0,20)),500));
const sub=await p.evaluate(()=>[...document.querySelectorAll('a,button,[role=tab]')].filter(e=>e.offsetParent&&/^Inventory$/.test((e.innerText||'').trim())).map(e=>e.tagName+'|'+(e.getAttribute('data-test-id')||'')+'|'+(e.getAttribute('href')||'')));
console.log('Inventory controls',J(sub));
console.log('url',p.url());
const cl=p.locator('[data-test-id^="filter_chip_clear_"]'); for(let i=0;i<4 && await cl.count();i++){ const bb=await cl.first().boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(1500); }
await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(600); await p.keyboard.type('201.6215',{delay:40}); await p.waitForTimeout(3000);
const id='18658006-86a7-4ef0-934c-4668995722bf'; const st=async()=>p.locator(`[data-test-id="stock_quantity_badge_${id}"]`).innerText();
console.log('before',await st());
const line=fs.readFileSync('/home/user/Manual-test-Cases/build/sv10072-vendor-return-add-item-qty-2026-10-14/comment.txt','utf8').match(/\{code:javascript\}\n([\s\S]*?)\n\{code\}/)[1];
const logs=[]; p.on('console',m=>logs.push(m.text())); await p.evaluate(l=>eval(l),line); await p.waitForTimeout(3000); console.log('console printed',J(logs.filter(x=>/^\d{3}$/.test(x))));
await p.reload(); await p.waitForTimeout(4000);
const cl2=p.locator('[data-test-id^="filter_chip_clear_"]'); for(let i=0;i<4 && await cl2.count();i++){ const bb=await cl2.first().boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(1500); }
if(!(await p.locator(`[data-test-id="stock_quantity_badge_${id}"]`).count())){ await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(600); await p.keyboard.type('201.6215',{delay:40}); await p.waitForTimeout(3000); }
console.log('after',await st()); await p.screenshot({path:'ev/WALK-after.png'});
await p.locator(`[data-test-id="button_part_history_${id}"]`).click(); await p.waitForTimeout(3500);
console.log('history top',J(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).filter(Boolean)[0])));
console.log('marker',J(await s.marker(),200)); await s.close();
