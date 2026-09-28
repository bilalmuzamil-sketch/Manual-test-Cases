// Ranking, part 4.
//  C55711  P2-2248 has just been marked Paid. Its twin P2-2249 is the same day, same creator and
//          still an estimate, so a swap isolates the "paid gets a lift" half of the rule.
//  C44851  the recently-viewed half: open a mid-ranked work order, then search again.
//  C55730  100 customers match "Truck"; the tab shows at most 20, so a named one outside the top
//          20 must be missing until the query is narrowed to it.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
async function clickTab(page, name) {
  const got = await page.evaluate((n) => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase()));
    if (!t) return null; t.click(); return (t.innerText || '').trim();
  }, name);
  if (got) await page.waitForTimeout(1600);
  return got;
}
const rowsOf = s => (s.rows || []).map(r => r.text.replace(/\s+/g, ' ').slice(0, 120));
const b = await P.openStaging('/customers', 'admin');
const out = {};

// C55711
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST', 3400);
await clickTab(b.page, 'Part sales');
out.C55711 = { rows: rowsOf(await P.read(b.page)) };
console.log('C55711 after marking P2-2248 Paid:');
out.C55711.rows.forEach((r, i) => console.log(`   ${i + 1}. ${r}`));
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);

// C55730
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Truck', 3400);
await clickTab(b.page, 'Customers');
const broad = await P.read(b.page);
out.C55730 = { broad: rowsOf(broad), broadTab: (broad.tabs.find(t => t.active) || {}).label };
const all = JSON.parse(fs.readFileSync('/tmp/staging/truck-customers.json', 'utf8'));
const target = all.find(n => n && !out.C55730.broad.some(r => r.startsWith(n)));
out.C55730.target = target;
console.log(`C55730 broad "Truck": ${out.C55730.broad.length} rows (tab ${out.C55730.broadTab}); of ${all.length} matching customers`);
console.log('   chosen target, absent from the list:', target);
await P.type(b.page, target, 3400);
const nar = await P.read(b.page);
out.C55730.narrow = rowsOf(nar);
out.C55730.found = out.C55730.narrow.some(r => r.startsWith(target));
console.log(`   narrowed -> ${out.C55730.narrow.length} rows, target present: ${out.C55730.found}`);
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);

// C44851 recently-viewed half: S2-34138 sits mid-list. Open it, then search again.
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Fibridge', 3400);
await clickTab(b.page, 'Work orders');
out.viewedBefore = rowsOf(await P.read(b.page));
const before = out.viewedBefore.findIndex(r => r.startsWith('S2-34138')) + 1;
// open it from the palette itself - that is how a tester would, and it registers the view
const clicked = await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('S2-34138'));
  if (!r) return false; r.click(); return true;
});
await b.page.waitForTimeout(6000);
out.afterUrl = b.page.url();
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Fibridge', 3400);
await clickTab(b.page, 'Work orders');
out.viewedAfter = rowsOf(await P.read(b.page));
const after = out.viewedAfter.findIndex(r => r.startsWith('S2-34138')) + 1;
out.viewed = { clicked, before, after, url: out.afterUrl };
console.log(`C44851 recently-viewed: S2-34138 was at ${before}, after opening it (clicked=${clicked}, url=${out.afterUrl}) it is at ${after}`);
fs.writeFileSync('sweep-rank4.json', JSON.stringify(out, null, 1));
await b.browser.close();
