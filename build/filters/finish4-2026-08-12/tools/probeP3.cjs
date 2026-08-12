// probeP3.cjs — finish4, 2026-08-12. The two phone remainders.
//
//  C29626 STEP 3  — select one name in the Lead Technician (or Service Advisor) list and tap
//                   'Apply Filters'; expectation 3 is that the list filters "just like on desktop".
//                   MADE ABLE TO FAIL: the visible work-order numbers are counted BEFORE and
//                   AFTER, the URL is read, and the server's own count for that technician is
//                   fetched independently and compared. If the filter did nothing, before and
//                   after would be identical and the URL unchanged.
//
//  C43561 STEP 4  — the Technician Efficiency report's SECOND view tab. finish3 drove only the
//                   first. Expectation 3 is that BOTH view tabs behave the same as each other.
//
// PHONE TRAPS RESPECTED (inherited): `tbody tr` is 0 on the phone (cards); the sheet CARD is
// `.mobile-all-filters-sheet`; collapsed accordions stay MOUNTED so every option read is SCOPED
// to its own `.q-expansion-item`.

const { makeHarness, APP, API, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n = 2200) => p.waitForTimeout(n);
const PHONE = { width: 390, height: 844 };
const R = { read_at_utc: new Date().toISOString(), viewport: PHONE, cases: {} };

async function sectionOptions(page, label) {
  return page.evaluate((lbl) => {
    const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
    const row = rows.find(r => new RegExp(lbl, 'i').test((r.innerText || '').split('\n')[0] || ''));
    if (!row) return { sectionFound: false, sections: rows.map(r => (r.innerText || '').split('\n')[0]) };
    const opts = Array.from(row.querySelectorAll('[data-test-id^="filter_option_"]')).map(e => ({
      id: e.getAttribute('data-test-id'),
      text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
      checked: e.getAttribute('aria-checked') === 'true'
        || !!e.querySelector('.q-checkbox__inner--truthy')
        || !!e.querySelector('.q-item__section--side i')
    }));
    const inp = row.querySelector('input:not(.hidden)');
    return { sectionFound: true, expanded: /q-expansion-item--expanded/.test(row.className),
      optionCount: opts.length, first: opts.slice(0, 6),
      ticked: opts.filter(o => o.checked).map(o => o.text),
      hasSearchField: !!inp, searchPlaceholder: inp ? inp.getAttribute('placeholder') : null };
  }, label);
}

async function expandSection(page, label) {
  const r = await page.evaluate((lbl) => {
    const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
    const row = rows.find(r => new RegExp(lbl, 'i').test((r.innerText || '').split('\n')[0] || ''));
    if (!row) return { ok: false, sections: rows.map(x => (x.innerText || '').split('\n')[0]) };
    const head = row.querySelector('.q-expansion-item__container > .q-item, .q-item');
    if (!head) return { ok: false, why: 'no header' };
    head.click(); return { ok: true };
  }, label);
  await page.waitForTimeout(2000);
  return r;
}

async function cards(page) {
  return page.evaluate(() => {
    const body = document.body.innerText;
    const nums = [...new Set(body.match(/S2-\d{4,6}/g) || [])];
    return { count: nums.length, sample: nums.slice(0, 6),
      emptyStateVisible: /No work orders match/i.test(body),
      tbodyRows: document.querySelectorAll('tbody tr').length };
  });
}

