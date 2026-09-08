import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
const { browser, page } = await boot('sv9315', '/administration/roles-permissions/'+ROLE+'/edit', 'admin');
await page.waitForTimeout(6000);
async function setView(w){return await page.evaluate((w)=>{const els=[...document.querySelectorAll('*')].filter(e=>(e.textContent||'').trim()===w&&e.children.length<=2&&e.offsetParent);const el=els[0];if(!el)return 'nf';let c=el;for(let i=0;i<4&&c;i++){if(c.matches('[role=radio],.q-radio,button,label,.q-toggle,[role=option],[class*=segment]')){c.click();return 'clk';}c=c.parentElement;}el.click();return 'raw';},w);}
console.log('Full View:', await setView('Full View')); await page.waitForTimeout(1200);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s','1');}, lab);
await page.locator('[data-s="1"]').click().catch(()=>{}); await page.waitForTimeout(4000);
await page.goto('https://sv9315.qa.shopview.com/workorders?tab=estimate',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e)));if(b)b.setAttribute('data-a','1');}, lab);
await page.locator('[data-a="1"]').first().click().catch(()=>{}); await page.waitForTimeout(4000);
// type a Description and a non-catalog part number
const desc=page.locator('input[aria-label="Description"]').last();
await desc.click().catch(()=>{}); await desc.type('ZZAUTOTEST Custom Widget',{delay:40}).catch(()=>{}); await page.waitForTimeout(1500);
const pn=page.locator('input[aria-label="Part number"]').last();
await pn.click().catch(()=>{}); await pn.type('ZZNOCATALOG999',{delay:60}).catch(()=>{}); await page.waitForTimeout(3000);
// dismiss any suggestion dropdown by pressing Escape? No—capture suggestions
const sugg=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,.q-menu [role=option]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,8));
console.log('SUGGESTIONS for non-catalog:', JSON.stringify(sugg));
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
// enumerate ALL controls on the open row with labels
const controls=await page.evaluate(()=>{const out=[];document.querySelectorAll('button,[role=button],.q-btn,a').forEach(e=>{if(!e.offsetParent)return;const t=(e.textContent||'').replace(/\s+/g,' ').trim();const a=e.getAttribute('aria-label')||'';const ti=e.title||'';if(t||a||ti)out.push({t:t.slice(0,26),a:a.slice(0,30),ti:ti.slice(0,22)});});return out.slice(-22);});
console.log('ROW CONTROLS:', JSON.stringify(controls));
await page.screenshot({path:OUT+'/partreq-row-v26.35.9.png'}).catch(()=>{});
// try clicking candidate triggers to open a Part Request modal; test each and check for dialog
async function tryOpen(desc, clickFn){
  await clickFn(); await page.waitForTimeout(2500);
  const dlg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;const h=d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title,.q-card__section');return {title:h?(h.textContent||'').trim().slice(0,50):'',has:/Part Request/i.test(d.innerText)};});
  console.log('  try',desc,'->',JSON.stringify(dlg));
  return dlg&&dlg.has;
}
// candidate 1: a control whose aria/text mentions request/edit/expand/more
let opened=await tryOpen('more_vert on the add row', async()=>{await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button]')].filter(e=>e.offsetParent&&/more_vert|expand|Part context|more options/i.test((e.getAttribute('aria-label')||'')+e.textContent));const el=b[b.length-1];if(el)el.click();});});
if(!opened){ // candidate 2: double-click the Description or a "detail" chevron; or an "edit" icon on the new row
  opened=await tryOpen('edit icon', async()=>{await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button]')].filter(e=>e.offsetParent&&/edit/i.test((e.getAttribute('aria-label')||'')+e.textContent));const el=b[b.length-1];if(el)el.click();});});
}
if(opened){const t=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');const h=d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title,.q-card__section');return h?(h.textContent||'').trim():d.innerText.slice(0,60);});console.log('MODAL TITLE:',JSON.stringify(t));await page.screenshot({path:OUT+'/partreq-modal-v26.35.9.png'}).catch(()=>{});}
else console.log('NO Part Request modal opened from the tried controls.');
// restore Tech view
await page.goto('https://sv9315.qa.shopview.com/administration/roles-permissions/'+ROLE+'/edit',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
console.log('Tech view:', await setView('Tech view')); await page.waitForTimeout(1200);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s2','1');}, lab);
await page.locator('[data-s2="1"]').click().catch(()=>{}); await page.waitForTimeout(4000);
console.log('RESTORED Tech view');
await browser.close();
