// V1 regression, first eleven: the basics the old search could do and V2 must not lose.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
async function clickTab(page, name) {
  const got = await page.evaluate((n) => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase()));
    if (!t) return null; t.click(); return (t.innerText || '').trim();
  }, name);
  if (got) await page.waitForTimeout(1500);
  return got;
}
// the "≈ close match:" marker is injected MID-WORD, so a plain includes() on the row text lies.
const clean = s => s.replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
const rowsOf = s => (s.rows || []).map(r => clean(r.text).slice(0, 120));
const groupsOf = s => (s.groupRows || []).map(g => ({ head: clean(g.head), rows: g.rows.map(r => clean(r).slice(0, 110)) }));
async function look(page, q, tab) {
  await P.openPalette(page, 'click'); await P.type(page, q, 3200);
  const snap = await P.read(page);
  let tabbed = null;
  if (tab) { await clickTab(page, tab); tabbed = rowsOf(await P.read(page)); }
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  return { q, groups: groupsOf(snap), tabbed, tabs: (snap.tabs || []).map(t => t.label) };
}
const b = await P.openStaging('/customers', 'admin');
const out = {};
const has = (r, s) => (r.tabbed || []).some(x => x.includes(s)) ||
                      r.groups.some(g => g.rows.some(x => x.includes(s)));

out.C55665 = await look(b.page, 'Bridgeport', 'Part sales');
out.C55666 = { a: await look(b.page, 'ZZT-88-4412', 'Parts'), b: await look(b.page, 'ZZT884412', 'Parts') };
out.C55667 = { a: await look(b.page, 'Bridgeport', 'Customers'), b: await look(b.page, 'ZZAUTOTEST Bridgeport Hauling', 'Customers') };
out.C55668 = { a: await look(b.page, 'Kestrel', 'Vendors'), b: await look(b.page, 'ZZAUTOTEST Kestrel Parts Supply', 'Vendors') };
out.C55669 = { a: await look(b.page, '1FUJGLDR9KLZZ4471', 'Assets'), b: await look(b.page, 'ZZ4471', 'Assets') };
out.C55670 = { first: await look(b.page, 'Marlene'), last: await look(b.page, 'Okonkwo'),
               phone: await look(b.page, '419-555-0177'), tail: await look(b.page, '555-0177') };
out.C55671 = { lower: await look(b.page, 'bridgeport', 'Customers'), upper: await look(b.page, 'BRIDGEPORT', 'Customers'),
               mixed: await look(b.page, 'BrIdGePoRt', 'Customers') };
out.C55672 = { bare: await look(b.page, '34367', 'Work orders'), full: await look(b.page, 'S-34367', 'Work orders') };
out.C55675 = await look(b.page, 'ZZNOSUCHRECORD9999');

console.log('C55665 part sale by customer name     :', has(out.C55665, 'Bridgeport') ? 'found' : 'NOT FOUND', '|', (out.C55665.tabbed || []).slice(0, 2).join(' ;; '));
console.log('C55666 part number with dashes        :', has(out.C55666.a, 'Brake Chamber Kestrel') ? 'found' : 'NOT FOUND');
console.log('       part number without dashes     :', has(out.C55666.b, 'Brake Chamber Kestrel') ? 'found' : 'NOT FOUND', '|', (out.C55666.b.tabbed || []).slice(0,2).join(' ;; '));
console.log('C55667 customer by word / full name   :', has(out.C55667.a, 'Bridgeport Hauling'), '/', has(out.C55667.b, 'Bridgeport Hauling'));
console.log('C55668 vendor by word / full name     :', has(out.C55668.a, 'Kestrel Parts Supply'), '/', has(out.C55668.b, 'Kestrel Parts Supply'));
console.log('C55669 VIN full / last six            :', has(out.C55669.a, 'ZZ4471') || (out.C55669.a.tabbed||[]).length > 0, '/', (out.C55669.b.tabbed || []).length, 'rows');
console.log('   full VIN rows:', (out.C55669.a.tabbed || []).slice(0,2).join(' ;; '));
console.log('   ZZ4471  rows:', (out.C55669.b.tabbed || []).slice(0,2).join(' ;; '));
for (const [k, r] of Object.entries(out.C55670))
  console.log(`C55670 ${k.padEnd(6)}: ${has(r, 'Bridgeport Hauling') ? 'found Bridgeport Hauling' : 'NOT FOUND'} | groups ${r.groups.map(g => g.head).join(', ')}`);
for (const [k, r] of Object.entries(out.C55671))
  console.log(`C55671 ${k.padEnd(6)}: ${has(r, 'Bridgeport Hauling') ? 'found' : 'NOT FOUND'} (${(r.tabbed || []).length} rows)`);
console.log('C55672 bare number 34367              :', has(out.C55672.bare, 'S-34367') ? 'found' : 'NOT FOUND', '| rows', (out.C55672.bare.tabbed || []).slice(0,3).join(' ;; '));
console.log('       with prefix S-34367            :', has(out.C55672.full, 'S-34367') ? 'found' : 'NOT FOUND');
console.log('C55675 nothing matches                :', JSON.stringify(out.C55675.groups), '| tabs', out.C55675.tabs.join(','));
fs.writeFileSync('sweep-v1a.json', JSON.stringify(out, null, 1));
await b.browser.close();