(async () => {
  // ============================================================== C29626 step 3
  {
    const H = await makeHarness('admin', PHONE);
    const e = { case: 'C29626', step: 3 };
    try {
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 11000);
      // Start from a clean filter state so the before/after difference is attributable.
      e.prefBefore = (await L.pref(H.page)).value?.filters;
      e.cardsBefore = await cards(H.page);
      e.urlBefore = H.page.url();

      const open1 = await L.clickSel(H.page, '[data-test-id="filter_chip_all_filters"]');
      await S(H.page, 2800);
      e.sheetOpened = open1.clicked;

      const exp = await expandSection(H.page, 'Lead Technician');
      e.expandLeadTech = exp;
      const sec = await sectionOptions(H.page, 'Lead Technician');
      e.leadTechSection = sec;
      await L.shot(H.page, OUT, 'P3-c29626-leadtech-open');

      if (sec.sectionFound && sec.first && sec.first.length) {
        // Pick the FIRST technician option and remember exactly who it was.
        const chosen = sec.first[0];
        e.chosen = chosen;
        const pick = await L.clickSel(H.page, `[data-test-id="${chosen.id}"]`);
        e.picked = pick.clicked;
        await S(H.page, 1800);
        e.tickedAfterPick = (await sectionOptions(H.page, 'Lead Technician')).ticked;
        e.urlBeforeApply = H.page.url();

        const applyBtn = await L.label(H.page, '[data-test-id="apply_filters"]');
        e.applyButton = applyBtn;
        const applied = await L.clickSel(H.page, '[data-test-id="apply_filters"]');
        e.applyClicked = applied.clicked;
        await S(H.page, 5000);

        e.urlAfterApply = H.page.url();
        e.cardsAfter = await cards(H.page);
        e.prefAfter = (await L.pref(H.page)).value?.filters;
        await L.shot(H.page, OUT, 'P3-c29626-after-apply');

        // INDEPENDENT CROSS-CHECK: ask the server directly for that technician's work orders.
        const techId = (chosen.id || '').replace('filter_option_', '').replace(/^lead_technician_id_/, '');
        e.techIdParsed = techId;
        e.serverCountForTech = await H.page.evaluate(async ({ api, field, val }) => {
          const p = new URLSearchParams();
          p.set('pagination[rowsPerPage]', '3000'); p.set('pagination[page]', '1');
          p.set('filters[0][field]', field); p.set('filters[0][value]', val);
          p.set('search', ''); p.set('showMyWorkOrders', '0');
          const r = await fetch(`${api}/api/work-orders?${p}`, { headers: { accept: 'application/json' } });
          let j = null; try { j = await r.json(); } catch (_) {}
          const w = j?.data?.work_orders;
          return { http: r.status, total: Array.isArray(w) ? w.length : null,
            sample: Array.isArray(w) ? w.slice(0, 6).map(x => x.number || x.work_order_number) : null };
        }, { api: API, field: 'lead_technician_id', val: techId });
      }
      // Leave the account clean for the next probe.
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 8000);
      await L.ensureBarOpen(H.page);
      await L.clearAll(H.page); await S(H.page, 2500);
      e.prefRestored = (await L.pref(H.page)).value?.filters;
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['29626'] = e; L.save(OUT, 'probeP3', R);
    await H.browser.close();
  }

  // ============================================================== C43561 step 4
  {
    const H = await makeHarness('admin', PHONE);
    const e = { case: 'C43561', step: 4 };
    try {
      // Find the Technician Efficiency report from the Reports area rather than guessing a URL.
      await H.page.goto(APP + '/reports', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 9000);
      e.reportsLinks = await H.page.evaluate(() => Array.from(document.querySelectorAll('a[href],[data-test-id]'))
        .map(a => ({ href: a.getAttribute('href'), id: a.getAttribute('data-test-id'),
          text: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50) }))
        .filter(x => /efficien/i.test(x.text || '') || /efficien/i.test(x.href || '') || /efficien/i.test(x.id || '')));
      await L.shot(H.page, OUT, 'P3-c43561-reports-list');

      const href = (e.reportsLinks.find(x => x.href) || {}).href;
      e.navigatedTo = href ? (APP + href) : (APP + '/reports/technician-efficiency');
      await H.page.goto(e.navigatedTo, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 10000);
      e.landedOn = H.page.url();

      // Enumerate the view tabs and the toolbar in one read, then per tab.
      const readTabsAndToolbar = async () => H.page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"], .q-tab')).map(t => ({
          id: t.getAttribute('data-test-id'),
          text: (t.innerText || '').replace(/\s+/g, ' ').trim(),
          active: /q-tab--active/.test(t.className) || t.getAttribute('aria-selected') === 'true'
        }));
        // Icon-only buttons = a button whose visible text is just an icon ligature (no words).
        const btns = Array.from(document.querySelectorAll('button')).map(b => {
          const r = b.getBoundingClientRect();
          return { id: b.getAttribute('data-test-id'),
            text: (b.innerText || '').replace(/\s+/g, ' ').trim(),
            visible: r.width > 0 && r.height > 0,
            x: Math.round(r.x), y: Math.round(r.y) };
        }).filter(b => b.visible);
        const dropdowns = btns.filter(b => /dropdown|more|actions/i.test(b.id || ''));
        return { tabs, buttonCount: btns.length,
          buttons: btns.filter(b => b.y < 400).slice(0, 25), dropdowns };
      });

      e.tabsInitial = await readTabsAndToolbar();
      await L.shot(H.page, OUT, 'P3-c43561-tab1');

      // Open the 'more' dropdown on tab 1 and list its contents.
      const openMore = async (tag) => {
        const dd = (await readTabsAndToolbar()).dropdowns[0];
        if (!dd || !dd.id) return { found: false };
        const c = await L.clickSel(H.page, `[data-test-id="${dd.id}"]`);
        await S(H.page, 2000);
        const items = await H.page.evaluate(() => {
          const m = document.querySelector('.q-menu');
          return m ? Array.from(m.querySelectorAll('.q-item,[role="menuitem"],div'))
            .map(i => (i.innerText || '').replace(/\s+/g, ' ').trim())
            .filter(t => t && t.length < 60).slice(0, 12) : null;
        });
        await L.shot(H.page, OUT, `P3-c43561-${tag}-menu`);
        await H.page.keyboard.press('Escape'); await S(H.page, 1200);
        return { found: true, id: dd.id, clicked: c.clicked, items };
      };
      e.tab1Menu = await openMore('tab1');

      // Now the SECOND view tab — the whole point of step 4.
      const tabs = e.tabsInitial.tabs || [];
      e.tabList = tabs.map(t => t.text);
      const second = tabs.find(t => !t.active && t.text);
      e.secondTabTarget = second || null;
      if (second) {
        const sel = second.id ? `[data-test-id="${second.id}"]` : null;
        let clicked = false;
        if (sel) { clicked = (await L.clickSel(H.page, sel)).clicked; }
        if (!clicked) {
          clicked = await H.page.evaluate((txt) => {
            const t = Array.from(document.querySelectorAll('[role="tab"], .q-tab'))
              .find(x => (x.innerText || '').replace(/\s+/g, ' ').trim() === txt);
            if (!t) return false; t.click(); return true;
          }, second.text);
        }
        e.secondTabClicked = clicked;
        await S(H.page, 6000);
        e.tabsAfterSwitch = await readTabsAndToolbar();
        e.activeTabAfterSwitch = (e.tabsAfterSwitch.tabs || []).filter(t => t.active).map(t => t.text);
        await L.shot(H.page, OUT, 'P3-c43561-tab2');
        e.tab2Menu = await openMore('tab2');
      }
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    e.api_4xx5xx = H.apiLog.filter(a => a.s >= 400).slice(0, 10);
    R.cases['43561'] = e; L.save(OUT, 'probeP3', R);
    await H.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeP3.json`, JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 9000));
})();
