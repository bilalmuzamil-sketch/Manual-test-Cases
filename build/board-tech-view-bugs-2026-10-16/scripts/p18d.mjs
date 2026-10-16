import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1600,height:900},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const q='S2-33351'; const out={mk};
const search=async()=>{ await p.click('[data-test-id=page_search_toggle]').catch(()=>{}); await p.waitForTimeout(500); await p.keyboard.press('Control+A'); await p.keyboard.type(q,{delay:30}); await p.waitForTimeout(4000); };
const rect=sc=>p.evaluate(sc=>{const c=[...document.querySelectorAll(sc)].find(x=>x.querySelector('.q-badge:not(.q-badge--floating)')); const b=c.querySelector('.q-badge:not(.q-badge--floating)'); const r=b.getBoundingClientRect(); const fl=[...c.querySelectorAll('.q-badge--floating')].map(f=>{const q=f.getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height,t:f.innerText.trim()};}); return {x:r.x,y:r.y,w:r.width,h:r.height,t:b.innerText.trim(),fl};},sc);
await toView(p,'list'); await search(); out.list=await rect('td.cell.status'); await p.mouse.move(1580,880); await p.screenshot({path:'/tmp/qa11310/p18d-list.png'});
await toView(p,'tech_view'); await search();
for(const b of await p.$$('[data-test-id^=button_tech_view_group_toggle_]')){ if(await b.getAttribute('aria-expanded')!=='true'){ await b.click(); await p.waitForTimeout(800);} } await p.waitForTimeout(1500);
for(const d of ['compact','regular','comfortable']){ await dens(p,d); await p.mouse.move(1580,880); await p.waitForTimeout(800); out[d]=await rect('[data-test-id^=tech_view_row_]'); await p.screenshot({path:`/tmp/qa11310/p18d-${d}.png`}); console.log(d,JSON.stringify(out[d]).slice(0,200)); }
await dens(p,'regular'); await p.keyboard.press('Escape'); 
await p.click('[data-test-id=page_search_toggle]').catch(()=>{}); await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await p.waitForTimeout(3000);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/collapse/i.test(lab||'')){ await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);} console.log('collapse now',await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'));
fs.writeFileSync('/tmp/qa11310/p18d.json',JSON.stringify(out,null,1)); console.log('list',JSON.stringify(out.list).slice(0,200)); await s.close();
