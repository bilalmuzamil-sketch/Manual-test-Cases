import * as H from './h.mjs';
import {boot,APP} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const {browser,page,netlog}=await boot();
await page.goto(APP+'/reports/punch-clock-activities',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(13000);
await page.locator('[data-test-id="filter_chip_range"]').first().click({timeout:20000});
await page.waitForTimeout(2500);
R.beforeCustom={url:page.url(),menus:await page.evaluate(()=>[...document.querySelectorAll('.q-menu,.q-dialog')].map(e=>({cls:e.className,vis:e.offsetParent!==null,txt:e.innerText.slice(0,120)})))};
await page.locator('[data-test-id="filter_preset_range_custom"]').first().click({timeout:15000});
await page.waitForTimeout(4500);
R.afterCustomClick={url:page.url(),
  chip:await page.evaluate(()=>{const b=document.querySelector('[data-test-id="filter_chip_range"]');return b?b.innerText.trim().replace(/\n/g,'|'):null;}),
  menus:await page.evaluate(()=>[...document.querySelectorAll('.q-menu,.q-dialog')].map(e=>({cls:e.className,vis:e.offsetParent!==null,txt:e.innerText.slice(0,300)}))),
  allDatePickers:await page.evaluate(()=>[...document.querySelectorAll('.q-date,[class*=date-picker],[class*=calendar]')].map(e=>({cls:e.className,vis:e.offsetParent!==null}))),
  visibleTestIds:await page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent!==null&&/range|date|calendar|custom/i.test(e.getAttribute('data-test-id'))).map(e=>e.getAttribute('data-test-id'))),
  rows:(await H.rows(page)).n};
await page.screenshot({path:'/tmp/frc/shots/dr-07-after-custom.png',fullPage:false});
console.log(JSON.stringify(R.afterCustomClick,null,1).slice(0,2000));
fs.writeFileSync('/tmp/frc/obs/r-daterange-custom.json',JSON.stringify(R,null,1));
await browser.close();
