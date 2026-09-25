// Closer. Complete opens the wizard at "Resolve cores", with "Receive parts (5)" as the NEXT step.
// Clicking that step label does not advance it - the step has to be cleared first, which is what
// "Continue Without Resolving" is for. Walk it through and read the receive step properly.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='035df665-3843-411c-b5cc-c6a01a1b09b2';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
const grab=async()=>await page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>120;}).pop();
  if(!d) return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return { text:(d.innerText||'').replace(/\s+/g,' ').trim(),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    fields:[...d.querySelectorAll('.q-field')].filter(vis).map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)),
    columns:[...d.querySelectorAll('th')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    ticks:[...d.querySelectorAll('.q-checkbox,[type=checkbox]')].filter(vis).length,
    box:(()=>{const r=d.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height)};})() };});
const press=async(re,label)=>{const r=await page.evaluate((src)=>{const rx=new RegExp(src,'i');
    const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d) return 'no dialog';
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>rx.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b) return 'not found; buttons are: '+[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).join(' | ');
    b.click(); return 'pressed '+(b.innerText||'').replace(/\s+/g,' ').trim();},re.source||re);
  console.log('  ',label+':',r); await page.waitForTimeout(5500); return r;};

await openWo(page,WO); await page.waitForTimeout(9000);
const ls=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean)
  .map(id=>{const r=document.querySelector('tr.line-row-'+id);
    return {id,badges:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};}));
console.log('lines:',JSON.stringify(ls.map(l=>l.badges.join('+')+' -> '+l.buttons.join('|'))));
const t=ls.find(l=>l.buttons.some(b=>/^Complete$/i.test(b)))||ls[0];
await page.evaluate((lid)=>{const r=document.querySelector('tr.line-row-'+lid);
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); if(b)b.click();},t.id);
await page.waitForTimeout(6500);
let d=await grab();
console.log('\nstep 1:',JSON.stringify(d&&d.text.slice(0,120)));
await page.screenshot({path:`${EV}/p6c-step1-cores.png`}).catch(()=>{});
// clear the cores step so the wizard moves on
if(d && /Resolve cores/i.test(d.text)) { await press(/Continue Without Resolving/, 'clearing the cores step'); d=await grab(); }
// The step that follows is a prompt, not the modal: "4 parts waiting to receive" with a
// "Receive Parts" button. THAT button opens the expanded receive modal the QA lead described.
if(d && /waiting to receive/i.test(d.text)) { await press(/^Receive Parts$/, 'opening the receive modal'); await page.waitForTimeout(4000); }
d=await grab();
R.receive=d;
console.log('\n=== the step it lands on now ===');
console.log('  size   :',JSON.stringify(d&&d.box));
console.log('  reads  :',JSON.stringify(d&&d.text.slice(0,700)));
console.log('  columns:',JSON.stringify(d&&d.columns));
console.log('  fields :',JSON.stringify(d&&d.fields));
console.log('  buttons:',JSON.stringify(d&&d.buttons));
console.log('  ticks  :',d&&d.ticks);
await page.screenshot({path:`${EV}/p6c-receive-step.png`}).catch(()=>{});
await page.screenshot({path:`${EV}/p6c-receive-step-full.png`,fullPage:true}).catch(()=>{});
if(d){
  const want=['Vendor','Invoice Number','Invoice Date','Delivery Note','Deselect all','Subtotal','Tax','Total','Sell','Receive parts','Vendor Missing','Expand all','Purchase Order'];
  const has=want.filter(w=>new RegExp(w,'i').test(d.text));
  R.present=has; R.absent=want.filter(w=>!has.includes(w));
  console.log('\n  of what the checks ask for - PRESENT:',JSON.stringify(has));
  console.log('                             - ABSENT :',JSON.stringify(R.absent));
  // is it grouped by Vendor? look for repeated vendor headings with counts
  R.grouping=await page.evaluate(()=>{const dd=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!dd)return null; const t=dd.innerText||'';
    return { rollups:(t.match(/\d+\s+(POs?|parts?)/gi)||[]).slice(0,10),
      groupish:[...dd.querySelectorAll('[class*="group"],[class*="vendor"],[class*="expansion"]')]
        .filter(e=>e.getBoundingClientRect().height).map(e=>(e.innerText||'').replace(/\s+/g,' ').slice(0,70)).slice(0,10) };});
  console.log('  counts that look like rollups:',JSON.stringify(R.grouping&&R.grouping.rollups));
  console.log('  things that look like vendor groups:',JSON.stringify(R.grouping&&R.grouping.groupish));
}
fs.writeFileSync(`${EV}/p6c-receive-step.json`,JSON.stringify(R,null,1));
await browser.close();
