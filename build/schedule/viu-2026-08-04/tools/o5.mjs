import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
const clickBtn=async(label)=>{await page.evaluate(l=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()===l);if(b)b.click();},label);};
// ---- DAY VIEW
await clickBtn('Day'); await page.waitForTimeout(4000);
await page.screenshot({path:E+'10-day.png'});
F.dayView=await page.evaluate(()=>{
  const sc=document.querySelector('.fc-timeline-body')?.closest('.fc-scroller');
  const slots=[...document.querySelectorAll('.fc-timeline-slot-cushion')].map(e=>e.innerText.trim());
  return {scrollLeft:sc?sc.scrollLeft:null, scrollWidth:sc?sc.scrollWidth:null, clientWidth:sc?sc.clientWidth:null,
    firstSlots:slots.slice(0,14), slotCount:slots.length,
    shaded:document.querySelectorAll('.fc-cell-shaded').length,
    header:document.querySelector('.fc-timeline-header')?.innerText.trim().replace(/\n/g,' ').slice(0,200),
    viewCls:document.querySelector('.fc-view')?.className};
});
// navigate next day
await clickBtn('chevron_right'); await page.waitForTimeout(3500);
F.dayViewNext=await page.evaluate(()=>{const sc=document.querySelector('.fc-timeline-body')?.closest('.fc-scroller');return {scrollLeft:sc?sc.scrollLeft:null, header:document.querySelector('.fc-timeline-header')?.innerText.trim().replace(/\n/g,' ').slice(0,120)};});
await page.screenshot({path:E+'11-day-next.png'});
// ---- MONTH VIEW
await clickBtn('Month'); await page.waitForTimeout(4000);
await page.screenshot({path:E+'12-month.png'});
F.monthView=await page.evaluate(()=>({
  viewCls:document.querySelector('.fc-view')?.className,
  header:document.querySelector('.fc-timeline-header, .fc-col-header')?.innerText.trim().replace(/\n/g,' | ').slice(0,300),
  blocks:[...document.querySelectorAll('.schedule-block')].slice(0,6).map(e=>e.innerText.trim().replace(/\n/g,' / ')),
  capacityBars:document.querySelectorAll('.capacity-bar').length,
  moreLinks:[...document.querySelectorAll('.fc-more-link,.fc-timeline-more-link')].map(e=>e.innerText.trim()).slice(0,5)
}));
// ---- back to week, capacity bar tooltip
await clickBtn('Week'); await page.waitForTimeout(3500);
F.weekCapacity=await page.evaluate(()=>[...document.querySelectorAll('.capacity-bar')].map(e=>({t:e.innerText.trim().replace(/\n/g,' '),title:e.getAttribute('title')||''})).slice(0,10));
const cap=await page.evaluate(()=>{const c=document.querySelectorAll('.capacity-bar')[0];if(!c)return null;const r=c.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
if(cap){await page.mouse.move(cap.x,cap.y);await page.waitForTimeout(2200);
  await page.screenshot({path:E+'13-capacity-tooltip.png'});
  F.capTooltip=await page.evaluate(()=>{const t=document.querySelector('.q-tooltip');return t?t.innerText.trim():null;});}
// ---- sidebar: collapse chevron, search, filters
F.sidebarChevron=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].map(e=>e.innerText.trim()).filter(t=>/expand_less|expand_more|chevron/.test(t));return b;});
F.sidebarSearchPlaceholders=await page.evaluate(()=>[...document.querySelectorAll('input')].map(e=>e.placeholder).filter(Boolean));
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/Filters/.test(e.innerText));if(b)b.click();});
await page.waitForTimeout(1400);
await page.screenshot({path:E+'14-sidebar-filters.png'});
F.sidebarFilters=await page.evaluate(()=>{const m=document.querySelector('.q-menu');return m?m.innerText.trim():null;});
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
// search full WO number
const type=async(ph,v)=>{const el=await page.$(`input[placeholder="${ph}"]`); if(el){await el.click();await el.fill(''); await el.type(v,{delay:40});} return !!el;};
F.searchFullOk=await type('Search work orders','S-9379'); await page.waitForTimeout(2500);
F.searchFullResult=await page.evaluate(()=>({cards:[...document.querySelectorAll('.sidebar-card')].map(e=>e.innerText.trim().split('\n')[0]),empty:document.querySelector('.sidebar__empty,.text-center')?.innerText?.trim()||document.body.innerText.match(/No schedulable[^\n]*/)?.[0]||''}));
await page.screenshot({path:E+'15-search-full.png'});
await type('Search work orders','9379'); await page.waitForTimeout(2500);
F.searchNumResult=await page.evaluate(()=>({cards:[...document.querySelectorAll('.sidebar-card')].map(e=>e.innerText.trim().split('\n')[0])}));
await type('Search work orders','S8685-9379'); await page.waitForTimeout(2500);
F.searchPrefixed=await page.evaluate(()=>({cards:[...document.querySelectorAll('.sidebar-card')].map(e=>e.innerText.trim().split('\n')[0]),empty:document.body.innerText.match(/No schedulable[^\n]*/)?.[0]||''}));
fs.writeFileSync('/tmp/sviu/f-batch3.json',JSON.stringify(F,null,1));
console.log(JSON.stringify(F,null,1));
await browser.close();
