// Ranking, part 3.
//  C44851  the two top Fibridge work orders were identical (both 'approved', same customer, same
//          age, adjacent in rank). S2-34151 has just been driven to Complete and S2-34150 left
//          open, so ONLY the status differs - if the rule holds, they swap.
//  C55711  part sales, read on their own tab.
//  C55730  a broad query caps at 20 rows, and a low-ranked record only appears once it is narrowed.
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

// C44851
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Fibridge', 3400);
await clickTab(b.page, 'Work orders');
out.C44851 = { rows: rowsOf(await P.read(b.page)) };
const pos = n => out.C44851.rows.findIndex(r => r.startsWith(n));
console.log('C44851 after closing S2-34151:');
out.C44851.rows.slice(0, 8).forEach((r, i) => console.log(`   ${i + 1}. ${r}`));
console.log(`   S2-34151(now Complete) at ${pos('S2-34151') + 1}, S2-34150(still open) at ${pos('S2-34150') + 1}`);
out.C44851.closedPos = pos('S2-34151') + 1; out.C44851.openPos = pos('S2-34150') + 1;
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);

// C55711
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST', 3400);
const l = await clickTab(b.page, 'Part sales');
out.C55711 = { label: l, rows: rowsOf(await P.read(b.page)) };
console.log('C55711 part sales:'); out.C55711.rows.forEach((r, i) => console.log(`   ${i + 1}. ${r}`));
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);

// C55730 - broad then narrowed
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Fib', 3400);
await clickTab(b.page, 'Work orders');
const broad = await P.read(b.page);
out.C55730 = { broadLabel: (broad.tabs.find(t => t.active) || {}).label, broad: rowsOf(broad) };
console.log(`C55730 broad "Fib": ${out.C55730.broad.length} rows, tab says ${out.C55730.broadLabel}`);
// pick a Fibridge work order that the broad query does NOT show
const known = JSON.parse(fs.readFileSync('/tmp/staging/fib-wos.json', 'utf8')).map(w => w[0]);
const target = known.find(n => !out.C55730.broad.some(r => r.startsWith(n)));
out.C55730.target = target;
console.log('   target not shown on the broad query:', target);
if (target) {
  await P.type(b.page, target, 3400);
  const narrow = await P.read(b.page);
  out.C55730.narrow = rowsOf(narrow);
  out.C55730.targetFound = out.C55730.narrow.some(r => r.startsWith(target));
  console.log(`   after narrowing to "${target}": ${out.C55730.narrow.length} rows, target present: ${out.C55730.targetFound}`);
  out.C55730.narrow.slice(0, 4).forEach(r => console.log('      -', r));
}
fs.writeFileSync('sweep-rank3.json', JSON.stringify(out, null, 1));
await b.browser.close();
