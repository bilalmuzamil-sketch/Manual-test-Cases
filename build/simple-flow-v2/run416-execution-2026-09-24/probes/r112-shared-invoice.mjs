// C44586 and C44591 point 2: one invoice number used on two of the SAME vendor's purchase orders.
// Purchase orders are grouped by vendor, and the invoice number is typed inside the vendor's group.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const INV=process.env.INV||'ZZAUTOTEST-SHARED-1';
const POS=[{name:'S2-868',id:process.env.PO1||''},
           {name:'S2-917',id:'806dcdca-eb70-4634-acb5-7bcb3ecdd7b8'}];
const {browser,page}=await bootProdLogin('/parts/orders',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={invoice:INV,runs:[]};
for(const po of POS){
  console.log(`\n=== ${po.name} ===`);
  await page.goto(`https://app.shopview.com/order/${po.id}`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(11000);
  const one={po:po.name};
  console.log(' ',await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .find(e=>/^Receive$/i.test((e.innerText||'').trim())); if(!b)return 'no Receive on this purchase order'; b.click(); return 'pressed Receive';}));
  await page.waitForTimeout(9000);
  const groups=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop()||document.querySelector('main,.q-page')||document.body;
    if(!q)return null;
    return {fields:[...q.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>({label:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),val:(e.querySelector('input')||{}).value||''})),
      text:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,340)};});
  one.modal=groups;
  console.log('  the window asks for:',JSON.stringify((groups&&groups.fields||[]).map(f=>f.label)));
  console.log('  it reads:',JSON.stringify(groups&&groups.text.slice(0,240)));
  if(!groups){ R.runs.push(one); continue; }
  // assign a vendor wherever one is missing, so the group can be received
  const v=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop()||document;
    const f=[...q.querySelectorAll('.q-field,.q-select')].find(x=>/Assign Vendor/i.test(x.innerText||''));
    if(!f)return 'every group already has a vendor'; f.click(); return 'opened the vendor list';});
  console.log(' ',v);
  if(/opened/.test(v)){ await page.waitForTimeout(3000);
    console.log(' ',await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
      if(!m.length)return 'no vendor list'; const d=m.find(e=>/Delete Test/i.test(e.innerText||''))||m[0]; d.click();
      return 'chose '+(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,24);}));
    await page.waitForTimeout(3500); }
  // type the SAME invoice number into every invoice field the window offers
  one.typed=await page.evaluate((inv)=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop()||document;
    const fs=[...q.querySelectorAll('.q-field')].filter(x=>/Vendor Invoice\s*(#|Number)/i.test(x.innerText||''));
    if(!fs.length)return 'no invoice number field in this window';
    fs.forEach(f=>{const i=f.querySelector('input'); if(i){i.focus(); i.value=inv; i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));}});
    const ds=[...q.querySelectorAll('.q-field')].filter(x=>/Invoice Date/i.test(x.innerText||''));
    ds.forEach(f=>{const i=f.querySelector('input'); if(i&&!i.value){i.focus(); i.value='09/28/2026'; i.dispatchEvent(new Event('input',{bubbles:true}));}});
    return 'typed it into '+fs.length+' invoice field(s), and filled '+ds.length+' date field(s)';},INV);
  console.log(' ',one.typed);
  await page.waitForTimeout(2500);
  one.ticked=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop()||document;
    const sa=[...q.querySelectorAll('button,.q-btn,a,span')].filter(e=>/^Select All$/i.test((e.innerText||'').trim()));
    if(sa.length){sa.forEach(s=>s.click()); return 'pressed Select All '+sa.length+' time(s)';}
    const c=[...q.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width); c.forEach(x=>x.click());
    return 'ticked '+c.length+' boxes';});
  console.log(' ',one.ticked); await page.waitForTimeout(3500);
  await page.screenshot({path:`${EV}/r112-${po.name}-ready.png`}).catch(()=>{});
  one.press=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop()||document;
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>/^Receive Parts/i.test(x.t));
    if(!c.length)return 'no Receive Parts button'; const b=c[c.length-1];
    if(b.dis)return '"'+b.t+'" will not press'; b.e.click(); return 'pressed "'+b.t+'"';});
  console.log(' ',one.press); await page.waitForTimeout(9000);
  await page.screenshot({path:`${EV}/r112-${po.name}-result.png`}).catch(()=>{});
  one.msg=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
  one.pageNow=await page.evaluate(()=>{const m=document.querySelector('main,.q-page')||document.body; return (m.innerText||'').replace(/\s+/g,' ').trim().slice(0,220);});
  console.log('  the page now reads:',JSON.stringify(one.pageNow.slice(0,170)));
  console.log('  it said:',JSON.stringify(one.msg));
  one.accepted=/received/i.test(JSON.stringify(one.msg));
  R.runs.push(one);
  await page.keyboard.press('Escape').catch(()=>{});
}
console.log('\n>>> purchase orders of the same vendor that accepted the invoice number "'+INV+'":',
  R.runs.filter(r=>r.accepted).length,'of',R.runs.length);
fs.writeFileSync(`${EV}/r112-shared-invoice.json`,JSON.stringify(R,null,1));
await browser.close();
