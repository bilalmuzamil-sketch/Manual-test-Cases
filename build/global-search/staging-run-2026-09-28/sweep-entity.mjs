// The two entity cases and the cutover check, split out of the mobile sweep after an unguarded
// innerText on a group with no header threw and lost the reading.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Fibridge', 3600);
out.snap = await b.page.evaluate(() => {
  const m = document.querySelector('.search-modal');
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  return {
    tabs: [...m.querySelectorAll('.search-tabs__tab')].map(t),
    groups: [...m.querySelectorAll('.search-group')].map(g => ({
      head: t(g.querySelector('.search-group__header')),
      rows: [...g.querySelectorAll('.search-row')].map(r => ({
        text: t(r).slice(0, 120),
        badge: t(r.querySelector('[class*="badge"]')) || null,
        badgeCls: [...(r.querySelector('[class*="badge"]')?.classList || [])].join(' ') || null,
        tile: t(r.querySelector('.search-row__tile')) || null,
      })),
    })),
  };
});
for (const g of out.snap.groups) if (/purchase order|vendor invoice/i.test(g.head)) {
  console.log('==', g.head);
  g.rows.slice(0, 6).forEach(r => console.log(`   tile=${JSON.stringify(r.tile)} badge=${JSON.stringify(r.badge)} [${r.badgeCls || ''}]`, '|', r.text));
}
console.log('tabs:', out.snap.tabs.join(' | '));
out.C44897 = await b.page.evaluate(async () => {
  const r = await fetch('/api/global-search/fetch?q=Bridgeport', { headers: { Accept: 'application/json' } });
  return { status: r.status, body: (await r.text()).slice(0, 140) };
});
console.log('C44897 old endpoint ->', JSON.stringify(out.C44897));
fs.writeFileSync('sweep-entity.json', JSON.stringify(out, null, 1));
await b.browser.close();
