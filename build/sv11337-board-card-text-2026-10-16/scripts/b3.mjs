import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(!await p.$('[data-test-id=board_view]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(5000);}
const F=['board_card_number','board_card_field_company_name','board_card_unit','board_card_field_total_price'];
const out={mk,dens:{}};
for(const d of ['Compact','Regular','Comfortable']){ await p.click('[data-test-id=button_density]'); await p.waitForTimeout(700); await p.click(`[data-test-id=option_density_${d.toLowerCase()}]`); await p.waitForTimeout(2500); await p.keyboard.press('Escape').catch(()=>{}); await p.mouse.move(800,980); await p.waitForTimeout(500);
  out.dens[d]=await p.evaluate(F=>{const cards=[...document.querySelectorAll('[data-test-id^=board_card_]')].filter(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id'))&&e.querySelector('[data-test-id=board_card_field_total_price]')&&e.querySelector('[data-test-id=board_card_unit]')?.innerText.trim().length>2&&e.querySelector('[data-test-id=board_card_field_company_name]').innerText.trim().length<28&&e.getBoundingClientRect().y>120&&e.getBoundingClientRect().bottom<990&&e.getBoundingClientRect().right<1590);
    cards.sort((a,b)=>(b.querySelector('[data-test-id=board_card_unit]').innerText.length)-(a.querySelector('[data-test-id=board_card_unit]').innerText.length)); const c=cards[0]; const r=c.getBoundingClientRect(); const f={};
    for(const t of F){const el=c.querySelector(`[data-test-id=${t}]`); const vis=x=>{const b=x.getBoundingClientRect();const cs=getComputedStyle(x);return b.width>2&&b.height>2&&cs.position!=='absolute'&&!/sr-only|visually-hidden/.test(x.className);}; const leaf=[...el.querySelectorAll('*')].filter(x=>x.children.length===0&&x.innerText?.trim()&&vis(x)).pop()||el; const b=leaf.getBoundingClientRect(); const cs=getComputedStyle(leaf); f[t]={x:b.x,y:b.y,w:b.width,h:b.height,txt:leaf.innerText.trim(),fs:cs.fontSize,fw:cs.fontWeight,col:cs.color};}
    return {card:{x:r.x,y:r.y,w:r.width,h:r.height,tid:c.getAttribute('data-test-id'),num:c.querySelector('[data-test-id=board_card_number]').innerText.trim(),n:cards.length},f};},F);
  await p.screenshot({path:`/tmp/qa11310/b3-${d}.png`}); console.log(d,JSON.stringify(out.dens[d].card),JSON.stringify(Object.values(out.dens[d].f).map(x=>[x.txt,x.fs,x.fw])));}
await p.click('[data-test-id=button_density]'); await p.waitForTimeout(700); await p.click('[data-test-id=option_density_regular]'); await p.waitForTimeout(1500);
fs.writeFileSync('/tmp/qa11310/b3.json',JSON.stringify(out,null,1)); await s.close();
