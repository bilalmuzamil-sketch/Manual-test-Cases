// probe_fails2.cjs — (a) C29601 toolbar landmarks + the "pressed look" RULE-OUT,
//                    (b) C29622 / C29628 on the phone, 390x844.
// Every absence claim below carries a control that proves the reader can see the
// thing when it is present.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const SETTLE = 9000;

const TOOLBAR = () => {
  const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  // find toolbar buttons BY TEXT as well as by test-id: a missing test-id is not a missing button
  const all = Array.from(document.querySelectorAll('button, a.q-btn')).filter(vis).map(b => ({
    testid: b.getAttribute('data-test-id'),
    text: b.innerText.replace(/\s+/g, ' ').trim().slice(0, 40),
    x: Math.round(b.getBoundingClientRect().left), y: Math.round(b.getBoundingClientRect().top)
  })).filter(b => b.y < 130);
  return all.sort((a, b) => a.x - b.x);
};

async function sheetRead(page) {
  return page.evaluate(() => {
    const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    // Quasar leaves stale EMPTY dialogs mounted -- take the last VISIBLE, NON-EMPTY one
    const dialogs = Array.from(document.querySelectorAll('.q-dialog, [data-test-id="mobile_all_filters_sheet"], .q-bottom-sheet'))
      .filter(d => vis(d) && d.innerText.trim().length > 0);
    const d = dialogs[dialogs.length - 1];
    if (!d) return { sheet_found: false, dialogs_seen: document.querySelectorAll('.q-dialog').length };
    const txt = d.innerText.replace(/\s+/g, ' ').trim();
    const rect = d.getBoundingClientRect();
    // title: any element whose text is exactly the sheet name
    const titleEl = Array.from(d.querySelectorAll('*')).find(e => e.children.length === 0 && /^all filters$/i.test(e.innerText.trim()));
    let title = null;
    if (titleEl) { const r = titleEl.getBoundingClientRect(); const cs = getComputedStyle(titleEl);
      title = { text: titleEl.innerText.trim(), left: Math.round(r.left), right: Math.round(r.right),
        centreOffset: Math.round(((r.left + r.right) / 2) - ((rect.left + rect.right) / 2)),
        textAlign: cs.textAlign, cls: titleEl.className }; }
    // close button: any button carrying a close glyph or aria-label
    const closeBtn = Array.from(d.querySelectorAll('button')).map(b => ({
      testid: b.getAttribute('data-test-id'), text: b.innerText.replace(/\s+/g, ' ').trim(),
      aria: b.getAttribute('aria-label'), x: Math.round(b.getBoundingClientRect().left),
      y: Math.round(b.getBoundingClientRect().top) }))
      .filter(b => /close|^x$/i.test(b.text) || /close/i.test(b.aria || '') || /close/i.test(b.testid || ''));
    // drag handle: a short wide low element near the very top of the sheet
    const handle = Array.from(d.querySelectorAll('div,span')).map(e => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return { r, cs, e };
    }).filter(o => o.r.height > 0 && o.r.height <= 8 && o.r.width >= 24 && o.r.width <= 160
        && (o.r.top - rect.top) < 32 && o.cs.backgroundColor !== 'rgba(0, 0, 0, 0)')
      .map(o => ({ w: Math.round(o.r.width), h: Math.round(o.r.height),
        fromTop: Math.round(o.r.top - rect.top), bg: o.cs.backgroundColor,
        radius: o.cs.borderRadius, cls: o.e.className.toString().slice(0, 60) }));
    // accordion rows
    const rows = Array.from(d.querySelectorAll('.q-expansion-item, [class*="expansion"]')).filter(vis).map(e => ({
      text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 60),
      icons: Array.from(e.querySelectorAll('i,.q-icon')).map(i => i.innerText.trim()).filter(Boolean).slice(0, 5),
      testid: e.getAttribute('data-test-id') }));
    // apply button
    const applyEl = d.querySelector('[data-test-id="apply_filters"]')
      || Array.from(d.querySelectorAll('button')).find(b => /apply/i.test(b.innerText));
    let apply = null;
    if (applyEl) { const r = applyEl.getBoundingClientRect(); const cs = getComputedStyle(applyEl);
      const inner = applyEl.querySelector('.q-btn__content') || applyEl;
      apply = { testid: applyEl.getAttribute('data-test-id'),
        textContent: applyEl.innerText.trim(),
        computedTransform: getComputedStyle(inner).textTransform,
        bg: cs.backgroundColor, y: Math.round(r.top), bottomGap: Math.round(rect.bottom - r.bottom),
        widthPct: Math.round(100 * r.width / rect.width) }; }
    return { sheet_found: true, testid: d.getAttribute('data-test-id'), rect: {
        top: Math.round(rect.top), bottom: Math.round(rect.bottom), left: Math.round(rect.left), right: Math.round(rect.right) },
      title, closeButtons: closeBtn, handleCandidates: handle, rowCount: rows.length, rows, apply,
      allText: txt.slice(0, 700) };
  });
}

