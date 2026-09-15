// Two things, both of which my last probe could not settle honestly.
//
// C  SV-10061. Reading a CSS class to decide "which row is selected" is a guess, and the guess said
//    the seventh row was selected before anything was hovered, which contradicts the report's own
//    first line. So stop reading classes and do what a person does: press Enter and see WHICH RECORD
//    OPENS. Twice - once without touching the mouse, once after the mouse has passed over a row and
//    moved away. If the two differ, the report is true from the user's side and needs no class at all.
//
// A  SV-10001. /parts/catalog is a not-found page on this branch, so the catalogue has some other
//    address. Walk the Parts menu and see what it actually offers before saying the part is missing.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/enter-catalogue`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/ENTER-CATALOGUE.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP } = await boot('sv9160','/','admin');

const open=async()=>{ await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const type=async(q)=>{ await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:40}); await page.waitForTimeout(10000); };
const rowText=(i)=>page.evaluate((n)=>{const r=[...document.querySelectorAll('[data-test-id^="search_result_row_"]')][n];
  return r?(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,60):null;},i);

// --- C1  no mouse at all: type, press Enter, see where we land
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
await open(); await type('Truck');
R.plain={firstRow:await rowText(0), rows:await page.evaluate(()=>document.querySelectorAll('[data-test-id^="search_result_row_"]').length)};
await page.keyboard.press('Enter'); await page.waitForTimeout(8000);
R.plain.landedOn=page.url();
R.plain.pageTitle=await page.evaluate(()=>{const h=document.querySelector('h1,h2,.text-h6'); return h?(h.innerText||'').trim().slice(0,60):null;});
await page.screenshot({path:`${EV}/enter-without-mouse.png`});
L('C without touching the mouse, Enter opened:', R.plain.landedOn, '|', R.plain.pageTitle);
L('C   the first row was:', R.plain.firstRow);
save();

// --- C2  same again, but let the pointer pass over the ninth row and move away
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
await open(); await type('Truck');
const box=await page.evaluate(()=>{const rs=[...document.querySelectorAll('[data-test-id^="search_result_row_"]')];
  const r=rs[8]||rs[rs.length-1]; if(!r) return null; const b=r.getBoundingClientRect();
  return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2),text:(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)};});
R.hovered={row:box&&box.text, firstRow:await rowText(0)};
if(box){ await page.mouse.move(box.x,box.y); await page.waitForTimeout(1500);
         await page.mouse.move(20,300); await page.waitForTimeout(3000); }
await page.keyboard.press('Enter'); await page.waitForTimeout(8000);
R.hovered.landedOn=page.url();
R.hovered.pageTitle=await page.evaluate(()=>{const h=document.querySelector('h1,h2,.text-h6'); return h?(h.innerText||'').trim().slice(0,60):null;});
await page.screenshot({path:`${EV}/enter-after-hover.png`});
R.enterVerdict = { differentRecord: R.plain.landedOn!==R.hovered.landedOn,
  openedTheHoveredOne: !!(box && R.hovered.pageTitle && box.text.toLowerCase().startsWith((R.hovered.pageTitle||'').toLowerCase().slice(0,14))) };
L('C after the mouse passed over row nine and left, Enter opened:', R.hovered.landedOn, '|', R.hovered.pageTitle);
L('C   the row the mouse passed over was:', box&&box.text);
L('C   a DIFFERENT record from the no-mouse run:', R.enterVerdict.differentRecord);
save();

// --- A  walk the Parts menu for the catalogue
await page.goto(`${APP}/parts/inventory`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.partsMenu=await page.evaluate(()=>[...document.querySelectorAll('a[href*="/parts"]')]
   .map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,28),href:e.getAttribute('href')}))
   .filter(x=>x.text));
L('A the Parts screens on offer:', JSON.stringify(R.partsMenu).slice(0,500));
save();
for (const r of (R.partsMenu||[]).map(x=>x.href).filter((v,i,a)=>a.indexOf(v)===i).slice(0,8)) {
  await page.goto(`${APP}${r}`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
  const has=await page.evaluate(()=>/ZZT-77-3300/.test(document.body.innerText||''));
  const txt=await page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean).slice(14,26));
  R['parts_'+r.replace(/\W/g,'_')]={url:page.url(), holdsThePart:has, shows:txt};
  L('A ', r.padEnd(26), has?'HOLDS ZZT-77-3300':'-', JSON.stringify(txt).slice(0,150)); }
save(); L('DONE'); await browser.close();
