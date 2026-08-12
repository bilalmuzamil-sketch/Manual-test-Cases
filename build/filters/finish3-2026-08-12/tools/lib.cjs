// lib.cjs — shared step drivers for the Filters runnability walk, 2026-08-12 (finish3).
//
// EVERY helper here returns enough state for the caller to prove the check COULD FAIL.
// The pass this continues lost three attempts to a selector that matched nothing and so
// reported "no options" without ever being able to fail.  The rule encoded here:
//   * options are DIV[data-test-id^="filter_option_"] -- NOT label, NOT .q-item
//   * every picker returns {found, clicked, optionsSeen} so a caller can assert it worked
//   * blur() is used to drop focus, never a page click (a click at (700,400) opens a work order)

const fs = require('fs');
const { API } = require('./harness.cjs');

const OPT = 'div[data-test-id^="filter_option_"]';

/** Read the saved page preference straight from the API (not the SPA's copy). */
async function pref(page, key = 'work-orders-list') {
  return page.evaluate(async ({ k, api }) => {
    // ABSOLUTE api host: a relative /api/ path hits the SPA host and returns index.html,
    // which then fails JSON.parse -- that cost the first run of this pass.
    const r = await fetch(`${api}/api/users/me/preferences/${k}`, { headers: { accept: 'application/json' } });
    if (!r.ok) return { status: r.status };
    const j = await r.json();
    return { status: r.status, updatedAt: j?.data?.updatedAt, value: j?.data?.value };
  }, { k: key, api: API });
}

/** Open a filter chip's dropdown and enumerate its real options. */
async function openChip(page, testId) {
  const chip = await page.$(`[data-test-id="${testId}"]`);
  if (!chip) return { found: false, options: [] };
  await chip.click();
  await page.waitForTimeout(1200);
  const options = await page.$$eval(OPT, els => els.map(e => ({
    id: e.getAttribute('data-test-id'),
    text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
    // PROVEN from outerHTML: these ARE Quasar checkboxes -- role=checkbox, aria-checked
    // flips false->true and q-checkbox__inner--falsy -> --truthy. A check-GLYPH detector
    // returns 0 for every row and makes the whole check unable to fail.
    checked: e.getAttribute('aria-checked') === 'true'
      || !!e.querySelector('.q-checkbox__inner--truthy'),
    ariaLabel: e.getAttribute('aria-label')
  })));
  return { found: true, options };
}

/** Click a named option inside an open dropdown. Returns whether it was really there. */
async function pickOption(page, optionTestId) {
  const el = await page.$(`div[data-test-id="${optionTestId}"]`);
  if (!el) return { clicked: false };
  await el.click();
  await page.waitForTimeout(1500);
  return { clicked: true };
}

/** Close any open dropdown WITHOUT navigating: Escape, never a page click. */
async function closeMenu(page) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
}

/** The five chips, as the tester sees them: label text + active tint + disabled state. */
async function chips(page) {
  return page.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => {
    const cs = getComputedStyle(e);
    return {
      id: e.getAttribute('data-test-id'),
      text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
      disabled: e.getAttribute('aria-disabled') === 'true' || e.disabled === true,
      opacity: cs.opacity,
      background: cs.backgroundColor,
      x: Math.round(e.getBoundingClientRect().x)
    };
  }));
}

/** Row count that does NOT lie: tbody tr is 0 on the phone (cards) and page-capped at 30. */
async function rows(page) {
  return page.evaluate(() => {
    const tb = document.querySelectorAll('tbody tr').length;
    const cards = document.querySelectorAll('[data-test-id^="work_order_card"], .work-order-card').length;
    const body = document.body ? document.body.innerText : '';
    const empty = /No work orders match|no work orders|No results/i.test(body);
    return { tbody: tb, cards, emptyStateVisible: empty };
  });
}

/** Presence + exact on-screen label, read from computed style not textContent. */
async function label(page, sel) {
  return page.evaluate((s) => {
    const e = document.querySelector(s);
    if (!e) return { present: false };
    const cs = getComputedStyle(e);
    return {
      present: true,
      textContent: (e.textContent || '').trim(),
      innerText: (e.innerText || '').trim(),   // what the tester actually reads
      textTransform: cs.textTransform,
      color: cs.color, background: cs.backgroundColor,
      x: Math.round(e.getBoundingClientRect().x), y: Math.round(e.getBoundingClientRect().y),
      w: Math.round(e.getBoundingClientRect().width)
    };
  }, sel);
}


/** Open the page search and type. The toggle is `page_search_toggle` -- NOT page_search_button,
 *  which matches nothing and makes the whole check unable to fail (cost one run of this pass).
 *  Returns every intermediate fact so the caller can prove the typing really landed. */
async function search(page, word) {
  const before = await page.$('[data-test-id="page_search_input"]');
  if (!before) {
    const t = await page.$('[data-test-id="page_search_toggle"]');
    if (!t) return { toggleFound: false, typed: false };
    await t.click();
    await page.waitForTimeout(1200);
  }
  const host = await page.$('[data-test-id="page_search_input"]');
  if (!host) return { toggleFound: true, inputFound: false, typed: false };
  const inner = await page.$('[data-test-id="page_search_input"] input');
  const target = inner || host;
  await target.click();
  await page.keyboard.press('Control+A');
  await target.type(word, { delay: 45 });
  await page.waitForTimeout(3500);
  const value = await page.evaluate(() => {
    const h = document.querySelector('[data-test-id="page_search_input"]');
    if (!h) return null;
    const i = h.matches('input') ? h : h.querySelector('input');
    return i ? i.value : null;
  });
  return { toggleFound: true, inputFound: true, typed: value === word, value };
}

