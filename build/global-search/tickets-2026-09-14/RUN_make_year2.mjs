// C55688 / C55689, read properly. The first run judged from the five rows the All tab shows per
// group and called the year a failure because the seeded vehicle was not among them — which is a
// fact about where I looked, not about the product. Both queries match many vehicles, so the
// reading has to be taken from the ASSETS SCOPE TAB, which lists up to twenty.
//
// Two separate questions, reported separately, because they are not the same question:
//   a) is the field searchable at all — do the rows that come back actually carry that make/year?
//   b) is the SEEDED vehicle reachable by it, which is what the case asks for.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/make-year-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'}); }
const rows=()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const m=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=m?+m[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')]
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim())};});
const scoped=async(q,label)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await page.waitForTimeout(9000);
  // the Assets scope tab lists up to twenty; the All tab shows five per group
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_assets"]'); t&&t.click();});
  await page.waitForTimeout(6000);
  const m=await rows();
  await page.screenshot({path:`${EV}/${label}.png`});
  const seeded=(m&&m.rows||[]).filter(t=>/ZZT-4471/i.test(t));
  const out={query:q, assetsCount:m&&m.tabs&&m.tabs.assets, rowsListed:(m&&m.rows||[]).length,
    seededVehicleListed:seeded.length>0, seededRow:seeded[0]||null,
    firstRows:(m&&m.rows||[]).slice(0,6)};
  L(`"${q}" -> assets ${out.assetsCount}, rows listed ${out.rowsListed}, seeded vehicle listed: ${out.seededVehicleListed}`);
  return out;
};
R.make = await scoped('Freightliner','C55688-assets-tab');
R.year = await scoped('2019','C55689-assets-tab');
R.control = await scoped('ZZT-4471','control-assets-tab');
fs.writeFileSync(`${DIR}/MAKE-YEAR-RESULTS2.json`,JSON.stringify(R,null,1));
L('control (the vehicle is findable at all):', R.control.seededVehicleListed);
await browser.close();
