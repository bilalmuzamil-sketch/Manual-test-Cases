import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,320)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,220)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// A) SIDEBAR LINE DRILL-DOWN
await page.evaluate(()=>{const c=[...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')].find(e=>/S-13053/.test(e.innerText))||document.querySelector('[data-test-id=sidebar_work_order_card]'); c.click();});
await page.waitForTimeout(2600);
await page.screenshot({path:E+'70-drilldown.png'});
F.drill=await page.evaluate(()=>({sidebar:document.querySelector('[data-test-id=schedule_sidebar]')?.innerText.trim().slice(0,900),
  ph:[...document.querySelectorAll('input')].map(i=>i.placeholder).filter(Boolean),
  ids:[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(x=>/line|drill|back|tab/i.test(x))}));
console.log('DRILL',JSON.stringify(F.drill,null,1));
// back
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/arrow_back|Back|chevron_left/.test(e.innerText)&&e.closest('[data-test-id=schedule_sidebar]')); if(b)b.click();});
await page.waitForTimeout(1800);
F.afterBack=await page.evaluate(()=>document.querySelectorAll('[data-test-id=sidebar_work_order_card]').length);
console.log('after back cards',F.afterBack);
// B) UNASSIGNED ROW drop
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
console.log('rows tail',JSON.stringify(R.slice(-3)));
const un=R.find(r=>/Unassigned/.test(r.t));
F.unassignedRowPresent=!!un;
if(un){
  await page.evaluate(()=>{const sc=document.querySelector('.fc-datagrid-body')?.closest('.fc-scroller'); if(sc) sc.scrollTop=sc.scrollHeight;});
  await page.waitForTimeout(1200);
  const R2=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
  const un2=R2.find(r=>/Unassigned/.test(r.t));
  const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
  const fri=C.find(c=>c.cls==='fc-day-fri');
  const inp=await page.$('[data-test-id=input_sidebar_search]');
  if(inp){await inp.click(); await inp.fill('S-14879'); await page.waitForTimeout(2400);}
  const card=await page.evaluate(()=>{const c=document.querySelector('[data-test-id=sidebar_work_order_card]'); if(!c)return null; const r=c.getBoundingClientRect(); return {t:c.innerText.trim().replace(/\n/g,' / '),x:r.x+r.width/2,y:r.y+r.height/2};});
  console.log('unassigned target y',un2&&un2.y,'card',JSON.stringify(card));
  if(card&&un2&&fri){
    await page.mouse.move(card.x,card.y); await page.mouse.down();
    for(let i=1;i<=12;i++){await page.mouse.move(card.x+(fri.x-card.x)*i/12,card.y+(un2.y-card.y)*i/12,{steps:2}); await page.waitForTimeout(85);}
    await page.mouse.up(); await page.waitForTimeout(3200);
    await page.screenshot({path:E+'71-unassigned-drop.png'});
    F.unassignedDrop=await page.evaluate(()=>({toast:document.querySelector('.undo-toast')?.innerText.trim().replace(/\n/g,' | ')||null,
      blocks:[...document.querySelectorAll('.schedule-block')].filter(e=>/Xemill/.test(e.innerText)).map(e=>e.innerText.trim().replace(/\n/g,' / '))}));
    console.log('UNASSIGNED DROP',JSON.stringify(F.unassignedDrop,null,1));
  }
}
fs.writeFileSync('/tmp/sviu/f-batch12.json',JSON.stringify(F,null,1));
console.log('REQS',JSON.stringify(F.reqs).slice(0,900));
await browser.close();
