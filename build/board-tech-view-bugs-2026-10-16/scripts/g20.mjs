import {session,toView} from './rec.mjs'; import fs from 'fs';
const quick=process.argv[2]||'admin';
const s=await session({quick,vp:{width:1440,height:900},dpr:2}); const p=s.page; const mk=await s.marker(); const out={mk,quick};
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2000);
out.who=await p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' '));
const groups=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({id:b.getAttribute('data-test-id').replace('button_tech_view_group_toggle_',''),exp:b.getAttribute('aria-expanded'),cnt:b.closest('[data-test-id^=tech_view_group_]')?.innerText.replace(/\s+/g,' ').slice(0,40)})));
const heads=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>{const id=b.getAttribute('data-test-id').replace('button_tech_view_group_toggle_',''); const h=document.querySelector(`[data-test-id=tech_view_group_drag_handle_${id}]`); return {id,grip:!!h,icon:h?.querySelector('svg')?.getAttribute('data-icon')||null,op:h?getComputedStyle(h).opacity:null};}));
const rows=()=>p.evaluate(()=>{const rr=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))).map(r=>{const id=r.getAttribute('data-test-id').slice(14); const h=document.querySelector(`[data-test-id=tech_view_row_drag_handle_${id}]`); const rb=r.getBoundingClientRect(); const hb=h?.getBoundingClientRect(); return {id,num:document.querySelector(`[data-test-id=tech_view_row_number_link_${id}]`)?.innerText?.trim(),grip:!!h,icon:h?.querySelector('svg')?.getAttribute('data-icon')||null,op:h?getComputedStyle(h).opacity:null,dx:hb?Math.round(hb.x-rb.x):null,w:hb?Math.round(hb.width):null,cur:h?getComputedStyle(h).cursor:null};}); return {n:rr.length,grip:rr.filter(r=>r.grip).length,icons:[...new Set(rr.map(r=>r.icon))],op:[...new Set(rr.map(r=>r.op))],dx:[...new Set(rr.map(r=>r.dx))],cur:[...new Set(rr.map(r=>r.cur))],first:rr.slice(0,3)};});
// collapse everything first
const ca=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); out.collapseLabelStart=ca;
if(/Collapse/i.test(ca)){ await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);} 
const H=await heads(); out.heads={n:H.length,grip:H.filter(h=>h.grip).length,ua:H.find(h=>h.id==='unassigned'),icons:[...new Set(H.map(h=>h.icon))],op:[...new Set(H.map(h=>h.op))]};
const G=await groups(); out.groups=G.slice(0,8);
await p.mouse.move(1430,890); await p.screenshot({path:`/tmp/qa11310/g20-${quick}-heads.png`});
// Unassigned rows
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500); await p.mouse.move(1430,890); await p.waitForTimeout(800);
out.ua=await rows(); await p.screenshot({path:`/tmp/qa11310/g20-${quick}-ua.png`});
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(1500);
// technician group with work orders: first group whose header count > 0
const tg=G.find(g=>g.id!=='unassigned' && / ([1-9]\d*) work order/.test(g.cnt||'')); out.techGroup=tg;
if(tg){ await p.click(`[data-test-id=button_tech_view_group_toggle_${tg.id}]`); await p.waitForTimeout(2500); await p.mouse.move(1430,890); await p.waitForTimeout(800); out.tg=await rows(); await p.screenshot({path:`/tmp/qa11310/g20-${quick}-tg.png`}); await p.click(`[data-test-id=button_tech_view_group_toggle_${tg.id}]`); await p.waitForTimeout(1200);} 
out.collapseLabelEnd=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label');
fs.writeFileSync(`/tmp/qa11310/g20-${quick}.json`,JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,3000)); await s.close();
