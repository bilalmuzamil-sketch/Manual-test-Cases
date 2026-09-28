// Mobile section (C44898, C45132-36) plus the two entity cases and the cutover check.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};

// ---------- mobile ----------
await b.page.setViewportSize({ width: 390, height: 844 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);
await P.openPalette(b.page, 'click');
await b.page.waitForTimeout(2500);
out.mobileFirstOpen = await b.page.evaluate(() => {
  const m = document.querySelector('.search-modal'); if (!m) return { open: false };
  const t = e => (e.innerText || '').replace(/\s+/g, ' ').trim();
  const box = m.getBoundingClientRect();
  return { open: true,
    w: Math.round(box.width), h: Math.round(box.height), top: Math.round(box.top), vw: innerWidth,
    fullScreen: Math.round(box.width) >= innerWidth - 1 && Math.round(box.top) <= 1,
    horizontalScroll: document.documentElement.scrollWidth > innerWidth,
    placeholder: (document.querySelector('.search-modal input') || {}).placeholder,
    hasCancel: /cancel/i.test(t(m)),
    chipRow: m.querySelectorAll('.search-tabs__tab').length,
    footer: !!m.querySelector('.search-footer'),
    body: t(m).slice(0, 320),
    quickCreate: [...m.querySelectorAll('button')].map(e => t(e)).filter(x => /new |create|add /i.test(x)),
  };
});
console.log('MOBILE first open:', JSON.stringify(out.mobileFirstOpen).slice(0, 560));
await P.type(b.page, 'ZZAUTOTEST', 3600);
out.mobileResults = await b.page.evaluate(() => {
  const m = document.querySelector('.search-modal');
  const t = e => (e.innerText || '').replace(/\s+/g, ' ').trim();
  const heads = [...m.querySelectorAll('.search-group__header')];
  return {
    chips: [...m.querySelectorAll('.search-tabs__tab')].map(e => t(e)),
    groups: heads.map(h => t(h)),
    rowsTotal: m.querySelectorAll('.search-row').length,
    rowsPerGroup: [...m.querySelectorAll('.search-group')].map(g => g.querySelectorAll('.search-row').length),
    showAll: [...m.querySelectorAll('*')].filter(e => /^show all$/i.test(t(e))).length,
    footer: !!m.querySelector('.search-footer'),
    stickyHeads: heads.map(h => getComputedStyle(h).position),
    horizontalScroll: document.documentElement.scrollWidth > innerWidth,
  };
});
console.log('MOBILE with a query:', JSON.stringify(out.mobileResults).slice(0, 700));
await b.page.screenshot({ path: 'mobile-results.png' });
await P.type(b.page, 'ZZNOSUCHRECORD9999', 3600);
out.mobileEmpty = await b.page.evaluate(() => (document.querySelector('.search-modal').innerText || '').replace(/\s+/g, ' ').slice(0, 220));
console.log('MOBILE no results:', out.mobileEmpty);
await b.page.keyboard.press('Escape');

// ---------- desktop entity cases ----------
await b.page.setViewportSize({ width: 1440, height: 900 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);
for (const [cid, q] of [['C44899', 'Fibridge'], ['C44900', 'Fibridge']]) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3600);
  out[cid] = await b.page.evaluate(() => {
    const m = document.querySelector('.search-modal');
    // a group can render without a header element, and an unguarded innerText on it
      // threw and lost the whole reading
    const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
    return {
      tabs: [...m.querySelectorAll('.search-tabs__tab')].map(e => t(e)),
      groups: [...m.querySelectorAll('.search-group')].map(g => ({
        head: t(g.querySelector('.search-group__header')),
        rows: [...g.querySelectorAll('.search-row')].map(r => ({
          text: t(r).slice(0, 110),
          badge: t(r.querySelector('[class*="badge"]')) || null,
          badgeCls: [...(r.querySelector('[class*="badge"]')?.classList || [])].join(' ') || null,
          icon: t(r.querySelector('.search-row__tile')) || (r.querySelector('.search-row__tile i, .search-row__tile svg')?.textContent || null),
        })),
      })),
    };
  });
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
}
for (const cid of ['C44899', 'C44900']) {
  const g = out[cid].groups.find(x => /purchase orders|vendor invoices/i.test(x.head));
  console.log(`${cid} tabs:`, out[cid].tabs.join(' | '));
}
for (const g of out.C44899.groups) if (/purchase order|vendor invoice/i.test(g.head)) {
  console.log('  ', g.head);
  g.rows.slice(0, 5).forEach(r => console.log(`     icon=${JSON.stringify(r.icon)} badge=${JSON.stringify(r.badge)} ${r.badgeCls || ''} | ${r.text}`));
}

// ---------- C44897 the old endpoint ----------
out.C44897 = await b.page.evaluate(async () => {
  const r = await fetch('/api/global-search/fetch?q=Bridgeport', { headers: { Accept: 'application/json' } });
  return { status: r.status, body: (await r.text()).slice(0, 160) };
});
console.log('C44897 old endpoint /api/global-search/fetch ->', JSON.stringify(out.C44897));
fs.writeFileSync('sweep-mobile.json', JSON.stringify(out, null, 1));
await b.browser.close();
