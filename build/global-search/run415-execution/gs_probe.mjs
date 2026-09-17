// gs_probe.mjs — the ONE harness every Global Search V2 run-415 probe uses.
//
// Written 2026-09-17 against sv9160 build v26.36.7-29ca209. The palette carries NO data-test
// attributes, so every selector here is a BEM class read off the live DOM (explore pass in
// /tmp/gs/explore2.mjs). If a selector stops matching, RE-READ THE DOM — do not assume the
// feature went away (Rule 104: prove the instrument before any negative claim).
//
// Geometry observed on the empty palette: .search-modal is 640 wide at top 96, left 480 in a
// 1600-wide viewport — i.e. centred, NOT anchored to the header. That is what C44804/C44805 assert.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';

export const SEL = {
  modal:   '.search-modal',
  backdrop:'.q-dialog__backdrop',
  // 🔴 .search-modal__input is the Quasar <label> WRAPPER, not the field. Selecting it returns
  // placeholder "undefined" and focused=false, which reads exactly like a product defect and is
  // not one (measured 2026-09-17, cost one false Failed on C44804). The field is the <input>.
  input:   '.search-modal input',
  tab:     '.search-tabs__tab',
  tabOn:   '.search-tabs__tab--active',
  row:     '.search-row',
  rowOn:   '.search-row--selected',
  footer:  '.search-footer',
  dialog:  '.search-modal-dialog',
};

export async function open(branch = 'sv9160', route = '/customers', key = 'admin') {
  const b = await boot(branch, route, key);
  await b.page.waitForTimeout(2000);
  return b;
}

/** Open the palette with the keyboard shortcut. Returns nothing; assert separately. */
export async function openPalette(page, how = 'key') {
  if (how === 'key') {
    await page.keyboard.press('Control+k');
  } else {
    // The header trigger is a BUTTON labelled "Search" at the top right (observed 97x36 @1296,79),
    // NOT an <input>. Selecting for an input times out and looks like the trigger is missing.
    const hit = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(e => {
        const r = e.getBoundingClientRect();
        return r.top < 120 && r.height > 18 && r.height < 60 && /search/i.test(e.innerText || '');
      });
      if (!b) return false;
      b.click(); return true;
    });
    if (!hit) throw new Error('no header Search trigger found - RE-READ THE DOM before calling it absent');
  }
  await page.waitForTimeout(1400);
}

export async function isOpen(page) {
  return page.evaluate(s => !!document.querySelector(s), SEL.modal);
}

/**
 * Type a query and wait for the debounce + async index to settle.
 *
 * 🔴 `reset` RE-SELECTS THE "All" TAB FIRST, AND IT DEFAULTS ON. A scope tab chosen by an earlier
 * case STAYS selected across a re-type, so the next query is silently narrowed to that one type and
 * the record you are looking for "is not returned". That produced a false Failed on C45129
 * (2026-09-17) against data the verifier had just proven. Pass reset:false only when the case is
 * deliberately testing a scoped tab.
 */
export async function type(page, q, wait = 2600, reset = true) {
  if (reset) {
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('.search-tabs__tab')]
        .find(x => /^All\b/.test(x.innerText.trim()));
      if (t && !t.classList.contains('search-tabs__tab--active')) t.click();
    });
    await page.waitForTimeout(500);
  }
  return _type(page, q, wait);
}

async function _type(page, q, wait) {
  await page.fill(SEL.input, '');
  await page.waitForTimeout(250);
  await page.type(SEL.input, q, { delay: 28 });
  await page.waitForTimeout(wait);
}

/**
 * Read the whole palette in one evaluate. Everything a case needs, measured, never inferred.
 * Group headers in RESULTS mode and in RECENTS mode use different classes, so both are collected
 * and the caller is told which mode it is looking at.
 */
export async function read(page) {
  return page.evaluate((S) => {
    const m = document.querySelector(S.modal);
    if (!m) return { open: false };
    const box = m.getBoundingClientRect();
    const inp = document.querySelector(S.input);
    const txt = e => (e?.innerText || '').replace(/\s+/g, ' ').trim();

    // Group headings. RESULTS mode uses .search-group__header ("Work orders (20)"); RECENTS mode
    // uses .search-modal__recents-header ("TODAY"). Both are collected and `mode` says which.
    const resHeads = [...m.querySelectorAll('.search-group__header')].map(txt).filter(Boolean);
    const recHeads = [...m.querySelectorAll('.search-modal__recents-header')].map(txt).filter(Boolean);
    const heads = resHeads.length ? resHeads : recHeads;
    const mode = resHeads.length ? 'results' : (recHeads.length ? 'recents' : 'empty');

    // rows per group, in order - needed by every "this tab shows only X" case.
    const groupRows = [...m.querySelectorAll('.search-group')].map(g => ({
      head: txt(g.querySelector('.search-group__header')),
      rows: [...g.querySelectorAll('.search-row')].map(r => txt(r).slice(0, 90)),
    }));

    const rows = [...m.querySelectorAll(S.row)].map(r => ({
      text: txt(r),
      selected: r.classList.contains('search-row--selected'),
      badge: txt(r.querySelector('[class*="search-row__badge"]')) || null,
      badgeClass: [...(r.querySelector('[class*="search-row__badge"]')?.classList || [])]
                    .filter(c => c.startsWith('search-row__badge--')).join(',') || null,
      title: txt(r.querySelector('[class*="search-row__title"]')) || null,
      meta:  txt(r.querySelector('[class*="search-row__meta"]')) || null,
      hasMark: !!r.querySelector('mark, .highlight, [class*="highlight"]'),
    }));

    const tabs = [...m.querySelectorAll(S.tab)].map(t => ({
      label: txt(t), active: t.classList.contains('search-tabs__tab--active'),
    }));

    return {
      open: true,
      geometry: { w: Math.round(box.width), h: Math.round(box.height),
                  top: Math.round(box.top), left: Math.round(box.left),
                  viewportW: window.innerWidth },
      centred: Math.abs((box.left + box.width / 2) - window.innerWidth / 2) <= 2,
      backdrop: !!document.querySelector(S.backdrop),
      placeholder: inp ? inp.placeholder : null,
      value: inp ? inp.value : null,
      inputFocused: inp ? document.activeElement === inp : null,
      tabs, heads, mode, groupRows, resHeads, recHeads, rows,
      rowCount: rows.length,
      selectedIndex: rows.findIndex(r => r.selected),
      footer: txt(document.querySelector(S.footer)),
      bodyText: txt(m).slice(0, 4000),
    };
  }, SEL);
}

/** Group headings that look like "Work orders (12)" -> [{name, count}] */
export function groups(snap) {
  return (snap.heads || []).map(h => {
    const m = /^(.*?)\s*\((\d+)\)\s*$/.exec(h);
    return m ? { name: m[1].trim(), count: +m[2] } : { name: h.trim(), count: null };
  });
}

export const results = [];
export function record(cid, status, note, evidence) {
  results.push({ cid, status, note, evidence });
  const tick = status === 'Passed' ? '✅' : status === 'Failed' ? '❌' : '⚠️';
  console.log(`${tick} ${cid}  ${status}  — ${note}`);
}
export function dump(path) {
  fs.writeFileSync(path, JSON.stringify(results, null, 1));
  console.log(`\nwrote ${results.length} result(s) -> ${path}`);
}
