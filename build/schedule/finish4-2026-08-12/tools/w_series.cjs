// finish4 probe A - the SERIES cases.  C30057 C30060 C43556 C30065 C38864
//
// SAFETY, learned the hard way (drag-retry-2026-08-12/INCIDENT-accidental-delete):
// a shift is selected BY ID, never by matching a customer name on the grid, and
// Delete on a NON-series shift has no confirmation at all.  Every shift this probe
// touches is a member of a known series, identified by id from the board fetch.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc, setView, clickId, clickText } = require('./walkbase.cjs');
const fs = require('fs');

const R = mkRecorder(`${OUT}/walk_series.json`);
// series 6635dbdb, 4 shifts Mon 10 - Thu 13 Aug, technician 16469a2e, S-14209 Kastone Solutions
const SERIES = '6635dbdb-6b40-4e5b-8e08-9e0e2ba1e5c4';
const MIDDLE = '75716e48-263b-4edb-8c03-33e83e90dcea';  // Tue 11 Aug - a genuine MIDDLE member

// find a shift block on the grid by its id, and return its centre
const FIND = ({ id, v }) => {
  const vis = eval(v);
  const sel = [`[data-shift-id="${id}"]`, `[data-test-id="shift_${id}"]`, `[data-id="${id}"]`, `#shift-${id}`];
  for (const s of sel) { const e = document.querySelector(s); if (e && vis(e)) { const r = e.getBoundingClientRect(); return { sel: s, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), text: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 160) }; } }
  // fall back: any element whose attributes carry the id
  const all = [...document.querySelectorAll('*')].filter(vis).filter(e => [...e.attributes].some(a => a.value === id));
  if (all.length) { const e = all[all.length - 1]; const r = e.getBoundingClientRect(); return { sel: 'attr-match:' + e.tagName + '.' + (e.className || '').toString().slice(0, 60), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), text: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 160) }; }
  return null;
};

(async () => {
  const h = await makeHarness('series');
  const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(12000);

  const findings = {};
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/series-${n}.png` }); } catch (e) { } };

  // ---- can the tester SEE a series shift at all?  (finish3 could not) ----
  let loc = await ev(page, FIND, { id: MIDDLE });
  findings.middle_on_screen_first_try = loc;
  if (!loc) {
    // the grid may be showing a different week; the shift is Tue 11 Aug and today is 12 Aug,
    // so the default week should contain it.  Record what IS on screen before concluding.
    findings.grid_sample = await ev(page, ({ v }) => { const vis = eval(v);
      return [...document.querySelectorAll('[data-shift-id],[class*="shift"]')].filter(vis).slice(0, 12)
        .map(e => ({ cls: (e.className || '').toString().slice(0, 70), id: e.getAttribute('data-shift-id'), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 70) })); });
  }
  await shot('grid');
  fs.writeFileSync(`${OUT}/series-findings.json`, JSON.stringify(findings, null, 1));

  if (loc) {
    // ---------- C30057 : delete a MIDDLE shift -> three scope options ----------
    await page.mouse.click(loc.x, loc.y); await page.waitForTimeout(2200);
    const modal = await pops(page);
    findings.detail_modal = modal;
    await shot('detail');
    const delOk = await clickId(page, 'button_shift_detail_delete');
    await page.waitForTimeout(1800);
    const scope = await pops(page);
    findings.delete_scope_dialog = scope;
    await shot('scope');
    const opts = await ev(page, ({ v }) => { const vis = eval(v);
      const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop();
      if (!d) return null;
      return [...d.querySelectorAll('.q-item,label,button,.q-radio,[role="option"]')].filter(vis)
        .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean); });
    findings.scope_options = opts;
    R.record(30057, [
      { step: 'precondition: a shift that is a MIDDLE member of a repeating series', seen: `series ${SERIES.slice(0, 8)} has 4 shifts Mon 10 - Thu 13 Aug; the one opened is Tue 11 Aug, shift ${MIDDLE.slice(0, 8)} - selected BY ID, never by customer name` },
      { step: '1 open the shift and press Delete', seen: `detail modal: ${JSON.stringify(modal).slice(0, 260)} ; delete control clicked = ${delOk}` },
      { step: '2 a scope dialog offers all three options', seen: JSON.stringify(opts) },
    ], 'see RUNNABILITY');
    // CANCEL - nothing is destroyed by this case
    await clickText(page, 'Cancel'); await esc(page, 2);
  }

  fs.writeFileSync(`${OUT}/series-findings.json`, JSON.stringify(findings, null, 1));
  fs.writeFileSync(`${OUT}/series-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET API CALLS:', JSON.stringify(nonget));
  await h.browser.close();
})();
