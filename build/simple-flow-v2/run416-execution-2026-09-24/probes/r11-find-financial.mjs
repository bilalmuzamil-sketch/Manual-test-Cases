import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='c29fd819-f798-49b5-87f0-92948c859e9a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(12000);
const found = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    if (el.children.length) continue;
    const t = (el.textContent||'').trim();
    if (!/financial/i.test(t)) continue;
    let row = el.parentElement, chain = [];
    for (let i = 0; i < 6 && row; i++) {
      chain.push(row.tagName.toLowerCase() + '.' + (row.className||'').toString().split(' ').slice(0,2).join('.'));
      const cbs = [...row.querySelectorAll('.q-checkbox, input[type=checkbox]')];
      const tgs = [...row.querySelectorAll('.q-toggle')];
      if (cbs.length || tgs.length) return_ = null;
      if (cbs.length || tgs.length) { out.push({ label: t, depth: i, checkboxes: cbs.length, toggles: tgs.length,
        checked: cbs.map(c => c.getAttribute('aria-checked') || (c.querySelector('input')||{}).checked),
        rowText: (row.innerText||'').replace(/\s+/g,' ').slice(0,120), chain: chain.join(' < ') }); break; }
      row = row.parentElement;
    }
  }
  return out;
});
console.log(JSON.stringify(found, null, 1).slice(0, 2500));
fs.writeFileSync(`${EV}/financial-control.json`, JSON.stringify(found,null,1));
await page.screenshot({ path: `${EV}/role-editor-financial.png`, fullPage: true });
await browser.close();
