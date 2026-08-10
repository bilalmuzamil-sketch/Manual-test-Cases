import {boot,APP} from './boot2.mjs';
const {browser,page}=await boot();
const reqs=[];
page.on('request',r=>{const u=r.url(); if(u.includes('/api/reporting/reports/technician-utilization')) reqs.push((u.includes('/daily')?'DAILY':'MAIN')+' '+u.replace(/^https:\/\/[^/]+/,'').slice(0,95));});
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
// --- toolbar labels ---
const tb=await page.evaluate(()=>{const e=document.querySelector('[data-test-id="select_multiple_tu_technician_filter"]');
 return e?{txt:e.innerText.replace(/\s+/g,' ').trim(),aria:e.getAttribute('aria-label')}:'MISSING';});
console.log('TECH FILTER CONTROL:',JSON.stringify(tb));
// --- keyboard on per-row expand (C30418 item3) ---
const rowBtn='[data-test-id="button_tu_expand_57378c17-8f19-42bd-90d3-4bb6c5e607e8"]'; // Alicia Campbell
await page.locator(rowBtn).focus();
const foc1=await page.evaluate((s)=>({active:document.activeElement===document.querySelector(s),aria:document.querySelector(s).getAttribute('aria-expanded'),label:document.querySelector(s).getAttribute('aria-label'),role:document.querySelector(s).getAttribute('role'),tab:document.querySelector(s).getAttribute('tabindex')}),rowBtn);
console.log('ROW BTN focus/state BEFORE:',JSON.stringify(foc1));
await page.keyboard.press('Enter'); await page.waitForTimeout(2500);
const foc2=await page.evaluate((s)=>({aria:document.querySelector(s).getAttribute('aria-expanded'),label:document.querySelector(s).getAttribute('aria-label')}),rowBtn);
console.log('ROW BTN after ENTER:',JSON.stringify(foc2),'rows',await page.evaluate(()=>document.querySelectorAll('tbody tr').length));
await page.keyboard.press('Space'); await page.waitForTimeout(2000);
const foc3=await page.evaluate((s)=>({aria:document.querySelector(s).getAttribute('aria-expanded'),label:document.querySelector(s).getAttribute('aria-label')}),rowBtn);
console.log('ROW BTN after SPACE:',JSON.stringify(foc3),'rows',await page.evaluate(()=>document.querySelectorAll('tbody tr').length));
// --- open technician filter dropdown ---
let b=reqs.length;
await page.locator('[data-test-id="select_multiple_tu_technician_filter"]').first().click(); await page.waitForTimeout(2500);
const menu=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return 'NO MENU';
 return {txt:m.innerText.replace(/\s+/g,' ').trim().slice(0,400),
  items:[...m.querySelectorAll('[data-test-id]')].map(e=>({tid:e.getAttribute('data-test-id'),t:e.innerText.replace(/\s+/g,' ').trim().slice(0,40)})).slice(0,20)};});
console.log('MENU:',JSON.stringify(menu,null,1));
await page.screenshot({path:'/tmp/qa-cookies/tu-techfilter.png'});
console.log('reqs on opening filter:',reqs.length-b);
await browser.close();
