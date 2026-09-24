// The work order's own Parts tab lists every part with its state and the actions offered - use that
// rather than the lines feed, which does not return them all.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO=process.argv[2] || '068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(10000);
const clicked = await page.evaluate(() => {
  const t = [...document.querySelectorAll('[role=tab], .q-tab, a, button')].find(e => /^Parts \(\d+\)$/.test((e.innerText||'').trim()));
  if (!t) return 'no Parts tab: ' + [...document.querySelectorAll('[role=tab], .q-tab')].map(e=>(e.innerText||'').trim()).slice(0,8).join(' | ');
  t.click(); return 'clicked ' + (t.innerText||'').trim();
});
console.log(clicked);
await page.waitForTimeout(9000);
console.log('URL:', page.url());
const t = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/parts-tab.txt`, t);
await page.screenshot({ path: `${EV}/parts-tab.png`, fullPage: true });
const headers = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean));
console.log('columns:', JSON.stringify(headers));
const rows = await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>({
  text:(tr.innerText||'').replace(/\s+/g,' ').trim().slice(0,110),
  badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
  actions:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)
})).filter(r=>r.text));
console.log('rows:', rows.length);
for (const r of rows) console.log(' ', JSON.stringify(r));
fs.writeFileSync(`${EV}/parts-tab.json`, JSON.stringify({headers, rows}, null, 1));
await browser.close();
