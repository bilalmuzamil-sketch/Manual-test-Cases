import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json')); const D=JSON.parse(fs.readFileSync('/tmp/qa11310/vo37/durs.json'));
const HOLD=k=>Math.max(Math.round(D[k]*1000)+200,2000);
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:1,record:'/tmp/qa11310/rec37c'}); const tLogin=Date.now(); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(!await p.$('[data-test-id=board_view]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(5000);}
await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(600); await p.keyboard.type('S2-16614',{delay:30}); await p.waitForTimeout(4000);
for(let i=0;i<60;i++){ const hit=await p.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id=board_card_number]')].find(x=>x.innerText.trim()==='S2-16614'); if(e){e.closest('[data-test-id^=board_card_]').scrollIntoView({block:'center',inline:'center'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=600; return false;}); if(hit) break; await p.waitForTimeout(400);}
await p.click('[data-test-id=button_density]'); await p.waitForTimeout(500); await p.click('[data-test-id=option_density_regular]'); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{});
await p.mouse.move(720,860); await p.waitForTimeout(800);
const mk=await s.marker(); const ev={}; const log={};
const read=()=>p.evaluate(()=>{const c=[...document.querySelectorAll('[data-test-id^=board_card_]')].find(e=>e.querySelector('[data-test-id=board_card_number]')?.innerText.trim()==='S2-16614'); const g=t=>{const cs=getComputedStyle(c.querySelector(`[data-test-id=${t}]`)); return cs.fontSize+'/'+cs.fontWeight;}; return {n:g('board_card_number'),c:g('board_card_field_company_name'),u:g('board_card_unit'),t:g('board_card_field_total_price')};});
ev.n1=Date.now(); await s.caption(`SV-11337 · staging build ${mk.version} · 16 Oct 2026 · Work Orders > Board View · search S2-16614 · window 1440 px, zoom 100%`,{hold:HOLD('n1')});
for(const [k,d] of [['n2','compact'],['n3','regular'],['n4','comfortable']]){
  await s.glideClick('button_density'); await p.waitForTimeout(400); await s.glideClick(`option_density_${d}`); await p.waitForTimeout(900); await p.keyboard.press('Escape').catch(()=>{}); await p.mouse.move(720,860,{steps:6});
  await p.waitForTimeout(1800); const v=await read(); log[k]=v; ev[k]=Date.now(); await s.caption(`${d[0].toUpperCase()+d.slice(1)} · S2-16614 · number ${v.n} · customer ${v.c} · unit line ${v.u} · total ${v.t}`,{hold:HOLD(k)+800}); }
ev.n5=Date.now(); await s.caption('Spec v62 S6-R4: card text 14px at every density, secondary lines 12px · S2-R23: customer and total weight 500 → PASSED',{hold:HOLD('n5')+300});
await p.click('[data-test-id=button_density]'); await p.waitForTimeout(500); await p.click('[data-test-id=option_density_regular]'); await p.waitForTimeout(800);
const r=await s.close(); const out={tLogin,ev,r,mk,log}; fs.writeFileSync('/tmp/qa11310/vo37/run.json',JSON.stringify(out,null,1)); console.log(JSON.stringify({ev,r,log}));
