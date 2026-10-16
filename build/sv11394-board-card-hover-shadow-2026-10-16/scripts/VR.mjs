import {start,J} from './drv.mjs'; import fs from 'fs';
const D=JSON.parse(fs.readFileSync('/tmp/qa11394v/durs.json')); const HOLD=k=>Math.round(D[k]*1000)+500;
const s=await start({vp:{width:1440,height:900},record:'/tmp/qa11394v/rec'}); const tLogin=Date.now(); const p=s.page;
await s.go('/workorders?tab=all'); for(let i=0;i<40;i++){ if(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="board_card_"]')].some(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id'))&&e.getBoundingClientRect().y>150))) break; await p.waitForTimeout(500); }
await p.waitForTimeout(1500); await p.mouse.move(700,870);
const mk=await s.marker(); const ev={};
const tids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="board_card_"]')].filter(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id'))).filter(e=>{const r=e.getBoundingClientRect(); return r.y>150&&r.bottom<890;}).filter((e,i,a)=>a.findIndex(o=>Math.abs(o.getBoundingClientRect().x-e.getBoundingClientRect().x)<5)===i).slice(0,3).map(e=>e.getAttribute('data-test-id')));
const read=t=>p.evaluate(x=>{const e=document.querySelector(`[data-test-id="${x}"]`); const cs=getComputedStyle(e); return {sh:cs.boxShadow,bd:cs.borderTopColor,num:e.querySelector('[data-test-id="board_card_number"]')?.innerText.trim(),cls:e.className.includes('no-shadow')};},t);
const ctr=t=>p.evaluate(x=>{const r=document.querySelector(`[data-test-id="${x}"]`).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},t);
const rgb=c=>c.replace(/\s/g,'');
// n1
ev.n1=Date.now(); await s.caption(`SV-11394 · staging build ${mk.version} · 16 Oct 2026 · Work Orders > All > Board View · window 1440 px, 100% zoom`,{hold:HOLD('n1')});
const log=[];
for(const [k,t] of [['n2',tids[0]],['n3',tids[1]],['n4',tids[2]]]){
  ev[k]=Date.now(); const a=await read(t); const c=await ctr(t); await p.mouse.move(c.x,c.y,{steps:20}); await p.waitForTimeout(500); const h=await read(t); log.push({k,t,a,h});
  await s.caption(`Pointer on card ${h.num}: border ${rgb(a.bd)} → ${rgb(h.bd)} · shadow: ${h.sh}`,{hold:HOLD(k)-500}); await p.mouse.move(700,870,{steps:6}); }
// n5: take off no-shadow in this browser only, hover card 1 again
ev.n5=Date.now(); await s.caption(`Showing the expected look: the "no-shadow" setting is taken off the cards in this browser only`,{hold:2500});
await p.evaluate(()=>document.querySelectorAll('.board-card.no-shadow').forEach(e=>e.classList.remove('no-shadow')));
let c=await ctr(tids[0]); await p.mouse.move(c.x,c.y,{steps:20}); await p.waitForTimeout(500); const x5=await read(tids[0]); log.push({k:'n5',x5});
await s.caption(`"no-shadow" taken off (this browser only) · card ${x5.num} on hover · shadow: ${x5.sh}`,{hold:HOLD('n5')-3000});
// n6: put it back, hover again: today's behaviour
ev.n6=Date.now(); await p.mouse.move(700,870,{steps:6}); await p.evaluate(()=>document.querySelectorAll('.board-card').forEach(e=>e.classList.add('no-shadow')));
c=await ctr(tids[0]); await p.mouse.move(c.x,c.y,{steps:16}); await p.waitForTimeout(400); const x6=await read(tids[0]); log.push({k:'n6',x6});
await s.caption(`Expected: border darkens + soft shadow, card does not move · Today (card ${x6.num}): shadow ${x6.sh} → FAILED`,{hold:HOLD('n6')+800});
const r=await s.close(); const out={tLogin,ev,r,mk,log}; fs.writeFileSync('/tmp/qa11394v/run.json',JSON.stringify(out,null,1)); console.log(J({ev,r,log},1600));
