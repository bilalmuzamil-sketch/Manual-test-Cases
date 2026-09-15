// C55688 (the make on its own) and C55689 (the year on its own) — the two gaps the old-search
// reconciliation found, authored by the other session. Run them and read the Assets group.
//
// Controls: the same box must return the asset for a query that is known to work (the model,
// Cascadia) in the same sitting, so an empty Assets group is a fact about the query and not about
// the panel; and the asset itself is confirmed present before either verdict is taken.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/make-year-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/MAKE-YEAR-RESULTS.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'});
  R.location=hd&&hd.name; }

const READ=()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const m=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=m?+m[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
    type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
    text:(e.innerText||'').replace(/\s+/g,' ').trim()}))};};
const closeModal=async()=>{ for(let i=0;i<3;i++){
  const o=await page.evaluate(()=>{const e=document.querySelector('[data-test-id="search_modal_input"]');
    return !!(e&&e.getBoundingClientRect().width>2);});
  if(!o) return true; await page.keyboard.press('Escape'); await page.waitForTimeout(800);} return false; };
const openModal=async()=>{ await closeModal();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const settle=async()=>{ let last=null,st=0;
  for(let i=0;i<25;i++){ await page.waitForTimeout(1000);
    const m=await page.evaluate(READ); if(!m){st=0;continue;}
    const sig=JSON.stringify(m);
    const ready=Object.values(m.tabs).some(v=>v!==null)||m.rows.length>0;
    if(ready&&sig===last){ if(++st>=3) return m; } else st=0; last=sig; }
  return page.evaluate(READ); };
const ask=async(q,label)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal();
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await settle();
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();});
  await page.waitForTimeout(2000);
  const m=await settle();
  await page.screenshot({path:`${EV}/${label}.png`});
  const assets=((m&&m.rows)||[]).filter(r=>r.type==='assets').map(r=>r.text.slice(0,70));
  L(`"${q}"`, 'assets tab:', (m&&m.tabs&&m.tabs.assets), '| asset rows:', JSON.stringify(assets));
  return {query:q, tabs:m&&m.tabs, assetRows:assets,
    seededAssetReturned: assets.some(t=>/Freightliner/i.test(t)||/ZZT-4471/i.test(t))};
};

R.control_model = await ask('Cascadia','control-model-Cascadia');   // known to work
R.C55688_make   = await ask('Freightliner','C55688-make-Freightliner');
R.C55689_year   = await ask('2019','C55689-year-2019');
R.control_theAssetExists = await ask('ZZT-4471','control-asset-exists');
save();
L('CONTROL model returns the asset:', R.control_model.seededAssetReturned);
L('C55688 make :', R.C55688_make.seededAssetReturned ? 'PASS' : 'FAIL');
L('C55689 year :', R.C55689_year.seededAssetReturned ? 'PASS' : 'FAIL');
await browser.close();