(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };

  // ---------------- (a) desktop: C29601 landmarks + pressed-look rule-out ----------------
  const hd = await makeHarness('admin');
  try {
    await hd.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await hd.page.waitForTimeout(SETTLE);
    out.checks.c29601_toolbar = await hd.page.evaluate(TOOLBAR);
    // state while EXPANDED, with focus elsewhere (control)
    await hd.page.mouse.click(700, 400); await hd.page.waitForTimeout(800);
    const look = async () => hd.page.evaluate(() => {
      const b = document.querySelector('[data-test-id="toggle_filter_bar"]'); if (!b) return null;
      const h = b.querySelector('.q-focus-helper'); const cs = getComputedStyle(b);
      return { cls: b.className, color: cs.color, bg: cs.backgroundColor,
        helperOpacity: h ? getComputedStyle(h).opacity : null,
        helperBg: h ? getComputedStyle(h).backgroundColor : null,
        hasOpenModifier: /filter-toggle-button--open/.test(b.className),
        chips: document.querySelectorAll('[data-test-id^="filter_chip_"]').length,
        activeIsButton: document.activeElement === b };
    });
    out.checks.c29601_expanded_blurred = await look();
    await hd.page.click('[data-test-id="toggle_filter_bar"]'); await hd.page.waitForTimeout(2000);
    out.checks.c29601_collapsed_focused = await look();
    // THE RULE-OUT: blur, then read again. If the 0.22 was focus it will drop back.
    await hd.page.mouse.click(700, 400); await hd.page.waitForTimeout(1200);
    out.checks.c29601_collapsed_blurred = await look();
    await hd.page.screenshot({ path: `${OUT}/c29601-collapsed-blurred.png` });
    // restore expanded so we leave the account as we found it
    await hd.page.click('[data-test-id="toggle_filter_bar"]'); await hd.page.waitForTimeout(1500);
    out.checks.c29601_restored = await look();
  } catch (e) { out.err_desktop = String(e).slice(0, 400); }
  out.bridge_desktop = hd.bridgeErrors.length;
  await hd.browser.close();

  // ---------------- (b) phone 390x844: C29622, C29628 ----------------
  const hm = await makeHarness('admin', { width: 390, height: 844 });
  try {
    await hm.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await hm.page.waitForTimeout(SETTLE);
    out.checks.mobile_chiprow = await hm.page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      return Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).filter(vis).map(e => ({
        id: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim(),
        x: Math.round(e.getBoundingClientRect().left) }));
    });
    await hm.page.screenshot({ path: `${OUT}/mobile-chiprow.png` });

    // CONTROL: prove the sheet reader can see a sheet when one is open.
    const allf = await hm.page.$('[data-test-id="filter_chip_all_filters"]');
    out.checks.c29622_all_filters_chip_present = !!allf;
    if (allf) {
      await allf.click();
      // wait for a sheet that actually HAS content, not a stale empty dialog
      await hm.page.waitForFunction(() => {
        const ds = Array.from(document.querySelectorAll('.q-dialog')).filter(d => {
          const r = d.getBoundingClientRect(); return r.height > 0 && d.innerText.trim().length > 0; });
        return ds.length > 0;
      }, { timeout: 20000 }).catch(() => {});
      await hm.page.waitForTimeout(2500);
      out.checks.c29622_sheet = await sheetRead(hm.page);
      await hm.page.screenshot({ path: `${OUT}/c29622-all-filters-sheet.png` });
      // close it again
      await hm.page.keyboard.press('Escape').catch(() => {});
      await hm.page.waitForTimeout(1500);
      out.checks.c29622_sheet_after_escape = await sheetRead(hm.page);
    }

    // ---- C29628 : chips + Clear Filters on the phone, with a filter APPLIED ----
    await hm.page.goto(APP + '/workorders?tab=all&status=approved', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await hm.page.waitForTimeout(SETTLE);
    out.checks.c29628_with_filter = await hm.page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const chips = Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).filter(vis).map(e => {
        const cs = getComputedStyle(e);
        return { id: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim(),
          bg: cs.backgroundColor, color: cs.color, cls: e.className.toString().slice(0, 80) }; });
      // Clear Filters: by test-id AND by visible text -- either counts as present
      const byId = document.querySelector('[data-test-id="clear_filters"]');
      const byText = Array.from(document.querySelectorAll('button, a, span, div'))
        .filter(e => vis(e) && e.children.length === 0 && /clear\s*filters/i.test(e.innerText))
        .map(e => ({ tag: e.tagName, text: e.innerText.trim(), testid: e.getAttribute('data-test-id'),
          x: Math.round(e.getBoundingClientRect().left), y: Math.round(e.getBoundingClientRect().top) }));
      return { url: location.href, chips, clearById: !!byId,
        clearByIdInfo: byId ? { text: byId.innerText.trim(), y: Math.round(byId.getBoundingClientRect().top) } : null,
        clearByText: byText, cards: document.querySelectorAll('tbody tr').length,
        bodySnippet: document.body.innerText.replace(/\s+/g, ' ').slice(0, 400) };
    });
    await hm.page.screenshot({ path: `${OUT}/c29628-filter-applied.png` });
    // CONTROL for the Clear Filters absence: read the SAME selectors on DESKTOP,
    // where the control is known to exist. Done in the desktop half below.
  } catch (e) { out.err_mobile = String(e).slice(0, 400); }
  out.bridge_mobile = hm.bridgeErrors.length;
  await hm.browser.close();

  // ---- CONTROL: the same Clear Filters readers, on desktop with a filter applied ----
  const hc = await makeHarness('admin');
  try {
    await hc.page.goto(APP + '/workorders?tab=all&status=approved', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await hc.page.waitForTimeout(SETTLE);
    out.checks.control_desktop_clear = await hc.page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const byId = document.querySelector('[data-test-id="clear_filters"]');
      const byText = Array.from(document.querySelectorAll('button, a, span, div'))
        .filter(e => vis(e) && e.children.length === 0 && /clear\s*filters/i.test(e.innerText))
        .map(e => ({ tag: e.tagName, text: e.innerText.trim(), testid: e.getAttribute('data-test-id') }));
      return { clearById: !!byId, clearByText: byText };
    });
  } catch (e) { out.err_control = String(e).slice(0, 300); }
  out.bridge_control = hc.bridgeErrors.length;
  await hc.browser.close();

  out.finished_utc = new Date().toISOString();
  fs.writeFileSync(`${OUT}/fails-2.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.checks, null, 1).slice(0, 7000));
})();
