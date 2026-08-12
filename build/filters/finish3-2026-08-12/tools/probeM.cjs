// probeM.cjs — the phone group at 390 x 844 with touch, driven step by step.
// C29621 C29623 C29624 C29626 C29627 C29629 C29630 C43563 C43561 C38889
//
// TRAPS THIS PASS INHERITS AND RESPECTS:
//  * `tbody tr` counts 0 on the phone (the list renders cards) -- never read as "no results".
//  * `.q-dialog` is the full-screen wrapper; the sheet CARD is `.mobile-all-filters-sheet`.
//  * collapsed accordions stay MOUNTED, so a card-wide filter_option_ sweep picks up another
//    section's options. Every option read here is SCOPED to its own section element.

const { makeHarness, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const S = (p, n = 2200) => p.waitForTimeout(n);
const PHONE = { width: 390, height: 844 };

/** Options that belong to ONE accordion section, not the whole sheet. */
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
      optionCount: opts.length, options: opts.map(o => o.text).slice(0, 12),
      ids: opts.map(o => o.id).slice(0, 12),
      ticked: opts.filter(o => o.checked).map(o => o.text),
      hasSearchField: !!inp, searchPlaceholder: inp ? inp.getAttribute('placeholder') : null,
      hasClearSelection: /Clear Selection/i.test(row.innerText || '') };
  }, label);
}

async function expandSection(page, label) {
  const r = await page.evaluate((lbl) => {
    const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
    const row = rows.find(r => new RegExp(lbl, 'i').test((r.innerText || '').split('\n')[0] || ''));
    if (!row) return { ok: false };
    const head = row.querySelector('.q-expansion-item__container > .q-item, .q-item');
    if (!head) return { ok: false, why: 'no header' };
    head.click(); return { ok: true };
  }, label);
  await page.waitForTimeout(1800);
  return r;
}

async function cards(page) {
  return page.evaluate(() => {
    const body = document.body.innerText;
    const empty = /No work orders match/i.test(body);
    const nums = (body.match(/S2-\d{4,6}/g) || []);
    return { workOrderNumbersVisible: [...new Set(nums)].length, sample: [...new Set(nums)].slice(0, 5),
      emptyStateVisible: empty,
      emptyText: (body.match(/No work orders[^\n]*/) || [null])[0],
      tbodyRows: document.querySelectorAll('tbody tr').length };
  });
}

