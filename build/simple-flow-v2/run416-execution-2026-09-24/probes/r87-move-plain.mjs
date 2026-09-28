// Move To Line silently did nothing for a part that is on order. Is that a restriction the product
// enforces, or a control that does not work? Try a part that is NOT on order - one taken from stock -
// and see whether it moves. Same dialog, same button, different part.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dump=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>({line:/line-row-/.test(t.className||'')&&/^\d+\s+more_vert/.test((t.innerText||'').replace(/\s+/g,' ').trim()),
    t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)})));
const whereIs=(rows,needle)=>{let cur=null; for(const r of rows){ if(r.line) cur=r.t.slice(0,34); if(r.t.includes(needle)) return cur; } return null;};
await openWo(page,WO); await page.waitForTimeout(9000);
const before=await dump();
const PART='A427';   // taken from stock, not on order
R.before=whereIs(before,'(1238213) '+PART);
console.log('the stock part is on line:',JSON.stringify(R.before));
const spot=await page.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/\(1238213\)/.test(t.innerText||''));
  if(!row)return null; const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
if(!spot){ console.log('no menu on that part'); await browser.close(); process.exit(0); }
await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(2200);
const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
    .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):[];});
console.log('its menu:',JSON.stringify(items.map(i=>i.t+(i.dis?' [disabled]':''))));
const mv=items.find(i=>/^Move$/i.test(i.t)&&!i.dis);
if(!mv){ console.log('Move is not offered on a stock part either'); await browser.close(); process.exit(0); }
await page.mouse.click(mv.x,mv.y); await page.waitForTimeout(5000);
const f=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const fl=[...d.querySelectorAll('.q-field')].find(x=>/Target Line/i.test(x.innerText||''));
  if(!fl)return null; const r=fl.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
if(f){ await page.mouse.click(f.x,f.y); await page.waitForTimeout(2600);
  const ch=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}));
  console.log('it offers:',JSON.stringify(ch.map(c=>c.t)));
  const want=ch.find(c=>/parts line/i.test(c.t));
  if(want){ await page.mouse.click(want.x,want.y); console.log('chose',JSON.stringify(want.t)); await page.waitForTimeout(2500); } }
const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const all=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}));
  const c=all.filter(a=>a.t&&!a.dis&&!/^(cancel|close|×)$/i.test(a.t));
  if(!c.length)return 'nothing pressable'; c[c.length-1].e.click(); return 'pressed "'+c[c.length-1].t+'"';});
console.log(go); await page.waitForTimeout(8000);
R.msg=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
R.dialogStillOpen=await page.evaluate(()=>!!([...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop()));
console.log('message:',JSON.stringify(R.msg),'| the dialog is still open:',R.dialogStillOpen);
await page.screenshot({path:`${EV}/r87-after-press.png`}).catch(()=>{});
await page.keyboard.press('Escape').catch(()=>{});
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
const after=await dump();
R.after=whereIs(after,'(1238213) '+PART);
console.log('\nthe stock part was on',JSON.stringify(R.before),'and is now on',JSON.stringify(R.after));
R.moved = R.before && R.after && R.before!==R.after;
console.log('>>> a part that is NOT on order moves between lines:',R.moved);
fs.writeFileSync(`${EV}/r87-move-plain.json`,JSON.stringify(R,null,1));
await browser.close();
