import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// conflict pill now
await page.evaluate(()=>{const b=document.querySelector('.conflicts-pill'); if(b) b.click();});
await page.waitForTimeout(1300);
F.conflictMenu=await page.evaluate(()=>document.querySelector('.q-menu')?.innerText.trim());
await page.screenshot({path:E+'18-conflicts-after.png'});
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
// find the new shift block (Vuchester Retail 10123073) and open modal
const blk=await page.evaluate(()=>{const b=[...document.querySelectorAll('.schedule-block')].find(e=>/10123073/.test(e.innerText)); if(!b)return null; const r=b.getBoundingClientRect(); return {t:b.innerText.trim().replace(/\n/g,' / '),cls:b.className,x:r.x+r.width/2,y:r.y+r.height/2};});
F.newBlock=blk; console.log('NEWBLOCK',JSON.stringify(blk));
if(blk){ await page.mouse.move(blk.x,blk.y); await page.waitForTimeout(2000);
  F.newTooltip=await page.evaluate(()=>document.querySelector('.q-tooltip')?.innerText.trim());
  await page.screenshot({path:E+'19-conflict-tooltip.png'});
  await page.mouse.click(blk.x,blk.y); await page.waitForTimeout(2200);
  await page.screenshot({path:E+'20-conflict-modal.png'});
  F.newModal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean)}:null;});
  // time pickers
  F.modalInputs=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(i=>({ph:i.placeholder||'',v:i.value,ro:i.readOnly,mask:i.getAttribute('data-mask')||''})));
  // color picker
  await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button')].find(e=>/expand_more/.test(e.innerText)); if(b)b.click();});
  await page.waitForTimeout(1200); await page.screenshot({path:E+'21-color-picker.png'});
  F.colorMenu=await page.evaluate(()=>document.querySelector('.q-menu')?.innerText.trim());
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  // delete
  await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button')].find(e=>/delete_outline/.test(e.innerText)); if(b)b.click();});
  await page.waitForTimeout(1500); await page.screenshot({path:E+'22-delete-confirm.png'});
  F.deleteDialog=await page.evaluate(()=>{const ds=[...document.querySelectorAll('.q-dialog')]; return ds.map(d=>({text:d.innerText.trim().slice(0,500),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean)}));});
  // confirm delete
  await page.evaluate(()=>{const ds=[...document.querySelectorAll(".q-dialog")]; const d=ds[ds.length-1]; if(!d) return; const b=[...d.querySelectorAll('button')].find(e=>/^Delete$|Delete shift|Confirm|Yes/i.test(e.innerText.trim())); if(b)b.click();});
  await page.waitForTimeout(1200);
  F.toastAfterDelete=await page.evaluate(()=>({n:document.querySelectorAll('.q-notification').length,t:document.querySelector('.q-notification')?.innerText.trim()||null}));
  await page.screenshot({path:E+'23-undo-toast.png'});
  await page.waitForTimeout(4000);
  F.toastAfter5s=await page.evaluate(()=>({n:document.querySelectorAll('.q-notification').length,t:document.querySelector('.q-notification')?.innerText.trim()||null}));
}
fs.writeFileSync('/tmp/sviu/f-batch4.json',JSON.stringify(F,null,1));
console.log(JSON.stringify(F,null,1));
await browser.close();
