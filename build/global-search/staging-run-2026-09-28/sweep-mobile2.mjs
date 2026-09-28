// Remaining mobile points: does the chip row list ONLY the types that matched (C44898.2, C45133)?
// Plus C45135's Clear all, and C55684's location switch.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
await b.page.setViewportSize({ width: 390, height: 844 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);

// a query that matches only SOME types - if zero-count chips show, the row is the full strip
for (const q of ['Deshawn', 'ZZMAGENTA']) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3600);
  out['chips_' + q] = await b.page.evaluate(() => {
    const m = document.querySelector('.search-modal');
    const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
    const strip = m.querySelector('.search-tabs');
    return { chips: [...m.querySelectorAll('.search-tabs__tab')].map(t),
             stripOverflowX: strip ? getComputedStyle(strip).overflowX : null,
             contactsChip: [...m.querySelectorAll('.search-tabs__tab')].some(e => /contact/i.test(t(e))) };
  });
  console.log(`${q}: ${out['chips_' + q].chips.join(' | ')}  [overflow-x ${out['chips_' + q].stripOverflowX}, Contacts chip ${out['chips_' + q].contactsChip}]`);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);
}

// C45135 - Clear all returns to the first-time state
await P.openPalette(b.page, 'click');
await b.page.waitForTimeout(2500);
out.beforeClear = await b.page.evaluate(() => (document.querySelector('.search-modal').innerText || '').replace(/\s+/g, ' ').slice(0, 200));
const cleared = await b.page.evaluate(() => {
  const e = [...document.querySelectorAll('.search-modal *')].find(x => /^clear all$/i.test((x.innerText || '').trim()) && x.children.length === 0);
  if (!e) return false; e.click(); return true;
});
await b.page.waitForTimeout(2500);
out.afterClear = await b.page.evaluate(() => (document.querySelector('.search-modal').innerText || '').replace(/\s+/g, ' ').slice(0, 200));
console.log('C45135 Clear all clicked:', cleared);
console.log('   before:', out.beforeClear.slice(0, 120));
console.log('   after :', out.afterClear.slice(0, 160));
await b.page.keyboard.press('Escape');

// C55684 - switch location and make sure the old location's work orders never reappear
await b.page.setViewportSize({ width: 1440, height: 900 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);
const wos = s => (s.groupRows || []).filter(g => /work order/i.test(g.head)).flatMap(g => g.rows);
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Bridgeport', 3600);
out.C55684 = { before: wos(await P.read(b.page)) };
console.log('C55684 work orders on Heavy Duty:', out.C55684.before.length);
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);
out.C55684.workplaces = await b.page.evaluate(async () => {
  const r = await fetch('/api/staff/my-workplaces', { headers: { Accept: 'application/json' } });
  const d = await r.json(); const c = d.data || d;
  return (Array.isArray(c) ? c : c.workplaces || c.collection || []).map(w => ({ id: w.id, name: w.name, tz: w.timezone }));
});
console.log('   workplaces:', out.C55684.workplaces.map(w => w.name).join(' | '));
fs.writeFileSync('sweep-mobile2.json', JSON.stringify(out, null, 1));
await b.browser.close();
