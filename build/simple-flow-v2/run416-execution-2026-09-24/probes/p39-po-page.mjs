// Section 6671: the purchase orders page - is it grouped by vendor with Missing vendors first and
// every group collapsed, does a panel expand per purchase order, and does selecting rows raise the
// same bulk bar as the work order?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page } = await bootProdLogin('/parts/orders', { settle: 15000 });
page.setDefaultTimeout(20000);
console.log('URL:', page.url());
const t = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/C44589-po-page.txt`, t);
await page.screenshot({ path: `${EV}/C44589-po-page.png`, fullPage: false });
const head = await page.evaluate(() => ({
  headers: [...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean),
  groupHeaders: [...document.querySelectorAll('[class*=group], .q-expansion-item__container > .q-item, .q-expansion-item')].map(e=>(e.innerText||'').split('\n')[0].trim()).filter(Boolean).slice(0,20),
  expandAll: /Expand all/i.test(document.body.innerText),
  vendorMissing: (document.body.innerText.match(/Vendor missing/gi)||[]).length,
  rows: [...document.querySelectorAll('tbody tr')].length
}));
console.log('COLUMN HEADERS:', JSON.stringify(head.headers));
console.log('group headers seen:', JSON.stringify(head.groupHeaders));
console.log('"Expand all" on the page:', head.expandAll, '| "Vendor missing" occurrences:', head.vendorMissing, '| rows:', head.rows);
console.log('--- first 1200 characters of the list ---');
const i = t.indexOf('Vendors'); console.log(t.slice(i>0?i+8:0, (i>0?i:0)+1400));
// selection -> bulk bar
const boxes = page.locator('tbody tr input[type=checkbox], tbody tr .q-checkbox');
const n = await boxes.count(); console.log('tick boxes on rows:', n);
let bar = null;
if (n) {
  const firstRow = page.locator('tbody tr').first();
  await firstRow.hover(); await page.waitForTimeout(900);
  try { await boxes.first().click({ timeout: 8000 }); } catch(e) { console.log('tick:', e.message.split('\n')[0]); }
  await page.waitForTimeout(3000);
  bar = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].filter(e => /selected/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length < 150).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
    return el ? { text:(el.innerText||'').replace(/\s+/g,' ').trim(), buttons:[...el.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean) } : null;
  });
  console.log('BULK BAR on the purchase orders page:', JSON.stringify(bar));
  await page.screenshot({ path: `${EV}/C53488-po-bulk-bar.png` });
}
fs.writeFileSync(`${EV}/C44589-po.json`, JSON.stringify({ head, bar }, null, 1));
await browser.close();
