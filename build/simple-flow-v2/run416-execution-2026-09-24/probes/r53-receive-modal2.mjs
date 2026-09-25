// Press Complete and WAIT for the dialog properly (poll, do not take one snapshot), then walk to the
// "Receive parts" step and read the expanded modal - the surface the QA lead says is grouped by Vendor.
// Two work orders: the one he named, and S2-908 whose line menu offers "Receive parts (1)", so the
// receive step is certain to exist there.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
const grab=async()=>await page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>120;}).pop();
  if(!d) return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return { text:(d.innerText||'').replace(/\s+/g,' ').trim(),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    fields:[...d.querySelectorAll('.q-field')].filter(vis).map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)),
    columns:[...d.querySelectorAll('th')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    ticks:[...d.querySelectorAll('.q-checkbox,[type=checkbox]')].filter(vis).length,
    box:(()=>{const r=d.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height)};})() };});
const waitDialog=async(ms=12000)=>{const t0=Date.now();
  while(Date.now()-t0<ms){const d=await grab(); if(d) return d; await page.waitForTimeout(900);} return null;};
const lines=async()=>await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean)
  .map(id=>{const r=document.querySelector('tr.line-row-'+id);
    return {id,badges:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};}));

for (const [tag,id] of [['the work order you sent','035df665-3843-411c-b5cc-c6a01a1b09b2'],['S2-908','068f9856-9d28-4500-a3dd-dd6d7aafb15a']]) {
  await openWo(page,id); await page.waitForTimeout(9000);
  const ls=await lines();
  console.log('\n######',tag,'-',JSON.stringify(ls.map(l=>l.badges.join('+')+' -> '+l.buttons.join('|'))));
  const t=ls.find(l=>l.buttons.some(b=>/^Complete$/i.test(b)));
  if(!t){ console.log('   nothing here offers Complete'); continue; }
  await page.evaluate((lid)=>{const r=document.querySelector('tr.line-row-'+lid);
    const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); if(b)b.click();},t.id);
  const d1=await waitDialog();
  console.log('   after Complete, a dialog appeared:',!!d1);
  if(!d1){ await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
    const l2=await lines(); const now=l2.find(x=>x.id===t.id);
    console.log('   the line went straight to:',JSON.stringify(now&&now.badges),'- nothing was outstanding, so no dialog was needed');
    continue; }
  console.log('   it reads   :',JSON.stringify(d1.text.slice(0,260)));
  console.log('   its buttons:',JSON.stringify(d1.buttons));
  await page.screenshot({path:`${EV}/p6b-${tag.replace(/\W+/g,'-')}-complete.png`}).catch(()=>{});
  // go to the Receive parts step
  const pressed=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const all=[...d.querySelectorAll('button,.q-btn,.q-item,[class*="step"],div,span')].filter(e=>e.getBoundingClientRect().width);
    const b=all.filter(x=>/^Receive parts/i.test((x.innerText||'').replace(/\s+/g,' ').trim()))
              .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
    if(!b) return 'no "Receive parts" control here';
    b.click(); return 'pressed "'+(b.innerText||'').replace(/\s+/g,' ').trim()+'"';});
  console.log('  ',pressed);
  await page.waitForTimeout(7000);
  const d2=await grab();
  R[tag]={complete:d1, receive:d2};
  if(d2){
    console.log('   THE RECEIVE MODAL');
    console.log('     size   :',JSON.stringify(d2.box));
    console.log('     columns:',JSON.stringify(d2.columns));
    console.log('     fields :',JSON.stringify(d2.fields));
    console.log('     buttons:',JSON.stringify(d2.buttons));
    console.log('     ticks  :',d2.ticks);
    console.log('     reads  :',JSON.stringify(d2.text.slice(0,520)));
    const want=['Vendor','Invoice Number','Invoice Date','Delivery Note','Deselect all','Subtotal','Tax','Total','Sell','Receive parts','Vendor Missing','Expand all'];
    const has=want.filter(w=>new RegExp(w,'i').test(d2.text));
    console.log('     of what the checks ask for, present:',JSON.stringify(has));
    console.log('     absent:',JSON.stringify(want.filter(w=>!has.includes(w))));
    await page.screenshot({path:`${EV}/p6b-receive-modal.png`}).catch(()=>{});
    await page.screenshot({path:`${EV}/p6b-receive-modal-full.png`,fullPage:true}).catch(()=>{});
  } else console.log('   no modal appeared after that');
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
}
fs.writeFileSync(`${EV}/p6b-receive-modal.json`,JSON.stringify(R,null,1));
await browser.close();
