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
// mark the Add Part button, click, then capture the row that OPENS (the container right after)
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e)));if(b)b.setAttribute('data-a','1');}, lab);
await page.locator('[data-a="1"]').first().click().catch(()=>{}); await page.waitForTimeout(4500);
// enumerate EVERY control that appeared with the new row: text + aria + title, plus any element literally containing "More"
const dump = await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('button,[role=button],.q-btn,a,[role=menuitem],.q-item,.q-chip').forEach(e=>{
    if(!e.offsetParent) return;
    const t=(e.textContent||'').replace(/\s+/g,' ').trim();
    const a=e.getAttribute('aria-label')||''; const ti=e.title||'';
    const combo=(t+' '+a+' '+ti).toLowerCase();
    if(/more|option|request|expand|detail/.test(combo)) out.push({t:t.slice(0,34),a:a.slice(0,34),ti:ti.slice(0,24)});
  });
  const bodyHasMoreOptions = document.body.innerText.includes('More options')||document.body.innerText.includes('More Options');
  return {out:out.slice(0,25), bodyHasMoreOptions};
});
console.log('BODY has "More options":', dump.bodyHasMoreOptions);
console.log('MORE/OPTION/REQUEST CONTROLS:', JSON.stringify(dump.out));
// Try to find & click a control literally labelled "More options" on the add row; if none, try each more_vert near the add row and read the menu
let opened=null;
const found=await page.evaluate(L=>{const lab=eval(L);const cands=[...document.querySelectorAll('button,.q-btn,[role=button]')].filter(e=>e.offsetParent&&(/More options/i.test(lab(e))||/More options/i.test(e.getAttribute('aria-label')||'')));if(cands.length){cands[0].setAttribute('data-mo','1');return 'text';}return null;}, lab);
if(found){ await page.locator('[data-mo="1"]').click().catch(()=>{}); await page.waitForTimeout(2500);
  opened=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');return d?d.innerText.slice(0,120):null;});
  console.log('clicked text "More options" -> modal:', JSON.stringify(opened));
} else {
  console.log('NO control literally labelled "More options" on the add row.');
  // read every more_vert menu near the add row to find where New/Edit Part Request lives
  const menus=await page.evaluate(()=>{const r=[];document.querySelectorAll('button,[role=button]').forEach(e=>{const a=e.getAttribute('aria-label')||'';if(/context menu|more_vert/i.test(a+e.textContent)){r.push(a||'(icon)');}});return [...new Set(r)];});
  console.log('overflow controls present:', JSON.stringify(menus));
}
await page.screenshot({path:OUT+'/moreopts-fullview-v26.35.9.png'}).catch(()=>{});
await page.goto('https://sv9315.qa.shopview.com/administration/roles-permissions/'+ROLE+'/edit',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
console.log('Tech view:', await setView('Tech view')); await page.waitForTimeout(1200);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s2','1');}, lab);
await page.locator('[data-s2="1"]').click().catch(()=>{}); await page.waitForTimeout(4000);
console.log('RESTORED Tech view');
await browser.close();
