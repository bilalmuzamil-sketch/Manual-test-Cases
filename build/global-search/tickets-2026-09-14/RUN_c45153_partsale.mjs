// C45153 -- the two halves that could not be judged on 14 September.
//
//  * PART SALE: no part sale could be created that day (SV-10031), so the row type was never
//    clicked. That ticket is fixed and part sales exist now, so the row can be selected and the
//    page it opens read.
//  * THE CATALOGUE-ONLY PART: re-checked on today's build, because the case's own instruction is
//    to hold it for the Product Owner -- and the Product Owner has since ruled (15 September, "yes,
//    it should still be findable"). A ruling does not make an old reading current; the check is
//    re-run today.
//
// Controls: a part sale must be FOUND before "clicking it goes nowhere" can mean anything, and the
// stocked part is searched alongside the catalogue-only one so that a zero is read against a
// non-zero from the same box in the same minute.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/unrun3-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/C45153-FINISH.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,method,body]);
const wps=await api('/api/staff/my-workplaces');
{ const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'});
  R.pinnedTo=hd&&hd.name; }

const READ=()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
    tid:e.getAttribute('data-test-id'),
    type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
    text:(e.innerText||'').replace(/\s+/g,' ').trim()}))};};
const modalOpen=async()=>page.evaluate(()=>{const e=document.querySelector('[data-test-id="search_modal_input"]');
  if(!e) return false; const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;});
const closeModal=async()=>{ for(let i=0;i<3;i++){ if(!await modalOpen()) return true;
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);} return !(await modalOpen()); };
const openModal=async()=>{ await closeModal();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const settle=async(min=5000)=>{ let last=null,st=0,t0=Date.now();
  for(let i=0;i<25;i++){ await page.waitForTimeout(1000);
    const m=await page.evaluate(READ); if(!m){st=0;continue;}
    const sig=JSON.stringify(m);
    const ready=Object.values(m.tabs).some(v=>v!==null)||m.rows.length>0;
    if(ready&&sig===last){ if(++st>=3&&Date.now()-t0>=min) return m; } else st=0;
    last=sig; }
  return page.evaluate(READ); };
const type2=async q=>{ const s='[data-test-id="search_modal_input"]';
  await page.fill(s,''); await page.type(s,q,{delay:35}); await settle();
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();});
  await page.waitForTimeout(2000); return settle(); };

// ---- 1. the PART SALE row
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
await openModal();
const QUERY=process.env.PARTSALE_QUERY||'4 Star Truck Repair';
const m=await type2(QUERY);
const psRows=((m&&m.rows)||[]).filter(r=>r.type==='part_sales');
R.partSale={query:QUERY, tabs:m&&m.tabs, rowsFound:psRows.length,
  rowText:psRows[0]&&psRows[0].text.slice(0,90)};
if(psRows.length){
  const before=page.url();
  await page.evaluate(t=>{const el=document.querySelector(`[data-test-id="${t}"]`); el&&el.click();}, psRows[0].tid);
  await page.waitForTimeout(7000);
  R.partSale.urlBefore=before; R.partSale.urlAfter=page.url();
  R.partSale.navigated=page.url()!==before;
  R.partSale.pageWords=await page.evaluate(()=>(document.body.innerText||'')
    .replace(/\s+/g,' ').trim().slice(0,260));
  await page.screenshot({path:`${EV}/C45153-part-sale-opened.png`});
}
save(); L('part sale ->', JSON.stringify(R.partSale).slice(0,300));

// ---- 2. the catalogue-only part, re-checked today, against a stocked part in the same minute
R.parts={};
for(const q of [process.env.STOCKED||'ZZT-88-4412', process.env.CATALOGUE||'ZZT-77-3300', 'Vernway']){
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal();
  const r=await type2(q);
  R.parts[q]={tabs:r&&r.tabs,
    partRows:((r&&r.rows)||[]).filter(x=>x.type==='parts').map(x=>x.text.slice(0,70))};
  await page.screenshot({path:`${EV}/C45153-part-${q.replace(/\W+/g,'-')}.png`});
  L(q,'->',JSON.stringify(R.parts[q]).slice(0,200));
  save();
}
R.control_stockedPartStillFound = (R.parts[process.env.STOCKED||'ZZT-88-4412'].partRows||[]).length>0;
save();
console.log('C45153 FINISH DONE');
await browser.close();
