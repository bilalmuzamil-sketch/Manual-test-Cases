// Two small things that finish the last two reports honestly.
//
// A  The catalogue is at /parts/parts-catalogue - found by walking the Parts menu, not guessing.
//    Search it for ZZT-77-3300. If the part is not there, SV-10001 is void the way SV-10015 was, and
//    saying so is the whole job. Search it for ZZAUTOTEST too, as a control on the screen itself.
// B  Name the two records the Enter test opened, so the report can say plainly which record a person
//    gets with the mouse untouched and which one they get after the pointer has crossed the list.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/catalogue-names`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/CATALOGUE-NAMES.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP } = await boot('sv9160','/','admin');

// --- A the catalogue, through its own screen
await page.goto(`${APP}/parts/parts-catalogue`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(12000);
R.catalogueScreen={url:page.url(),
  inputs:await page.evaluate(()=>[...document.querySelectorAll('input')]
    .map(e=>({ph:e.getAttribute('placeholder'),al:e.getAttribute('aria-label')})).slice(0,8)),
  firstRows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')]
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)).slice(0,6))};
L('A catalogue screen:', page.url(), '| inputs', JSON.stringify(R.catalogueScreen.inputs).slice(0,200));
L('A first rows:', JSON.stringify(R.catalogueScreen.firstRows).slice(0,260));
await page.screenshot({path:`${EV}/catalogue.png`});
const look=async(term)=>{
  await page.goto(`${APP}/parts/parts-catalogue`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
  const ok=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')]
      .find(e=>/search/i.test((e.getAttribute('placeholder')||'')+(e.getAttribute('aria-label')||'')))
      ||document.querySelector('input'); if(!i) return false; i.focus(); return true;});
  if(ok){ await page.keyboard.type(term,{delay:45}); await page.waitForTimeout(9000); }
  const rows=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')]
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)).slice(0,8));
  await page.screenshot({path:`${EV}/catalogue-${term.replace(/\W/g,'')}.png`});
  return {typed:term, foundABox:ok, rows};
};
R.catalogueZZT=await look('ZZT-77-3300');
L('A catalogue searched for ZZT-77-3300 ->', JSON.stringify(R.catalogueZZT).slice(0,300));
R.catalogueControl=await look('ZZAUTOTEST');
L('A catalogue searched for ZZAUTOTEST  ->', JSON.stringify(R.catalogueControl).slice(0,300));
save();

// --- B name the two records
const name=async(u)=>{ await page.goto(u,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
  return page.evaluate(()=>{const t=(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const i=t.findIndex(s=>/^AS$|Staging Heavy Duty/.test(s)); return t.slice(i+1,i+3).join(' | ');});};
R.enterPlainRecord=await name('https://sv9160.qa.shopview.com/customers/7e90eb07-a144-465b-9743-df9c35d9b587/work-orders');
R.enterHoveredRecord=await name('https://sv9160.qa.shopview.com/customers/a6f3a7bb-d3ea-448c-a16b-d3bae64298a8/work-orders');
L('B with the mouse untouched, Enter opened :', R.enterPlainRecord);
L('B after the pointer crossed the list    :', R.enterHoveredRecord);
save(); L('DONE'); await browser.close();
