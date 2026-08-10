import {boot,APP} from './boot2.mjs';
const {browser,page}=await boot();
const reqs=[];
page.on('request',r=>{const u=r.url(); if(u.includes('/api/reporting/reports/technician-utilization')) reqs.push((u.includes('/daily')?'DAILY':'MAIN')+' '+u.replace(/^https:\/\/[^/]+/,'').slice(0,95));});
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
const S=()=>page.evaluate(()=>{const rs=[...document.querySelectorAll('tbody tr')];
 const s=rs.find(r=>r.innerText.includes('Summary'));
 return {rows:rs.length,names:rs.map(r=>{const t=r.querySelector('td');return t?t.innerText.replace(/keyboard_arrow_\w+/,'').trim():''}).filter(Boolean),
   summary:s?s.innerText.replace(/\s+/g,' ').trim():'',
   label:(document.querySelector('[data-test-id="select_multiple_tu_technician_filter"]')||{}).innerText};});
const before=await S(); console.log('BEFORE:',JSON.stringify(before));
// open filter and deselect Alicia Campbell
await page.locator('[data-test-id="select_multiple_tu_technician_filter"]').first().click(); await page.waitForTimeout(2000);
let b=reqs.length;
await page.locator('[data-test-id="item_tu_technician_filter_57378c17-8f19-42bd-90d3-4bb6c5e607e8"]').first().click();
await page.waitForTimeout(3000);
console.log('DESELECT Alicia -> report reqs fired:',reqs.length-b);
const after=await S(); console.log('AFTER DESELECT:',JSON.stringify(after));
// deselect a 2nd to check "N technicians" label
b=reqs.length;
await page.locator('[data-test-id="item_tu_technician_filter_05595e82-243a-43df-aa48-cfe314c1c131"]').first().click();
await page.waitForTimeout(2500);
console.log('DESELECT 2nd -> reqs:',reqs.length-b);
const a2=await S(); console.log('LABEL with 4 of 6 selected:',JSON.stringify(a2.label),'rows',a2.rows);
// clear all
b=reqs.length;
await page.locator('[data-test-id="item_clear_all_tu_technician_filter"]').first().click(); await page.waitForTimeout(2500);
const a3=await S(); console.log('CLEAR ALL -> reqs',reqs.length-b,'label',JSON.stringify(a3.label),'rows',a3.rows,'names',JSON.stringify(a3.names));
// select all
b=reqs.length;
await page.locator('[data-test-id="item_select_all_tu_technician_filter"]').first().click(); await page.waitForTimeout(2500);
const a4=await S(); console.log('ALL TECHNICIANS -> reqs',reqs.length-b,'label',JSON.stringify(a4.label),'rows',a4.rows);
console.log('--- ALL REQS ---'); reqs.forEach(r=>console.log('  ',r));
await browser.close();