(async () => {
  const H = await makeHarness('admin', PHONE);
  const R = { read_at_utc: new Date().toISOString(), viewport: PHONE, cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeM', R); };
  try {
    await H.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 11000);

    // ============================================================ C29621 — the chip row
    const row = await H.page.evaluate(() => {
      const tab = document.querySelector('[data-test-id="tab_all"]');
      const chips = Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]'))
        .map(e => ({ id: e.getAttribute('data-test-id'), text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
          x: Math.round(e.getBoundingClientRect().x), icon: (e.querySelector('i.q-icon')?.textContent || '').trim(),
          hasSvgIcon: !!e.querySelector('i.q-icon svg') }))
        .sort((a, b) => a.x - b.x);
      const holder = document.querySelector('[data-test-id^="filter_chip_"]')?.parentElement;
      const cs = holder ? getComputedStyle(holder) : null;
      return { tabBottom: tab ? Math.round(tab.getBoundingClientRect().bottom) : null,
        firstChipY: chips[0] ? Math.round(document.querySelector(`[data-test-id="${chips[0].id}"]`).getBoundingClientRect().y) : null,
        chips, firstChip: chips[0]?.id, firstChipText: chips[0]?.text,
        holderOverflowX: cs ? cs.overflowX : null,
        holderScrollWidth: holder ? holder.scrollWidth : null,
        holderClientWidth: holder ? holder.clientWidth : null,
        horizontallyScrollable: holder ? holder.scrollWidth > holder.clientWidth + 2 : null };
    });
    // actually swipe it
    const swiped = await H.page.evaluate(() => {
      const holder = document.querySelector('[data-test-id^="filter_chip_"]')?.parentElement;
      if (!holder) return null;
      const before = holder.scrollLeft; holder.scrollLeft = 300;
      return { before, after: holder.scrollLeft, moved: holder.scrollLeft > before };
    });
    put('29621', { chipRow: row, swipe: swiped,
      belowTabs: row.firstChipY !== null && row.tabBottom !== null && row.firstChipY >= row.tabBottom,
      startsWithAllFilters: /all_filters/i.test(row.firstChip || ''),
      could_fail: (row.chips || []).length > 0 });
    await L.shot(H.page, OUT, 'c29621-phone-chip-row');

    // ============================================================ C29629 — no collapse toggle on the phone
    put('29629', await H.page.evaluate(() => ({
      toggleFilterBarPresent: !!document.querySelector('[data-test-id="toggle_filter_bar"]'),
      chipRowVisible: !!document.querySelector('[data-test-id^="filter_chip_"]'),
      toolbarTestIds: Array.from(document.querySelectorAll('button[data-test-id]'))
        .map(b => b.getAttribute('data-test-id')).filter(id => /search|sort|create|toggle|filter|more|actions/i.test(id)),
      anyFilterIconButton: Array.from(document.querySelectorAll('button')).filter(b =>
        /filter_list/.test(b.innerText || '')).length
    })));

    // ============================================================ C29623 — Status in the sheet, Apply
    const openSheet = async () => {
      const r = await L.clickSel(H.page, '[data-test-id="filter_chip_all_filters"]');
      await S(H.page, 2600);
      return r;
    };
    let sheetOpen = await openSheet();
    const sheetCard = await H.page.evaluate(() => {
      const c = document.querySelector('.mobile-all-filters-sheet');
      const d = document.querySelector('.q-dialog');
      return { sheetCardPresent: !!c, dialogPresent: !!d,
        title: c ? (c.innerText || '').split('\n')[0] : null,
        sections: c ? Array.from(c.querySelectorAll('.q-expansion-item')).map(r => (r.innerText || '').split('\n')[0]) : null,
        applyButton: (() => { const b = document.querySelector('[data-test-id="apply_filters"]');
          return b ? { present: true, text: (b.innerText || '').trim(),
            background: getComputedStyle(b).backgroundColor } : { present: false }; })() };
    });
    const expStatus = await expandSection(H.page, '^Status');
    const statusSec = await sectionOptions(H.page, '^Status');
    // tick two statuses inside the sheet, SCOPED to the Status section
    const tickIds = (statusSec.ids || []).filter(i => /status_(declined|complete)$/.test(i));
    const ticks = [];
    for (const id of tickIds) { const r = await L.clickSel(H.page, `[data-test-id="${id}"]`); ticks.push({ id, ...r }); await S(H.page, 1200); }
    const urlBeforeApply = H.page.url();
    const cardsBeforeApply = await cards(H.page);
    const statusAfterTick = await sectionOptions(H.page, '^Status');
    const applied = await L.clickSel(H.page, '[data-test-id="apply_filters"]');
    await S(H.page, 4000);
    const afterApply = { url: H.page.url(), sheetStillOpen: !!(await H.page.$('.mobile-all-filters-sheet')),
      cards: await cards(H.page) };
    // reopen and read the title / accordion count
    await openSheet();
    const reopened = await H.page.evaluate(() => {
      const c = document.querySelector('.mobile-all-filters-sheet');
      if (!c) return { sheet: false };
      const rows = Array.from(c.querySelectorAll('.q-expansion-item')).map(r => (r.innerText || '').split('\n')[0]);
      return { sheet: true, title: (c.innerText || '').split('\n')[0], sectionHeaders: rows };
    });
    const allFiltersChip = await L.label(H.page, '[data-test-id="filter_chip_all_filters"]');
    put('29623', { sheetOpened: sheetOpen, sheetCard, statusExpanded: expStatus,
      statusSection: statusSec, tickedControls: ticks, statusAfterTick,
      urlBeforeApply, cardsBeforeApply,
      deferredUntilApply: urlBeforeApply === H.page.url() ? 'url unchanged before apply (see afterApply)' : 'url changed before apply',
      applyClicked: applied, afterApply, reopenedSheet: reopened, allFiltersChipLabel: allFiltersChip.innerText,
      could_fail: statusSec.sectionFound === true && ticks.some(t => t.clicked) });
    await L.shot(H.page, OUT, 'c29623-sheet-status');

    // ============================================================ C29626 — technician / advisor sections
    const secTech = await (async () => { await expandSection(H.page, 'Lead Technician'); return sectionOptions(H.page, 'Lead Technician'); })();
    await expandSection(H.page, 'Lead Technician');
    const secAdv = await (async () => { await expandSection(H.page, 'Service Advisor'); return sectionOptions(H.page, 'Service Advisor'); })();
    put('29626', { leadTechnicianSection: secTech, serviceAdvisorSection: secAdv,
      bothHaveSearch: !!secTech.hasSearchField && !!secAdv.hasSearchField,
      could_fail: secTech.sectionFound && secAdv.sectionFound });
    await L.shot(H.page, OUT, 'c29626-tech-advisor-sections');

    // ============================================================ C29627 — Asset on Site in the sheet
    await expandSection(H.page, 'Service Advisor');
    await expandSection(H.page, 'Asset on Site');
    const secAsset = await sectionOptions(H.page, 'Asset on Site');
    const yesId = (secAsset.ids || []).find(i => /vehicleHere_1$/.test(i));
    const noId = (secAsset.ids || []).find(i => /vehicleHere_0$/.test(i));
    let single = null;
    if (yesId && noId) {
      await L.clickSel(H.page, `[data-test-id="${yesId}"]`); await S(H.page, 1400);
      const afterYes = await sectionOptions(H.page, 'Asset on Site');
      await L.clickSel(H.page, `[data-test-id="${noId}"]`); await S(H.page, 1400);
      const afterNo = await sectionOptions(H.page, 'Asset on Site');
      single = { afterYesTicked: afterYes.ticked, afterNoTicked: afterNo.ticked,
        onlyOneAtATime: afterNo.ticked.length === 1 };
      // apply Yes state: re-tick yes then apply
      await L.clickSel(H.page, `[data-test-id="${yesId}"]`); await S(H.page, 1400);
      await L.clickSel(H.page, '[data-test-id="apply_filters"]'); await S(H.page, 4000);
    }
    put('29627', { assetSection: secAsset, singleSelect: single, urlAfterApply: H.page.url(),
      cards: await cards(H.page), could_fail: !!(yesId && noId) });
    await L.shot(H.page, OUT, 'c29627-asset-applied');

    // ============================================================ C29630 — phone empty state
    await H.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all&status=declined&tech_assigned_id=ccbacb31-53f3-488e-9a7e-28f781761e62',
      { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 10000);
    const emptyPhone = await cards(H.page);
    const emptyControls = await H.page.evaluate(() => Array.from(document.querySelectorAll('[data-test-id]'))
      .map(e => e.getAttribute('data-test-id')).filter(id => /clear/i.test(id)));
    put('29630', { url: H.page.url(), phone: emptyPhone, clearControlsPresent: emptyControls,
      pageErrored: await H.page.evaluate(() => /something went wrong|unexpected error/i.test(document.body.innerText)),
      realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 3),
      could_fail: true });
    await L.shot(H.page, OUT, 'c29630-phone-empty');

    // ============================================================ C43563 — steps 6-7 (untick and reapply)
    await H.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 10000);
    await openSheet();
    await expandSection(H.page, '^Status');
    const sec1 = await sectionOptions(H.page, '^Status');
    const impId = (sec1.ids || []).find(i => /status_imported$/.test(i));
    let c43563 = { importedOptionFound: !!impId };
    if (impId) {
      await L.clickSel(H.page, `[data-test-id="${impId}"]`); await S(H.page, 1500);
      const insideSheet = await L.chips(H.page);
      await L.clickSel(H.page, '[data-test-id="apply_filters"]'); await S(H.page, 4000);
      const afterApply1 = { url: H.page.url(), chips: (await L.chips(H.page)).map(c => ({ t: c.text, disabled: c.disabled, opacity: c.opacity })) };
      // STEP 6/7: reopen, untick Imported, apply again
      await openSheet();
      await expandSection(H.page, '^Status');
      const sec2 = await sectionOptions(H.page, '^Status');
      const untick = await L.clickSel(H.page, `[data-test-id="${impId}"]`); await S(H.page, 1600);
      const sec3 = await sectionOptions(H.page, '^Status');
      const apply2 = await L.clickSel(H.page, '[data-test-id="apply_filters"]'); await S(H.page, 4000);
      c43563 = { importedOptionFound: true, chipsWhileSheetOpen: insideSheet.map(c => ({ t: c.text, disabled: c.disabled, opacity: c.opacity })),
        afterFirstApply: afterApply1,
        reopenedTicked: sec2.ticked, untickClicked: untick, tickedAfterUntick: sec3.ticked,
        secondApply: apply2, urlAfterSecondApply: H.page.url(),
        chipsAfterSecondApply: (await L.chips(H.page)).map(c => ({ t: c.text, disabled: c.disabled, opacity: c.opacity })),
        othersReEnabled: (await L.chips(H.page)).filter(c => c.id !== 'filter_chip_all_filters' && c.disabled).length === 0,
        could_fail: untick.clicked === true };
      await L.shot(H.page, OUT, 'c43563-after-untick-apply');
    }
    put('43563', c43563);

    // ============================================================ C38889 — no page search on the phone
    await H.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 9000);
    put('38889', await H.page.evaluate(() => ({
      pageSearchTogglePresent: !!document.querySelector('[data-test-id="page_search_toggle"]'),
      pageSearchInputPresent: !!document.querySelector('[data-test-id="page_search_input"]'),
      globalSearchPresent: !!document.querySelector('[data-test-id="select_global_search"]'),
      toolbarButtons: Array.from(document.querySelectorAll('button[data-test-id]')).map(b => b.getAttribute('data-test-id')).slice(0, 20)
    })));

    // ============================================================ C43561 — icon buttons collapse into one menu
    const pages = [
      { name: 'Parts > Inventory', url: '/parts/inventory' },
      { name: 'Parts > Purchase Orders', url: '/parts/orders' },
      { name: 'Reports > Timesheet Activities', url: '/reports/timesheet-activities' },
      { name: 'Reports > Technician Efficiency', url: '/reports/technician-efficiency' },
      { name: 'Reports > Sales Tax Collected', url: '/reports/sales-tax' }
    ];
    const seenPages = [];
    for (const p of pages) {
      await H.page.goto('https://sv8785.qa.shopview.com' + p.url, { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
      await S(H.page, 9000);
      const info = await H.page.evaluate(() => {
        const iconBtns = Array.from(document.querySelectorAll('button')).filter(b => {
          const t = (b.innerText || '').trim();
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.width < 60 && t.length < 22 && /^[a-z_]+$/.test(t.replace(/\s/g, ''));
        }).map(b => ({ id: b.getAttribute('data-test-id'), text: (b.innerText || '').trim(), x: Math.round(b.getBoundingClientRect().x) }));
        const more = Array.from(document.querySelectorAll('button')).filter(b => /more_vert|more_horiz/.test(b.innerText || ''))
          .map(b => ({ id: b.getAttribute('data-test-id'), text: (b.innerText || '').trim() }));
        return { landedOn: location.pathname, iconOnlyButtons: iconBtns, moreButtons: more,
          bodyStart: document.body.innerText.replace(/\s+/g, ' ').slice(0, 90) };
      });
      // open the more menu if there is one
      let menu = null;
      if (info.moreButtons.length && info.moreButtons[0].id) {
        const r = await L.clickSel(H.page, `[data-test-id="${info.moreButtons[0].id}"]`);
        await S(H.page, 1800);
        menu = await H.page.evaluate(() => {
          const m = document.querySelector('.q-menu');
          return m ? { open: true, items: Array.from(m.querySelectorAll('.q-item,div[role="listitem"],button'))
            .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 12) } : { open: false };
        });
        menu.click = r;
        await H.page.keyboard.press('Escape'); await S(H.page, 800);
      }
      seenPages.push({ ...p, ...info, moreMenu: menu });
      await L.shot(H.page, OUT, `c43561-${p.url.replace(/\W+/g, '-')}`);
    }
    put('43561', { pagesDriven: seenPages.length, pages: seenPages, could_fail: seenPages.length === pages.length });

    R.bridge_errors = H.bridgeErrors.length;
  } catch (e) { R.error = String(e).slice(0, 700); }
  L.save(OUT, 'probeM', R);
  console.log('ERR:', R.error, '| bridge:', R.bridge_errors, '| blocks:', Object.keys(R.cases).length);
  await H.browser.close();
})();
