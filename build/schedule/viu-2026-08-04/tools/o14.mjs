import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,400)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,400)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const inp=await page.$('input[placeholder="Search work orders"]');
await inp.click(); await inp.type('S-13053',{delay:40}); await page.waitForTimeout(2600);
const card=await page.evaluate(()=>{const c=document.querySelector('.sidebar-card'); if(!c)return null; const r=c.getBoundingClientRect(); return {t:c.innerText.trim().replace(/\n/g,' / '),x:r.x+r.width/2,y:r.y+r.height/2};});
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
const br=R.find(r=>/Brittany/.test(r.t)); const thu=C.find(c=>c.cls==='fc-day-thu');
console.log('card',JSON.stringify(card),'row',br&&br.y,'col',thu&&thu.x);
await page.mouse.move(card.x,card.y); await page.mouse.down();
for(let i=1;i<=12;i++){await page.mouse.move(card.x+(thu.x-card.x)*i/12,card.y+(br.y-card.y)*i/12,{steps:2}); await page.waitForTimeout(80);}
await page.mouse.up(); await page.waitForTimeout(3000);
await page.screenshot({path:E+'35-scope-picker.png'});
F.scope=await page.evaluate(()=>{const m=document.querySelector('.q-menu'),d=document.querySelector('.q-dialog');
  const t=m||d; return t?{kind:m?'menu':'dialog',text:t.innerText.trim(),btns:[...t.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean),items:[...t.querySelectorAll('.q-item')].map(e=>e.innerText.trim().replace(/\n/g,' | '))}:null;});
console.log('SCOPE',JSON.stringify(F.scope,null,1));
// choose "Select multiple" if present
if(F.scope){
  const has=await page.evaluate(()=>{const t=document.querySelector('.q-menu')||document.querySelector('.q-dialog'); return [...t.querySelectorAll('*')].some(e=>/Select multiple/i.test(e.innerText||''));});
  F.hasSelectMultiple=has;
  if(has){ await page.evaluate(()=>{const t=document.querySelector('.q-menu')||document.querySelector('.q-dialog'); const e=[...t.querySelectorAll('div,button,span')].find(x=>x.children.length===0&&/Select multiple/i.test(x.innerText||'')); if(e)e.click();});
    await page.waitForTimeout(1400); await page.screenshot({path:E+'36-select-multiple.png'});
    F.selectMultiple=await page.evaluate(()=>{const t=document.querySelector('.q-menu')||document.querySelector('.q-dialog'); return t?{text:t.innerText.trim(),cbs:t.querySelectorAll('.q-checkbox').length}:null;});
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);
}
fs.writeFileSync('/tmp/sviu/f-scope.json',JSON.stringify(F,null,1));
console.log('SELMULT',JSON.stringify(F.selectMultiple,null,1));
console.log('REQS',JSON.stringify(F.reqs).slice(0,900));
await browser.close();
