// The CUSTOM half: does a custom range apply only when the second date is picked?
import * as H from './h.mjs';
import {boot,APP} from './boot.mjs';
import fs from 'fs';
const R=JSON.parse(fs.readFileSync('/tmp/frc/obs/r-daterange.json','utf8'));
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-daterange.json',JSON.stringify(R,null,1));console.log('..'+n);};
const {browser,page,netlog}=await boot();
await page.goto(APP+'/reports/punch-clock-activities',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(13000);
await page.locator('[data-test-id="filter_chip_range"]').first().click({timeout:20000});
await page.waitForTimeout(2500);
await page.locator('[data-test-id="filter_preset_range_custom"]').first().click({timeout:15000});
await page.waitForTimeout(3500);
const snap=async()=>page.evaluate(()=>{
  const ps=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(e=>e.offsetParent!==null);
  const e=ps[ps.length-1];
  return {text:e?e.innerText.slice(0,600):null,
    hasCalendar:!!(e&&e.querySelector('.q-date,[class*=calendar]')),
    testIds:e?[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).slice(0,30):[],
    days:e?[...e.querySelectorAll('.q-date__calendar-item button,[class*=calendar] button')].map(b=>b.innerText.trim()).filter(Boolean).slice(0,12):[]};});
R.customPanel=await snap();
await H.shot(page,'dr-04-custom-open');
S('custom');
const before=page.url();
// pick a start day then an end day
const days=await page.locator('.q-date__calendar-item button, [class*=calendar] button').all().catch(()=>[]);
R.dayButtons=days.length;
if(days.length>6){
  await days[4].click({timeout:10000}).catch(e=>R.d1err=e.message.slice(0,100));
  await page.waitForTimeout(4000);
  R.afterFirstDate={url:page.url(),urlChanged:page.url()!==before,
    chip:await page.evaluate(()=>{const b=document.querySelector('[data-test-id="filter_chip_range"]');return b?b.innerText.trim().replace(/\n/g,'|'):null;}),
    rows:(await H.rows(page)).n,
    reportCalls:netlog.filter(x=>x.phase==='res'&&/reporting/.test(x.url)).slice(-1).map(x=>x.url.replace(/^https:\/\/[^/]+/,'').slice(0,130))};
  await H.shot(page,'dr-05-first-date');
  const days2=await page.locator('.q-date__calendar-item button, [class*=calendar] button').all().catch(()=>[]);
  if(days2.length>10){ await days2[9].click({timeout:10000}).catch(e=>R.d2err=e.message.slice(0,100)); }
  await page.waitForTimeout(5000);
  R.afterSecondDate={url:page.url(),
    chip:await page.evaluate(()=>{const b=document.querySelector('[data-test-id="filter_chip_range"]');return b?b.innerText.trim().replace(/\n/g,'|'):null;}),
    rows:(await H.rows(page)).n,
    panelOpen:await page.evaluate(()=>[...document.querySelectorAll('.q-menu')].some(e=>e.offsetParent!==null)),
    reportCalls:netlog.filter(x=>x.phase==='res'&&/reporting/.test(x.url)).slice(-1).map(x=>x.url.replace(/^https:\/\/[^/]+/,'').slice(0,150))};
  await H.shot(page,'dr-06-second-date');
}
S('dates');
// restore the default
await page.goto(APP+'/reports/punch-clock-activities',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.locator('[data-test-id="filter_chip_range"]').first().click({timeout:20000});
await page.waitForTimeout(2000);
await page.locator('[data-test-id="filter_preset_range_this_month"]').first().click({timeout:12000}).catch(()=>{});
await page.waitForTimeout(3500);
R.restored={url:page.url(),chip:await page.evaluate(()=>{const b=document.querySelector('[data-test-id="filter_chip_range"]');return b?b.innerText.trim().replace(/\n/g,'|'):null;})};
S('restored');
await browser.close();
