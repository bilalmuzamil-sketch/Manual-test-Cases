import {boot,APP} from './boot.mjs';
import fs from 'fs';
const F={};
// MOBILE / narrow viewport
{
 const {browser,page}=await boot({tz:'America/Edmonton',viewport:{width:900,height:800}});
 await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForTimeout(9000);
 await page.screenshot({path:'/tmp/sviu/evidence/91-narrow-900.png'});
 F.narrow900=await page.evaluate(()=>({sidebar:!!document.querySelector('[data-test-id=schedule_sidebar]'),
   sidebarVisible:(()=>{const s=document.querySelector('[data-test-id=schedule_sidebar]'); return s?s.getBoundingClientRect().width:0;})(),
   calendar:!!document.querySelector('[data-test-id=schedule_calendar]'),
   hScroll:(()=>{const sc=document.querySelector('.fc-timeline-body')?.closest('.fc-scroller'); return sc?{sw:sc.scrollWidth,cw:sc.clientWidth}:null;})(),
   bodyScrollW:document.documentElement.scrollWidth}));
 console.log('900px',JSON.stringify(F.narrow900));
 await browser.close();
}
{
 const {browser,page}=await boot({tz:'America/Edmonton',viewport:{width:1280,height:800}});
 await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForTimeout(9000);
 await page.screenshot({path:'/tmp/sviu/evidence/92-narrow-1280.png'});
 F.w1280=await page.evaluate(()=>({sidebarW:document.querySelector('[data-test-id=schedule_sidebar]')?.getBoundingClientRect().width||0}));
 console.log('1280px',JSON.stringify(F.w1280));
 // KEYBOARD: Enter confirms a confirmable dialog (reassign)
 const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
 const src=await page.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id=schedule_shift_block]')].find(e=>/10123073/.test(e.innerText)); if(!b)return null; const r=b.getBoundingClientRect(); return{x:r.x+r.width/2,y:r.y+r.height/2};});
 const tgt=R.find(r=>/Margaret|Christian/.test(r.t));
 if(src&&tgt){
  await page.mouse.move(src.x,src.y); await page.mouse.down();
  for(let i=1;i<=10;i++){await page.mouse.move(src.x,src.y+(tgt.y-src.y)*i/10,{steps:2}); await page.waitForTimeout(90);}
  await page.mouse.up(); await page.waitForTimeout(2500);
  F.reassignDlg=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,200)||null);
  console.log('reassign dlg',JSON.stringify(F.reassignDlg));
  if(F.reassignDlg){
    await page.keyboard.press('Enter'); await page.waitForTimeout(2000);
    F.afterEnter=await page.evaluate(()=>({dialogs:document.querySelectorAll('.q-dialog').length,toast:document.querySelector('.undo-toast')?.innerText.trim().replace(/\n/g,' | ')||null}));
    console.log('AFTER ENTER',JSON.stringify(F.afterEnter));
    if(F.afterEnter.dialogs){ await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const b=[...d.querySelectorAll('button')].find(e=>/^Cancel$/.test(e.innerText.trim())); if(b)b.click();}); }
  }
 }
 await browser.close();
}
fs.writeFileSync('/tmp/sviu/f-batch14.json',JSON.stringify(F,null,1));
