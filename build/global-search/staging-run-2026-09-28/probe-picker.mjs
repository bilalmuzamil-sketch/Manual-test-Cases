import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
await b.page.waitForTimeout(9000);
const clicked = await b.page.evaluate(() => {
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  const el = [...document.querySelectorAll('*')].filter(e => t(e) === 'Staging Heavy Duty - 9919');
  const pick = el[el.length - 1]; if (!pick) return null;
  pick.click(); return { cls: String(pick.className).slice(0, 80), tag: pick.tagName };
});
await b.page.waitForTimeout(4000);
const dump = await b.page.evaluate(() => {
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  const overlays = [...document.querySelectorAll('.q-dialog, .q-menu, [role="dialog"], [role="menu"], .q-popup-proxy')];
  return overlays.map(o => ({
    cls: String(o.className).slice(0, 70), text: t(o).slice(0, 400),
    options: [...o.querySelectorAll('.q-item, [role="option"], li, button')].map(t).filter(Boolean).slice(0, 15),
    selects: [...o.querySelectorAll('.q-field, .q-select, input')].map(e => ({ cls: String(e.className).slice(0, 50), val: e.value ?? null })),
  }));
});
console.log('clicked:', JSON.stringify(clicked));
console.log('overlays:', JSON.stringify(dump, null, 1).slice(0, 1400));
await b.page.screenshot({ path: 'picker.png' });
fs.writeFileSync('probe-picker.json', JSON.stringify({ clicked, dump }, null, 1));
await b.browser.close();
