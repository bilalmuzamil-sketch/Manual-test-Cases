import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
// open a WO with existing parts: click an Approved row
await page.evaluate(L=>{const lab=eval(L);const tr=[...document.querySelectorAll('table tbody tr')].find(r=>/Approved/i.test(lab(r)));if(tr)tr.querySelector('td:nth-child(3)')?.click();}, lab);
await page.waitForTimeout(6000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{});
await page.waitForTimeout(4000);
console.log('WO:', page.url());
// part row three-dot / context menu
const ctx=await page.evaluate(L=>{const lab=eval(L);
  const mv=[...document.querySelectorAll('.q-btn,button,[class*=more]')].find(e=>/more_vert|more/i.test(e.textContent||e.className||''));
  if(mv){mv.setAttribute('data-mv','1');return true;}return false;}, lab);
if(ctx){ await page.locator('[data-mv="1"]').first().click().catch(()=>{}); await page.waitForTimeout(1500);
  const menu=await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('.q-menu .q-item, .q-menu .q-item__label')].map(lab).filter(Boolean);}, lab);
  console.log('PART/LINE CONTEXT MENU:', JSON.stringify([...new Set(menu)]));
  await page.keyboard.press('Escape').catch(()=>{});
}
// WO header more_vert (top-right) -> look for Print Work Order
await page.evaluate(()=>{const btns=[...document.querySelectorAll('.q-btn,button')];const hdr=btns.find(b=>/more_vert/i.test(b.textContent||'')&&b.getBoundingClientRect().top<200);if(hdr){hdr.setAttribute('data-hdr','1');}});
await page.locator('[data-hdr="1"]').first().click().catch(()=>{});
await page.waitForTimeout(1500);
const womenu=await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('.q-menu .q-item,.q-menu .q-item__label')].map(lab).filter(Boolean);}, lab);
console.log('WO HEADER MENU:', JSON.stringify([...new Set(womenu)]));
await page.screenshot({path:OUT+'/wo-header-menu-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
