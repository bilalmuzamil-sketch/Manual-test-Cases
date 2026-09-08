import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974'; // Admin role edited earlier
const { browser, page } = await boot('sv9315', '/administration/roles-permissions/'+ROLE+'/edit', 'admin');
await page.waitForTimeout(6000);
async function setView(which){
  // find the View mode toggle and click the requested option
  const done = await page.evaluate((w)=>{
    // radios/toggles labeled Full View / Tech view
    const cands=[...document.querySelectorAll('*')].filter(e=>{
      const t=(e.textContent||'').trim(); return t===w && e.children.length<=2 && e.offsetParent;});
    // click the closest clickable ancestor
    const el=cands[0]; if(!el) return 'label-not-found';
    let c=el; for(let i=0;i<4 && c;i++){ if(c.matches('[role=radio],.q-radio,button,label,.q-toggle,[role=option]')){c.click();return 'clicked '+c.className.slice(0,30);} c=c.parentElement;}
    el.click(); return 'clicked-raw';
  }, which);
  return done;
}
console.log('set Full View:', await setView('Full View'));
await page.waitForTimeout(1500);
// Save
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b){b.setAttribute('data-qa-save','1');}}, lab);
await page.locator('[data-qa-save="1"]').click().catch(()=>{}); await page.waitForTimeout(5000);
console.log('saved Full View');
// now go to a WO and open Add Part
await page.goto('https://sv9315.qa.shopview.com/workorders?tab=estimate',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
await page.locator('[data-qa-add1="1"]').first().click().catch(()=>{}); await page.waitForTimeout(5000);
const flds = await page.evaluate(()=>[...document.querySelectorAll('.q-field__label')].map(e=>(e.textContent||'').trim()).filter(Boolean));
console.log('FULLVIEW FIELD LABELS:', JSON.stringify([...new Set(flds)]));
const body = await page.evaluate(()=>document.body.innerText);
for(const t of ['Cost','Sell price','More options','More Options','Category']) console.log('  ',t,':',body.includes(t));
const rowctl = await page.evaluate(()=>[...document.querySelectorAll('button,[role=button],.q-btn')].map(e=>((e.textContent||'')+'|'+(e.getAttribute('aria-label')||'')).replace(/\s+/g,' ').trim()).filter(t=>/more|option/i.test(t)));
console.log('MORE-CTRLS:', JSON.stringify([...new Set(rowctl)].slice(0,12)));
await page.screenshot({path:OUT+'/fullview-row-v26.35.9.png'}).catch(()=>{});
// RESTORE: set back to Tech view
await page.goto('https://sv9315.qa.shopview.com/administration/roles-permissions/'+ROLE+'/edit',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
console.log('set Tech view:', await setView('Tech view'));
await page.waitForTimeout(1500);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-qa-save2','1');}, lab);
await page.locator('[data-qa-save2="1"]').click().catch(()=>{}); await page.waitForTimeout(5000);
console.log('RESTORED Tech view');
await browser.close();
