import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/';
const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// 1. week header order
F.weekHeaders=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-header th, .fc-timeline-header-row th')].map(e=>e.innerText.trim().replace(/\n/g,' ')).filter(Boolean));
F.miniWeekdays=await page.evaluate(()=>[...document.querySelectorAll('.mini-calendar__weekday')].map(e=>e.innerText.trim()));
F.firstColClass=await page.evaluate(()=>{const th=[...document.querySelectorAll('.fc-timeline-header-row th')];return th.map(e=>e.className.match(/fc-day-\w+/)?.[0]||'').filter(Boolean);});
// 2. resource column header + department groups
F.resourceHeader=await page.evaluate(()=>document.querySelector('.fc-datagrid-header')?.innerText.trim().replace(/\n/g,' | '));
F.resourceRows=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body .fc-datagrid-cell-cushion')].map(e=>e.innerText.trim()).filter(Boolean));
// 3. toolbar
F.toolbar=await page.evaluate(()=>document.querySelector('.fc-view-harness')?.parentElement?.previousElementSibling?.innerText?.trim().replace(/\n/g,' | '));
// 4. tune = View Options
const tune=await page.$('button:has-text("tune")')||await page.$('.q-btn:has(.material-icons:text("tune"))');
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='tune'); if(b) b.click();});
await page.waitForTimeout(1200);
await page.screenshot({path:E+'02-tune-menu.png'});
F.tuneMenu=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return null;
  return {text:m.innerText.trim(), toggles:[...m.querySelectorAll('.q-toggle,.q-checkbox,.q-item')].map(e=>({t:e.innerText.trim().slice(0,60), aria:e.getAttribute('aria-checked')||e.querySelector('input')?.getAttribute('aria-checked')||'', cls:e.className.toString().slice(0,90)}))};});
await page.keyboard.press('Escape'); await page.waitForTimeout(600);
// 5. space_dashboard = ?
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='space_dashboard'); if(b) b.click();});
await page.waitForTimeout(1200);
await page.screenshot({path:E+'03-dashboard-menu.png'});
F.dashMenu=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return null;
  return {text:m.innerText.trim(), items:[...m.querySelectorAll('.q-item,.q-toggle,.q-checkbox')].map(e=>({t:e.innerText.trim().slice(0,60), aria:e.querySelector('input')?.getAttribute('aria-checked')||''}))};});
await page.keyboard.press('Escape'); await page.waitForTimeout(600);
// 6. conflicts pill
await page.evaluate(()=>{const b=document.querySelector('.conflicts-pill'); if(b) b.click();});
await page.waitForTimeout(1200);
await page.screenshot({path:E+'04-conflicts.png'});
F.conflictMenu=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return m?m.innerText.trim():null;});
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
// 7. search in toolbar
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='search' && e.closest('.fc')===null); if(b) b.click();});
await page.waitForTimeout(1000);
await page.screenshot({path:E+'05-toolbar-search.png'});
F.toolbarSearch=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')].map(e=>({ph:e.placeholder||'',v:e.value}));return i;});
fs.writeFileSync('/tmp/sviu/f-batch1.json',JSON.stringify(F,null,1));
console.log(JSON.stringify(F,null,1));
await browser.close();