/** Enumerate every clear-ish control the page currently offers, by test-id and by text. */
async function clearControls(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('button,a,[role="button"],[data-test-id]'))
    .map(e => ({ id: e.getAttribute('data-test-id'), text: (e.innerText || '').replace(/\s+/g, ' ').trim() }))
    .filter(x => (x.id && /clear|search/i.test(x.id)) || (x.text && /clear/i.test(x.text))));
}


/** Make sure the filter bar is EXPANDED, by state, never by a blind toggle click.
 *  A blind `if (toggle) click()` COLLAPSED an already-open bar and made every chip
 *  lookup below it return "not found" -- my own error, twice, in this pass. */
async function ensureBarOpen(page) {
  let chip = await page.$('[data-test-id="filter_chip_status"]');
  if (chip) return { alreadyOpen: true, toggled: false };
  const t = await page.$('[data-test-id="toggle_filter_bar"]');
  if (!t) return { alreadyOpen: false, toggled: false, toggleFound: false };
  await t.click();
  await page.waitForTimeout(2500);
  chip = await page.$('[data-test-id="filter_chip_status"]');
  return { alreadyOpen: false, toggled: true, nowOpen: !!chip };
}

/** Land on Work Orders with the bar open and a known-clean filter state. */
async function goWO(page, qs = '?tab=all') {
  await page.goto('https://sv8785.qa.shopview.com/workorders' + qs, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(9000);
  return ensureBarOpen(page);
}

/** Clear every active filter through the control the tester uses. */
async function clearAll(page) {
  const b = await page.$('[data-test-id="clear_filters"]');
  if (!b) return { present: false };
  await b.click();
  await page.waitForTimeout(2500);
  return { present: true, url: page.url() };
}


/** How many options are ticked right now, by aria-checked. */
async function tickedCount(page) {
  // TWO DIFFERENT MARKUPS on this build, both proven from outerHTML:
  //  * STATUS / ASSET  -> q-checkbox, role=checkbox, aria-checked flips false->true
  //  * CUSTOMER / TECH / ADVISOR -> q-item, role=listitem, NO aria-checked; selection
  //    appends a `q-item__section--side` holding a check <i>. An aria-only detector
  //    returns [] for every row here and makes the check unable to fail.
  return page.$$eval(OPT, els => els.filter(e =>
    e.getAttribute('aria-checked') === 'true'
    || !!e.querySelector('.q-checkbox__inner--truthy')
    || !!e.querySelector('.q-item__section--side i')
  ).map(e => e.getAttribute('data-test-id')));
}

/** Click 'Clear Selection' inside the open dropdown. */
async function clearSelection(page) {
  const ok = await page.evaluate(() => {
    const menu = document.querySelector('.q-menu'); if (!menu) return false;
    const btn = Array.from(menu.querySelectorAll('div,button,span'))
      .find(e => /^Clear Selection$/i.test((e.innerText || '').trim()));
    if (!btn) return false; btn.click(); return true;
  });
  await page.waitForTimeout(2200);
  return ok;
}

/** The REAL list-request shape, captured from the SPA rather than guessed:
 *  filters[n][field]=<f>&filters[n][value]=<v>  (a `status[]=` guess returns HTTP 400).
 *  Returns the server's own total so a row count is never read off a 30-row page. */
async function serverCount(page, filters = []) {
  return page.evaluate(async ({ api, fs }) => {
    const p = new URLSearchParams();
    // The envelope is {data:{pagination,work_orders}} and pagination carries NO row total
    // (only totalWorkOrderPrice), so a total has to be counted from a wide page.
    p.set('pagination[rowsPerPage]', '500'); p.set('pagination[page]', '1');
    fs.forEach((f, i) => { p.set(`filters[${i}][field]`, f.field); p.set(`filters[${i}][value]`, f.value); });
    p.set('search', ''); p.set('showMyWorkOrders', '0');
    const r = await fetch(`${api}/api/work-orders?${p.toString()}`, { headers: { accept: 'application/json' } });
    let j = null; try { j = await r.json(); } catch (_) {}
    const wos = j?.data?.work_orders;
    return { http: r.status, total: Array.isArray(wos) ? wos.length : null,
             capped: Array.isArray(wos) ? wos.length >= 500 : null,
             totalPrice: j?.data?.pagination?.totalWorkOrderPrice ?? null, query: p.toString() };
  }, { api: API, fs: filters });
}

/** Count the visible table by its STATUS column (index 1: On Site, Status, ...). */
async function statusTally(page) {
  return page.evaluate(() => {
    const out = {};
    document.querySelectorAll('tbody tr').forEach(tr => {
      const tds = tr.querySelectorAll('td');
      if (tds.length < 2) return;
      const s = (tds[1].innerText || '').split('\n')[0].trim();
      if (s) out[s] = (out[s] || 0) + 1;
    });
    return out;
  });
}

async function shot(page, out, name) {
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false }).catch(() => {});
}

function save(out, name, obj) {
  fs.writeFileSync(`${out}/${name}.json`, JSON.stringify(obj, null, 1));
}

module.exports = { OPT, pref, openChip, pickOption, closeMenu, chips, rows, label, search, clearControls, ensureBarOpen, goWO, clearAll, tickedCount, clearSelection, serverCount, statusTally, shot, save };
