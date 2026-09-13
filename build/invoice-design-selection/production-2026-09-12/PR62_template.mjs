// PRODUCTION -- C53568. The invoices import screen offers a template download. Get it and read its
// columns, so an imported invoice can be seeded properly rather than guessed at.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', net:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR62.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)) R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
await page.goto(`${APP}/administration/invoices-import`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
R.screenText=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  const i=t.indexOf('Invoices'); return t.slice(Math.max(0,i-40), i+700);});
L('screen: %s', R.screenText.slice(0,420));
await page.screenshot({path:`${EV}/PR62-import-screen.png`, fullPage:true});
const before=R.net.length;
// the template download may be a fetch rather than a navigation -- watch the network AND the download
const dl = page.waitForEvent('download', {timeout:25000}).catch(()=>null);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_download_template"]'); b&&b.click();});
const d=await dl;
await page.waitForTimeout(8000);
R.afterClick=R.net.slice(before);
L('calls after the template click: %s', JSON.stringify(R.afterClick));
if(d){ const p=`${EV}/PR62-invoice-import-template-${d.suggestedFilename()}`;
  await d.saveAs(p); R.template={file:p, name:d.suggestedFilename()};
  L('template saved: %s', d.suggestedFilename()); }
else L('no browser download fired -- reading the route instead');
const route=R.afterClick.find(u=>/template/i.test(u));
if(!d && route){
  const g=await page.evaluate(async(p)=>{const r=await fetch(`https://api.shopview.com${p.replace(/^GET /,'')}`,{credentials:'include'});
    const buf=await r.arrayBuffer(); const u=new Uint8Array(buf); let bin='';
    for(let i=0;i<u.length;i++) bin+=String.fromCharCode(u[i]);
    return {s:r.status, ct:r.headers.get('content-type'), n:u.length, b64:btoa(bin)};}, route);
  L('template via route: %s %s %s bytes', g.s, g.ct, g.n);
  if(g.s===200){ const ext=/sheet|excel|xlsx/i.test(g.ct||'')?'xlsx':'csv';
    fs.writeFileSync(`${EV}/PR62-template.${ext}`, Buffer.from(g.b64,'base64'));
    R.template={file:`PR62-template.${ext}`, contentType:g.ct, bytes:g.n}; }
}
save(); await browser.close();
