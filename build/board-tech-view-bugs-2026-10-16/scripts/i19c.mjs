import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const R=sel=>p.evaluate(sel=>{const e=document.querySelector(sel); if(!e) return null; const sv=e.matches('svg')?e:(e.querySelector('svg[data-icon]')||e); const r=sv.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,icon:sv.getAttribute('data-icon')};},sel);
const out={mk};
await toView(p,'tech_view'); await p.mouse.move(1580,980); await p.waitForTimeout(4000);
const pb=await p.$('[data-test-id^=button_tech_view_pin_]'); const pinId=(await pb.getAttribute('data-test-id')).replace('button_tech_view_pin_',''); await pb.click(); await p.waitForTimeout(2500); await p.mouse.move(1580,980); await p.waitForTimeout(800);
out.tv={list:await R('[data-test-id=display_option_list]'),tech:await R('[data-test-id=display_option_tech_view]'),board:await R('[data-test-id=display_option_board_view]'),dens:await R('[data-test-id=button_density]'),
 chev:await R('[data-test-id=button_tech_view_group_toggle_unassigned]'),ua:await R('[data-test-id=tech_view_group_unassigned] svg[data-icon=user-round]'),clip:await R('[data-test-id=tech_view_group_unassigned] svg[data-icon=clipboard-list]'),
 pinoff:await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id^=button_tech_view_pin_]')].find(b=>b.querySelector('svg[data-icon=pin-off]')); if(!b) return null; const r=b.querySelector('svg').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,icon:'pin-off'};}),
 pin:await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id^=button_tech_view_pin_]')].find(b=>b.querySelector('svg[data-icon=pin]')); if(!b) return null; const r=b.querySelector('svg').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,icon:'pin'};}),
 grip:await R('[data-test-id^=tech_view_group_drag_handle_]')};
await p.screenshot({path:'/tmp/qa11310/i19c-tv.png'});
await toView(p,'board_view'); await p.mouse.move(1580,980); await p.waitForTimeout(1500);
out.bv={board:await R('[data-test-id=display_option_board_view]'),dens:await R('[data-test-id=button_density]'),lock:await R('[data-test-id=board_card_lock]'),ua:await R('[data-test-id=board_column_header_unassigned] svg[data-icon=user-round]'),
 pinoff:await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id^=button_board_pin_]')].find(b=>b.querySelector('svg[data-icon=pin-off]')); if(!b) return null; const r=b.querySelector('svg').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,icon:'pin-off'};})};
await p.screenshot({path:'/tmp/qa11310/i19c-bv.png'});
await toView(p,'tech_view'); await p.waitForTimeout(2500); await p.click(`[data-test-id=button_tech_view_pin_${pinId}]`); await p.waitForTimeout(2000); out.unpinned=await p.evaluate(id=>document.querySelector(`[data-test-id=button_tech_view_pin_${id}] svg`)?.getAttribute('data-icon'),pinId);
fs.writeFileSync('/tmp/qa11310/i19c.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,1500)); await s.close();
