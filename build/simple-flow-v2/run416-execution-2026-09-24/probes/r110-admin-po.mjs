// Two things at once, as an admin:
//  (a) the control for C44591 point 5 - the same page DOES offer a way to receive when the person
//      is allowed to, so the view-only person's empty page is the permission and not a broken page;
//  (b) C44586 / C44591 point 2 - one invoice number used on two of the SAME vendor's purchase
//      orders. The list shows "Delete Test" on three, so the ingredient exists after all.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const INV='ZZAUTOTEST-SHARED-1';
const {browser,page}=await bootProdLogin('/parts/orders',{settle:15000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
R.rows=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,92)).slice(0,10));
console.log('the page as an admin:'); R.rows.forEach(r=>console.log('   ',r));
R.tickBoxes=await page.evaluate(()=>[...document.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width).length);
R.rowActions=await page.evaluate(()=>{const out=[];
  for(const t of [...document.querySelectorAll('tr')].filter(x=>x.getBoundingClientRect().height)){
    const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
    if(b.length)out.push(b.join('|'));} return out.slice(0,6);});
console.log('\ntick boxes on the page:',R.tickBoxes,'| actions on rows:',JSON.stringify(R.rowActions));
if(R.tickBoxes){ await page.evaluate(()=>{const c=[...document.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width); if(c[1])c[1].click();});
  await page.waitForTimeout(3000);
  R.afterTick=await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<34))]);
  console.log('after ticking one:',JSON.stringify(R.afterTick)); }
R.adminCanReceive=(R.afterTick||[]).some(b=>/receive/i.test(b))||R.rowActions.some(b=>/receive/i.test(b));
console.log('>>> an admin IS offered a way to receive here:',R.adminCanReceive);
await page.screenshot({path:`${EV}/r110-admin-po.png`,fullPage:true}).catch(()=>{});
// --- (b) the same invoice number on two of one vendor's purchase orders ---
const vendorRows=(R.rows||[]).filter(r=>/Delete Test/.test(r));
console.log('\npurchase orders for the vendor "Delete Test":',vendorRows.length);
vendorRows.forEach(v=>console.log('   ',v));
R.sharedInvoice=[];
for(let i=0;i<2;i++){
  const opened=await page.evaluate((n)=>{const rows=[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height&&/Delete Test/.test(t.innerText||''));
    const t=rows[n]; if(!t)return null; t.click(); return (t.innerText||'').replace(/\s+/g,' ').trim().slice(0,52);},i);
  if(!opened){ console.log(`\nno purchase order number ${i+1} for that vendor`); break; }
  await page.waitForTimeout(9000);
  console.log(`\n--- purchase order ${i+1}: ${opened} ---`);
  console.log('   at',page.url().replace('https://app.shopview.com',''));
  const rec=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .find(e=>/^Receive/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b)return 'no Receive offered here: '+[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.innerText||'').trim()).filter(t=>t&&t.length<30))].join(' | ');
    b.click(); return 'pressed '+(b.innerText||'').trim();});
  console.log('  ',rec);
  await page.waitForTimeout(8000);
  const typed=await page.evaluate((inv)=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop()||document;
    const f=[...q.querySelectorAll('.q-field')].find(x=>/Vendor Invoice Number/i.test(x.innerText||''));
    if(!f)return 'there is no invoice number field here';
    const i=f.querySelector('input'); i.focus(); i.value=inv; i.dispatchEvent(new Event('input',{bubbles:true}));
    return 'typed the invoice number '+inv;},INV);
  console.log('  ',typed);
  await page.waitForTimeout(2000);
  const tick=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop()||document;
    const sa=[...q.querySelectorAll('button,.q-btn,a,span')].find(e=>/^Select All$/i.test((e.innerText||'').trim()));
    if(sa){sa.click(); return 'ticked everything';}
    const c=[...q.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width); if(c.length){c[c.length-1].click(); return 'ticked one';}
    return 'nothing to tick';});
  console.log('  ',tick); await page.waitForTimeout(3000);
  const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop()||document;
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>/^Receive Parts/i.test(x.t));
    if(!c.length)return 'no Receive Parts button'; const b=c[c.length-1];
    if(b.dis)return '"'+b.t+'" will not press'; b.e.click(); return 'pressed "'+b.t+'"';});
  console.log('  ',go); await page.waitForTimeout(8000);
  const msg=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
  console.log('   it said:',JSON.stringify(msg));
  R.sharedInvoice.push({po:opened,receive:rec,typed,tick,go,msg});
  await page.screenshot({path:`${EV}/r110-po${i+1}.png`}).catch(()=>{});
  await page.goto('https://app.shopview.com/parts/orders',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
}
const accepted=R.sharedInvoice.filter(s=>/received/i.test(JSON.stringify(s.msg))).length;
console.log('\n>>> purchase orders that accepted the same invoice number:',accepted,'of',R.sharedInvoice.length);
fs.writeFileSync(`${EV}/r110-admin-po.json`,JSON.stringify(R,null,1));
await browser.close();
