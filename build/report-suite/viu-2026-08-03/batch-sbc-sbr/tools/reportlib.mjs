// reportlib.mjs — proven UI driving primitives for the sv8582 report pages (Quasar SPA).
// SECRET-FREE. Selectors below were all discovered live 2026-08-03/04 (build v3.4.1-0ed4433).
//
// KEY SELECTORS (do not re-derive — Rule 27):
//   date-range trigger  : span.date-range-label       (inside div.date-range-trigger)
//   date presets        : div.preset-option           (inside div.preset-sidebar; active = .preset-option.active)
//   range readout       : span.range-indicator        ("Range: N days")
//   Apply               : .q-btn with text "Apply"
//   filter dropdowns    : .q-select in toolbar order (index 0 = the Search box)
//   dropdown options    : the last VISIBLE .q-menu -> .q-item
//   export menu button  : [aria-label="Export report"]  (renders the more_horiz glyph)
//   column selector     : [aria-label="Column Selection"] (renders the width_normal glyph)
//   grid                : VIRTUALISED — tbody rows may be spacers; filter to rows with >1 non-empty cell
export async function clickEl(page, loc, waitMs = 1300) {
  const bb = await loc.boundingBox().catch(() => null);
  if (!bb) return false;
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.waitForTimeout(waitMs);
  return true;
}

/** Apply a named date preset (e.g. "Last 12 Months"). Returns the new label + range readout. */
export async function setPreset(page, presetName) {
  const trig = page.locator('span.date-range-label').first();
  if (!(await clickEl(page, trig, 1600))) return { error: 'date-range trigger not clickable' };
  const opt = page.locator('div.preset-option').filter({ hasText: new RegExp('^' + presetName + '$') }).first();
  const okPreset = await clickEl(page, opt, 1500);
  const readout = await page.locator('span.range-indicator').first().innerText().catch(() => null);
  const header = await page.evaluate(() => {
    const m = Array.from(document.querySelectorAll('.q-menu, .q-dialog')).filter(e => e.getClientRects().length)[0];
    return m ? (m.innerText || '').trim().split('\n')[0] : null;
  });
  const apply = page.locator('.q-btn').filter({ hasText: /^Apply$/ }).first();
  const okApply = await clickEl(page, apply, 6500);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(2500);
  return { okPreset, okApply, readout, popupHeader: header,
    labelAfter: await page.locator('span.date-range-label').first().innerText().catch(() => null) };
}

/** Read the grid: header rows (cleaned), any real body rows, tfoot/totals. */
export async function readGrid(page) {
  return page.evaluate(() => {
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    const clean = s => s.replace(/arrow_drop_(up|down)/g, '').replace(/arrow_(upward|downward)/g, '')
      .replace(/keyboard_double_arrow_(down|up)/g, '').replace(/info_outline|help_outline/g, '').trim();
    const t = document.querySelector('table');
    if (!t) return { noTable: true, pageText: txt(document.querySelector('main') || document.body).slice(0, 2000) };
    const headRows = Array.from(t.querySelectorAll('thead tr')).map(tr =>
      Array.from(tr.querySelectorAll('th,td')).map(th => ({
        text: clean(txt(th)), raw: txt(th),
        sortIndicator: /arrow_drop|arrow_upward|arrow_downward/.test(txt(th)),
        ariaSort: th.getAttribute('aria-sort'), cls: th.className.toString().slice(0, 140) })));
    const allTr = Array.from(t.querySelectorAll('tbody tr'));
    const bodyRows = allTr.map(tr => ({
      cells: Array.from(tr.querySelectorAll('td,th')).map(td => txt(td)),
      cls: tr.className.toString().slice(0, 140),
      indentPx: (() => { const f = tr.querySelector('td'); if (!f) return null;
        const cs = getComputedStyle(f); return cs.paddingLeft; })(),
      links: Array.from(tr.querySelectorAll('a')).map(a => ({ text: txt(a).slice(0, 50), href: a.getAttribute('href') })),
    })).filter(r => r.cells.length > 1 && r.cells.some(c => c));
    const tfoot = Array.from(t.querySelectorAll('tfoot tr')).map(tr =>
      Array.from(tr.querySelectorAll('td,th')).map(td => txt(td)));
    return { headRows, bodyRows, tfoot, rawTbodyTrCount: allTr.length,
      tableScrollWidth: t.scrollWidth };
  });
}

/** Open a dropdown by .q-select index and read its options (returns the last visible .q-menu). */
export async function openSelect(page, index) {
  const sels = await page.locator('.q-select').all();
  if (!sels[index]) return { error: 'no q-select at index ' + index };
  const label = (await sels[index].innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  if (!(await clickEl(page, sels[index], 1900))) return { label, error: 'not clickable' };
  const menu = await page.evaluate(() => {
    const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
    const m = ms[ms.length - 1];
    if (!m) return null;
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    return {
      items: Array.from(m.querySelectorAll('.q-item')).map(i => ({
        text: txt(i),
        selected: i.classList.contains('q-item--active') || i.getAttribute('aria-selected') === 'true'
          || !!i.querySelector('.q-checkbox__inner--truthy, .q-toggle__inner--truthy'),
        hasCheckGlyph: /(^|\s)check(\s|$)/.test(txt(i)),
      })).filter(x => x.text),
      allText: txt(m).slice(0, 2500),
      hasSearchInput: !!m.querySelector('input'),
      cls: m.className.toString().slice(0, 140),
    };
  });
  return { label, menu };
}
export async function closeMenu(page) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(650); }

/** Toolbar buttons + a Print-control sweep (Print retired by ruling — must be absent). */
export async function readToolbar(page) {
  return page.evaluate(() => {
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    const main = document.querySelector('main') || document.body;
    return {
      buttons: Array.from(main.querySelectorAll('button, .q-btn, [role=button]'))
        .filter(b => b.getClientRects().length)
        .map(b => ({ text: txt(b), aria: b.getAttribute('aria-label'), title: b.getAttribute('title'),
          disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' }))
        .filter(b => b.text || b.aria || b.title),
      printControls: Array.from(document.querySelectorAll('button,.q-btn,.q-item,a'))
        .filter(e => /print/i.test(e.innerText || '') || /print/i.test(e.getAttribute('aria-label') || ''))
        .map(e => ({ text: (e.innerText || '').trim().slice(0, 60), aria: e.getAttribute('aria-label') })),
      bodyText: txt(main).slice(0, 24000),
    };
  });
}
