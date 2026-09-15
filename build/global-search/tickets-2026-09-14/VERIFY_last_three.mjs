// Three things left before the last reports can be rewritten, and one of them is a "does the record
// even exist" question of exactly the kind that has already voided one report today.
//
//  A  SV-10001 - is there a catalogue part numbered ZZT-77-3300 on THIS branch? It is not in
//     inventory (that is the point of the report), so the inventory list cannot answer it. Ask the
//     screens that read the catalogue, and sweep the obvious addresses.
//  B  SV-10059 - after a search that matches nothing, does clearing the box bring the recently
//     viewed list back?
//  C  SV-10061 - does moving the mouse over a row change which record Enter opens, and does it stay
//     changed after the mouse leaves and after the search is closed and reopened?
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/last-three`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/LAST-THREE.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p)=>page.evaluate(async(u)=>{ try{
    const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); return {status:r.status,head:t.slice(0,240)};}catch(e){return {error:String(e).slice(0,110)};}},
  `https://${APIH}${p}`);

// ---- A - the catalogue part -------------------------------------------------
R.catalogue={};
for (const p of ['/api/parts/catalogue?search=ZZT-77-3300','/api/catalogue/parts?search=ZZT-77-3300',
  '/api/parts-catalog?search=ZZT-77-3300','/api/parts/search?search=ZZT-77-3300',
  '/api/inventory/catalogue?search=ZZT-77-3300','/api/parts-catalogue/parts/list?search=ZZT-77-3300',
  '/api/parts?search=ZZT-77-3300','/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=5&search=Airline%20Coupler']) {
  const r=await api(p); R.catalogue[p]=r;
  L('A asked', p.split('?')[0].padEnd(36), r.status||r.error, (r.head||'').slice(0,110)); }
save();
// and through the screen: the part-search on a job's Add part
await page.goto(`${APP}/parts/catalog`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(12000);
R.catalogScreen={url:page.url(), text:(await page.evaluate(()=>(document.body.innerText||'')
    .split('\n').map(s=>s.trim()).filter(Boolean))).slice(8,40)};
await page.screenshot({path:`${EV}/parts-catalog.png`,fullPage:true});
L('A the catalogue screen shows:', JSON.stringify(R.catalogScreen.text).slice(0,320));
save();

// ---- shared search helpers --------------------------------------------------
const open=async()=>{ await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const rowsNow=()=>page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="search_result_row_"]')]
    .map((e,i)=>({i, id:e.getAttribute('data-test-id'),
      selected:/selected|active|highlight/i.test(e.className)||e.getAttribute('aria-selected')==='true',
      text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)})));
const panelWords=()=>page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
    .filter(e=>e.getBoundingClientRect().width>2).pop(); return d?(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,260):null;});

// ---- B - the recently viewed list ------------------------------------------
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
await open(); await page.waitForTimeout(4000);
const recentsBefore=await rowsNow();
await page.type('[data-test-id="search_modal_input"]','zzzqqqxxx',{delay:40}); await page.waitForTimeout(9000);
const duringWords=await panelWords();
await page.screenshot({path:`${EV}/recents-no-results.png`});
await page.fill('[data-test-id="search_modal_input"]',''); await page.waitForTimeout(8000);
const recentsAfter=await rowsNow();
const afterWords=await panelWords();
await page.screenshot({path:`${EV}/recents-after-clearing.png`});
R.recents={countBeforeTyping:recentsBefore.length, wordsWhileNothingMatched:duringWords,
  countAfterClearing:recentsAfter.length, wordsAfterClearing:afterWords,
  stillReproduces: recentsBefore.length>0 && recentsAfter.length===0};
save();
L('B recent list before typing:',recentsBefore.length,'| after clearing:',recentsAfter.length,
  '=>', R.recents.stillReproduces?'STILL A PROBLEM':'NOT A PROBLEM');

// ---- C - the mouse moves what Enter opens ----------------------------------
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
await open();
await page.fill('[data-test-id="search_modal_input"]','');
await page.type('[data-test-id="search_modal_input"]','Truck',{delay:40}); await page.waitForTimeout(10000);
const first=await rowsNow();
const sel=(rs)=>{const s=rs.find(r=>r.selected); return s?s.i:null;};
R.enter={rows:first.length, selectedAtFirst:sel(first), selectedText:(first.find(r=>r.selected)||{}).text};
// hover the ninth row, then take the mouse right away from the list
const box=await page.evaluate(()=>{const rs=[...document.querySelectorAll('[data-test-id^="search_result_row_"]')];
  const r=rs[8]||rs[rs.length-1]; if(!r) return null; const b=r.getBoundingClientRect();
  return {x:Math.round(b.x+b.width/2), y:Math.round(b.y+b.height/2), text:(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)};});
if(box){ await page.mouse.move(box.x,box.y); await page.waitForTimeout(1500);
  await page.mouse.move(20,300); await page.waitForTimeout(2500); }
const afterHover=await rowsNow();
R.enter.hoveredRowText=box&&box.text;
R.enter.selectedAfterHoverAndLeaving=sel(afterHover);
R.enter.selectedTextAfter=(afterHover.find(r=>r.selected)||{}).text;
await page.screenshot({path:`${EV}/enter-after-hover.png`});
// close and reopen, same page
await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
await open(); await page.waitForTimeout(3000);
await page.fill('[data-test-id="search_modal_input"]','');
await page.type('[data-test-id="search_modal_input"]','Truck',{delay:40}); await page.waitForTimeout(10000);
const reopened=await rowsNow();
R.enter.selectedAfterReopening=sel(reopened);
R.enter.selectedTextAfterReopening=(reopened.find(r=>r.selected)||{}).text;
R.enter.stillReproduces = R.enter.selectedAtFirst===0 && R.enter.selectedAfterHoverAndLeaving!==0
                          && R.enter.selectedAfterHoverAndLeaving!==null;
await page.screenshot({path:`${EV}/enter-after-reopening.png`});
save();
L('C selected first:',R.enter.selectedAtFirst,'| after hovering row 9 and leaving:',R.enter.selectedAfterHoverAndLeaving,
  '| after closing and reopening:',R.enter.selectedAfterReopening,
  '=>', R.enter.stillReproduces?'STILL A PROBLEM':'NOT A PROBLEM AS DESCRIBED');
L('DONE'); await browser.close();
