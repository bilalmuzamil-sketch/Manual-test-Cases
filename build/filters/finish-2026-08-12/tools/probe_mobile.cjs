// probe_mobile.cjs — C43563 (phone Imported in All Filters sheet), C38889 (phone search),
//                    C43561 (phone icon buttons collapse into one menu)
// Viewport 390 x 844, touch enabled — the size the cases name.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const R = { read_at_utc: new Date().toISOString(), viewport: '390x844', checks: [] };
const put = (n, d) => { R.checks.push(Object.assign({ name: n }, d)); console.log(`\n### ${n}\n` + JSON.stringify(d, null, 1).slice(0, 1600)); };

const VIS = () => [...document.querySelectorAll('button,[role=button],a,div,span,label')]
  .filter(el => { const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && r.width > 0 && r.height > 0; })
  .map(el => ({ t: (el.innerText || '').trim().slice(0, 60), tid: el.getAttribute('data-test-id'),
                x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y) }))
  .filter(e => e.t || e.tid);

(async () => {
  const h = await makeHarness('admin', { width: 390, height: 844 });
  const p = h.page;
  const go = async u => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(9000); };

  // ---------- C43563 : 'All Filters' sheet on a phone ----------
  await go('/workorders?tab=all');
  const v0 = await p.evaluate(VIS);
  const allFilters = v0.filter(e => /all filters/i.test(e.t || ''));
  await p.screenshot({ path: `${OUT}/mobile-wo.png` }).catch(() => {});
  let sheet = null, applyBtn = null, rowsInSheet = null;
  if (allFilters.length) {
    await p.locator('button:has-text("All Filters"), [role=button]:has-text("All Filters")').first().click({ timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(3000);
    sheet = await p.evaluate(() => {
      const d = [...document.querySelectorAll('.q-dialog__inner, .q-menu')].filter(x => x.getBoundingClientRect().width > 0).pop();
      if (!d) return null;
      return { painted: (d.innerText || '').trim().slice(0, 700),
               tids: [...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')).slice(0, 25),
               buttons: [...d.querySelectorAll('button')].map(b => ({ t: (b.innerText || '').trim().slice(0, 40), tid: b.getAttribute('data-test-id') })).slice(0, 15) };
    });
    await p.screenshot({ path: `${OUT}/mobile-all-filters-sheet.png` }).catch(() => {});
    applyBtn = sheet ? sheet.buttons.filter(b => /apply/i.test(b.t)) : null;
  }
  put('C43563 phone All Filters sheet', {
    all_filters_control: allFilters.slice(0, 3),
    sheet_opened: !!sheet, sheet_painted: sheet ? sheet.painted : null,
    sheet_tids: sheet ? sheet.tids : null, apply_button: applyBtn
  });

  // ---------- C38889 : phone page search ----------
  await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(1500);
  await go('/workorders?tab=all');
  const toggle = await p.locator('[data-test-id="page_search_toggle"]').count();
  let opened = null;
  if (toggle) {
    await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(2000);
    opened = await p.evaluate(() => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      const tb = [...document.querySelectorAll('[data-test-id]')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 160)
        .map(e => ({ tid: e.getAttribute('data-test-id'), x: Math.round(e.getBoundingClientRect().x), w: Math.round(e.getBoundingClientRect().width) }));
      return { input: i ? { visible: i.getBoundingClientRect().width > 0, w: Math.round(i.getBoundingClientRect().width) } : null, toolbar: tb };
    });
    await p.screenshot({ path: `${OUT}/mobile-search-open.png` }).catch(() => {});
  }
  put('C38889 phone page search', { toggle_present: toggle, after_open: opened });

  // ---------- C43561 : icon buttons collapse into one 'more' menu on a phone ----------
  const pages = [['Parts Inventory', '/parts/inventory'], ['Purchase Orders', '/parts/orders'],
                 ['Part Sales', '/parts/sales'], ['Reports', '/reports']];
  const seen = [];
  for (const [nm, u] of pages) {
    await go(u);
    const s = await p.evaluate(() => {
      const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const btns = [...document.querySelectorAll('button')].filter(vis)
        .filter(b => b.getBoundingClientRect().y < 220)
        .map(b => ({ t: (b.innerText || '').trim().slice(0, 30), tid: b.getAttribute('data-test-id'),
                     x: Math.round(b.getBoundingClientRect().x), w: Math.round(b.getBoundingClientRect().width) }));
      return { url: location.href, title: document.title,
               toolbar_buttons: btns,
               more_like: btns.filter(b => /more|more_vert|⋮/i.test(b.t + ' ' + (b.tid || ''))),
               filter_bar_tids: [...document.querySelectorAll('[data-test-id^="filter_chip"], [data-test-id="toggle_filter_bar"], [data-test-id="page_search_toggle"]')].filter(vis).map(e => e.getAttribute('data-test-id')) };
    });
    seen.push(Object.assign({ page: nm, asked: u }, s));
    await p.screenshot({ path: `${OUT}/mobile-${nm.replace(/\s+/g, '')}.png` }).catch(() => {});
  }
  put('C43561 phone toolbars', { pages: seen });

  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/mobile.json`, JSON.stringify(R, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length);
  await h.browser.close();
})();
