// SEED 1 - actually RECEIVE parts, which several checks need and none of the data currently has.
// Route (playbook, from the QA lead): work order -> Complete on a line with parts -> clear the cores
// step -> Receive Parts -> in the vendor-grouped window, assign a vendor if missing, type an invoice
// number and date, tick the parts, press Receive Parts (n).
// Unblocks: a line completing whatever its parts' state, declining returning only not-yet-arrived
// parts, the vendor becoming fixed once something is received, and one invoice number per PO.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';           // S2-908, Trucks Hill 2, carries parts
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const onWO=async()=>await page.evaluate(()=>!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''))));
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>120;}).pop();
  if(!d)return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,400),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
      disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const press=async(rx,label)=>{const r=await page.evaluate((src)=>{const re=new RegExp(src,'i');
    const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop(); if(!d)return 'no dialog';
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
      .find(e=>re.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b) return 'not found'; b.click(); return 'pressed '+(b.innerText||'').replace(/\s+/g,' ').trim();},rx.source);
  console.log('   ',label,'->',r); await page.waitForTimeout(5000); return r;};
const partStates=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim())
  .filter(t=>/\b(Received|Picked|In Stock|Awaiting|Ordered|Quoted|Auth To Order)\b/.test(t)).map(t=>t.slice(0,110)));

await openWo(page,WO); await page.waitForTimeout(9000);
if(!await onWO()){ console.log('did not land on the work order - wrong workplace?'); await browser.close(); process.exit(1); }
R.before=await partStates();
console.log('part states BEFORE:'); R.before.forEach(p=>console.log('   ',p));

const ls=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean)
  .map(id=>{const r=document.querySelector('tr.line-row-'+id);
    return {id,badges:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};}));
const t=ls.find(l=>l.buttons.some(b=>/^Complete$/i.test(b)));
console.log('\nusing line:',t&&t.badges.join('+'));
await page.evaluate((lid)=>{const r=document.querySelector('tr.line-row-'+lid);
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); if(b)b.click();},t.id);
await page.waitForTimeout(6500);
let d=null;
// Drive the wizard as a LOOP that reads the step it is actually on. Assuming an order failed: after
// the cores step this work order closed the dialog instead of advancing, and a fixed sequence has no
// way to notice. Poll for the dialog too - it is rebuilt between steps.
const waitDlg=async(ms=9000)=>{const t0=Date.now(); while(Date.now()-t0<ms){const x=await dlg(); if(x) return x; await page.waitForTimeout(800);} return null;};
let guard=0;
while(guard++ < 6){
  d=await waitDlg();
  if(!d){ console.log('\n   the wizard closed at step',guard,'- reopening from the line');
    const again=await page.evaluate(()=>{const rows=[...document.querySelectorAll('tr[class*="line-row-"]')];
      for(const r of rows){const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim()));
        if(b){b.click();return 'pressed Complete again';}} return 'no line offers Complete now';});
    console.log('   ',again); if(!/pressed/.test(again)) break; await page.waitForTimeout(6000); continue; }
  // Decide by the BUTTONS that are present, not by words in the text: the wizard prints a BREADCRUMB
  // naming every step, so "Resolve cores" appears while standing on "Pick parts" and a text match
  // sends you to the wrong control. The buttons only ever belong to the step you are on.
  const btns=d.buttons.map(b=>b.t);
  console.log('\n   step',guard,':',JSON.stringify(d.text.slice(0,80)),'| buttons',JSON.stringify(btns));
  if(/Invoice Number/i.test(d.text))                { console.log('   -> this is the receive window'); break; }
  if(btns.some(b=>/^Pick All$/i.test(b)))            { await press(/^Pick All$/,'picking parts'); continue; }
  if(btns.some(b=>/Continue Without Resolving/i.test(b))) { await press(/Continue Without Resolving/,'clearing cores'); continue; }
  if(btns.some(b=>/^Receive Parts$/i.test(b)))       { await press(/^Receive Parts$/,'opening the receive window'); continue; }
  if(btns.some(b=>/^Complete Line$/i.test(b)))       { await press(/^Complete Line$/,'completing the line'); continue; }
  console.log('   no step I know how to advance; buttons are',JSON.stringify(btns));
  break;
}
console.log('\nreceive window:',JSON.stringify(d&&d.text.slice(0,260)));
await page.screenshot({path:`${EV}/s20-receive-window.png`}).catch(()=>{});
if(!d || !/Invoice Number/i.test(d.text)){ console.log('never reached the receive window'); fs.writeFileSync(`${EV}/s20-receive-parts.json`,JSON.stringify(R,null,1)); await browser.close(); process.exit(1); }

// fill the first vendor card: assign a vendor if it is missing, then invoice number + tick parts
const filled=await page.evaluate(()=>{const dd=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const inputs=[...dd.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width);
  return inputs.map((i,ix)=>({ix,ph:i.getAttribute('placeholder')||i.getAttribute('aria-label')||'',val:i.value,
    label:(i.closest('.q-field')||{}).innerText?.replace(/\s+/g,' ').trim().slice(0,40)||''}));});
console.log('\ninputs in the window:'); filled.forEach(f=>console.log('   ',f.ix,JSON.stringify(f.label||f.ph),'=',JSON.stringify(f.val)));
// invoice number field
const invIx=filled.findIndex(f=>/Invoice Number/i.test(f.label+f.ph));
if(invIx>=0){ const box=page.locator('.q-dialog input:visible').nth(invIx);
  await box.click(); await box.type('ZZAUTOTEST-INV-001',{delay:40}); console.log('   typed an invoice number'); await page.waitForTimeout(1200); }
// tick every part via Select All in the first card
const sel=await page.evaluate(()=>{const dd=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const a=[...dd.querySelectorAll('button,.q-btn,a,span')].filter(e=>/^Select All$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!a.length) return 'no Select All'; a[0].click(); return 'pressed Select All ('+a.length+' cards have one)';});
console.log('   ',sel); await page.waitForTimeout(2500);
const after=await dlg();
console.log('   the receive button now reads:',JSON.stringify((after&&after.buttons||[]).filter(b=>/Receive Parts/i.test(b.t))));
await page.screenshot({path:`${EV}/s20-filled.png`}).catch(()=>{});
await press(/^Receive Parts \(\d+\)$/,'receiving');
await page.waitForTimeout(6000);
R.afterDialog=await dlg();
console.log('\nafter receiving, the window says:',JSON.stringify(R.afterDialog&&R.afterDialog.text.slice(0,200)));
await page.keyboard.press('Escape'); await page.waitForTimeout(2000);
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await partStates();
console.log('\npart states AFTER:'); R.after.forEach(p=>console.log('   ',p));
R.received=R.after.filter(p=>/Received/.test(p));
console.log('\nparts now showing Received:',R.received.length);
await page.screenshot({path:`${EV}/s20-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s20-receive-parts.json`,JSON.stringify(R,null,1));
await browser.close();
