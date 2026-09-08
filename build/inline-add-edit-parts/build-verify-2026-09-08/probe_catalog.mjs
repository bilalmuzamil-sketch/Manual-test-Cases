import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
const { browser, page } = await boot('sv9315', '/administration/roles-permissions/'+ROLE+'/edit', 'admin');
await page.waitForTimeout(6000);
async function setView(w){return await page.evaluate((w)=>{const els=[...document.querySelectorAll('*')].filter(e=>(e.textContent||'').trim()===w&&e.children.length<=2&&e.offsetParent);const el=els[0];if(!el)return 'nf';let c=el;for(let i=0;i<4&&c;i++){if(c.matches('[role=radio],.q-radio,button,label,.q-toggle,[role=option],.wo-settings__segment,[class*=segment]')){c.click();return 'clk';}c=c.parentElement;}el.click();return 'raw';},w);}
console.log('Full View:', await setView('Full View')); await page.waitForTimeout(1200);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s','1');}, lab);
await page.locator('[data-s="1"]').click().catch(()=>{}); await page.waitForTimeout(4000);
// open WO
await page.goto('https://sv9315.qa.shopview.com/workorders?tab=estimate',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e)));if(b)b.setAttribute('data-a','1');}, lab);
await page.locator('[data-a="1"]').first().click().catch(()=>{}); await page.waitForTimeout(4000);
// type the real catalog part number in Part number
const pn=page.locator('input[aria-label="Part number"]').last();
await pn.click().catch(()=>{}); await pn.type('F40010212',{delay:80}).catch(()=>{}); await page.waitForTimeout(4000);
const sugg=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,.q-menu [role=option]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,8));
console.log('SUGGESTIONS:', JSON.stringify(sugg));
// click a suggestion marked Catalog
await page.evaluate(()=>{const it=[...document.querySelectorAll('.q-menu .q-item,.q-menu [role=option]')].find(e=>/catalog|F40010212|Slack Adjuster/i.test(e.textContent||''));if(it)it.click();});
await page.waitForTimeout(4000);
const body=await page.evaluate(()=>document.body.innerText);
for(const t of ['Cost','Sell price','More options','More Options','Category']) console.log('  ',t,':',body.includes(t));
const ctrls=await page.evaluate(()=>[...document.querySelectorAll('button,[role=button],.q-btn')].map(e=>((e.textContent||'')+'|'+(e.getAttribute('aria-label')||'')).replace(/\s+/g,' ').trim()).filter(t=>/more option|more_vert|more/i.test(t)));
console.log('MORE-CTRLS:', JSON.stringify([...new Set(ctrls)].slice(0,12)));
// click "More options" if present
const hasMore=await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].find(e=>/More options/i.test(lab(e))||/More options/i.test(e.getAttribute('aria-label')||''));if(b){b.setAttribute('data-m','1');return true;}return false;}, lab);
console.log('found More options control:', hasMore);
if(hasMore){await page.locator('[data-m="1"]').click().catch(()=>{});await page.waitForTimeout(3000);
  const modal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');return d?d.innerText.slice(0,250):'(no dialog)';});
  console.log('MODAL:', JSON.stringify(modal.slice(0,180)));
}
await page.screenshot({path:OUT+'/catalog-part-v26.35.9.png'}).catch(()=>{});
// restore Tech view
await page.goto('https://sv9315.qa.shopview.com/administration/roles-permissions/'+ROLE+'/edit',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
console.log('Tech view:', await setView('Tech view')); await page.waitForTimeout(1200);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s2','1');}, lab);
await page.locator('[data-s2="1"]').click().catch(()=>{}); await page.waitForTimeout(4000);
console.log('RESTORED Tech view');
await browser.close();
