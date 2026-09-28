// A core charge is configured on the INVENTORY part record, so only a part drawn from stock shows a
// core row. C53489 needs a part that carries a core AND has to be ordered - so make an inventory
// part that carries a core charge and has no stock: it must then be ordered rather than picked.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/parts',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(40000);
const R={};
const fill=async(labelRe,value)=>{
  const ok=await page.evaluate(([re,v])=>{const rx=new RegExp(re,'i');
    const f=[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>rx.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!f)return 'no field matching '+re; const i=f.querySelector('input'); if(!i)return re+' has no input';
    i.focus(); i.value=v; i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
    return re+' <- '+v;},[labelRe.source||labelRe,String(value)]);
  await page.waitForTimeout(900); return ok;
};
console.log(await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
  .find(e=>/New Inventory Part/i.test(e.innerText||'')); if(!b)return 'no New Inventory Part button'; b.click(); return 'opened the new part form';}));
await page.waitForTimeout(7000);
R.form=await page.evaluate(()=>[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,36)));
console.log('the form asks for:',JSON.stringify(R.form));
// an inventory part is built FROM a catalog part - choose one first, or Save refuses
console.log(await page.evaluate(()=>{const f=[...document.querySelectorAll('.q-field,.q-select')].filter(e=>e.getBoundingClientRect().width)
  .find(e=>/Catalog Part/i.test((e.innerText||'').replace(/\s+/g,' ').trim())); if(!f)return 'no catalog part field'; f.click(); return 'opened the catalog list';}));
await page.waitForTimeout(3500);
console.log(await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
  if(!m.length)return 'no catalog list appeared';
  const names=m.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40));
  m[0].click(); return 'chose "'+names[0]+'" out of '+m.length+' - first few: '+names.slice(0,5).join(' , ');}));
await page.waitForTimeout(4000);
console.log(await fill(/Core Charge/, '7.50'));
console.log(await fill(/\$ Cost/, '25.00'));
console.log(await fill(/Sell Price/, '99.00'));
console.log(await fill(/^Quantity/, '0'));
// vendor, so it can be ordered
console.log(await page.evaluate(()=>{const f=[...document.querySelectorAll('.q-field,.q-select')].filter(e=>e.getBoundingClientRect().width)
  .find(e=>/^Vendor/i.test((e.innerText||'').replace(/\s+/g,' ').trim())); if(!f)return 'no vendor field'; f.click(); return 'opened the vendor list';}));
await page.waitForTimeout(3000);
console.log(await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
  if(!m.length)return 'no vendor list'; const d=m.find(e=>/Delete Test/i.test(e.innerText||''))||m[0];
  d.click(); return 'chose '+(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,26);}));
await page.waitForTimeout(2500);
await page.screenshot({path:`${EV}/s38-form.png`}).catch(()=>{});
console.log(await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
  .find(e=>/^(Save|Create|Add)$/i.test((e.innerText||'').trim()));
  if(!b)return 'no save button; what is offered: '+[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean).slice(0,14).join(' | ');
  b.click(); return 'pressed '+(b.innerText||'').trim();}));
await page.waitForTimeout(9000);
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('message:',JSON.stringify(R.toast));
await page.screenshot({path:`${EV}/s38-after.png`}).catch(()=>{});
fs.writeFileSync(`${EV}/s38-core-part.json`,JSON.stringify(R,null,1));
await browser.close();
