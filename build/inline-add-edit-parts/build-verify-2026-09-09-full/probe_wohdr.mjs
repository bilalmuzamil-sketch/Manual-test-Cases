import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders/6a529a5f-dff9-4c13-9636-b41500e585f0/lines','admin');
await page.waitForTimeout(8000);
console.log('URL:', page.url());
// WO header more_vert (top area). Find a more_vert button near the top of the page.
const opened=await page.evaluate(L=>{const lab=eval(L);
  const btns=[...document.querySelectorAll('.q-btn,button')].filter(b=>/more_vert/i.test(b.textContent||''));
  // pick the top-most more_vert (WO header)
  btns.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);
  if(btns[0]){btns[0].click();return true;}return false;}, lab);
await page.waitForTimeout(1500);
const menu=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('.q-menu .q-item,.q-menu .q-item__label')].map(lab).filter(Boolean))];}, lab);
console.log('WO HEADER MENU:', JSON.stringify(menu));
await page.screenshot({path:OUT+'/wohdr-menu-v2636.png',fullPage:true}).catch(()=>{});
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(800);
// part row three-dot context menu (a part row's more_vert)
const pctx=await page.evaluate(L=>{const lab=eval(L);
  // find a part row (has a part name in parentheses) and its more_vert
  const rows=[...document.querySelectorAll('tr,.q-item,div')].filter(r=>/\([A-Za-z0-9]/.test(lab(r))&&r.querySelector('.q-btn,button'));
  for(const r of rows){const mv=[...r.querySelectorAll('.q-btn,button')].find(b=>/more_vert/i.test(b.textContent||''));if(mv){mv.click();return true;}}
  return false;}, lab);
await page.waitForTimeout(1200);
const pmenu=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('.q-menu .q-item,.q-menu .q-item__label')].map(lab).filter(Boolean))];}, lab);
console.log('PART CONTEXT MENU:', JSON.stringify(pmenu));
await browser.close();
