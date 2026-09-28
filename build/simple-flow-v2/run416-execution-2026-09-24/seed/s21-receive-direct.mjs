// Simpler route to a RECEIVED part: the part row itself carries a Receive button ("... 1 Awaiting
// Receive $50.00"). Going through the completion wizard only reaches the receive step when THAT line
// has parts awaiting - the line I drove had none, so the wizard finished and closed.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>120;}).pop();
  if(!d)return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return {text:(d.innerText||'').replace(/\s+/g,' ').trim(),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
      disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||'')})).filter(b=>b.t),
    inputs:[...d.querySelectorAll('input')].filter(vis).map((i,ix)=>({ix,
      label:((i.closest('.q-field')||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,40),
      ph:i.getAttribute('placeholder')||'',val:i.value}))};});
const parts=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .filter(t=>/\b(Received|Picked|In Stock|Awaiting|Ordered|Quoted|Auth To Order)\b/.test(t.innerText||''))
  .map(t=>{const r=t.getBoundingClientRect();
    return {t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,110),
      buttons:[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>{const b=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)};})
        .filter(b=>b.t)};}));
await openWo(page,WO); await page.waitForTimeout(9000);
R.before=(await parts()).map(p=>p.t);
console.log('parts BEFORE:'); R.before.forEach(p=>console.log('   ',p));
const rows=await parts();
const awaiting=rows.find(r=>/Awaiting/.test(r.t) && r.buttons.some(b=>/^Receive$/i.test(b.t)));
if(!awaiting){ console.log('\nno part row offers Receive. rows and their buttons:');
  rows.forEach(r=>console.log('   ',r.t.slice(0,70),'->',JSON.stringify(r.buttons.map(b=>b.t))));
  await browser.close(); process.exit(1); }
const btn=awaiting.buttons.find(b=>/^Receive$/i.test(b.t));
console.log('\npressing Receive on:',awaiting.t.slice(0,70));
await page.mouse.click(btn.x,btn.y); await page.waitForTimeout(7000);
let d=await dlg();
console.log('the window says:',JSON.stringify(d&&d.text.slice(0,300)));
console.log('its inputs:',JSON.stringify(d&&d.inputs));
console.log('its buttons:',JSON.stringify((d&&d.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
await page.screenshot({path:`${EV}/s21-receive-modal.png`}).catch(()=>{});
if(!d){ console.log('no window opened'); await browser.close(); process.exit(1); }
// fill what it asks for
const fill=async(rx,value,label)=>{const ix=(d.inputs||[]).findIndex(i=>rx.test(i.label+' '+i.ph));
  if(ix<0){ console.log('   no field for',label); return false; }
  const box=page.locator('.q-dialog input:visible').nth(ix);
  await box.click({timeout:8000}).catch(()=>{}); await box.fill('').catch(()=>{});
  await box.type(value,{delay:40}); console.log('   typed',label,'=',value); await page.waitForTimeout(1200); return true;};
await fill(/Invoice Number/i,'ZZAUTOTEST-INV-001','the invoice number');
// vendor, if it is asking for one
const vend=(d.inputs||[]).findIndex(i=>/Vendor/i.test(i.label)&&!/Invoice/i.test(i.label));
if(vend>=0){ const box=page.locator('.q-dialog input:visible').nth(vend);
  await box.click().catch(()=>{}); await page.waitForTimeout(2000);
  const opt=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
    if(!m.length)return 'no vendor list'; const r=m[0].getBoundingClientRect(); m[0].click(); return 'picked '+(m[0].innerText||'').trim();});
  console.log('   vendor:',opt); await page.waitForTimeout(1500); }
// tick the parts
const sel=await page.evaluate(()=>{const dd=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const a=[...dd.querySelectorAll('button,.q-btn,a,span')].filter(e=>/^Select All$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(a.length){a[0].click(); return 'pressed Select All';}
  const cb=[...dd.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
  if(cb.length){cb.forEach(c=>c.click()); return 'ticked '+cb.length+' boxes';}
  return 'nothing to tick';});
console.log('   ',sel); await page.waitForTimeout(2500);
d=await dlg();
console.log('   buttons now:',JSON.stringify((d.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
await page.screenshot({path:`${EV}/s21-filled.png`}).catch(()=>{});
const go=await page.evaluate(()=>{const dd=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const b=[...dd.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
    .find(e=>/^Receive Parts?(\s*\(\d+\))?$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b) return 'the receive button is not pressable'; b.click(); return 'pressed '+(b.innerText||'').trim();});
console.log('   ',go); await page.waitForTimeout(7000);
R.afterDialog=(await dlg())?.text?.slice(0,200)||null;
console.log('   after: ',JSON.stringify(R.afterDialog));
await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=(await parts()).map(p=>p.t);
console.log('\nparts AFTER:'); R.after.forEach(p=>console.log('   ',p));
R.receivedCount=R.after.filter(p=>/Received/.test(p)).length;
console.log('\nparts now Received:',R.receivedCount);
await page.screenshot({path:`${EV}/s21-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s21-receive-direct.json`,JSON.stringify(R,null,1));
await browser.close();
