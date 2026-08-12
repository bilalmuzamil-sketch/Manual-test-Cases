// probe_batch4.cjs — URL cases (C29618/19/20, C38888, C38902), C43590 one-filter page,
// C38900 tabs, C38884 search+filter independence, C43561 report pages.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const R = { read_at_utc: new Date().toISOString(), checks: [] };
const put = (n, d) => { R.checks.push(Object.assign({ name: n }, d)); console.log(`\n### ${n}\n` + JSON.stringify(d, null, 1).slice(0, 1500)); };

const S = () => {
  const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const chip = t => { const e = document.querySelector(`[data-test-id="${t}"]`); return e && vis(e) ? (e.innerText || '').trim().replace(/\n/g, ' ') : null; };
  return { url: location.href, rows: document.querySelectorAll('tbody tr').length,
    chips: { status: chip('filter_chip_status'), customer: chip('filter_chip_company_id'), asset: chip('filter_chip_vehicleHere') },
    search_value: (() => { const i = document.querySelector('[data-test-id="page_search_input"]'); return i ? i.value : null; })(),
    err_banner: [...document.querySelectorAll('*')].filter(vis).filter(e => /error|something went wrong|unexpected/i.test((e.innerText || '').slice(0, 60))).map(e => (e.innerText || '').trim().slice(0, 90)).slice(0, 3),
    filter_chip_tids: [...document.querySelectorAll('[data-test-id^="filter_chip"]')].filter(vis).map(e => e.getAttribute('data-test-id')),
    toggle_filter_bar: !!(document.querySelector('[data-test-id="toggle_filter_bar"]') && vis(document.querySelector('[data-test-id="toggle_filter_bar"]'))),
    page_search_toggle: !!(document.querySelector('[data-test-id="page_search_toggle"]') && vis(document.querySelector('[data-test-id="page_search_toggle"]')))
  };
};

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const go = async u => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(8500); return p.evaluate(S); };

  // ---- C29618 : a shared filtered URL loads with those filters on
  const a1 = await go('/workorders?tab=all&status=approved&search=');
  const a2 = await go('/workorders?tab=all&status=approved');
  put('C29618 shared filtered URL', { loaded: a2, chips_reflect_url: a2.chips });

  // ---- C29620 / C38888 : broken / malformed filter URL
  const b1 = await go('/workorders?tab=all&status=NOT_A_REAL_STATUS_zzz');
  const b2 = await go('/workorders?tab=all&status[]=%%%&company_id=@@@nonsense');
  const b3 = await go('/workorders?tab=all&search=%E2%98%A0%00broken');
  put('C29620/C38888 malformed URLs', {
    bad_status: { url: b1.url, rows: b1.rows, chips: b1.chips, errors: b1.err_banner },
    scrambled_params: { url: b2.url, rows: b2.rows, chips: b2.chips, errors: b2.err_banner },
    malformed_search: { url: b3.url, rows: b3.rows, search_value: b3.search_value, errors: b3.err_banner }
  });

  // ---- C38902 : an OLD link carrying a top-search word
  const c1 = await go('/workorders?tab=all&query=Iibay');
  const c2 = await go('/workorders?tab=all&globalSearch=Iibay');
  put('C38902 old top-search link', {
    query_param: { url: c1.url, rows: c1.rows, page_search_box: c1.search_value },
    globalSearch_param: { url: c2.url, rows: c2.rows, page_search_box: c2.search_value }
  });

  // ---- C43590 : a page whose filter bar shows only ONE filter button
  const pages = [['Part Sales', '/parts/sales'], ['Parts Inventory', '/parts/inventory'],
                 ['Purchase Orders', '/parts/orders'], ['Customers', '/customers'],
                 ['Reports default', '/reports']];
  const survey = [];
  for (const [nm, u] of pages) { const s = await go(u); survey.push({ page: nm, url: s.url, filter_chips: s.filter_chip_tids, n: s.filter_chip_tids.length, collapse_control: s.toggle_filter_bar, page_search: s.page_search_toggle }); }
  put('C43590 one-filter page survey (desktop)', { survey });

  // ---- C38900 : one search box serves all tabs
  await go('/workorders?tab=all');
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1500);
  await p.locator('[data-test-id="page_search_input"]').fill('Iibay').catch(() => {});
  await p.waitForTimeout(4000);
  const t = [];
  for (const tab of ['tab_all', 'tab_estimates', 'tab_completed', 'tab_all']) {
    await p.locator(`[data-test-id="${tab}"]`).click({ timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(3500);
    const s = await p.evaluate(S);
    t.push({ tab, url: s.url, search_value: s.search_value, rows: s.rows });
  }
  put('C38900 one search box across tabs', { sequence: t });

  R.bridge_errors = h.bridgeErrors;
  R.api_errors = h.apiLog.filter(x => x.s >= 400);
  fs.writeFileSync(`${OUT}/steps-batch4.json`, JSON.stringify(R, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length, '| api errors:', JSON.stringify(R.api_errors.slice(0, 5)));
  await h.browser.close();
})();
