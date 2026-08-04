import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(12000);
await page.locator('button.filter-chip:has-text("Status")').first().click();
await page.waitForTimeout(2500);
await page.screenshot({path:'/tmp/fviu/shots/02-status-dropdown.png'});
const d=await page.evaluate(()=>{
  const vis=e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed';
  const cands=[...document.querySelectorAll('div')].filter(e=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();
    return r.width>120&&r.height>60&&r.y>110&&(cs.position==='fixed'||cs.position==='absolute')&&cs.zIndex&&+cs.zIndex>1000;});
  return {n:cands.length, list:cands.slice(0,6).map(e=>({cls:e.className.slice(0,120),z:getComputedStyle(e).zIndex,
    y:Math.round(e.getBoundingClientRect().y),h:Math.round(e.getBoundingClientRect().height),text:e.innerText.slice(0,700)}))};
});
console.log(JSON.stringify(d,null,1));
await browser.close();
