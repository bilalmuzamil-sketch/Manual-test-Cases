// probe_batch5.cjs — broad filter-bar survey for C43590/C43561/C38891, and clears
// the throwaway search this session's earlier probes left on the admin account.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const S = () => {
  const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const q = s => [...document.querySelectorAll(s)].filter(vis);
  return { url: location.href,
    filter_chips: q('[data-test-id^="filter_chip"]').map(e => ({ tid: e.getAttribute('data-test-id'), t: (e.innerText || '').trim().replace(/\n/g, ' ').slice(0, 40) })),
    collapse: !!q('[data-test-id="toggle_filter_bar"]').length,
    page_search: !!q('[data-test-id="page_search_toggle"]').length,
    more_kebab: q('button').filter(b => /more_vert|more_horiz/.test(b.innerText || '')).map(b => b.getAttribute('data-test-id')),
    icon_buttons: q('button').filter(b => { const r = b.getBoundingClientRect(); return r.y < 220 && r.width < 60 && (b.innerText || '').trim().length < 16; })
      .map(b => ({ tid: b.getAttribute('data-test-id'), t: (b.innerText || '').trim().slice(0, 18) })),
    heading: (document.querySelector('h1,h2,.text-h5,.page-title') || {}).innerText || document.title };
};

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const go = async u => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(7000); return p.evaluate(S); };

  // ---- FIRST: clear the throwaway search this session left saved on the admin account
  await go('/workorders?tab=all&search=');
  const cleared = await p.evaluate(() => {
    const i = document.querySelector('[data-test-id="page_search_input"]'); return i ? i.value : 'no box open'; });
  const cf = p.locator('[data-test-id="clear_filters"]');
  if (await cf.count()) { await cf.first().click().catch(() => {}); }
  await p.waitForTimeout(4000);
  const afterClear = await p.evaluate(S);

  const targets = [
    ['Work Orders', '/workorders'], ['Parts Inventory', '/parts/inventory'], ['Purchase Orders', '/parts/orders'],
    ['Part Sales', '/parts/sales'], ['Parts Returns', '/parts/returns'], ['Deliveries', '/parts/deliveries'],
    ['Customers', '/customers'], ['Vendors', '/vendors'], ['Assets', '/assets'],
    ['Reports: Timesheet Activities', '/reports/punch-clock-activities'],
    ['Reports: Technician Efficiency', '/reports/technician-efficiency'],
    ['Reports: Sales Tax Collected', '/reports/sales-tax-collected'],
    ['Reports: IBS Batches', '/reports/ibs-batches'],
    ['Reports: Sales By Customer', '/reports/sales-by-customer']
  ];
  const survey = [];
  for (const [nm, u] of targets) {
    try { const s = await go(u); survey.push(Object.assign({ page: nm, asked: u }, s)); }
    catch (e) { survey.push({ page: nm, asked: u, error: String(e).slice(0, 120) }); }
  }

  console.log('CLEANUP: search box value before clear =', JSON.stringify(cleared), '| chips after clear:', JSON.stringify(afterClear.filter_chips.map(c => c.t)));
  console.log('\n%-32s %-42s %5s %-9s %-7s %s', 'PAGE', 'LANDED', 'CHIPS', 'COLLAPSE', 'SEARCH', 'CHIP NAMES');
  for (const s of survey) {
    if (s.error) { console.log(`${s.page.padEnd(32)} ERROR ${s.error.slice(0, 60)}`); continue; }
    const path = s.url.replace(/^https?:\/\/[^/]+/, '').slice(0, 42);
    console.log(`${s.page.padEnd(32)} ${path.padEnd(42)} ${String(s.filter_chips.length).padStart(5)} ${String(s.collapse).padEnd(9)} ${String(s.page_search).padEnd(7)} ${s.filter_chips.map(c => c.tid.replace('filter_chip_', '')).join(',')}`);
  }
  fs.writeFileSync(`${OUT}/filter-bar-survey.json`, JSON.stringify({ read_at_utc: new Date().toISOString(), cleanup: { search_before: cleared, after: afterClear }, survey, bridge_errors: h.bridgeErrors }, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length);
  await h.browser.close();
})();
