// C45135 Clear all (the earlier attempt reopened onto the PREVIOUS query's results, so there was no
// recent list on screen and no Clear all to click) and C55684 the location switch.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
const txt = () => b.page.evaluate(() => ((document.querySelector('.search-modal') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 260));

// --- C45135, on the phone -------------------------------------------------
await b.page.setViewportSize({ width: 390, height: 844 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(7000);
await P.openPalette(b.page, 'click');
await b.page.waitForTimeout(1500);
await b.page.evaluate(() => { const i = document.querySelector('.search-modal input'); if (i) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
await b.page.waitForTimeout(2500);
out.recentState = await txt();
out.clicked = await b.page.evaluate(() => {
  const e = [...document.querySelectorAll('.search-modal *')]
    .find(x => /^clear all$/i.test((x.innerText || '').trim()) && x.children.length === 0);
  if (!e) return false; e.click(); return true;
});
await b.page.waitForTimeout(3000);
out.afterClear = await txt();
console.log('C45135 recent state :', out.recentState.slice(0, 150));
console.log('       Clear all hit:', out.clicked);
console.log('       after        :', out.afterClear.slice(0, 200));
await b.page.keyboard.press('Escape');

// --- C55684 ---------------------------------------------------------------
await b.page.setViewportSize({ width: 1440, height: 900 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(7000);
const wos = s => (s.groupRows || []).filter(g => /work order/i.test(g.head)).flatMap(g => g.rows.map(r => r.slice(0, 60)));
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Bridgeport', 3600);
out.C55684 = { heavyDuty: wos(await P.read(b.page)) };
console.log('C55684 Heavy Duty work orders:', out.C55684.heavyDuty.join(' ;; '));

// switch location WITHOUT closing search, exactly as the case says
const sw = await b.page.evaluate(async () => {
  const r = await fetch('https://api.staging.shopview.com/api/iam/change-location', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ workplace_id: 'f8a8b802-7780-4b16-bf10-343caeb616b2', workplace_timezone: 'America/Edmonton' }),
  });
  return r.status;
});
console.log('   switch to Lethbridge ->', sw);
await b.page.waitForTimeout(3000);
// watch the results WHILE they reload - sample repeatedly from the first keystroke
await P.type(b.page, 'Bridgepor', 200, true);
const frames = [];
for (let i = 0; i < 14; i++) {
  frames.push(await b.page.evaluate(() => {
    const m = document.querySelector('.search-modal'); if (!m) return null;
    return [...m.querySelectorAll('.search-group')]
      .filter(g => /work order/i.test((g.querySelector('.search-group__header') || {}).innerText || ''))
      .flatMap(g => [...g.querySelectorAll('.search-row')].map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 40)));
  }));
  await b.page.waitForTimeout(400);
}
await b.page.waitForTimeout(3500);
out.C55684.after = wos(await P.read(b.page));
out.C55684.frames = frames;
const old = new Set(out.C55684.heavyDuty.map(s => s.split(' ')[0]));
out.C55684.leaked = frames.flatMap(f => f || []).filter(r => old.has(r.split(' ')[0]));
console.log('   after the switch  :', out.C55684.after.join(' ;; ') || '(no work orders)');
console.log('   old ones seen at any moment while reloading:', out.C55684.leaked.length ? out.C55684.leaked.join(' ;; ') : 'none');
fs.writeFileSync('sweep-mobile3.json', JSON.stringify(out, null, 1));
await b.browser.close();
