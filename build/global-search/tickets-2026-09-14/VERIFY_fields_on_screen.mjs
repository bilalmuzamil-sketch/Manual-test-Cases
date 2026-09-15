// Can a tester actually SEE the value each ticket asks them to type?
//
// Every one of these tickets starts the same way: "open the record and read the postcode / the number
// plate / the contact's job title". If that value is not on the screen, the tester cannot even begin,
// the ticket comes back as cannot-reproduce, and the person who raised it wears it.
//
// So: open each seeded record the tickets name and dump what the screen shows. Nothing is changed.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/field-check`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), records:{}};
const save=()=>fs.writeFileSync(`${DIR}/FIELD-CHECK.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:1};}},[`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'}); }

// reach each record the way a tester would: through the search box, then click the row
const openVia=async(query,rowType,label)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',query,{delay:35});
  await page.waitForTimeout(10000);
  const clicked=await page.evaluate(t=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const row=[...d.querySelectorAll(`[data-test-id^="search_result_row_${t}"]`)][0];
    if(!row) return null; const txt=(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,70); row.click(); return txt;},rowType);
  await page.waitForTimeout(9000);
  const seen=await page.evaluate(()=>{
    const text=(document.body.innerText||'');
    return {url:location.pathname, lines:text.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,70)};});
  await page.screenshot({path:`${EV}/${label}.png`});
  return {query, rowClicked:clicked, ...seen};
};

const has=(rec,v)=>rec.lines.some(l=>l.toLowerCase().includes(String(v).toLowerCase()));

R.records.customer = await openVia('ZZAUTOTEST Bridgeport','customers','customer');
R.records.customer.postcodeOnScreen = has(R.records.customer,'44872-9931');
R.records.customer.websiteOnScreen  = has(R.records.customer,'bridgeporthauling-zzt.com');
R.records.customer.phoneOnScreen    = has(R.records.customer,'555-0143');
L('CUSTOMER page', R.records.customer.url);
L('  postcode shown:', R.records.customer.postcodeOnScreen,
  '| website shown:', R.records.customer.websiteOnScreen,
  '| phone shown:', R.records.customer.phoneOnScreen);
L('  what the page shows:', JSON.stringify(R.records.customer.lines.slice(0,22)));
save();

R.records.vendor = await openVia('ZZAUTOTEST Kestrel','vendors','vendor');
R.records.vendor.postcodeOnScreen = has(R.records.vendor,'43055-2210');
R.records.vendor.stateOnScreen    = has(R.records.vendor,'Ohio');
L('VENDOR page', R.records.vendor.url, '| postcode shown:', R.records.vendor.postcodeOnScreen,
  '| county shown:', R.records.vendor.stateOnScreen);
save();

R.records.asset = await openVia('ZZT-4471','assets','asset');
R.records.asset.plateOnScreen = has(R.records.asset,'OHZZT471');
R.records.asset.vinOnScreen   = has(R.records.asset,'1FUJGLDR9KLZZ4471');
L('ASSET page', R.records.asset.url, '| number plate shown:', R.records.asset.plateOnScreen,
  '| chassis number shown:', R.records.asset.vinOnScreen);
L('  what the page shows:', JSON.stringify(R.records.asset.lines.slice(0,22)));
save();
await browser.close();
