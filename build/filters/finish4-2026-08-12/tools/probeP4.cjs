// probeP4.cjs — finish4, 2026-08-12.
//
// (1) C29626 STEP 3, REDONE PROPERLY. probeP3 applied the filter correctly (30 cards -> 0,
//     URL and saved preference both gained it), but the technician it happened to pick first
//     ('Admin ShopView') is lead tech on ZERO work orders, so filtering was only shown
//     NEGATIVELY. A zero result is also what a broken list looks like. This run picks
//     JOEL PARKER, who holds 84 work orders, so the narrowed list is POSITIVELY non-empty.
//     INDEPENDENT CROSS-CHECK, with the field name now correct: probeP3's server check
//     returned HTTP 400 because it sent field 'lead_technician_id'. THE REAL FIELD IS
//     'tech_assigned_id', read off the option's own data-test-id.
//
// (2) BASELINE HYGIENE, not cleanup. probeP3's desktop clearAll() silently did nothing on the
//     phone (there is no clear_filters control in the phone chip row), so the account was left
//     holding a tech_assigned_id filter. A polluted saved preference is exactly what wrecked
//     finish3's C43560 attempts, so it is cleared here and PROVEN clear.
//
// (3) C43561 STEP 7 spot-check: a page with only ONE small icon button must still show that
//     button on its own rather than in a 'more' menu (expectation 5).

const { makeHarness, APP, API, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n = 2200) => p.waitForTimeout(n);
const PHONE = { width: 390, height: 844 };
const R = { read_at_utc: new Date().toISOString(), cases: {} };

async function sectionOf(page, label) {
  return page.evaluate((lbl) => {
    const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
    const row = rows.find(r => new RegExp(lbl, 'i').test((r.innerText || '').split('\n')[0] || ''));
    if (!row) return { sectionFound: false };
    const opts = Array.from(row.querySelectorAll('[data-test-id^="filter_option_"]')).map(e => ({
      id: e.getAttribute('data-test-id'), text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
      checked: !!e.querySelector('.q-item__section--side i') || e.getAttribute('aria-checked') === 'true'
        || !!e.querySelector('.q-checkbox__inner--truthy')
    }));
    return { sectionFound: true, expanded: /q-expansion-item--expanded/.test(row.className),
      optionCount: opts.length, ticked: opts.filter(o => o.checked).map(o => o.text),
      match: opts.filter(o => /Joel Parker/i.test(o.text)).slice(0, 3) };
  }, label);
}
async function expand(page, label) {
  const r = await page.evaluate((lbl) => {
    const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
    const row = rows.find(r => new RegExp(lbl, 'i').test((r.innerText || '').split('\n')[0] || ''));
    if (!row) return { ok: false };
    const h = row.querySelector('.q-expansion-item__container > .q-item, .q-item');
    if (!h) return { ok: false }; h.click(); return { ok: true };
  }, label);
  await page.waitForTimeout(2000); return r;
}
async function typeInSection(page, label, text) {
  return page.evaluate(({ lbl, t }) => {
    const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
    const row = rows.find(r => new RegExp(lbl, 'i').test((r.innerText || '').split('\n')[0] || ''));
    if (!row) return false;
    const i = row.querySelector('input:not(.hidden)'); if (!i) return false;
    i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); return true;
  }, { lbl: label, t: text });
}
async function cards(page) {
  return page.evaluate(() => {
    const b = document.body.innerText;
    const n = [...new Set(b.match(/S2-\d{4,6}/g) || [])];
    return { count: n.length, sample: n.slice(0, 5), emptyStateVisible: /No work orders match/i.test(b) };
  });
}

