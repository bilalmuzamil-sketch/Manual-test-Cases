// Walk the two screens and RECORD what is actually there, instead of guessing selectors again.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
await b.page.waitForTimeout(6000);
out.customersList = await b.page.evaluate(() => {
  const t = e => (e.innerText || '').replace(/\s+/g, ' ').trim();
  return {
    url: location.href,
    inputs: [...document.querySelectorAll('input')].map(i => ({ ph: i.placeholder, type: i.type, cls: String(i.className).slice(0, 60) })),
    rowish: ['tr', '.q-item', '[role="row"]', '.q-table tbody tr', '.q-virtual-scroll__content > *']
      .map(s => ({ sel: s, n: document.querySelectorAll(s).length,
                   first: t(document.querySelector(s) || document.createElement('i')).slice(0, 90) })),
  };
});
console.log('CUSTOMERS LIST', JSON.stringify(out.customersList, null, 1).slice(0, 1200));
await b.page.screenshot({ path: 'ui-customers.png', fullPage: false });

// open a work order from the palette and look at its tab strip
await P.openPalette(b.page, 'click');
await P.type(b.page, 'S2-34138', 3400);
await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('S2-34138'));
  if (r) r.click();
});
await b.page.waitForTimeout(9000);
out.wo = await b.page.evaluate(() => {
  const t = e => (e.innerText || '').replace(/\s+/g, ' ').trim();
  const main = document.querySelector('main, .q-page, #q-app') || document.body;
  return {
    url: location.href,
    tabs: [...document.querySelectorAll('[role="tab"], .q-tab')].map(e => ({ text: t(e), cls: String(e.className).slice(0, 70) })),
    // anything in the page body (not the left nav) whose whole label is one of the WO tab names
    candidates: [...main.querySelectorAll('a,button,div,span')]
      .filter(e => ['lines', 'parts', 'notes', 'stats', 'finance'].includes(t(e).toLowerCase()) && e.children.length === 0)
      .map(e => ({ text: t(e), tag: e.tagName, cls: String(e.className).slice(0, 70),
                   inNav: !!e.closest('nav, .q-drawer, aside') })),
  };
});
console.log('WORK ORDER', JSON.stringify(out.wo, null, 1).slice(0, 1800));
await b.page.screenshot({ path: 'ui-workorder.png', fullPage: false });
fs.writeFileSync('explore-ui.json', JSON.stringify(out, null, 1));
await b.browser.close();
