// SV-11125 Returns > Credits: choose 60 days, reload, which tab? + SV-11124 staff list columns
import {session} from './rec.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const SH=`/tmp/qa11310/ex19/${env}-ret-`;
const s= env==='prod'? await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900}}) : await session({vp:{width:1440,height:900}});
const p=s.page; const log={mk:await s.marker()};
const st=()=>p.evaluate(()=>({url:location.pathname+location.search,active:[...document.querySelectorAll('[data-test-id^=tab_]')].filter(t=>/q-tab--active/.test(t.className)).map(t=>t.innerText.trim()),chips:[...document.querySelectorAll('[data-test-id^=filter_chip_]')].map(c=>c.dataset.testId+':'+c.innerText.replace(/\s+/g,' ').replace('keyboard_arrow_down','').trim())}));
try{
 if(process.argv[3]!=='nostaff'){ await s.go('/administration/staff'); await p.waitForTimeout(4000); } log.staffHeaders=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(h=>h.innerText.replace('arrow_drop_up','').trim())); log.staffImgs=await p.evaluate(()=>document.querySelectorAll('tbody img, tbody .q-avatar').length); await p.screenshot({path:`/tmp/qa11310/ex19/${env}-staff.png`});
 await s.go('/parts/returns'); await p.waitForTimeout(4500); log.r0=await st();
 await p.click('[data-test-id=tab_credits]'); await p.waitForTimeout(3000); log.r1=await st(); await p.screenshot({path:SH+'1-credits.png'});
 const dchip=log.r1.chips.map(c=>c.split(':')[0]).find(t=>/date|range|period|days/i.test(t)); log.dchip=dchip;
 if(dchip){ await p.click(`[data-test-id="${dchip}"]`); await p.waitForTimeout(1200); await p.screenshot({path:SH+'1b-menu.png'}); log.opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu, .q-dialog')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,300))); log.optTids=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-dialog [data-test-id]')].map(e=>e.dataset.testId+':'+e.innerText.replace(/\s+/g,' ').slice(0,30)).slice(0,30));
  const t60=(log.optTids||[]).map(x=>x.split(':')[0]).find(t=>/60/.test(t)); log.pick=t60; if(t60){ await p.click(`[data-test-id="${t60}"]`); await p.waitForTimeout(2500);} else { const el=await p.$('.q-menu >> text=/60/'); if(el){ await el.click(); log.pick='text60'; await p.waitForTimeout(2500);} } await p.keyboard.press('Escape').catch(()=>{}); }
 log.r2=await st(); await p.screenshot({path:SH+'2-60days.png'});
 await p.reload(); await p.waitForTimeout(6000); log.r3=await st(); await p.screenshot({path:SH+'3-reloaded.png'}); await p.click('[data-test-id=tab_credits]'); await p.waitForTimeout(3000); log.r4=await st(); await p.screenshot({path:SH+'4-credits-again.png'});
}catch(e){ log.err=e.message.slice(0,300); }
fs.writeFileSync(`/tmp/qa11310/ex19/x6-${env}.json`,JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
