// The QA lead's route, which I never walked: on a work order press Complete, a receive-parts dialog
// appears, and pressing "Receive parts" opens the expanded modal - and THAT is where purchase orders
// are grouped by Vendor. I judged C44589 and C44590 on /parts/orders, which is a different surface.
// Walk his route and read what is actually there.
// (The product's word is Vendor. Never "supplier" - Rule 110.)
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='035df665-3843-411c-b5cc-c6a01a1b09b2';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
const dlg=async()=>await page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>100&&r.height>100;}).pop();
  if(!d) return null;
  const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return { text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,700),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
      disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||'')})).filter(b=>b.t),
    fields:[...d.querySelectorAll('.q-field')].filter(vis).map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)),
    columns:[...d.querySelectorAll('th')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    checkboxes:[...d.querySelectorAll('.q-checkbox,[type=checkbox]')].filter(vis).length,
    box:(()=>{const r=d.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height)};})() };});
await openWo(page,WO); await page.waitForTimeout(9000);
R.lines=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean)
  .map(id=>{const r=document.querySelector('tr.line-row-'+id);
    return {id,badges:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};}));
console.log('lines on this work order:');
for(const l of R.lines) console.log('   ',l.badges.join('+'),'->',JSON.stringify(l.buttons));
let target=R.lines.find(l=>l.buttons.some(b=>/^Complete$/i.test(b)));
if(!target){
  // every line here is already finished, so there is no Complete to press. Reopen one first - the
  // line's own three-dot is the LEFTMOST more_vert on its row (playbook: the tab-row trap).
  const l=R.lines[0];
  console.log('\nno line offers Complete - reopening', l.badges.join('+'), 'first so his route can be walked');
  const tr=page.locator('tr.line-row-'+l.id).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1200);
  const spot=await page.evaluate((lid)=>{const row=document.querySelector('tr.line-row-'+lid); if(!row)return null;
    const rb=row.getBoundingClientRect(); const c=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect(); if(!r.width||!r.height)return; const cy=r.y+r.height/2;
      if(cy>=rb.top-2&&cy<=rb.bottom+2) c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
    c.sort((a,b)=>a.x-b.x); return c[0]||null;}, l.id);
  if(spot){ await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(1900);
    const done=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
      if(!m)return 'no menu'; const i=[...m.querySelectorAll('.q-item')].find(x=>/^Uncomplete/i.test((x.innerText||'').trim()));
      if(!i)return 'no Uncomplete'; i.click(); return 'pressed Uncomplete';});
    console.log('  ',done); await page.waitForTimeout(4000);
    await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>100)[0]; if(!d)return;
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim())); if(b)b.click();});
    await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
    R.lines=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean)
      .map(id=>{const r=document.querySelector('tr.line-row-'+id);
        return {id,badges:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
          buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};}));
    console.log('  lines now:',JSON.stringify(R.lines.map(x=>x.badges.join('+')+' -> '+x.buttons.join('|'))));
    target=R.lines.find(l=>l.buttons.some(b=>/^Complete$/i.test(b))); }
}
if(!target){ console.log('still no Complete available'); await browser.close(); process.exit(0); }
await page.evaluate((id)=>{const r=document.querySelector('tr.line-row-'+id);
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); if(b)b.click();},target.id);
await page.waitForTimeout(6000);
R.step1=await dlg();
console.log('\n=== after pressing Complete ===');
console.log('  dialog size:',JSON.stringify(R.step1&&R.step1.box));
console.log('  reads      :',JSON.stringify(R.step1&&R.step1.text.slice(0,300)));
console.log('  buttons    :',JSON.stringify((R.step1&&R.step1.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
await page.screenshot({path:`${EV}/p6a-complete-dialog.png`}).catch(()=>{});
// press "Receive parts" - it may be a step in the wizard or a button
const pressed=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>100).pop();
  if(!d) return 'no dialog';
  const all=[...d.querySelectorAll('button,.q-btn,.q-item,.q-step__tab,[class*="step"]')].filter(e=>e.getBoundingClientRect().width);
  const b=all.find(x=>/^Receive parts/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b) return 'no "Receive parts" control; visible controls are: '+all.map(x=>(x.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12).join(' | ');
  b.click(); return 'pressed Receive parts';});
console.log('\n', pressed);
await page.waitForTimeout(7000);
R.step2=await dlg();
console.log('\n=== the expanded receive modal ===');
console.log('  size    :',JSON.stringify(R.step2&&R.step2.box));
console.log('  columns :',JSON.stringify(R.step2&&R.step2.columns));
console.log('  fields  :',JSON.stringify(R.step2&&R.step2.fields));
console.log('  buttons :',JSON.stringify((R.step2&&R.step2.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
console.log('  tick boxes in it:',R.step2&&R.step2.checkboxes);
console.log('  reads   :',JSON.stringify(R.step2&&R.step2.text.slice(0,600)));
await page.screenshot({path:`${EV}/p6a-receive-modal.png`}).catch(()=>{});
await page.screenshot({path:`${EV}/p6a-receive-modal-full.png`,fullPage:true}).catch(()=>{});
// what the check asks for, word by word
const want=['Vendor','Invoice Number','Invoice Date','Delivery Note','Deselect all','Subtotal','Tax','Total','Sell','Receive parts','Vendor Missing','Expand all'];
R.wanted=await page.evaluate((w)=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>100).pop();
  const t=d?(d.innerText||''):''; const o={}; for(const x of w) o[x]=new RegExp(x,'i').test(t); return o;},want);
console.log('\n  of what the checks ask for, present in this modal:');
for(const [k,v] of Object.entries(R.wanted)) console.log('    ',v?'YES':'no ',k);
fs.writeFileSync(`${EV}/p6a-receive-modal.json`,JSON.stringify(R,null,1));
await browser.close();
