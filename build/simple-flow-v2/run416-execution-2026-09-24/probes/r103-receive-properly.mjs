// Receive the deferred A158 properly: assign the vendor, give the invoice number and date, tick the
// part, then receive. Read back after every step rather than assuming it took. If Receive Parts
// still will not press, read what the window says about why.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const INV='ZZAUTOTEST-INV-1';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const win=async()=>await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  if(!q)return null;
  return {header:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,150),
    fields:[...q.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({label:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,30),val:(e.querySelector('input')||{}).value||''})),
    receive:(()=>{const b=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>/^Receive Parts/i.test((e.innerText||'').trim()));
      return b?{t:(b.innerText||'').trim(),dis:/disabled/.test(b.className||'')||b.disabled}:null;})()};});
await openWo(page,WO); await page.waitForTimeout(9000);
// open the deferred part's menu -> Receive part
const mv=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].find(x=>/\(1237944\)/.test(x.innerText||'')&&/Receive Later/i.test(x.innerText||''));
  if(!t)return null; const b=[...t.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
if(!mv){ console.log('the deferred A158 is not on the page'); await browser.close(); process.exit(0); }
await page.mouse.click(mv.x,mv.y); await page.waitForTimeout(2200);
await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  const it=[...m.querySelectorAll('.q-item')].find(i=>/Receive part/i.test(i.innerText||'')); if(it)it.click();});
await page.waitForTimeout(7000);
console.log('opened:',JSON.stringify((await win())||{}).slice(0,220));
// 1. vendor
await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  const f=[...q.querySelectorAll('.q-field,.q-select')].find(x=>/Assign Vendor/i.test(x.innerText||'')); if(f)f.click();});
await page.waitForTimeout(3000);
console.log('vendor:',await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width);
  if(!m.length)return 'no list'; m[0].click(); return 'chose '+(m[0].innerText||'').replace(/\s+/g,' ').trim().slice(0,26);}));
await page.waitForTimeout(4000);
let w=await win(); R.afterVendor=w;
console.log('  fields now:',JSON.stringify(w&&w.fields),'| receive:',JSON.stringify(w&&w.receive));
// 2. invoice number - type it so the field's own handlers fire
const invField=page.locator('.q-dialog .q-field:has-text("Vendor Invoice Number") input').first();
if(await invField.count()){ await invField.click(); await invField.type(INV,{delay:60}); }
await page.waitForTimeout(2500);
w=await win(); console.log('  after the invoice number:',JSON.stringify(w&&w.fields),'| receive:',JSON.stringify(w&&w.receive));
// 3. tick
console.log(' ',await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
  const sa=[...q.querySelectorAll('button,.q-btn,a,span')].find(e=>/^Select All$/i.test((e.innerText||'').trim()));
  if(sa){sa.click(); return 'ticked everything';}
  const b=[...q.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width); if(b.length){b[b.length-1].click(); return 'ticked the part';} return 'nothing to tick';}));
await page.waitForTimeout(3000);
w=await win(); R.beforePress=w;
console.log('  ready? receive:',JSON.stringify(w&&w.receive),'| header:',JSON.stringify(w&&w.header.slice(0,110)));
await page.screenshot({path:`${EV}/r103-ready.png`}).catch(()=>{});
if(w&&w.receive&&w.receive.dis){
  R.why=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
    const i=[...q.querySelectorAll('i,.q-icon')].find(e=>/info/.test((e.innerText||e.textContent||'').trim()));
    if(i)i.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
    return [...q.querySelectorAll('[title],[aria-label]')].map(e=>e.getAttribute('title')||e.getAttribute('aria-label')).filter(Boolean).slice(0,6);});
  await page.waitForTimeout(2500);
  R.tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(e=>(e.innerText||'').trim()).filter(Boolean));
  console.log('  it will not press. what it says:',JSON.stringify(R.why),JSON.stringify(R.tip));
} else {
  for(let i=0;i<3;i++){
    const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!q)return 'the window closed';
      const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
        .filter(x=>/^Receive Parts|confirm|^Yes$|^OK$/i.test(x.t));
      if(!c.length)return 'no receive button'; const b=c[c.length-1];
      if(b.dis)return '"'+b.t+'" is not pressable'; b.e.click(); return 'pressed "'+b.t+'"';});
    console.log('  ',go); if(/closed|no receive/.test(go))break; await page.waitForTimeout(6000);
  }
}
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('message:',JSON.stringify(R.toast));
await page.keyboard.press('Escape').catch(()=>{});
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.after=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height&&/1237944|Core|Later|Received/i.test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,96)));
console.log('\nafter:'); R.after.forEach(x=>console.log('  ',x));
fs.writeFileSync(`${EV}/r103-receive-properly.json`,JSON.stringify(R,null,1));
await browser.close();
