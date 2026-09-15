// The old version, photographed on the live product, for every report that has a query behind it.
// The same seeded records are on both, so the two pictures in each report show the same words typed
// into the same search box, one version each.
//
// Cropped to the search box and the panel it opens - about 340 by 520 - so the picture arrives at
// its own size and reads without being clicked. That is the Head of Product's point: today's images
// are whole screens shrunk to fit.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/prod-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), shots:{}};
const save=()=>fs.writeFileSync(`${DIR}/PROD-CAPTURE.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const QUERIES=[
 ['SV-10001','ZZT-77-3300','a part number the shop has never stocked'],
 ['SV-10001b','Vernway','a word from that part’s description'],
 ['SV-10002','44872-9931','a customer postcode'],
 ['SV-10003','bridgeporthauling-zzt.com','a customer website'],
 ['SV-10004','Dispatch Supervisor','a contact’s job title'],
 ['SV-10005','43055-2210','a supplier postcode'],
 ['SV-10006','Ohio','the county a supplier is in'],
 ['SV-10007','OHZZT471','a vehicle number plate'],
 ['SV-10008','Estimate','a job status'],
 ['SV-10025','Marlene','a customer name that has a near-spelling twin'],
 ['SV-10055','2019 Freightliner','a vehicle year and make together'],
 ['SV-10057','555-0143','part of a phone number'],
 ['SV-10058','ZZ4471','part of a chassis number'],
 ['SV-10060','ernva','a fragment from the middle of a town name'],
];
const { browser, page, version } = await bootProdLogin('/workorders',{settle:13000});
R.appVersion=version; L('live product version:', version);
const SEL='[data-test-id="select_global_search"]';
for (const [key,q,what] of QUERIES){
  await page.goto('https://app.shopview.com/workorders',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(4000);
  await page.click(SEL).catch(()=>{});
  await page.fill(SEL,'').catch(()=>{});
  await page.type(SEL,q,{delay:55});
  await page.waitForTimeout(9000);
  const m = await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const box=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
    const panel=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis)
      .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];
    const sbox=document.querySelector('[data-test-id="select_global_search"]');
    return {panel:panel?box(panel):null, searchBox:sbox?box(sbox):null,
      items:panel?[...panel.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)):[],
      text:panel?(panel.innerText||'').replace(/\s+/g,' ').trim().slice(0,300):null};});
  let clip=null;
  if(m.panel&&m.searchBox){
    const x=Math.max(0,Math.min(m.panel.x,m.searchBox.x)-14);
    const y=Math.max(0,m.searchBox.y-14);
    clip={x, y, width:Math.min(1400,Math.max(m.panel.w,m.searchBox.w)+28),
          height:Math.min(1000,(m.panel.y+m.panel.h)-y+14)};
    await page.screenshot({path:`${EV}/V1-${key}.png`, clip});
  } else {
    await page.screenshot({path:`${EV}/V1-${key}.png`});
  }
  R.shots[key]={query:q, what, found:(m.items||[]).length, items:(m.items||[]).slice(0,8), clip};
  save();
  L(`${key.padEnd(10)} ${JSON.stringify(q).padEnd(28)} rows ${String((m.items||[]).length).padStart(2)}  ${clip?'cropped':'FULL PAGE'}`);
}
L('DONE');
await browser.close();
