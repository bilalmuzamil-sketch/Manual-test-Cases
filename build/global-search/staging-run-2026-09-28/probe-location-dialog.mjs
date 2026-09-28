import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
await b.page.waitForTimeout(6000);
const header = await b.page.evaluate(() => (document.body.innerText || '').match(/Staging [A-Za-z]+ - \d+/g) || []);
console.log('header says:', JSON.stringify(header));
await b.page.evaluate(() => {
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  const el = [...document.querySelectorAll('button,[role="button"],.q-item,div,span')].filter(e => /Staging \w+ - \d+/.test(t(e)) && t(e).length < 60);
  if (el.length) el[el.length - 1].click();
});
await b.page.waitForTimeout(3000);
const dlg = await b.page.evaluate(() => {
  const d = document.querySelector('.q-dialog, .q-menu'); if (!d) return null;
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  return { text: t(d).slice(0, 400),
           selects: [...d.querySelectorAll('.q-select, select, input')].map(e => ({ cls: String(e.className).slice(0,60), val: e.value })),
           buttons: [...d.querySelectorAll('button')].map(t) };
});
console.log('dialog:', JSON.stringify(dlg, null, 1).slice(0, 900));
await b.page.screenshot({ path: 'location-dialog.png' });
fs.writeFileSync('probe-location-dialog.json', JSON.stringify({ header, dlg }, null, 1));
await b.browser.close();
