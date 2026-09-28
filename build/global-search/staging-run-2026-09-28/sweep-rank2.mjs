// Ranking, part 2: the pinned-identifier cases and the per-entity ordering rules.
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

// Is there a row OUTSIDE every .search-group? That is the "pinned" row the spec describes -
// a single row above the groups, not the first row of the first group.
async function pinned(page) {
  return page.evaluate(() => {
    const m = document.querySelector('.search-modal'); if (!m) return null;
    const txt = e => (e.innerText || '').replace(/\s+/g, ' ').trim();
    const all = [...m.querySelectorAll('.search-row')];
    const inGroup = new Set([...m.querySelectorAll('.search-group .search-row')]);
    const loose = all.filter(r => !inGroup.has(r));
    return {
      totalRows: all.length,
      looseRows: loose.map(r => ({ text: txt(r).slice(0, 120), cls: r.className,
                                   parentCls: r.parentElement?.className || null })),
      firstGroupHead: txt(m.querySelector('.search-group__header')),
      // Anything above the first group in document order tells us it is genuinely "at the very top".
      order: [...m.querySelectorAll('.search-row, .search-group__header')]
               .map(e => (e.classList.contains('search-group__header') ? 'HEAD: ' : 'ROW : ') + txt(e).slice(0, 80)),
    };
  });
}

const b = await P.openStaging('/customers', 'admin');
const out = {};

// C44850 / C55729 - an exact identifier is pinned above the groups
for (const q of ['S2-15430', 'S2-33692']) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3200);
  out['pin_' + q] = { snap: await P.read(b.page), pinned: await pinned(b.page) };
  console.log(`PIN ${q}: loose=${out['pin_' + q].pinned.looseRows.length} total=${out['pin_' + q].pinned.totalRows}`);
  for (const l of out['pin_' + q].pinned.order.slice(0, 6)) console.log('     ', l);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
}

// C44851 work orders - C45137 purchase orders - C45138 vendor invoices, all on one broad keyword
for (const [cid, tab] of [['C44851', 'Work orders'], ['C45137', 'Purchase orders'], ['C45138', 'Vendor invoices']]) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, 'Fibridge', 3200);
  const label = await clickTab(b.page, tab);
  const s = await P.read(b.page);
  out[cid] = { tab, label, rows: (s.rows || []).map(r => ({ title: r.title, meta: r.meta, badge: r.badge, text: r.text.slice(0, 130) })) };
  console.log(`${cid} ${tab} (${label}) -> ${out[cid].rows.length} rows`);
  out[cid].rows.slice(0, 12).forEach((r, i) => console.log(`   ${i + 1}. ${r.text}`));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
}

// C45139 - "Deshawn" matches one customer by NAME and another only through its contact
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Deshawn', 3200);
const s = await P.read(b.page);
out.C45139 = { tabs: (s.tabs || []).map(t => t.label),
               groups: (s.groupRows || []).map(g => ({ head: g.head, rows: g.rows })) };
console.log('C45139 tabs:', out.C45139.tabs.join(' | '));
for (const g of out.C45139.groups) { console.log('  ', g.head); g.rows.forEach(r => console.log('      -', r)); }

fs.writeFileSync('sweep-rank2.json', JSON.stringify(out, null, 1));
await b.browser.close();
