import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page } = await bootProdLogin('/workorders', { settle: 15000, timeout: 20000 });
page.setDefaultTimeout(20000);
const rows = await page.evaluate(()=>{
  const out=[];
  for (const tr of document.querySelectorAll('tr')) { const t=(tr.innerText||'').trim(); if (/S2-\d+/.test(t)) out.push(t.split('\n').slice(0,3).join(' | ')); }
  return out.slice(0,5);
});
console.log('ROWS SEEN:', JSON.stringify(rows,null,1));
// click the first row that shows a work order number and see where it goes
const r = page.locator('tr', { hasText: /S2-\d+/ }).first();
console.log('row count', await page.locator('tr', { hasText: /S2-\d+/ }).count());
await r.click();
await page.waitForTimeout(9000);
console.log('URL ->', page.url());
const tabs = await page.evaluate(()=>[...document.querySelectorAll('[role=tab], .q-tab')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('TABS:', JSON.stringify(tabs));
await browser.close();
