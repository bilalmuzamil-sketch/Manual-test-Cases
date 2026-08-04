import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,500)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,500)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const inp=await page.$('input[placeholder="Search work orders"]');
await inp.click(); await inp.type('S-14527',{delay:40}); await page.waitForTimeout(2600);
const card=await page.evaluate(()=>{const c=document.querySelector('.sidebar-card'); if(!c)return null; const r=c.getBoundingClientRect(); return {t:c.innerText.trim().replace(/\n/g,' / '),x:r.x+r.width/2,y:r.y+r.height/2};});
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
const br=R.find(r=>/Brittany/.test(r.t)); const mon=C.find(c=>c.cls==='fc-day-mon');
console.log('card',JSON.stringify(card));
await page.mouse.move(card.x,card.y); await page.mouse.down();
for(let i=1;i<=12;i++){await page.mouse.move(card.x+(mon.x-card.x)*i/12,card.y+(br.y-card.y)*i/12,{steps:2}); await page.waitForTimeout(80);}
await page.mouse.up(); await page.waitForTimeout(3000);
await page.screenshot({path:E+'37-bigjob-scope.png'});
F.step1=await page.evaluate(()=>{const t=document.querySelector('.q-menu')||document.querySelector('.q-dialog'); return t?t.innerText.trim():null;});
// click "Schedule whole work order"
await page.evaluate(()=>{const t=document.querySelector('.q-menu')||document.querySelector('.q-dialog'); const b=[...t.querySelectorAll('button')].find(e=>/Schedule whole work order/.test(e.innerText)); if(b)b.click();});
await page.waitForTimeout(3000);
await page.screenshot({path:E+'38-spread-step.png'});
F.spread=await page.evaluate(()=>{const t=document.querySelector('.q-dialog')||document.querySelector('.q-menu'); return t?{kind:t.className,text:t.innerText.trim(),btns:[...t.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean),inputs:[...t.querySelectorAll('input')].map(i=>({v:i.value,type:i.type}))}:null;});
console.log('STEP1',JSON.stringify(F.step1));
console.log('SPREAD',JSON.stringify(F.spread,null,1));
// expand the preview if present
await page.evaluate(()=>{const t=document.querySelector('.q-dialog'); if(!t)return; const e=[...t.querySelectorAll('*')].find(x=>x.children.length<=2&&/shifts ·|Preview|expand/i.test(x.innerText||'')); if(e)e.click();});
await page.waitForTimeout(1500);
await page.screenshot({path:E+'39-spread-preview.png'});
F.spreadPreview=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim());
fs.writeFileSync('/tmp/sviu/f-spread.json',JSON.stringify(F,null,1));
console.log('PREVIEW',JSON.stringify(F.spreadPreview));
await browser.close();