(async () => {
  // ================================================= C29626 step 3, with a technician who HAS work
  {
    const H = await makeHarness('admin', PHONE);
    const e = { case: 'C29626', step: 3, technician: 'Joel Parker' };
    try {
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 11000);
      e.prefAtStart = (await L.pref(H.page)).value?.filters;
      e.cardsBefore = await cards(H.page);

      e.sheetOpened = (await L.clickSel(H.page, '[data-test-id="filter_chip_all_filters"]')).clicked;
      await S(H.page, 2800);
      e.expanded = await expand(H.page, 'Lead Technician');
      e.typed = await typeInSection(H.page, 'Lead Technician', 'Joel');
      await S(H.page, 2400);
      const sec = await sectionOf(H.page, 'Lead Technician');
      e.section = sec;
      if (sec.match && sec.match.length) {
        const opt = sec.match[0];
        e.chosen = opt;
        e.techUuid = (opt.id || '').replace('filter_option_tech_assigned_id_', '');
        e.picked = (await L.clickSel(H.page, `[data-test-id="${opt.id}"]`)).clicked;
        await S(H.page, 1800);
        e.tickedAfterPick = (await sectionOf(H.page, 'Lead Technician')).ticked;
        e.urlBeforeApply = H.page.url();
        e.applyClicked = (await L.clickSel(H.page, '[data-test-id="apply_filters"]')).clicked;
        await S(H.page, 5500);
        e.urlAfterApply = H.page.url();
        e.cardsAfter = await cards(H.page);
        e.prefAfter = (await L.pref(H.page)).value?.filters;
        await L.shot(H.page, OUT, 'P4-c29626-joel-applied');

        // CROSS-CHECK with the CORRECT field name.
        e.serverCount = await H.page.evaluate(async ({ api, val }) => {
          const p = new URLSearchParams();
          p.set('pagination[rowsPerPage]', '3000'); p.set('pagination[page]', '1');
          p.set('filters[0][field]', 'tech_assigned_id'); p.set('filters[0][value]', val);
          p.set('search', ''); p.set('showMyWorkOrders', '0');
          const r = await fetch(`${api}/api/work-orders?${p}`, { headers: { accept: 'application/json' } });
          let j = null; try { j = await r.json(); } catch (_) {}
          const w = j?.data?.work_orders;
          return { http: r.status, total: Array.isArray(w) ? w.length : null,
            allSameTech: Array.isArray(w) ? [...new Set(w.map(x => `${x.techAssignedFirstName} ${x.techAssignedLastName}`))] : null,
            sample: Array.isArray(w) ? w.slice(0, 5).map(x => x.number) : null };
        }, { api: API, val: e.techUuid });
      }

      // ---- BASELINE HYGIENE: clear the filter through the phone sheet, then PROVE it clear.
      e.reopenedSheet = (await L.clickSel(H.page, '[data-test-id="filter_chip_all_filters"]')).clicked;
      await S(H.page, 2600);
      e.clearAllInSheet = await H.page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button,div,span'))
          .filter(b => /^(Clear all|Clear filters|Clear Filters|Clear all filters)$/i.test((b.innerText || '').trim()));
        if (!btns.length) return { found: false, candidates: Array.from(document.querySelectorAll('button'))
          .map(b => (b.innerText || '').trim()).filter(Boolean).slice(0, 12) };
        btns[0].click(); return { found: true, label: (btns[0].innerText || '').trim() };
      });
      await S(H.page, 2200);
      await L.clickSel(H.page, '[data-test-id="apply_filters"]');
      await S(H.page, 4500);
      e.prefAfterClearAttempt = (await L.pref(H.page)).value?.filters;
      // Last resort: write an EMPTY VALID filters value (never an invalid one - finish3's trap).
      if (e.prefAfterClearAttempt && Object.keys(e.prefAfterClearAttempt).length) {
        e.hygieneFallback = await H.page.evaluate(async (api) => {
          const g = await fetch(`${api}/api/users/me/preferences/work-orders-list`, { headers: { accept: 'application/json' } });
          const cur = (await g.json())?.data?.value || {};
          cur.filters = [];                       // [] is the shape the app itself stores when clean
          const r = await fetch(`${api}/api/users/me/preferences/work-orders-list`, {
            method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify({ value: cur }) });
          return { http: r.status };
        }, API);
        await S(H.page, 1500);
        e.prefFinal = (await L.pref(H.page)).value?.filters;
      } else { e.prefFinal = e.prefAfterClearAttempt; }
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['29626'] = e; L.save(OUT, 'probeP4', R);
    await H.browser.close();
  }

  // ================================================= C43561 step 7 — the single-icon comparison
  {
    const H = await makeHarness('admin', PHONE);
    const e = { case: 'C43561', step: 7, pages: {} };
    try {
      for (const [name, path] of [['Purchase Orders', '/parts/orders'],
                                  ['Timesheet Activities', '/reports/punch-clock-activities'],
                                  ['Sales Tax', '/reports/sales-tax-report']]) {
        await H.page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 120000 });
        await S(H.page, 9000);
        e.pages[name] = await H.page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button')).map(b => {
            const r = b.getBoundingClientRect();
            const txt = (b.innerText || '').replace(/\s+/g, ' ').trim();
            return { id: b.getAttribute('data-test-id'), text: txt,
              // an icon-only button renders a single ligature word and no sentence
              iconOnly: /^[a-z_]+$/.test(txt) && txt.length < 20,
              visible: r.width > 0 && r.height > 0, y: Math.round(r.y) };
          }).filter(b => b.visible && b.y < 320);
          return { url: location.pathname, toolbarButtons: btns,
            iconOnlyCount: btns.filter(b => b.iconOnly).length,
            iconOnlyIds: btns.filter(b => b.iconOnly).map(b => b.id || b.text),
            hasMoreDropdown: btns.some(b => /dropdown|more/i.test(b.id || '') || /more_horiz|more_vert/.test(b.text)) };
        });
        await L.shot(H.page, OUT, `P4-c43561-step7-${name.replace(/\s+/g, '-')}`);
      }
    } catch (err) { e.error = String(err).slice(0, 500); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['43561'] = e; L.save(OUT, 'probeP4', R);
    await H.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeP4.json`, JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 8000));
})();
