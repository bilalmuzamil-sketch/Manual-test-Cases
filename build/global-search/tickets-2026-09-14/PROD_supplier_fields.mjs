// Two new failures on the test branch: a supplier is not found by its address line 2, and not by its
// website. Neither becomes a report until the LIVE PRODUCT has been asked the same question, because
// the shipped old product is what this suite is judged against. If the old one does not find them
// either, there is no loss and no report - and saying that is the job.
//
// Also reads the supplier's own record on the live product, so the two fields are known to be filled
// in there. An empty field proves nothing about a search.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/prod-supplier`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), checks:{}};
const save=()=>fs.writeFileSync(`${DIR}/PROD-SUPPLIER.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, version } = await bootProdLogin('/workorders',{settle:13000});
R.appVersion=version; L('the live product is', version);
const SEL='[data-test-id="select_global_search"]';

const ask=async(q,want,label)=>{
  await page.goto('https://app.shopview.com/workorders',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(4000);
  await page.click(SEL).catch(()=>{}); await page.fill(SEL,'').catch(()=>{});
  await page.type(SEL,q,{delay:50}); await page.waitForTimeout(9000);
  const m=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const p=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis)
      .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];
    const s=document.querySelector('[data-test-id="select_global_search"]');
    const box=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
    return {items:p?[...p.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)):[],
      text:p?(p.innerText||'').replace(/\s+/g,' ').trim().slice(0,260):null,
      panel:p?box(p):null, searchBox:s?box(s):null};});
  let clip=null;
  if(m.panel&&m.searchBox){
    const x=Math.max(0,Math.min(m.panel.x,m.searchBox.x)-14), y=Math.max(0,m.searchBox.y-14);
    clip={x,y,width:Math.min(1400,Math.max(m.panel.w,m.searchBox.w)+28),
          height:Math.min(1000,(m.panel.y+m.panel.h)-y+14)};
    await page.screenshot({path:`${EV}/V1-${label}.png`, clip});
  } else await page.screenshot({path:`${EV}/V1-${label}.png`});
  const found=(m.items||[]).some(t=>t.toLowerCase().includes(want.toLowerCase()));
  R.checks[label]={typed:q, wanted:want, found, rows:(m.items||[]).slice(0,6), text:m.text};
  save(); L(`${label.padEnd(26)} ${JSON.stringify(q).padEnd(30)} ${found?'FOUND '+want:'did not find '+want}`);
  return found;
};

// controls first - if the supplier is not findable by name, nothing below means anything
await ask('ZZAUTOTEST Kestrel','Kestrel','control-supplier-by-name');
await ask('Halbrook','Kestrel','control-supplier-by-street');
// the two in question, on the supplier
await ask('Bay 12C','Kestrel','supplier-address-line-2');
await ask('kestrelsupply-zzt.com','Kestrel','supplier-website');
// the customer equivalents, which the new version does find - for the comparison
await ask('Dock 7B','Bridgeport','customer-address-line-2');
await ask('bridgeporthauling-zzt.com','Bridgeport','customer-website');

// and read the supplier's own record here, so the fields are known to be filled in
await page.goto('https://app.shopview.com/workorders',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
await page.click(SEL).catch(()=>{}); await page.type(SEL,'ZZAUTOTEST Kestrel',{delay:50}); await page.waitForTimeout(9000);
await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const p=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis)
    .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];
  if(!p) return; const it=[...p.querySelectorAll('.q-item')].find(e=>/Kestrel/i.test(e.innerText||'')); it&&it.click();});
await page.waitForTimeout(9000);
const txt=await page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean));
R.supplierRecordOnLive={url:page.url(),
  addressLine2Shown:txt.some(s=>/Bay 12C/i.test(s)),
  websiteShown:txt.some(s=>/kestrelsupply-zzt\.com/i.test(s)),
  shows:txt.slice(10,50)};
await page.screenshot({path:`${EV}/V1-supplier-record.png`,fullPage:true});
L('the supplier record on the live product shows address line 2:',R.supplierRecordOnLive.addressLine2Shown,
  '| website:',R.supplierRecordOnLive.websiteShown,'|',page.url());
save(); L('DONE'); await browser.close();
