import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&!e.closest('.mini-calendar')); b.click();});
await page.waitForTimeout(4500);
// 1) Escape closes the shift detail modal
const i=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id=schedule_shift_block]')].findIndex(e=>/10123073/.test(e.innerText)));
await page.evaluate(x=>document.querySelectorAll('[data-test-id=schedule_shift_block]')[x].click(),i);
await page.waitForTimeout(2200);
F.modalOpen=await page.evaluate(()=>!!document.querySelector('[data-test-id=dialog_schedule_shift_detail]'));
await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
F.escClosesDetail=await page.evaluate(()=>!document.querySelector('[data-test-id=dialog_schedule_shift_detail]'));
console.log('detail modal open',F.modalOpen,'-> Escape closes it',F.escClosesDetail);
// 2) Escape closes each popover
for(const b of ['tune','space_dashboard']){
  await page.evaluate(x=>{const e=[...document.querySelectorAll('button')].find(z=>z.innerText.trim()===x); e.click();},b);
  await page.waitForTimeout(1200);
  const open=await page.evaluate(()=>!!document.querySelector('.q-menu'));
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  const closed=await page.evaluate(()=>!document.querySelector('.q-menu'));
  F['esc_'+b]={open,closed}; console.log('esc',b,JSON.stringify(F['esc_'+b]));
}
// 3) Enter on the reassign dialog
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const src=await page.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id=schedule_shift_block]')].find(e=>/10123073/.test(e.innerText)&&!/--conflict/.test(e.className)); if(!b)return null; const r=b.getBoundingClientRect(); return{x:r.x+r.width/2,y:r.y+r.height/2};});
const tgt=R.find(r=>/William Johns/.test(r.t));
console.log('src',JSON.stringify(src),'tgt',tgt&&tgt.y);
if(src&&tgt){
  await page.mouse.move(src.x,src.y); await page.mouse.down();
  for(let k=1;k<=10;k++){await page.mouse.move(src.x,src.y+(tgt.y-src.y)*k/10,{steps:2}); await page.waitForTimeout(95);}
  await page.mouse.up(); await page.waitForTimeout(2600);
  F.reassign=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,160)||null);
  console.log('reassign',JSON.stringify(F.reassign));
  if(F.reassign){
    await page.keyboard.press('Enter'); await page.waitForTimeout(2200);
    F.enter=await page.evaluate(()=>({dialogs:document.querySelectorAll('.q-dialog').length,toast:document.querySelector('.undo-toast')?.innerText.trim().replace(/\n/g,' | ')||null}));
    console.log('ENTER ->',JSON.stringify(F.enter));
    if(F.enter.dialogs) await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/^Cancel$/.test(e.innerText.trim())); if(b)b.click();});
  }
}
fs.writeFileSync('/tmp/sviu/f-keyboard.json',JSON.stringify(F,null,1));
await browser.close();
