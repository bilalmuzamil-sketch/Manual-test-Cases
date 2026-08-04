import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,250)});});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// TOOLBAR: Today + arrows per range
const range=()=>page.evaluate(()=>document.querySelector('[data-test-id=text_schedule_range]')?.innerText.trim());
F.rangeWeek=await range();
await page.evaluate(()=>document.querySelector('[data-test-id=button_schedule_next]').click()); await page.waitForTimeout(3200);
F.rangeWeekNext=await range();
await page.evaluate(()=>document.querySelector('[data-test-id=button_schedule_today]').click()); await page.waitForTimeout(3200);
F.rangeToday=await range();
await page.evaluate(()=>{[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Day').click();}); await page.waitForTimeout(3400);
F.rangeDay=await range();
await page.evaluate(()=>document.querySelector('[data-test-id=button_schedule_next]').click()); await page.waitForTimeout(3200);
F.rangeDayNext=await range();
await page.evaluate(()=>{[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Month').click();}); await page.waitForTimeout(3600);
F.rangeMonth=await range();
await page.evaluate(()=>document.querySelector('[data-test-id=button_schedule_next]').click()); await page.waitForTimeout(3400);
F.rangeMonthNext=await range();
console.log('RANGES',JSON.stringify({w:F.rangeWeek,wn:F.rangeWeekNext,t:F.rangeToday,d:F.rangeDay,dn:F.rangeDayNext,m:F.rangeMonth,mn:F.rangeMonthNext},null,1));
await page.evaluate(()=>{[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Week').click();}); await page.waitForTimeout(3200);
await page.evaluate(()=>document.querySelector('[data-test-id=button_schedule_today]').click()); await page.waitForTimeout(2600);
// SIDEBAR card border colour + needs techs
F.card=await page.evaluate(()=>{const c=document.querySelector('[data-test-id=sidebar_work_order_card]'); const cs=getComputedStyle(c);
  return {cls:c.className,borderLeft:cs.borderLeftColor+' '+cs.borderLeftWidth,statusBadge:c.querySelector('[data-test-id^=sidebar_wo_status]')?.innerText.trim(),
    needs:!!c.querySelector('[data-test-id^=sidebar_wo_needs_techs]')};});
F.needsCard=await page.evaluate(()=>{const c=[...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')].find(e=>e.querySelector('[data-test-id^=sidebar_wo_needs_techs]')); return c?{t:c.innerText.trim().replace(/\n/g,' / ').slice(0,90),badge:c.querySelector('[data-test-id^=sidebar_wo_needs_techs]').innerText.trim()}:null;});
console.log('CARD',JSON.stringify(F.card),'NEEDS',JSON.stringify(F.needsCard));
// SPREAD: Until a date / Specific hours fields + Select all
const inp=await page.$('[data-test-id=input_sidebar_search]'); await inp.click(); await inp.fill('S-14531'); await page.waitForTimeout(2500);
const c2=await page.evaluate(()=>{const c=document.querySelector('[data-test-id=sidebar_work_order_card]'); const r=c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:c.innerText.trim().replace(/\n/g,' / ').slice(0,60)};});
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
const tgt=R.find(r=>/Margaret Garcia/.test(r.t))||R.find(r=>/Christian/.test(r.t)); const fri=C.find(c=>c.cls==='fc-day-fri');
console.log('spread card',JSON.stringify(c2),'tgt',tgt&&tgt.y);
if(c2&&tgt&&fri){
  await page.mouse.move(c2.x,c2.y); await page.mouse.down();
  for(let k=1;k<=12;k++){await page.mouse.move(c2.x+(fri.x-c2.x)*k/12,c2.y+(tgt.y-c2.y)*k/12,{steps:2}); await page.waitForTimeout(85);}
  await page.mouse.up(); await page.waitForTimeout(2800);
  // Select multiple -> Select all
  F.scopeSel=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m)return null;
    const b=[...m.querySelectorAll('button,div,span')].find(e=>/Select multiple/.test(e.innerText||'')); if(b)b.click(); return true;});
  await page.waitForTimeout(1400);
  F.selectAll=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return m?{text:m.innerText.trim().slice(0,500),hasSelectAll:/Select all/i.test(m.innerText)}:null;});
  console.log('SELECT ALL',JSON.stringify(F.selectAll,null,1));
  // whole order -> spread step -> Until a date / Specific hours
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  await page.mouse.move(c2.x,c2.y); await page.mouse.down();
  for(let k=1;k<=12;k++){await page.mouse.move(c2.x+(fri.x-c2.x)*k/12,c2.y+(tgt.y-c2.y)*k/12,{steps:2}); await page.waitForTimeout(85);}
  await page.mouse.up(); await page.waitForTimeout(2600);
  await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const b=[...m.querySelectorAll('button')].find(e=>/Schedule whole work order/.test(e.innerText)); b.click();});
  await page.waitForTimeout(2800);
  for(const opt of ['Until a date','Specific hours']){
    await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); [...d.querySelectorAll('input')][0].click();});
    await page.waitForTimeout(1300);
    await page.evaluate(o=>{const ms=[...document.querySelectorAll('.q-menu')]; const m=ms[ms.length-1]; const it=[...m.querySelectorAll('.q-item')].find(e=>e.innerText.includes(o)); if(it)it.click();},opt);
    await page.waitForTimeout(1800);
    await page.screenshot({path:E+'93-spread-'+opt.replace(/\s/g,'-')+'.png'});
    F['spread_'+opt]=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return {text:d.innerText.trim().slice(0,600),inputs:[...d.querySelectorAll('input')].map(i=>({t:i.type,v:i.value}))};});
    console.log(opt,JSON.stringify(F['spread_'+opt],null,1));
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); if(d){const b=[...d.querySelectorAll('button')].find(e=>/^Cancel$/.test(e.innerText.trim())); if(b)b.click();}});
}
fs.writeFileSync('/tmp/sviu/f-batch15.json',JSON.stringify(F,null,1));
console.log('REQS',JSON.stringify(F.reqs));
await browser.close();
