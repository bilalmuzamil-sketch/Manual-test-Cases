// probeQ4 — walk EVERY Parts + Reports surface the 10 Branko-held cases name.
// Routes were DISCOVERED from the app's own nav (probeQ3), never guessed.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

const PAGES = [
  ['Parts / Inventory',        '/parts/inventory'],
  ['Parts / Part Sales',       '/parts/part-sales'],
  ['Parts / Catalog',          '/parts/parts-catalogue'],
  ['Parts / Returns',          '/parts/returns'],
  ['Parts / Purchase Orders',  '/parts/orders'],
  ['Parts / Vendor Invoices',  '/parts/deliveries'],
  ['Parts / Vendors',          '/parts/vendors'],
  ['Rep / Timesheet Activities','/reports/punch-clock-activities'],
  ['Rep / Sales',              '/reports/sales'],
  ['Rep / Shop Efficiency',    '/reports/shop-billing-efficiency'],
  ['Rep / Sales Tax',          '/reports/sales-tax'],
  ['Rep / A/R Aging Detail',   '/reports/ar-aging-detail'],
  ['Rep / Notes',              '/reports/notes-report'],
  ['Rep / Reminders',          '/reports/reminders-report'],
];

(async () => {
  const h = await makeHarness('admin');
  const P = h.page, R = { probe:'Q4', at:new Date().toISOString(), pages:[] };

  for (const [name, path] of PAGES) {
    const rec = { name, path };
    try { await P.goto(APP + path, { waitUntil:'domcontentloaded', timeout:120000 }); await P.waitForTimeout(11000); }
    catch(e){ rec.gotoError = String(e).slice(0,140); }
    rec.landedOn = P.url();
    rec.stayed = P.url().includes(path);
    const bar = await L.ensureBarOpen(P);
    rec.barState = bar;
    rec.chips = await P.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e=>{
      const cs=getComputedStyle(e);
      const raw=(e.innerText||'').replace(/\s+/g,' ').trim();
      // the label the TESTER reads: drop the leading material-icon ligature word
      const parts=raw.split(' ');
      const readable = raw.replace(/\s*keyboard_arrow_down\s*$/,'').replace(/^[a-z_0-9]+\s/,'').trim();
      return { id:e.getAttribute('data-test-id'), domText:raw, readableLabel:readable,
        textTransform:cs.textTransform, disabled:e.getAttribute('aria-disabled')==='true',
        hasArrow:/keyboard_arrow_down|expand_more/.test(raw), leadingIconLigature:parts[0] };
    }));
    // in-page tabs (Returns/Credits, Collected/All Tax Rates ...)
    rec.innerTabs = await P.$$eval('[role="tab"], .q-tab', els=>els.map(e=>({
      id:e.getAttribute('data-test-id'), text:(e.innerText||'').replace(/\s+/g,' ').trim(),
      active:/q-tab--active/.test(e.className) })).filter(t=>!/^(report_nav|parts_nav)/.test(t.id||'')));
    // toolbar icons scoped to the page's own top area only
    rec.toolbarIcons = await P.evaluate(()=>{
      const s=document.querySelector('.q-table__top, [class*="table-top"]');
      if(!s) return null;
      return [...s.querySelectorAll('button,[role="button"]')].map(b=>{
        const i=b.querySelector('i');
        return { id:b.getAttribute('data-test-id'), icon:i?(i.innerText||'').trim():null,
                 label:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,30) };
      }).slice(0,20);
    });
    rec.clearFiltersPresent = !!(await P.$('[data-test-id="clear_filters"]'));
    rec.pageSearchPresent   = !!(await P.$('[data-test-id="page_search_toggle"]'));
    rec.toggleBarPresent    = !!(await P.$('[data-test-id="toggle_filter_bar"]'));
    rec.rows = await P.evaluate(()=>document.querySelectorAll('tbody tr').length);
    // open EVERY chip and enumerate real options — this is what makes step "open a filter" runnable
    rec.chipOpen = [];
    for (const c of rec.chips) {
      const o = await L.openChip(P, c.id);
      rec.chipOpen.push({ id:c.id, label:c.readableLabel, opened:o.found, optionCount:o.options.length,
        sample:o.options.slice(0,5).map(x=>x.text),
        clearSelectionPresent: await P.evaluate(()=>{const m=document.querySelector('.q-menu');
          return m? /Clear Selection/i.test(m.innerText||'') : null;}) });
      await L.closeMenu(P);
    }
    R.pages.push(rec);
    console.log(`${name.padEnd(26)}| stayed=${rec.stayed?'Y':'N'} chips=${rec.chips.length} [${rec.chips.map(c=>c.readableLabel).join(' / ')}] tabs=[${rec.innerTabs.map(t=>t.text).join('|')}] clear=${rec.clearFiltersPresent?'Y':'N'} search=${rec.pageSearchPresent?'Y':'N'} collapse=${rec.toggleBarPresent?'Y':'N'} rows=${rec.rows}`);
    for (const co of rec.chipOpen) console.log(`      ${(co.label||co.id).padEnd(22)} opened=${co.opened} opts=${co.optionCount} clearSel=${co.clearSelectionPresent} ${JSON.stringify(co.sample).slice(0,110)}`);
  }
  fs.writeFileSync(`${OUT}/probeQ4.json`, JSON.stringify({...R, bridgeErrors:h.bridgeErrors,
    api4xx:h.apiLog.filter(a=>a.s>=400)},null,2));
  console.log('bridgeErrors', h.bridgeErrors.length, '4xx', JSON.stringify(h.apiLog.filter(a=>a.s>=400).slice(0,8)));
  await h.browser.close();
})();
