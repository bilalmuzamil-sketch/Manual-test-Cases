import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={reqs:[]};
page.on('request',r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.method()!=='GET') F.reqs.push({m:r.method(),u:u.replace(/^https:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,300)});});
page.on('response',async r=>{const u=r.url(); if(u.includes('/api/schedule')&&r.request().method()!=='GET'){try{F.reqs.push({res:r.status()});}catch{}}});
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const rows=async()=>page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
// 1) REASSIGN: drag the Tuesday Vuchester block from Ayesha to Colleen
const R=await rows();
const src=await page.evaluate(()=>{const b=[...document.querySelectorAll('.schedule-block')].find(e=>/10123073/.test(e.innerText)&&!/--conflict/.test(e.className)); const r=b.getBoundingClientRect(); return{x:r.x+r.width/2,y:r.y+r.height/2};});
const cg=R.find(r=>/Colleen/.test(r.t));
console.log('src',JSON.stringify(src),'colleen y',cg&&cg.y);
await page.mouse.move(src.x,src.y); await page.mouse.down();
for(let i=1;i<=12;i++){await page.mouse.move(src.x,src.y+(cg.y-src.y)*i/12,{steps:2}); await page.waitForTimeout(90);}
await page.waitForTimeout(600);
F.duringMove=await page.evaluate(()=>({mirror:document.querySelectorAll('.fc-event-mirror').length,highlight:document.querySelectorAll('.fc-highlight').length}));
await page.mouse.up(); await page.waitForTimeout(2800);
await page.screenshot({path:E+'59-reassign.png'});
F.reassign=await page.evaluate(()=>({dialog:document.querySelector('.q-dialog')?.innerText.trim().slice(0,600)||null,
  btns:document.querySelector('.q-dialog')?[...document.querySelector('.q-dialog').querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean):null,
  toast:document.querySelector('.undo-toast')?.innerText.trim().replace(/\n/g,' | ')||null}));
console.log('DURING MOVE',JSON.stringify(F.duringMove));
console.log('REASSIGN',JSON.stringify(F.reassign,null,1));
// confirm/cancel
if(F.reassign.dialog){
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/^Cancel$/.test(e.innerText.trim())); if(b)b.click();});
  await page.waitForTimeout(1500);
  F.afterCancelReassign=await page.evaluate(()=>document.querySelectorAll('.q-dialog').length);
}
// 2) toolbar search fade/highlight
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='search'&&e.closest('.fc')===null&&!e.closest('.schedule-sidebar')); if(b)b.click();});
await page.waitForTimeout(1200);
F.gridSearchPh=await page.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.placeholder).filter(Boolean));
const gi=await page.$$('input');
for(const el of gi){const ph=await el.getAttribute('placeholder'); if(ph&&/grid|shift|Search/i.test(ph)&&ph!=='Search work orders'){await el.click(); await el.type('Pamill',{delay:40}); break;}}
await page.waitForTimeout(2200);
await page.screenshot({path:E+'60-grid-search.png'});
F.gridSearch=await page.evaluate(()=>{const bs=[...document.querySelectorAll('.schedule-block')]; return {n:bs.length,classes:[...new Set(bs.map(b=>b.className))].slice(0,8)};});
console.log('GRID SEARCH PH',JSON.stringify(F.gridSearchPh));
console.log('GRID SEARCH',JSON.stringify(F.gridSearch,null,1));
fs.writeFileSync('/tmp/sviu/f-batch8.json',JSON.stringify(F,null,1));
console.log('REQS',JSON.stringify(F.reqs));
await browser.close();
