import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
await page.waitForTimeout(4500);
F.blocks=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].map((e,i)=>{const r=e.getBoundingClientRect();return{i,t:e.innerText.trim().replace(/\n/g,' / ').slice(0,55),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};}));
console.log(JSON.stringify(F.blocks,null,0));
// click the "continues" chip
const ci=F.blocks.findIndex(b=>/continues/.test(b.t));
console.log('continues idx',ci);
if(ci>=0){
  const b=F.blocks[ci];
  await page.evaluate(i=>document.querySelectorAll(".schedule-block")[i].click(),ci); await page.waitForTimeout(3000);
  await page.screenshot({path:E+'51-continues-modal.png'});
  F.m=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim().slice(0,800),btns:[...d.querySelectorAll('button')].map(x=>x.innerText.trim().replace(/\n/g,' ')).filter(Boolean)}:null;});
  console.log('MODAL',JSON.stringify(F.m,null,1));
  if(F.m){
    await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const x=[...d.querySelectorAll('button')].find(e=>/delete_outline/.test(e.innerText)); x.click();});
    await page.waitForTimeout(2400); await page.screenshot({path:E+'52-delete-scope.png'});
    F.scope=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({t:d.innerText.trim().slice(0,800),btns:[...d.querySelectorAll('button')].map(x=>x.innerText.trim().replace(/\n/g,' ')).filter(Boolean)})));
    console.log('SCOPE',JSON.stringify(F.scope,null,1));
    await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
    F.esc1=await page.evaluate(()=>({n:document.querySelectorAll('.q-dialog').length,t:document.querySelector('.q-dialog')?.innerText.trim().slice(0,80)}));
    console.log('ESC1',JSON.stringify(F.esc1));
  }
}
fs.writeFileSync('/tmp/sviu/f-scopedel.json',JSON.stringify(F,null,1));
await browser.close();
