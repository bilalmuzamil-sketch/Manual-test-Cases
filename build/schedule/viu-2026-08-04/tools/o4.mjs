import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/';
const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// Filter & Display full expansion
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='space_dashboard'); if(b) b.click();});
await page.waitForTimeout(1000);
F.fdRaw=await page.evaluate(()=>{const m=document.querySelector('.q-menu');return m?m.innerHTML.slice(0,6000):null;});
F.fdItems=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m)return null;
  return [...m.querySelectorAll('.q-item, .q-checkbox, .q-toggle, .q-expansion-item')].map(e=>({t:e.innerText.trim().replace(/\n/g,' / ').slice(0,80),aria:e.querySelector('input')?.getAttribute('aria-checked')||e.getAttribute('aria-checked')||'',cls:e.className.toString().slice(0,70)}));});
await page.screenshot({path:E+'06-fd-open.png'});
// expand each expansion item
await page.evaluate(()=>{document.querySelectorAll('.q-menu .q-expansion-item__toggle-icon, .q-menu .q-item').forEach(e=>{ if(/status|Service/i.test(e.innerText)) e.click(); });});
await page.waitForTimeout(900);
await page.screenshot({path:E+'07-fd-expanded.png'});
F.fdExpanded=await page.evaluate(()=>{const m=document.querySelector('.q-menu');return m?m.innerText.trim():null;});
await page.keyboard.press('Escape'); await page.waitForTimeout(600);
// hover tooltip on a shift
const bb=await page.evaluate(()=>{const b=document.querySelector('.schedule-block'); if(!b) return null; const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:b.innerText.trim()};});
F.firstBlock=bb;
if(bb){ await page.mouse.move(bb.x,bb.y); await page.waitForTimeout(2200);
  await page.screenshot({path:E+'08-tooltip.png'});
  F.tooltip=await page.evaluate(()=>{const t=document.querySelector('.q-tooltip,.schedule-tooltip,[role=tooltip]');return t?{cls:t.className,text:t.innerText.trim()}:null;});
}
// click block -> modal
if(bb){ await page.mouse.click(bb.x,bb.y); await page.waitForTimeout(2000);
  await page.screenshot({path:E+'09-modal.png'});
  F.modal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog');return d?{text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean)}:null;});
}
fs.writeFileSync('/tmp/sviu/f-batch2.json',JSON.stringify(F,null,1));
console.log(JSON.stringify({fdItems:F.fdItems,fdExpanded:F.fdExpanded,tooltip:F.tooltip,modal:F.modal,firstBlock:F.firstBlock},null,1));
await browser.close();
