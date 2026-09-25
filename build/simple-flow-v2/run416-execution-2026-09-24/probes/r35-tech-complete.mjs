// C44565 item 3 says a Technician in Tech View "cannot complete (they cannot approve), but can still
// pick parts". The lower-permission person DOES see a Complete button. A visible button that refuses
// is a different fact from a button that works - so press it and read what happens (Rule 104: prove
// the instrument, and do not call something present or absent from its look alone).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const R={};
// am I actually in Tech View?
R.view=await page.evaluate(()=>{const t=document.body.innerText;
  return {techViewWord:/Tech View|Tech view/.test(t), toggle:[...document.querySelectorAll('button,.q-btn,.q-toggle')]
    .map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>/tech|view/i.test(x)).slice(0,6)};});
console.log('tech view signals:',JSON.stringify(R.view));
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(9000);
const ls=await page.evaluate(()=>{const s=new Set(),o=[];
  for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if(!i||s.has(i))continue;s.add(i);o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim())});}return o;});
// pick a line that is actually Approved - one was completed by the earlier (void) run
const t=ls.find(l=>l.badges.some(b=>/Approved/i.test(b)))||ls[0];
console.log('pressing Complete on a', t.badges.join('+'), 'line as the lower-permission person');
const before=t.badges.join('+');
await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);
  const b=[...row.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim()));if(b)b.click();},t.id);
await page.waitForTimeout(5000);
R.dialog=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d?{text:(d.innerText||'').replace(/\s+/g,' ').slice(0,320),buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(Boolean)}:null;});
console.log('  dialog:',JSON.stringify(R.dialog));
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-notification__message,[role=alert]')]
  .map(x=>(x.innerText||'').trim()).filter(Boolean));
console.log('  message:',JSON.stringify(R.toast));
await page.screenshot({path:`${EV}/p3k-tech-complete.png`,fullPage:true}).catch(()=>{});
// carry the dialog through if there is one
if(R.dialog){ await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];if(!d)return;
  // "Pick All" comes BEFORE "Complete Line" in the DOM, so a find() over a list containing both picks
  // the wrong one and the line is never completed. Name the button that actually completes.
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Complete Line$/i.test((x.innerText||'').trim()))
       || [...d.querySelectorAll('button,.q-btn')].find(x=>/^(Complete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim()));
  if(b)b.click();});
  await page.waitForTimeout(6000);
  R.toast2=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(x=>(x.innerText||'').trim()).filter(Boolean));
  console.log('  after confirming:',JSON.stringify(R.toast2)); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const after=await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);
  return row?[...row.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()):null;},t.id);
R.before=before; R.after=after;
R.lineActuallyCompleted = !!(after&&after.some(b=>/^Complete$/i.test(b)));
console.log('\n  status before:',before,'| after:',JSON.stringify(after));
console.log('  the technician DID complete the line:',R.lineActuallyCompleted);
fs.writeFileSync(`${EV}/p3k-tech-complete.json`,JSON.stringify(R,null,1));
await browser.close();
