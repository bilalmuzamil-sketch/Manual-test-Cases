import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({t:th.innerText.trim().replace(/\n/g,' '),cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
const br=R.find(r=>/Brittany/.test(r.t)); const wed=C.find(c=>c.cls==='fc-day-wed');
console.log('row',JSON.stringify(br),'col',JSON.stringify(wed));
await page.mouse.click(wed.x,br.y); await page.waitForTimeout(1800);
await page.screenshot({path:E+'31-cell-click.png'});
F.afterCellClick=await page.evaluate(()=>({
  menu:document.querySelector('.q-menu')?document.querySelector('.q-menu').innerText.trim():null,
  menuItems:document.querySelector('.q-menu')?[...document.querySelector('.q-menu').querySelectorAll('.q-item')].map(e=>e.innerText.trim()):null,
  dialog:document.querySelector('.q-dialog')?document.querySelector('.q-dialog').innerText.trim().slice(0,900):null,
  dialogBtns:document.querySelector('.q-dialog')?[...document.querySelector('.q-dialog').querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean):null,
  dialogInputs:document.querySelector('.q-dialog')?[...document.querySelector('.q-dialog').querySelectorAll('input')].map(i=>({ph:i.placeholder||'',v:i.value,type:i.type})):null,
  labels:document.querySelector('.q-dialog')?[...document.querySelector('.q-dialog').querySelectorAll('.q-field__label,label')].map(l=>l.innerText.trim()):null,
  toggles:document.querySelector('.q-dialog')?[...document.querySelector('.q-dialog').querySelectorAll('.q-toggle,.q-checkbox')].map(t=>({t:t.innerText.trim(),a:t.querySelector('input')?.getAttribute('aria-checked')})):null
}));
console.log('AFTER CELL CLICK', JSON.stringify(F.afterCellClick,null,1));
// Escape test
await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
F.escClosed=await page.evaluate(()=>({menu:!!document.querySelector('.q-menu'),dialog:!!document.querySelector('.q-dialog')}));
console.log('ESC ->',JSON.stringify(F.escClosed));
fs.writeFileSync('/tmp/sviu/f-cellmenu.json',JSON.stringify(F,null,1));
await browser.close();
