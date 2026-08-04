import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/tu/ui'; fs.mkdirSync(OUT,{recursive:true});
const { browser, page, netlog } = await boot('admin');
const R={};
const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
const go=async()=>{await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(9000);};
const rows=()=>page.$$eval('tbody tr',trs=>trs.map(tr=>[...tr.querySelectorAll('td,th')].map(td=>td.innerText.replace(/\n/g,' ').trim())).filter(r=>r.join('')));
const hdrs=()=>page.$$eval('thead th',ths=>ths.map(th=>({t:th.innerText.replace(/\n/g,' ').trim(),aria:th.getAttribute('aria-sort')})));
const clickTid=async tid=>{const e=await page.$(`[data-test-id="${tid}"]`); if(!e)return false; const b=await e.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); return true;};
await go();
// --- set date range to This Year (28 rows) to test pinning/sorting/summary at scale
const dr=await page.$('[data-test-id="date-range-selector_tu_trigger"]');
{const b=await dr.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(1200);
 const items=await page.$$('.q-menu .q-item, .q-menu div');
 for(const it of items){const t=(await it.evaluate(e=>e.innerText.trim()));
   if(t==='This Year'){const bb=await it.boundingBox(); if(bb){await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); break;}}}
 await page.waitForTimeout(1200);
 // Apply
 const btns=await page.$$('.q-menu button');
 for(const bt of btns){const t=await bt.evaluate(e=>e.innerText.trim()); if(t==='Apply'){const bb=await bt.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); break;}}
 await page.waitForTimeout(6000);
}
R.afterThisYear={label: await dr.evaluate(e=>e.innerText.trim()), rowCount:(await rows()).length, headers: await hdrs(), first3:(await rows()).slice(0,3)};
await shot('tu-thisyear');
// --- Summary pinning while scrolling
R.scroll = await page.evaluate(async()=>{
  const sum=[...document.querySelectorAll('tbody tr,tfoot tr')].find(tr=>/^Summary/.test(tr.innerText));
  const before= sum? sum.getBoundingClientRect().top : null;
  const cs = sum? {position:getComputedStyle(sum).position, bottom:getComputedStyle(sum).bottom}:null;
  const tdCS = sum? getComputedStyle(sum.querySelector('td')||sum) : null;
  window.scrollTo(0, document.body.scrollHeight); await new Promise(r=>setTimeout(r,900));
  const after= sum? sum.getBoundingClientRect().top : null;
  const inView = sum? (after>=0 && after<=window.innerHeight):null;
  return {rowStyle:cs, cellPosition: tdCS&&tdCS.position, cellBottom: tdCS&&tdCS.bottom, before, after, inViewAfterScroll:inView, vh:window.innerHeight};
});
await shot('tu-scrolled-bottom');
await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(500);
// --- Est Lost Labor cell styling / pinning
R.ellCell = await page.evaluate(()=>{
  const tr=[...document.querySelectorAll('tbody tr')].find(t=>/\$/.test(t.innerText));
  if(!tr) return null; const tds=[...tr.querySelectorAll('td')]; const last=tds[tds.length-1];
  const first=tds[0];
  return {lastText:last.innerText.trim(), lastWeight:getComputedStyle(last).fontWeight, lastAlign:getComputedStyle(last).textAlign,
    lastPosition:getComputedStyle(last).position, lastRight:getComputedStyle(last).right,
    otherWeight:getComputedStyle(tds[2]).fontWeight, otherAlign:getComputedStyle(tds[2]).textAlign,
    firstWeight:getComputedStyle(first).fontWeight};
});
// --- sorting: click each header, record order + aria
R.sorts=[];
const headerTids=['header_tu_total_hours','header_tu_est_lost_labor','header_tu_est_lost_labor','header_tu_technician'];
for(const tid of headerTids){
  const before=netlog.length;
  if(!await clickTid(tid)) { R.sorts.push({tid,err:'not found'}); continue; }
  await page.waitForTimeout(2500);
  R.sorts.push({tid, headers:await hdrs(), top4:(await rows()).slice(0,4).map(r=>r[0]+' | '+r[r.length-1]),
    bottom3:(await rows()).slice(-3).map(r=>r[0]+' | '+r[r.length-1]),
    apiCalls: netlog.slice(before).filter(n=>n.url.includes('/api/reporting/reports/technician-utilization')).length});
}
await shot('tu-sorted');
// --- reload resets sort? change location to force reload
{const before=netlog.length;
 const locSel=(await page.$$('.q-select'))[2];
 const b=await locSel.boundingBox(); await page.mouse.click(b.x+b.width-14,b.y+b.height/2); await page.waitForTimeout(1200);
 // click the first concrete location to reduce scope
 const its=await page.$$('.q-menu .q-item');
 for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t.startsWith('Staging Heavy Duty')){const bb=await it.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); break;}}
 await page.waitForTimeout(1000); await page.keyboard.press('Escape'); await page.waitForTimeout(5000);
 R.afterLocChange={headers:await hdrs(), rowCount:(await rows()).length, top3:(await rows()).slice(0,3).map(r=>r[0]),
   reloadCalls: netlog.slice(before).filter(n=>n.url.includes('/api/reporting/reports/technician-utilization')).map(n=>n.status+' '+n.url.replace(/^https:\/\/[^/]+/,'').slice(0,150))};
 await shot('tu-after-loc-change');
}
R.lsAfter = await page.evaluate(()=>localStorage.getItem('report_view:technician-utilization'));
fs.writeFileSync(`${OUT}/tu-ui-2.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,9000));
await browser.close();
