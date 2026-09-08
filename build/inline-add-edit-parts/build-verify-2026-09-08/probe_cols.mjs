import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
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
await page.locator('[data-qa-add1="1"]').first().click().catch(()=>{}); await page.waitForTimeout(5000);
// dump every table's headers within the lines area, and the placeholder/aria of ALL inputs in the open row
const info = await page.evaluate(()=>{
  const tables=[...document.querySelectorAll('table')].map(t=>({
    heads:[...t.querySelectorAll('thead th')].map(h=>(h.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean)
  })).filter(t=>t.heads.length);
  const inputs=[...document.querySelectorAll('input,textarea')].filter(i=>i.offsetParent).map(i=>({
    ph:i.placeholder||'', aria:i.getAttribute('aria-label')||'', name:i.getAttribute('name')||''
  })).filter(x=>x.ph||x.aria||x.name);
  return {tables, inputs:inputs.slice(-15)};
});
console.log('TABLE HEADERS:', JSON.stringify(info.tables));
console.log('OPEN-ROW INPUTS:', JSON.stringify(info.inputs));
await browser.close();
