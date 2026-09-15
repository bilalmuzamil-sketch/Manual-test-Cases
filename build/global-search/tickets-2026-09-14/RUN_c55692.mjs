// Run the case just created, exactly as its own steps are written: the vendor website first, then
// the customer website in the same sitting. The second half is what turns "nothing came back" into
// "one kind of company is found by its website and the other is not".
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/c55692`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), steps:{}};
const save=()=>fs.writeFileSync(`${DIR}/C55692-RESULT.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:String(e).slice(0,110)};}},[`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'}); }

const ask=async(q,group,want,label)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await page.waitForTimeout(10000);
  await page.evaluate((g)=>{const e=document.querySelector(`[data-test-id="search_modal_tab_${g}"]`); e&&e.click();},group);
  await page.waitForTimeout(5000);
  const m=await page.evaluate((g)=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
      .filter(e=>e.getBoundingClientRect().width>2).pop();
    const tabs={}; d&&d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
    return {tabs, rows:[...document.querySelectorAll(`[data-test-id^="search_result_row_${g}"]`)]
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)),
      words:d?(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,240):null};},group);
  // crop to the panel so the picture reads without being clicked
  const clip=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
      .filter(e=>e.getBoundingClientRect().width>2).pop(); if(!d) return null;
    const c=d.querySelector('.q-card,[class*=card]')||d; const r=c.getBoundingClientRect();
    return {x:Math.max(0,Math.round(r.x)-6),y:Math.max(0,Math.round(r.y)-6),
            width:Math.round(Math.min(1400,r.width+12)),height:Math.round(Math.min(900,r.height+12))};});
  await page.screenshot(clip?{path:`${EV}/${label}.png`,clip}:{path:`${EV}/${label}.png`});
  const found=(m.rows||[]).some(t=>t.toLowerCase().includes(want.toLowerCase()));
  R.steps[label]={typed:q, group, count:(m.tabs||{})[group], rows:(m.rows||[]).slice(0,5), found, words:m.words};
  save(); L(`${label.padEnd(20)} ${JSON.stringify(q).padEnd(30)} ${group.padEnd(10)} ${found?'FOUND':'not found'} (count ${(m.tabs||{})[group]})`);
  return found;
};
await ask('ZZAUTOTEST Kestrel','vendors','Kestrel','control-supplier-by-name');
const v=await ask('kestrelsupply-zzt.com','vendors','Kestrel','step2-vendor-website');
const c=await ask('bridgeporthauling-zzt.com','customers','Bridgeport','step4-customer-website');
R.verdict = (v&&c) ? 'Passed' : 'Failed';
R.why = v&&c ? 'both websites returned their company'
     : (!v&&c) ? 'the supplier website returned nothing while the customer website returned its customer'
     : (!v&&!c) ? 'neither website returned anything' : 'the supplier was found but the customer was not';
L('VERDICT', R.verdict, '-', R.why);
save(); L('DONE'); await browser.close();
