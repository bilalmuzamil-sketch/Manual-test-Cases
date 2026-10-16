import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(5000);
await p.click('[data-test-id=button_density]'); await p.waitForTimeout(800);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim().replace(/\s+/g,' ')));
console.log(JSON.stringify(items)); await p.keyboard.press('Escape');
const before=await p.evaluate(()=>document.querySelector('[data-test-id=button_density]')?.innerText);
const read=()=>p.evaluate(()=>{const fields=['board_card_number','board_card_field_company_name','board_card_unit','board_card_field_total_price','board_card_field_vehicle','board_card_field_time_estimate','board_card_field_progress','board_card_field_technician'];
 const cards=[...document.querySelectorAll('[data-test-id^=board_card_]')].filter(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id')));
 const agg={}; for(const c of cards){ const r=c.getBoundingClientRect(); for(const f of fields){ const el=c.querySelector(`[data-test-id=${f}]`); if(!el) continue;
   const leaves=[...el.querySelectorAll('*')].filter(x=>x.children.length===0&&x.innerText?.trim()); const tgt=leaves.length?leaves:[el];
   for(const x of tgt){const cs=getComputedStyle(x); const k=f+'|'+cs.fontSize+'|'+cs.fontWeight+'|'+cs.color; agg[k]=(agg[k]||0)+1;} } }
 return {cards:cards.length,h:[...new Set(cards.map(c=>Math.round(c.getBoundingClientRect().height)))].slice(0,6),w:[...new Set(cards.map(c=>Math.round(c.getBoundingClientRect().width)))],agg};});
const out={mk,items,before,dens:{}};
for(const d of ['Compact','Regular','Comfortable']){ await p.click('[data-test-id=button_density]'); await p.waitForTimeout(700);
  const it=p.locator('.q-menu .q-item').filter({hasText:d}).first(); await it.click(); await p.waitForTimeout(2500); await p.keyboard.press('Escape').catch(()=>{});
  out.dens[d]=await read(); await p.screenshot({path:`/tmp/qa11310/b-${d}.png`}); console.log(d,JSON.stringify(out.dens[d])); }
fs.writeFileSync('/tmp/qa11310/b2.json',JSON.stringify(out,null,1)); await s.close();
