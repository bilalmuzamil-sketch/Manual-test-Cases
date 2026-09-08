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
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
await page.locator('[data-qa-add1="1"]').click().catch(()=>{}); await page.waitForTimeout(5000);
// Dump every button title/aria + placeholder near the new row
const controls = await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('button,[role=button],.q-btn').forEach(e=>{
    const t=(e.textContent||'').replace(/\s+/g,' ').trim();
    const a=e.getAttribute('aria-label')||''; const ti=e.title||'';
    if(t||a||ti) out.push({t:t.slice(0,30),a:a.slice(0,30),ti:ti.slice(0,30)});
  });
  return out.slice(-25);
});
console.log('ROW CONTROLS(last25):', JSON.stringify(controls));
// find more_vert / More options and click
const clicked = await page.evaluate(()=>{
  const cand=[...document.querySelectorAll('button,[role=button],.q-btn')].filter(e=>{
    const a=(e.getAttribute('aria-label')||'')+' '+(e.title||'')+' '+(e.textContent||'');
    return /more_vert|more options|more/i.test(a) || e.querySelector('i.q-icon')?.textContent==='more_vert';
  });
  const el=cand[cand.length-1]; if(el){el.setAttribute('data-qa-m','1');return true;} return false;
});
console.log('found more control:', clicked);
if(clicked){ await page.locator('[data-qa-m="1"]').click().catch(()=>{}); await page.waitForTimeout(2500);
  const menu = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,.q-menu [role=menuitem]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean));
  console.log('MENU:', JSON.stringify(menu));
  await page.screenshot({path:OUT+'/inline-more-menu-v26.35.9.png'}).catch(()=>{});
}
await browser.close();
