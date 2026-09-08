import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315', '/', 'admin');
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders")').first().click().catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/^add\s*Add Part$|Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
await page.locator('[data-qa-add1="1"]').last().click().catch(()=>{}); await page.waitForTimeout(5000);
// type into Part number to trigger the search / new-part-request affordance
const pn=page.locator('input[aria-label="Part number"]').last();
if(await pn.count()){ await pn.click().catch(()=>{}); await pn.type('ZZAUTOTEST-'+Date.now().toString().slice(-5),{delay:40}).catch(()=>{}); await page.waitForTimeout(3500); }
// dump menu/listbox that appeared + any "More options"/"New Part Request" text on page
const pop = await page.evaluate(()=>{
  const items=[...document.querySelectorAll('.q-menu .q-item,.q-menu [role=option],.q-menu [role=menuitem]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  const body=document.body.innerText;
  return {items:[...new Set(items)].slice(0,15),
    moreOptions: body.includes('More options')||body.includes('More Options'),
    newReq: body.includes('New Part Request'), editReq: body.includes('Edit Part Request'),
    sellPrice: body.includes('Sell price')||body.includes('Sell Price')};
});
console.log('POPUP/PAGE:', JSON.stringify(pop));
// scan newly-open add row controls for a "more" / expand-detail affordance
const rowc = await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('.q-menu .q-item, button, [role=button]').forEach(e=>{
    const t=((e.textContent||'')+' '+(e.getAttribute('aria-label')||'')+' '+(e.title||'')).replace(/\s+/g,' ').trim();
    if(/more|option|request|detail|expand more/i.test(t)) out.push(t.slice(0,40));
  });
  return [...new Set(out)].slice(0,20);
});
console.log('MORE-LIKE CONTROLS:', JSON.stringify(rowc));
await page.screenshot({path:OUT+'/add-flow-v26.35.9.png'}).catch(()=>{});
await browser.close();
