import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
// A) LOCATION business hours
await page.goto(APP+'/administration/locations',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(7000);
await page.screenshot({path:E+'81-locations.png'});
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,i,span,td')].find(e=>/edit_note|edit/.test(e.innerText||'')); if(b)b.click();});
await page.waitForTimeout(4500);
await page.screenshot({path:E+'82-location-edit.png',fullPage:true});
F.loc=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,1600)||document.body.innerText.slice(0,900));
console.log('LOCATION',JSON.stringify(F.loc));
F.locIds=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(x=>/hour|business|day/i.test(x)));
console.log('LOC IDS',JSON.stringify(F.locIds));
// turn on business hours toggle + create an overlap
const bt=await page.evaluate(()=>{const d=document.querySelector('.q-dialog')||document.body; const t=[...d.querySelectorAll('.q-toggle,.q-checkbox')].find(e=>/business hours/i.test(e.innerText)); if(t){t.click(); return t.innerText.trim();} return null;});
console.log('BUSINESS TOGGLE',JSON.stringify(bt));
if(bt){
  await page.waitForTimeout(2000); await page.screenshot({path:E+'83-business-hours.png',fullPage:true});
  F.bh=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,1400));
  console.log('BH',JSON.stringify(F.bh));
  // add a 2nd monday range that overlaps
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_business_hours_monday],[data-test-id=button_add_working_hours_monday]'); if(b)b.click();});
  await page.waitForTimeout(1400);
  F.ranges=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id*=business_hours],[data-test-id*=working_hours]')].map(e=>({id:e.getAttribute('data-test-id'),v:e.value||''})));
  console.log('RANGES',JSON.stringify(F.ranges).slice(0,900));
  // set both monday ranges to overlap
  const set=async(id,v)=>{const el=await page.$(`[data-test-id="${id}"]`); if(el){await el.fill(v);} return !!el;};
  const ids=F.ranges.map(r=>r.id).filter(i=>/monday/.test(i)&&/start|end/.test(i));
  console.log('monday ids',JSON.stringify(ids));
  if(ids.length>=4){ await set(ids[0],'08:00'); await set(ids[1],'12:00'); await set(ids[2],'11:00'); await set(ids[3],'15:00'); }
  await page.waitForTimeout(1800); await page.screenshot({path:E+'84-overlap.png',fullPage:true});
  F.overlapMsg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?(d.innerText.match(/These hours overlap[^\n]*/)?.[0]||d.innerText.match(/overlap[^\n]*/i)?.[0]||null):null;});
  console.log('OVERLAP MSG',JSON.stringify(F.overlapMsg));
  // close WITHOUT saving
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const c=[...d.querySelectorAll('button')].find(e=>/^close$/i.test(e.innerText.trim())); if(c)c.click();});
  await page.waitForTimeout(1500);
  F.closedWithoutSave=await page.evaluate(()=>document.querySelectorAll('.q-dialog').length);
  console.log('closed w/o save, dialogs:',F.closedWithoutSave);
}
fs.writeFileSync('/tmp/sviu/f-location.json',JSON.stringify(F,null,1));
await browser.close();
