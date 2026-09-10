// Last route to a multi-bin part: CLICK the Inventory-Parts count on Settings -> Bin Locations,
// rather than constructing /parts/inventory?binLocation=... Everything else has been tried and
// refused or ignored:
//   inventory/parts/change with a bins array   -> 201, bins silently unchanged
//   .../parts/{id}/bins                        -> 404
//   .../parts/transfer, .../parts/adjust-bins  -> 405
//   GET /api/inventory/parts?binLocation=<id>  -> filter IGNORED (8 bins, identical 200 rows)
//   /parts/inventory?binLocation=<name> by URL -> filter IGNORED (4 bins, identical 32 rows)
// If the click path also fails to filter, the four multi-bin cases are genuinely not testable here
// and that is reported as a proven data-state limit rather than ground down further.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={byBin:{}};
const save=()=>fs.writeFileSync(`${DIR}/evidence/92-bins-click.json`, JSON.stringify(R,null,1));
for (const bin of ['A1A','A1B','A1C']){
  await page.goto(`${APP}/administration/bins`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  const clicked = await page.evaluate(({vis,bin})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const row=[...document.querySelectorAll('tbody tr')].find(r=>{const c=[...r.querySelectorAll('td')].map(t); return c[0]===bin;});
    if(!row) return 'row for '+bin+' not found';
    const cells=[...row.querySelectorAll('td')];
    const countCell=cells[1]; if(!countCell) return 'no count cell';
    const link=countCell.querySelector('a,button,[role=button],span') || countCell;
    link.click(); return 'clicked the count "'+t(countCell)+'" on '+bin;}, {vis:VIS, bin});
  await page.waitForTimeout(12000);
  const grab = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hdr=[...document.querySelectorAll('thead th')].map(t);
    const rows=[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t));
    const i=hdr.findIndex(h=>/part\s*number/i.test(h));
    return {url:location.href, n:rows.length, pns: i>=0 ? rows.map(r=>r[i]).filter(Boolean) : []};});
  R.byBin[bin] = {clicked, url:grab.url, n:grab.n, pns:grab.pns};
  log('%s -> %s | url=%s | %d rows', bin, clicked, grab.url, grab.n);
  log('   parts: %s', JSON.stringify(grab.pns).slice(0,220));
  await page.screenshot({path:`${DIR}/evidence/92-${bin}.png`, fullPage:true});
  save();
}
const counts={};
for (const [bin,v] of Object.entries(R.byBin)) for (const pn of (v.pns||[])) (counts[pn]=counts[pn]||[]).push(bin);
const lists = Object.values(R.byBin).map(v=>JSON.stringify(v.pns));
R.allIdentical = lists.length>1 && lists.every(x=>x===lists[0]);
R.multiBin = R.allIdentical ? [] : Object.entries(counts).filter(([,b])=>b.length>1).map(([pn,bins])=>({pn,bins}));
log('are the three lists identical (i.e. the filter is ignored again)? %s', R.allIdentical);
log('genuine multi-bin parts: %s', JSON.stringify(R.multiBin).slice(0,400));
save();
await s.browser.close();
