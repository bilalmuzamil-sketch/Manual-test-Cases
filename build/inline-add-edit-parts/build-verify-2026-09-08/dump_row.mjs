import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const { browser, page } = await boot('sv9315', '/', 'admin');
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders")').first().click().catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
await page.locator('[data-qa-add1="1"]').click(); await page.waitForTimeout(4500);
const dump=await page.evaluate(()=>[...document.querySelectorAll('input,textarea')].filter(i=>i.offsetParent).map((i,idx)=>{
  const fld=i.closest('.q-field'); const lblEl=fld?fld.querySelector('.q-field__label'):null;
  return {idx, ph:i.placeholder||'', aria:i.getAttribute('aria-label')||'', type:i.type,
    fieldLabel:lblEl?(lblEl.textContent||'').trim():'', val:(i.value||'').slice(0,12)};}));
console.log(JSON.stringify(dump,null,0).slice(0,1600));
await browser.close();
