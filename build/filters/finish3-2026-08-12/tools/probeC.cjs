// probeC.cjs — the seeded-data cases and the three vacuous/loose ends.
//   C29568 expectation 3  a LONG customer name on a tag (84-char ZZAUTOTEST customer seeded)
//   C29619                a URL naming a customer that has since been DELETED
//   C29616                a remembered filter value that was deleted
//   C29615                filters are per user (admin vs technician, separate contexts)
//   C38876                first visit / last-used tab, with the check able to fail this time
//
// The 84-character customer is what makes the ellipsis question answerable: the longest name
// already in the shop is 36 characters and renders in full, which proves nothing either way.

const { makeHarness, OUT, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const S = (p, n = 2200) => p.waitForTimeout(n);

const LONG_ID = '8f36e64b-f84b-4733-a129-1aca2f94392e';
const LONG_NAME = 'ZZAUTOTEST Extremely Long Customer Name For Tag Truncation Check Limited Partnership';

async function typeMenu(page, t) {
  await page.evaluate((x) => { const m = document.querySelector('.q-menu');
    const i = m && m.querySelector('input:not(.hidden)');
    if (i) { i.value = x; i.dispatchEvent(new Event('input', { bubbles: true })); } }, t);
  await page.waitForTimeout(1800);
}

(async () => {
  const R = { read_at_utc: new Date().toISOString(), seeded_customer: { id: LONG_ID, name: LONG_NAME, length: LONG_NAME.length }, cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeC', R); };

  // ============================================================ long tag + C29619 setup
  const H = await makeHarness('admin');
  try {
    await L.goWO(H.page, '?tab=all');
    await L.clearAll(H.page);
    await L.goWO(H.page, '?tab=all');

    // C29568 exp 3 — the 84-character name on a tag
    let o = await L.openChip(H.page, 'filter_chip_company_id');
    await typeMenu(H.page, 'ZZAUTOTEST Extremely');
    const seen = await H.page.$$eval(L.OPT, els => els.map(e => ({ id: e.getAttribute('data-test-id'), t: (e.innerText || '').trim() })));
    const pk = await L.pickOption(H.page, `filter_option_company_id_${LONG_ID}`);
    await S(H.page, 2200);
    const tag = await H.page.evaluate((full) => {
      const m = document.querySelector('.q-menu'); if (!m) return { menu: false };
      const c = m.querySelector('.q-chip'); if (!c) return { menu: true, tag: false };
      const content = c.querySelector('.q-chip__content') || c;
      const cs = getComputedStyle(content);
      const txt = (c.innerText || '').replace(/\s+/g, ' ').replace(/ cancel$/, '').trim();
      return { menu: true, tag: true, fullNameLength: full.length, renderedText: txt,
        renderedLength: txt.length, showsFullName: txt === full,
        endsWithEllipsis: /[…]|\.\.\.$/.test(txt),
        textOverflow: cs.textOverflow, overflow: cs.overflow, whiteSpace: cs.whiteSpace,
        maxWidth: cs.maxWidth, scrollWidth: content.scrollWidth, clientWidth: content.clientWidth,
        clippedByBox: content.scrollWidth > content.clientWidth + 1,
        chipWidth: Math.round(c.getBoundingClientRect().width),
        menuWidth: Math.round(m.getBoundingClientRect().width) };
    }, LONG_NAME);
    // and the chip label itself, which is what the tester reads on the bar
    await L.closeMenu(H.page); await S(H.page, 2400);
    const chipLabel = await L.label(H.page, '[data-test-id="filter_chip_company_id"]');
    put('29568-longname', { optionVisibleInList: seen.length, optionText: seen[0]?.t,
      picked: pk.clicked, tag, chipOnBar: chipLabel,
      could_fail: pk.clicked === true && tag.tag === true });
    await L.shot(H.page, OUT, 'c29568-long-tag');

    // C29619 — build the shareable URL that names this customer plus one real filter value
    let oS = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page); await S(H.page, 2600);
    const savedUrl = H.page.url();
    put('29619-setup', { savedUrl, hasSeededCustomer: savedUrl.includes(LONG_ID),
      hasRealFilter: /status=declined/.test(savedUrl),
      chips: (await L.chips(H.page)).map(c => c.text) });

    // C29616 — the same value must also be in the SAVED preference, so it is "remembered"
    const prefBefore = await L.pref(H.page);
    put('29616-setup', { savedPreference: prefBefore.value?.filters, updatedAt: prefBefore.updatedAt,
      remembersSeededCustomer: JSON.stringify(prefBefore.value?.filters || {}).includes(LONG_ID) });

    R.bridge_errors_a = H.bridgeErrors.length;
  } catch (e) { R.error_a = String(e).slice(0, 500); }
  L.save(OUT, 'probeC', R);
  await H.browser.close();

  // ============================================================ delete the customer
  const del = await fetch(`${API}/api/customers/delete`, {
    method: 'POST',
    headers: { cookie: require('fs').readFileSync('/tmp/qa-cookies/filters-admin.txt', 'utf8').trim(),
               'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ company_id: LONG_ID }), redirect: 'manual'
  }).then(async r => ({ status: r.status })).catch(e => ({ error: String(e).slice(0, 120) }));
  const gone = await fetch(`${API}/api/customers/${LONG_ID}`, {
    headers: { cookie: require('fs').readFileSync('/tmp/qa-cookies/filters-admin.txt', 'utf8').trim(), accept: 'application/json' }
  }).then(r => ({ status: r.status })).catch(e => ({ error: String(e).slice(0, 120) }));
  R.deletion = { deleteCall: del, reReadAfterDelete: gone };
  L.save(OUT, 'probeC', R);

  // ============================================================ reopen the URL, and the remembered value
  const H2 = await makeHarness('admin');
  try {
    const saved = R.cases['29619-setup']?.savedUrl;
    if (saved) {
      await H2.page.goto(saved, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H2.page, 10000);
      await L.ensureBarOpen(H2.page);
      const chips = await L.chips(H2.page);
      const rows = await L.rows(H2.page);
      const req = H2.apiLog.filter(a => /\/api\/work-orders\?/.test(a.u)).slice(-1)[0];
      put('29619', { openedUrl: saved, landedOn: H2.page.url(),
        chips: chips.map(c => c.text),
        customerChipShowsAValue: /:/.test(chips.find(c => c.id === 'filter_chip_company_id')?.text || ''),
        statusChipShowsDeclined: /Declined/.test(chips.find(c => c.id === 'filter_chip_status')?.text || ''),
        rows, tally: await L.statusTally(H2.page),
        lastListRequest: req ? { status: req.s, decoded: decodeURIComponent(req.u) } : null,
        deletedIdStillSent: req ? decodeURIComponent(req.u).includes(LONG_ID) : null,
        pageErrored: await H2.page.evaluate(() => /something went wrong|unexpected error/i.test(document.body.innerText)),
        realConsoleErrors: H2.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 4),
        could_fail: true });
      await L.shot(H2.page, OUT, 'c29619-deleted-value-url');
    }

    // C29616 — arrive PLAINLY; the deleted value is in the saved preference, not the URL
    await H2.page.goto('https://sv8785.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H2.page, 10000);
    await L.ensureBarOpen(H2.page);
    const prefNow = await L.pref(H2.page);
    const chips2 = await L.chips(H2.page);
    const req2 = H2.apiLog.filter(a => /\/api\/work-orders\?/.test(a.u)).slice(-1)[0];
    put('29616', { arrivedPlainly: H2.page.url(),
      savedPreferenceNow: prefNow.value?.filters,
      preferenceStillNamesDeletedCustomer: JSON.stringify(prefNow.value?.filters || {}).includes(LONG_ID),
      chips: chips2.map(c => c.text),
      customerChipShowsAValue: /:/.test(chips2.find(c => c.id === 'filter_chip_company_id')?.text || ''),
      rows: await L.rows(H2.page), tally: await L.statusTally(H2.page),
      lastListRequest: req2 ? { status: req2.s, decoded: decodeURIComponent(req2.u) } : null,
      deletedIdStillSent: req2 ? decodeURIComponent(req2.u).includes(LONG_ID) : null,
      pageErrored: await H2.page.evaluate(() => /something went wrong|unexpected error/i.test(document.body.innerText)),
      could_fail: true });
    await L.shot(H2.page, OUT, 'c29616-remembered-deleted-value');
    R.bridge_errors_b = H2.bridgeErrors.length;
  } catch (e) { R.error_b = String(e).slice(0, 500); }
  L.save(OUT, 'probeC', R);
  await H2.browser.close();

  // ============================================================ C29615 — per-user filters
  const A = await makeHarness('admin');
  const B = await makeHarness('tech');
  try {
    await A.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(A.page, 9000);
    await L.clearAll(A.page);
    await L.ensureBarOpen(A.page);
    let oA = await L.openChip(A.page, 'filter_chip_status');
    const pA = await L.pickOption(A.page, 'filter_option_status_approved');
    await L.closeMenu(A.page); await S(A.page, 3000);
    const prefA = await L.pref(A.page);

    await B.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(B.page, 10000);
    const bLanded = B.page.url();
    const bBody = await B.page.evaluate(() => document.body.innerText.slice(0, 300));
    const bBarOpen = await L.ensureBarOpen(B.page);
    const chipsB = await L.chips(B.page);
    const prefB = await L.pref(B.page);
    // B sets its OWN different filter
    let pB = { clicked: false }; let oB = { found: false };
    if (chipsB.length) {
      oB = await L.openChip(B.page, 'filter_chip_status');
      pB = await L.pickOption(B.page, 'filter_option_status_invoiced');
      await L.closeMenu(B.page); await S(B.page, 3000);
    }
    const prefB2 = await L.pref(B.page);
    // re-check A
    await A.page.goto('https://sv8785.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(A.page, 9000);
    await L.ensureBarOpen(A.page);
    const chipsA2 = await L.chips(A.page);
    const prefA2 = await L.pref(A.page);

    put('29615', {
      technicianCanReachWorkOrders: !/login|no-location/.test(bLanded),
      technicianLandedOn: bLanded, technicianBodyStart: bBody.replace(/\s+/g, ' ').slice(0, 160),
      technicianFilterBar: bBarOpen, technicianChips: chipsB.map(c => c.text),
      adminSetApproved: pA.clicked, adminPrefAfterSet: prefA.value?.filters,
      technicianPrefOnArrival: prefB.status === 200 ? prefB.value?.filters : `HTTP ${prefB.status}`,
      technicianSawAdminsFilter: JSON.stringify(prefB.value?.filters || {}).includes('approved'),
      technicianSetInvoiced: pB.clicked, technicianPrefAfter: prefB2.status === 200 ? prefB2.value?.filters : `HTTP ${prefB2.status}`,
      adminChipsAfterTechnicianChanged: chipsA2.map(c => c.text),
      adminPrefUnchanged: JSON.stringify(prefA.value?.filters) === JSON.stringify(prefA2.value?.filters),
      adminPrefAfter: prefA2.value?.filters,
      could_fail: pA.clicked === true
    });
    await L.shot(A.page, OUT, 'c29615-admin-view');
    await L.shot(B.page, OUT, 'c29615-technician-view');
    R.bridge_errors_c = A.bridgeErrors.length + B.bridgeErrors.length;
  } catch (e) { R.error_c = String(e).slice(0, 500); }
  L.save(OUT, 'probeC', R);
  await A.browser.close(); await B.browser.close();

  console.log('errors:', R.error_a, R.error_b, R.error_c, '| blocks:', Object.keys(R.cases).length);
})();
