import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,600)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status(),body:(await r.text()).slice(0,700)});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const inp=await page.$('input[placeholder="Search work orders"]');
await inp.click(); await inp.type('S-14527',{delay:40}); await page.waitForTimeout(2600);
const card=await page.evaluate(()=>{const c=document.querySelector('.sidebar-card');const r=c.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
const br=R.find(r=>/Brittany/.test(r.t)); const mon=C.find(c=>c.cls==='fc-day-mon');
await page.mouse.move(card.x,card.y); await page.mouse.down();
for(let i=1;i<=12;i++){await page.mouse.move(card.x+(mon.x-card.x)*i/12,card.y+(br.y-card.y)*i/12,{steps:2}); await page.waitForTimeout(80);}
await page.mouse.up(); await page.waitForTimeout(2800);
await page.evaluate(()=>{const t=document.querySelector('.q-menu')||document.querySelector('.q-dialog'); const b=[...t.querySelectorAll('button')].find(e=>/Schedule whole work order/.test(e.innerText)); b.click();});
await page.waitForTimeout(2800);
// enumerate the "Schedule" selector options
await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const i=[...d.querySelectorAll('input')][0]; i.click();});
await page.waitForTimeout(1400);
await page.screenshot({path:E+'40-spread-options.png'});
F.spreadOptions=await page.evaluate(()=>{const ms=[...document.querySelectorAll('.q-menu')]; const m=ms[ms.length-1]; return m?[...m.querySelectorAll('.q-item')].map(e=>e.innerText.trim()):null;});
console.log('OPTIONS',JSON.stringify(F.spreadOptions));
await page.keyboard.press('Escape'); await page.waitForTimeout(900);
// expand the preview chip
await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/shifts ·/.test(e.innerText)); if(b)b.click();});
await page.waitForTimeout(1600);
await page.screenshot({path:E+'41-spread-preview-open.png'});
F.previewOpen=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim());
console.log('PREVIEW OPEN',JSON.stringify(F.previewOpen));
// create
await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/^Create \d+ shifts$/.test(e.innerText.trim())); if(b)b.click();});
await page.waitForTimeout(1400);
F.toast=await page.evaluate(()=>({n:document.querySelectorAll('.q-notification').length,t:document.querySelector('.q-notification')?.innerText.trim()||null}));
await page.screenshot({path:E+'42-series-created.png'});
console.log('TOAST',JSON.stringify(F.toast));
await page.waitForTimeout(3500);
F.series=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].filter(e=>/Qispring/.test(e.innerText)).map(e=>({t:e.innerText.trim().replace(/\n/g,' / ').slice(0,90),cls:e.className})));
console.log('SERIES BLOCKS',JSON.stringify(F.series,null,1));
fs.writeFileSync('/tmp/sviu/f-series.json',JSON.stringify(F,null,1));
console.log('REQS',JSON.stringify(F.reqs).slice(0,1500));
await browser.close();
