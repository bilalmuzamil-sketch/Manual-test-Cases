import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
const shade=()=>page.evaluate(()=>({shadedCells:document.querySelectorAll('.fc-cell-shaded').length,
  rowText:[...document.querySelectorAll('.fc-datagrid-body .fc-datagrid-cell-cushion')].filter(e=>/Ayesha/.test(e.innerText)).map(e=>e.innerText.trim().replace(/\n/g,' '))}));
F.before=await shade();
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='tune'); b.click();});
await page.waitForTimeout(1100);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); [...m.querySelectorAll('.q-toggle')].find(e=>/Tech Hours/.test(e.innerText)).click();});
await page.waitForTimeout(2200); await page.keyboard.press('Escape'); await page.waitForTimeout(1400);
F.techOn=await shade();
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='tune'); b.click();});
await page.waitForTimeout(1100);
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); [...m.querySelectorAll('.q-toggle')].find(e=>/Tech Hours/.test(e.innerText)).click();});
await page.waitForTimeout(1800); await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
F.after=await shade();
console.log('BEFORE',JSON.stringify(F.before),'TECH ON',JSON.stringify(F.techOn),'AFTER',JSON.stringify(F.after));
// +N more popover
const more=await page.evaluate(()=>{const m=[...document.querySelectorAll('.fc-more-link,.fc-timeline-more-link')][0]; if(!m)return null; const r=m.getBoundingClientRect(); return {t:m.innerText.trim(),x:r.x+r.width/2,y:r.y+r.height/2};});
F.moreLink=more; console.log('MORE',JSON.stringify(more));
if(more){ await page.mouse.click(more.x,more.y); await page.waitForTimeout(1800);
  await page.screenshot({path:E+'65-more-popover.png'});
  F.morePopover=await page.evaluate(()=>{const p=document.querySelector('.fc-popover,.q-menu,.q-dialog'); return p?{cls:p.className,text:p.innerText.trim().slice(0,400)}:null;});
  console.log('MORE POPOVER',JSON.stringify(F.morePopover,null,1));
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
// department collapse
const dep=await page.evaluate(()=>{const e=[...document.querySelectorAll('.fc-datagrid-expander')][0]; if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(dep){ const before=await page.evaluate(()=>document.querySelectorAll('.fc-datagrid-body tr').length);
  await page.mouse.click(dep.x,dep.y); await page.waitForTimeout(1800);
  const after=await page.evaluate(()=>document.querySelectorAll('.fc-datagrid-body tr').length);
  F.deptCollapse={before,after}; console.log('DEPT COLLAPSE',JSON.stringify(F.deptCollapse));
  await page.mouse.click(dep.x,dep.y); await page.waitForTimeout(1500);
}
// mini calendar month/year picker + collapse
await page.evaluate(()=>{const b=[...document.querySelectorAll('.mini-calendar button,.mini-calendar__month')].find(e=>/expand_more|2026/.test(e.innerText)); if(b)b.click();});
await page.waitForTimeout(1500);
await page.screenshot({path:E+'66-mini-picker.png'});
F.miniPicker=await page.evaluate(()=>{const m=document.querySelector('.q-menu')||document.querySelector('.mini-calendar__month-grid'); return m?m.innerText.trim().slice(0,300):null;});
console.log('MINI PICKER',JSON.stringify(F.miniPicker));
await page.keyboard.press('Escape'); await page.waitForTimeout(800);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='expand_less'); if(b)b.click();});
await page.waitForTimeout(1400);
await page.screenshot({path:E+'67-mini-collapsed.png'});
F.miniCollapsed=await page.evaluate(()=>({grid:document.querySelectorAll('.mini-calendar__grid').length,days:document.querySelectorAll('.mini-calendar__day').length}));
console.log('MINI COLLAPSED',JSON.stringify(F.miniCollapsed));
fs.writeFileSync('/tmp/sviu/f-batch10.json',JSON.stringify(F,null,1));
await browser.close();
