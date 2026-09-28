// V1 regression, the interactive remainder.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const clean = s => (s || '').replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
async function clickTab(page, name) {
  const got = await page.evaluate((n) => {
    const t = [...document.querySelectorAll('.search-tabs__tab')].find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase()));
    if (!t) return null; t.click(); return (t.innerText || '').trim();
  }, name);
  if (got) await page.waitForTimeout(1600); return got;
}
const b = await P.openStaging('/customers', 'admin');
const out = {};

// C45156 - the keyboard shortcut opens it
await b.page.waitForTimeout(6000);
await b.page.keyboard.press('Control+k');
await b.page.waitForTimeout(2500);
let s = await P.read(b.page);
out.C45156 = { opened: s.open === true, focused: s.inputFocused, placeholder: s.placeholder };
console.log('C45156 Ctrl+K:', JSON.stringify(out.C45156));

// C45161 - one character vs two
await P.type(b.page, 'B', 3000);
const one = await P.read(b.page);
await P.type(b.page, 'Br', 3000, false);
const two = await P.read(b.page);
out.C45161 = { one: { mode: one.mode, rows: one.rowCount, heads: one.heads },
               two: { mode: two.mode, rows: two.rowCount, heads: two.heads.slice(0, 3) } };
console.log('C45161 one char:', one.mode, one.rowCount, 'rows |', (one.heads || []).join(','));
console.log('       two chars:', two.mode, two.rowCount, 'rows |', (two.heads || []).slice(0, 3).join(','));
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);

// C55683 - is the shortcut printed in the header box?
out.C55683 = await b.page.evaluate(() => {
  const el = document.querySelector('.global-search__trigger, [class*="global-search"]');
  return { text: el ? (el.innerText || '').replace(/\s+/g, ' ').trim() : null,
           title: el ? el.getAttribute('title') : null, aria: el ? el.getAttribute('aria-label') : null };
});
console.log('C55683 header box says:', JSON.stringify(out.C55683));

// C53579 - the five forms of a work order number
out.C53579 = {};
for (const q of ['S-34367', 'S2-34367', '34367', 'S34367', 'S2 34367']) {
  await P.openPalette(b.page, 'click'); await P.type(b.page, q, 3400);
  await clickTab(b.page, 'Work orders');
  const r = (await P.read(b.page)).rows.map(x => clean(x.text).slice(0, 44));
  out.C53579[q] = { n: r.length, found: r.some(x => x.includes('34367')) };
  console.log(`C53579 "${q}" -> ${r.length} rows, the job found: ${out.C53579[q].found}`);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
}

// C55661 - every matching type appears, and each tab holds its own
await P.openPalette(b.page, 'click'); await P.type(b.page, 'ZZAUTOTEST', 3600);
s = await P.read(b.page);
out.C55661 = { tabs: s.tabs.map(t => t.label), heads: (s.groupRows || []).map(g => clean(g.head)), perTab: {} };
for (const t of ['Work orders', 'Customers', 'Assets', 'Parts', 'Vendors']) {
  await clickTab(b.page, t);
  const r = await P.read(b.page);
  out.C55661.perTab[t] = { n: r.rowCount, heads: (r.groupRows || []).map(g => clean(g.head)) };
}
console.log('C55661 groups:', out.C55661.heads.join(' | '));
console.log('       per tab:', Object.entries(out.C55661.perTab).map(([k, v]) => `${k}=${v.n}`).join(', '));
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);

// C55686 - the real match is first, and Enter
await P.openPalette(b.page, 'click'); await P.type(b.page, 'Marlene', 3600);
s = await P.read(b.page);
out.C55686 = { groups: (s.groupRows || []).map(g => ({ head: clean(g.head), rows: g.rows.map(r => clean(r).slice(0, 80)) })),
               selectedIndex: s.selectedIndex, before: b.page.url() };
await b.page.keyboard.press('Enter'); await b.page.waitForTimeout(8000);
out.C55686.after = b.page.url();
console.log('C55686 groups:'); out.C55686.groups.forEach(g => { console.log('   ' + g.head); g.rows.slice(0, 4).forEach(r => console.log('      -', r)); });
console.log('   highlight at', out.C55686.selectedIndex, '| Enter ->', out.C55686.after);
fs.writeFileSync('sweep-v1d.json', JSON.stringify(out, null, 1));
await b.browser.close();
