import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
const n=await page.evaluate(()=>document.querySelectorAll('.schedule-block').length);
F.res=[];
for(let i=0;i<n;i++){
  const t=await page.evaluate(i=>document.querySelectorAll('.schedule-block')[i].innerText.trim().replace(/\n/g,' / ').slice(0,45),i);
  await page.evaluate(i=>document.querySelectorAll('.schedule-block')[i].click(),i);
  await page.waitForTimeout(2200);
  const d=await page.evaluate(()=>document.querySelector('.q-dialog')?document.querySelector('.q-dialog').innerText.trim().slice(0,90):null);
  F.res.push({i,t,opened:!!d,head:d});
  if(d){await page.keyboard.press('Escape'); await page.waitForTimeout(900);}
}
console.log(JSON.stringify(F.res,null,1));
fs.writeFileSync('/tmp/sviu/f-clickable.json',JSON.stringify(F,null,1));
await browser.close();
