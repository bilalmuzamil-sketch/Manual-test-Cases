import {start,J} from './drv.mjs'; import fs from 'fs';
const s=await start({vp:{width:1440,height:900},record:'/tmp/qa11398/rec/h'}); const p=s.page;
await s.go('/workorders?tab=all'); for(let i=0;i<40;i++){ if(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="board_card_"]')].some(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id'))&&e.getBoundingClientRect().y>150))) break; await p.waitForTimeout(500); } await p.waitForTimeout(2500);
const mk=await s.marker();
await s.caption(`SV-11394 on staging, build ${mk.version}, 16 Oct 2026: Work Orders > All > Board View, window 1440 px wide`,{hold:2500});
const tids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="board_card_"]')].filter(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id'))).filter(e=>{const r=e.getBoundingClientRect(); return r.y>150&&r.bottom<890;}).slice(0,3).map(e=>e.getAttribute('data-test-id')));
const read=t=>p.evaluate(x=>{const e=document.querySelector(`[data-test-id="${x}"]`); const cs=getComputedStyle(e); return {sh:cs.boxShadow,bd:cs.borderTopColor,num:e.querySelector('[data-test-id="board_card_number"]')?.innerText.trim()};},t);
const log=[];
for(const t of tids){ await p.mouse.move(5,880,{steps:5}); await p.waitForTimeout(500); const a=await read(t);
  const b=await p.evaluate(x=>{const r=document.querySelector(`[data-test-id="${x}"]`).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},t); await p.mouse.move(b.x,b.y,{steps:18}); await p.waitForTimeout(900); const h=await read(t);
  log.push({t,a,h}); await s.caption(`Pointer on card ${h.num}: the border turns darker (${a.bd} to ${h.bd}); shadow value: ${h.sh}. No shadow appears.`,{hold:3000}); }
const r=await s.close(); fs.writeFileSync('ev/hrec.json',JSON.stringify({log,r,mk},null,1)); console.log(J({log,r},1500));
