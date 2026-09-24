import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const ID='47abc3c7-93a1-401c-9344-547e1066a4a2'; // S2-861, approved, 12 parts
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(20000);
for (const r of [`/workorders/${ID}`, `/work-orders/${ID}`, `/workorders/${ID}/lines`, `/workorders/view/${ID}`]) {
  await page.goto('https://app.shopview.com'+r, { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(8000);
  const t = await page.evaluate(()=>document.body.innerText);
  const is404 = t.includes('404:');
  console.log(r, '->', page.url(), is404 ? 'NOT FOUND' : 'OK len='+t.length);
  if (!is404) { console.log(t.slice(Math.max(0,t.indexOf('Invoices')), 1800)); break; }
}
await browser.close();
