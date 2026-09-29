// The QA lead has rewritten what two of these checks expect. Before agreeing they pass, measure
// each point of the NEW wording on the build as it stands.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
await b.page.setViewportSize({ width: 390, height: 844 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(7000);
await P.openPalette(b.page, 'click');
await b.page.waitForTimeout(2500);
const before = await b.page.evaluate(() => {
  const m = document.querySelector('.search-modal'); if (!m) return { open: false };
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  const box = m.getBoundingClientRect();
  return { open: true, fullScreen: Math.round(box.width) >= innerWidth - 1 && Math.round(box.top) <= 1,
    horizontalScroll: document.documentElement.scrollWidth > innerWidth,
    placeholder: (m.querySelector('input') || {}).placeholder,
    hasCancel: /cancel/i.test(t(m)), chipsBeforeTyping: m.querySelectorAll('.search-tabs__tab').length,
    footer: !!m.querySelector('.search-footer') };
});
console.log('before typing:', JSON.stringify(before));
await P.type(b.page, 'ZZAUTOTEST', 4000);
const after = await b.page.evaluate(() => {
  const m = document.querySelector('.search-modal');
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  return { chips: [...m.querySelectorAll('.search-tabs__tab')].map(t),
    contactsChip: [...m.querySelectorAll('.search-tabs__tab')].some(e => /contact/i.test(t(e))),
    rowsPerGroup: [...m.querySelectorAll('.search-group')].map(g => g.querySelectorAll('.search-row').length),
    showAll: [...m.querySelectorAll('*')].filter(e => /^show all$/i.test(t(e))).length,
    horizontalScroll: document.documentElement.scrollWidth > innerWidth };
});
console.log('with a query  :', JSON.stringify(after).slice(0, 320));
// does a tap still open the record?
const u0 = b.page.url();
await b.page.evaluate(() => { const r = document.querySelector('.search-modal .search-row'); if (r) r.click(); });
await b.page.waitForTimeout(7000);
const tapOpened = b.page.url() !== u0;
console.log('tapping a row opens it:', tapOpened);
const out = { before, after, tapOpened };
out.C44898 = { fullScreen: before.fullScreen, noSideScroll: !after.horizontalScroll,
  chipsOnlyWithQuery: before.chipsBeforeTyping === 0 && after.chips.length > 0,
  noContactsChip: !after.contactsChip, cappedPerGroup: after.rowsPerGroup.every(n => n <= 5),
  showAllPresent: after.showAll > 0, tapOpens: tapOpened };
out.C45132 = { fullScreen: before.fullScreen, cancel: before.hasCancel,
  placeholder: before.placeholder, noFooter: !before.footer };
console.log('\nC44898 against the new wording:', JSON.stringify(out.C44898));
console.log('C45132 against the new wording:', JSON.stringify(out.C45132));
fs.writeFileSync('verify-edited.json', JSON.stringify(out, null, 1));
await b.browser.close();
