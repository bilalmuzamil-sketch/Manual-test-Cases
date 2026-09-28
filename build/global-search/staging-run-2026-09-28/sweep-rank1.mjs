// Ranking, part 1: the keyword pairs/trios whose whole assertion is ROW ORDER inside one tab.
// Every one of these is measured through the screen, not the API: the case is about what the
// tester sees in the palette.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');

const CASES = [
  { cid: 'C55707', q: 'ZZPREFIX',    tab: 'Customers' },
  { cid: 'C55724', q: 'ZZPREFIX',    tab: 'Customers' },
  { cid: 'C72120', q: 'ZZKRYPTON',   tab: 'Parts' },
  { cid: 'C72121', q: 'ZZMAGENTA',   tab: 'Vendors' },
  { cid: 'C72122', q: 'ZZOBSIDIAN',  tab: 'Assets' },
  { cid: 'C55708', q: 'ZZCUSTOPEN',  tab: 'Customers' },
  { cid: 'C55709', q: 'ZZASSETLIFT', tab: 'Assets' },
  { cid: 'C55710', q: 'ZZVENDORPO',  tab: 'Vendors' },
  { cid: 'C55712', q: 'ZZPARTBUSY',  tab: 'Parts' },
  { cid: 'C55722', q: 'ZZOPENCOUNT', tab: 'Customers' },
  { cid: 'C55723', q: 'ZZNAMEBONUS', tab: 'Customers' },
  { cid: 'C44852', q: 'ZZSTOCKPART', tab: 'Parts' },
];

// Tab labels read "Customers (3)" once a query is typed, so an exact-match selector finds nothing.
async function clickTab(page, name) {
  const got = await page.evaluate((n) => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase()));
    if (!t) return null;
    t.click(); return (t.innerText || '').trim();
  }, name);
  if (got) await page.waitForTimeout(1500);
  return got;
}

const b = await P.openStaging('/customers', 'admin');
const out = {};
for (const c of CASES) {
  if (out[c.q]) { out[c.cid] = out[c.q]; continue; }
  await P.openPalette(b.page, 'click');
  await P.type(b.page, c.q, 3000);
  const all = await P.read(b.page);
  const tabLabel = await clickTab(b.page, c.tab);
  const snap = await P.read(b.page);
  const rec = {
    query: c.q, tab: c.tab, tabLabel,
    tabs: (all.tabs || []).map(t => t.label),
    groupsAll: (all.groupRows || []).map(g => ({ head: g.head, rows: g.rows })),
    rowsInTab: (snap.rows || []).map(r => ({ title: r.title, meta: r.meta, badge: r.badge, text: r.text.slice(0, 110) })),
  };
  out[c.q] = rec; out[c.cid] = rec;
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
  console.log(`${c.cid} ${c.q} -> ${c.tab}: ${rec.rowsInTab.length} rows | ${rec.rowsInTab.map(r => r.title || r.text.slice(0,34)).join(' >> ')}`);
}
fs.writeFileSync('sweep-rank1.json', JSON.stringify(out, null, 1));
await b.browser.close();
