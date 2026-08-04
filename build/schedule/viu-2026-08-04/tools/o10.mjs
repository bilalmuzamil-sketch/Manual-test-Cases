import {boot,APP} from './boot.mjs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/';
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const idx=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].findIndex(e=>/10123073/.test(e.innerText)&&!/--conflict/.test(e.className)));
// tooltip
const pos=await page.evaluate(i=>{const r=document.querySelectorAll('.schedule-block')[i].getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},idx);
await page.mouse.move(pos.x,pos.y); await page.waitForTimeout(2000);
console.log('TOOLTIP:',await page.evaluate(()=>document.querySelector('.q-tooltip')?.innerText.trim()));
// switch to Day view on Aug 11 to read the slot the block sits in
await page.mouse.move(10,10); await page.waitForTimeout(600);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='Day'); if(b)b.click();});
await page.waitForTimeout(4000);
// navigate to Aug 11 via mini calendar
await page.evaluate(()=>{const d=[...document.querySelectorAll('.mini-calendar__day')].find(e=>e.innerText.trim()==='11'&&!e.className.includes('outside')); if(d)d.click();});
await page.waitForTimeout(4000);
await page.screenshot({path:E+'29-day-aug11.png'});
const g=await page.evaluate(()=>{
  const b=[...document.querySelectorAll('.schedule-block')].find(e=>/10123073/.test(e.innerText));
  if(!b) return {no:true, hdr:document.querySelector('.fc-timeline-header')?.innerText.trim().slice(0,120)};
  const r=b.getBoundingClientRect();
  const slots=[...document.querySelectorAll('.fc-timeline-slot-lane')].map(s=>{const sr=s.getBoundingClientRect();return{x:sr.x,w:sr.width,t:s.getAttribute('data-time')||''};});
  const lbl=[...document.querySelectorAll('.fc-timeline-slot-cushion')].map(s=>({t:s.innerText.trim(),x:s.getBoundingClientRect().x}));
  const near=lbl.reduce((a,c)=>Math.abs(c.x-r.x)<Math.abs(a.x-r.x)?c:a,lbl[0]);
  return {blockX:r.x,blockW:r.width,nearestLabel:near, dataTimes:slots.slice(0,4)};
});
console.log('DAYVIEW POSITION:',JSON.stringify(g));
await browser.close();
