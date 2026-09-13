// PRODUCTION -- C53568. With MM/DD/YYYY the import passes its duplicate check ({"duplicatedInvoices":[]})
// but nothing is created, so there must be a further step. Capture EVERY response and every dialog
// after the click, and follow whatever the screen offers next.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', responses:[], steps:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR67.json`, JSON.stringify(R,null,1));
const HEAD='*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount';
const TAG='ZZAUTOTEST-IMP-C';
fs.writeFileSync('/tmp/claude-0/imp-C.csv', `${HEAD}
Trucks Hill 2,aqeel transport 56,,,,,,,,,${TAG},09/13/2026,,Bilal Muzammil,Labor,ZZAUTOTEST imported labour,Seeded for design testing,,,,2,100.00,200.00,10.00
Trucks Hill 2,aqeel transport 56,,,,,,,,,${TAG},09/13/2026,,Bilal Muzammil,Part,ZZAUTOTEST imported part,Seeded for design testing,,ZZPART1,ZZAUTOTEST part,1,50.00,50.00,2.50
`);
const { browser, page } = await bootProdLogin('/');
page.on('response', async r=>{ if(/api\.shopview\.com\/api\/(imports|work-orders|customers)/.test(r.url())&&r.request().method()!=='GET'){
  try{ R.responses.push({u:r.url().split('api.shopview.com')[1].slice(0,70), s:r.status(), b:(await r.text()).slice(0,600)}); }catch(e){} }});
await page.goto(`${APP}/administration/invoices-import`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
const input=await page.$('[data-test-id="file_upload"]');
await input.setInputFiles('/tmp/claude-0/imp-C.csv');
await page.waitForTimeout(9000);
await page.screenshot({path:`${EV}/PR67-1-attached.png`, fullPage:true});
R.steps.afterAttach=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {fileNamed:/imp-C\.csv|ZZAUTOTEST/i.test(t),
    buttons:[...document.querySelectorAll('button')].filter(ok).map(b=>({txt:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,30), dis:b.disabled})).slice(0,12),
    tail:t.slice(-400)};});
L('after attach: %s', JSON.stringify(R.steps.afterAttach).slice(0,400));
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const b=[...document.querySelectorAll('button')].filter(ok).find(x=>/^import invoices$/i.test((x.innerText||'').trim())); if(b&&!b.disabled) b.click();});
await page.waitForTimeout(9000);
await page.screenshot({path:`${EV}/PR67-2-after-click.png`, fullPage:true});
R.steps.afterClick=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const t=(document.body.innerText||'').replace(/\s+/g,' ');
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
  return {dialog: d?{text:(d.innerText||'').replace(/\s+/g,' ').slice(0,320),
      buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').trim()).filter(Boolean)}:null,
    buttons:[...document.querySelectorAll('button')].filter(ok).map(b=>({txt:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,30), dis:b.disabled})).slice(0,12),
    tail:t.slice(-450)};});
L('after click -- dialog: %s', JSON.stringify(R.steps.afterClick.dialog));
L('  buttons: %s', JSON.stringify(R.steps.afterClick.buttons));
L('  page tail: %s', R.steps.afterClick.tail.slice(0,320));
save();
// follow any confirm
if(R.steps.afterClick.dialog && R.steps.afterClick.dialog.buttons.length){
  const go=R.steps.afterClick.dialog.buttons.find(b=>/import|confirm|yes|proceed|continue|ok/i.test(b)&&!/cancel|close/i.test(b));
  if(go){ await page.evaluate((lab)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>(x.innerText||'').trim()===lab); if(b) b.click();}, go);
    L('confirmed with "%s"', go); R.steps.confirmed=go; await page.waitForTimeout(15000); } }
await page.screenshot({path:`${EV}/PR67-3-final.png`, fullPage:true});
R.steps.final=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return (t.match(/(Created:|Invoices Failed:|imported|success|Failed Row)[^.]{0,140}/ig)||[]).slice(0,5);});
L('final message: %s', JSON.stringify(R.steps.final));
L('responses: %s', JSON.stringify(R.responses.map(r=>`${r.u} ${r.s} ${r.b.slice(0,180)}`)));
save(); await browser.close();
