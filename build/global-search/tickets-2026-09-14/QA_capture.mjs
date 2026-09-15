// The new version, photographed on the QA branch, with the same words typed as the live-product
// pictures. Cropped to the search panel itself so the picture reads at its own size.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/qa-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), shots:{}};
const save=()=>fs.writeFileSync(`${DIR}/QA-CAPTURE.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const QUERIES=[
 ['SV-10001','ZZT-77-3300'],['SV-10001b','Vernway'],['SV-10002','44872-9931'],
 ['SV-10003','bridgeporthauling-zzt.com'],['SV-10004','Dispatch Supervisor'],
 ['SV-10005','43055-2210'],['SV-10006','Ohio'],['SV-10007','OHZZT471'],
 ['SV-10008','Estimate'],['SV-10025','Marlene'],['SV-10055','2019 Freightliner'],
 ['SV-10057','555-0143'],['SV-10058','ZZ4471'],['SV-10060','ernva'],
];
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
for (const [key,q] of QUERIES){
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await page.waitForTimeout(11000);
  const m=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const box=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const card=d?[...d.querySelectorAll('div')].filter(vis)
      .filter(e=>{const r=e.getBoundingClientRect(); return r.width>500&&r.width<820&&r.height>80;})
      .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0]:null;
    const tabs={}; d&&d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
    return {panel:card?box(card):null, tabs,
      rows:d?[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].length:0,
      words:d?(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,220):null};});
  let clip=null;
  if(m.panel){ const p=m.panel;
    clip={x:Math.max(0,p.x-10), y:Math.max(0,p.y-10), width:Math.min(1600,p.w+20), height:Math.min(1000,p.h+20)};
    await page.screenshot({path:`${EV}/V2-${key}.png`, clip});
  } else await page.screenshot({path:`${EV}/V2-${key}.png`});
  R.shots[key]={query:q, rows:m.rows, tabs:m.tabs, words:m.words, clip}; save();
  L(`${key.padEnd(10)} ${JSON.stringify(q).padEnd(28)} rows ${String(m.rows).padStart(2)} ${clip?'cropped':'FULL'}`);
}
L('DONE');
await browser.close();
