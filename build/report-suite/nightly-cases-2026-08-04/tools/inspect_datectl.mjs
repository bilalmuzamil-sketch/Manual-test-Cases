import { boot } from '../../viu-2026-08-03/tools/boot8582.mjs';
const { browser, page } = await boot('admin');
await page.goto('https://sv8582.qa.shopview.com/reports/inventory-value', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(8000);
const info = await page.evaluate(() => {
  const res = { inputs: [], buttons: [], selects: [] };
  document.querySelectorAll('input').forEach(i => res.inputs.push({
    type: i.type, ph: i.placeholder, val: (i.value||'').slice(0,40), aria: i.getAttribute('aria-label'), cls: (i.className||'').slice(0,60) }));
  document.querySelectorAll('button,[role=button],.q-btn').forEach(b => { const t=(b.innerText||'').trim().slice(0,40); if(t) res.buttons.push(t); });
  document.querySelectorAll('.q-select,.q-field').forEach(s => { const t=(s.innerText||'').trim().replace(/\n/g,'|').slice(0,60); if(t) res.selects.push(t); });
  return res;
});
console.log(JSON.stringify(info, null, 1).slice(0, 3000));
await browser.close();
