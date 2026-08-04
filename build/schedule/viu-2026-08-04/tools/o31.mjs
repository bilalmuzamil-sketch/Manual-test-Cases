import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const F={};
const ids=async(tag)=>{const v=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].sort()); F[tag]=v; console.log('== '+tag+' ('+v.length+')'); console.log(v.join('\n'));};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await ids('week');
// open menus and collect more
for(const b of ['tune','space_dashboard','search']){
  await page.evaluate(x=>{const e=[...document.querySelectorAll('button')].find(z=>z.innerText.trim()===x); if(e)e.click();},b);
  await page.waitForTimeout(1300); await ids('after_'+b); await page.keyboard.press('Escape'); await page.waitForTimeout(700);
}
await page.evaluate(()=>{const b=document.querySelector('.conflicts-pill'); if(b)b.click();}); await page.waitForTimeout(1300); await ids('conflicts'); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>/Filters/.test(e.innerText)); if(b)b.click();}); await page.waitForTimeout(1300); await ids('sidebarFilters'); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
// shift modal
const i=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].findIndex(e=>!/continues|event/.test(e.innerText)&&!/Part of a series/.test(e.innerText)));
await page.evaluate(x=>document.querySelectorAll('.schedule-block')[x].click(),i);
await page.waitForTimeout(2400); await ids('shiftModal');
await page.keyboard.press('Escape'); await page.waitForTimeout(900);
for(const v of ['Day','Month']){ await page.evaluate(x=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()===x); b.click();},v); await page.waitForTimeout(3800); await ids(v.toLowerCase()); }
fs.writeFileSync('/tmp/sviu/f-testids.json',JSON.stringify(F,null,1));
const all=[...new Set(Object.values(F).flat())].sort();
console.log('=== UNION ('+all.length+') ==='); console.log(all.join('\n'));
fs.writeFileSync('/tmp/sviu/testids-union.json',JSON.stringify(all,null,1));
await browser.close();
