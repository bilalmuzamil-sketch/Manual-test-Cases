import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page,feData}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
F.atoms=feData.fe_permissions.length; F.viewMode=feData.view_mode; F.sched=feData.fe_permissions.filter(c=>/chedule/.test(c));
console.log('AS ROLE atoms',F.atoms,'view_mode',F.viewMode,'sched',JSON.stringify(F.sched));
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.screenshot({path:E+'88-as-technician.png'});
F.url=page.url();
F.nav=await page.evaluate(()=>[...document.querySelectorAll('.desktop-link')].map(e=>e.innerText.trim()));
F.page=await page.evaluate(()=>({
  hasCalendar:!!document.querySelector('[data-test-id=schedule_calendar]'),
  hasSidebar:!!document.querySelector('[data-test-id=schedule_sidebar]'),
  cards:document.querySelectorAll('[data-test-id=sidebar_work_order_card]').length,
  draggableCards:document.querySelectorAll('.sidebar-card--draggable').length,
  blocks:document.querySelectorAll('[data-test-id=schedule_shift_block]').length,
  toolbar:[...document.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(t=>/Today|Day|Week|Month|conflicts|search|tune|space_dashboard/.test(t)),
  bodySnippet:document.body.innerText.slice(0,300)}));
console.log('PAGE',JSON.stringify(F.page,null,1));
// left-click empty cell -> should NOT offer Create Event
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
if(R.length>2&&C.length){
  await page.mouse.click(C[3].x,R[3].y); await page.waitForTimeout(1800);
  F.cellMenu=await page.evaluate(()=>document.querySelector('.q-menu')?.innerText.trim()||null);
  console.log('CELL MENU as role:',JSON.stringify(F.cellMenu));
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
}
// open a shift block -> delete button present?
const bi=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id=schedule_shift_block]')].findIndex(e=>!/continues/.test(e.innerText)));
if(bi>=0){ await page.evaluate(i=>document.querySelectorAll('[data-test-id=schedule_shift_block]')[i].click(),bi); await page.waitForTimeout(2400);
  await page.screenshot({path:E+'89-as-tech-modal.png'});
  F.modal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{hasDelete:!!d.querySelector('[data-test-id=button_shift_detail_delete]'),hasColor:!!d.querySelector('[data-test-id=button_shift_detail_color]'),hasAddNote:!!d.querySelector('[data-test-id=button_shift_detail_add_note]'),startEditable:(()=>{const i=d.querySelector('[data-test-id=input_shift_detail_start_time]'); return i?!i.readOnly&&!i.disabled:null;})(),text:d.innerText.trim().slice(0,300)}:null;});
  console.log('MODAL as role',JSON.stringify(F.modal,null,1));
}
fs.writeFileSync('/tmp/sviu/f-perm-fe.json',JSON.stringify(F,null,1));
await browser.close();
