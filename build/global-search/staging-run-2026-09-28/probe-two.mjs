// C53606 and C53607 re-read. The All tab shows only the first five rows of each group, so a record
// sitting sixth or lower reads as missing when it is simply not on that view - the tab has to be
// opened. (The vendor IS there: twelfth of twelve.)
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const clean = s => (s || '').replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
async function clickTab(page, name) {
  const got = await page.evaluate((n) => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase()));
    if (!t) return null; t.click(); return (t.innerText || '').trim();
  }, name);
  if (got) await page.waitForTimeout(1600);
  return got;
}
const b = await P.openStaging('/customers', 'admin');
const out = {};
for (const [cid, q, tab, must] of [['C53606', 'Ohio', 'Vendors', 'Kestrel Parts Supply'],
                                   ['C53607a', 'Kestrel', 'Parts', 'Brake Chamber Kestrel'],
                                   ['C53607b', 'Brake Chamber', 'Parts', 'Brake Chamber Kestrel'],
                                   ['C53607c', 'Brake Chamber Kestrel', 'Parts', 'Brake Chamber Kestrel']]) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3600);
  const label = await clickTab(b.page, tab);
  const s = await P.read(b.page);
  const rows = (s.rows || []).map(r => clean(r.text).slice(0, 100));
  out[cid] = { q, tab, label, n: rows.length, found: rows.some(r => r.includes(must)), rows };
  console.log(`${cid} "${q}" on ${label}: ${rows.length} rows, ${out[cid].found ? 'FOUND' : 'not found'}`);
  if (!out[cid].found) rows.slice(0, 6).forEach(r => console.log('     ', r));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);
}
fs.writeFileSync('probe-two.json', JSON.stringify(out, null, 1));
await b.browser.close();
