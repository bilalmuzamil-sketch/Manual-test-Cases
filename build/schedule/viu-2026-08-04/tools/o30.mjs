import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// +1 more
const more=await page.evaluate(()=>{const m=[...document.querySelectorAll('.fc-more-link,.fc-timeline-more-link')][0]; const r=m.getBoundingClientRect(); return {t:m.innerText.trim(),x:r.x+r.width/2,y:r.y+r.height/2};});
await page.mouse.click(more.x,more.y); await page.waitForTimeout(2200);
await page.screenshot({path:E+'68-more-popover.png'});
F.pop=await page.evaluate(()=>{const p=document.querySelector('.fc-popover'); return p?{cls:p.className,html:p.innerHTML.replace(/\s+/g,' ').slice(0,900),text:p.innerText,blocks:p.querySelectorAll('.schedule-block').length,rect:JSON.stringify(p.getBoundingClientRect())}:null;});
console.log('POPOVER',JSON.stringify(F.pop,null,1));
await page.keyboard.press('Escape'); await page.waitForTimeout(900);
// department group header chevron
F.groupRows=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map((tr,i)=>({i,t:tr.innerText.trim().replace(/\n/g,' ').slice(0,40),html:tr.innerHTML.replace(/\s+/g,' ').slice(0,200)})).slice(0,4));
console.log('GROUP ROWS',JSON.stringify(F.groupRows,null,1));
const gh=await page.evaluate(()=>{const tr=[...document.querySelectorAll('.fc-datagrid-body tr')].find(t=>/SERVICE\/PARTS/.test(t.innerText)); const ex=tr.querySelector('.fc-datagrid-expander,.fc-icon'); if(!ex)return null; const r=ex.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,cls:ex.className};});
console.log('expander',JSON.stringify(gh));
const before=await page.evaluate(()=>document.querySelectorAll('.fc-datagrid-body tr').length);
if(gh){ await page.mouse.click(gh.x,gh.y); await page.waitForTimeout(2000);
  const after=await page.evaluate(()=>document.querySelectorAll('.fc-datagrid-body tr').length);
  F.collapse={before,after};
  await page.screenshot({path:E+'69-dept-collapsed.png'});
  console.log('COLLAPSE',JSON.stringify(F.collapse));
  await page.mouse.click(gh.x,gh.y); await page.waitForTimeout(1500);
}
fs.writeFileSync('/tmp/sviu/f-batch11.json',JSON.stringify(F,null,1));
await browser.close();
