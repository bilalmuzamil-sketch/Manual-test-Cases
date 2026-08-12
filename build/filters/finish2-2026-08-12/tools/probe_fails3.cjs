// probe_fails3.cjs — close the two questions probe_fails2 left open.
// (1) C29601: is the collapsed "pressed look" real, or was 0.22 just focus?
//     Blur is done with element.blur(), NOT by clicking the page -- the last run
//     clicked at (700,400), which landed on a work-order row and navigated away,
//     so that check produced NOTHING and is reported as not established.
// (2) C29622: the drag handle. Instead of a heuristic detector that has never been
//     proven to fire, DUMP every element in the top band of the sheet with its
//     computed style, and read it.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const SETTLE = 9000;

const LOOK = () => {
  const b = document.querySelector('[data-test-id="toggle_filter_bar"]');
  if (!b) return null;
  const h = b.querySelector('.q-focus-helper'); const cs = getComputedStyle(b);
  return { hasOpenModifier: /filter-toggle-button--open/.test(b.className),
    cls: b.className, color: cs.color, bg: cs.backgroundColor,
    helperOpacity: h ? getComputedStyle(h).opacity : null,
    helperBg: h ? getComputedStyle(h).backgroundColor : null,
    isFocused: document.activeElement === b,
    chips: document.querySelectorAll('[data-test-id^="filter_chip_"]').length };
};

(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };

  const hd = await makeHarness('admin');
  try {
    await hd.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await hd.page.waitForTimeout(SETTLE);
    const blur = async () => hd.page.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); });

    let st = await hd.page.evaluate(LOOK);
    out.checks.state_A_onload = st;
    // normalise to EXPANDED
    if (st && st.chips === 0) { await hd.page.click('[data-test-id="toggle_filter_bar"]'); await hd.page.waitForTimeout(2200); }
    await blur(); await hd.page.waitForTimeout(600);
    out.checks.state_B_expanded_blurred = await hd.page.evaluate(LOOK);
    // collapse
    await hd.page.click('[data-test-id="toggle_filter_bar"]'); await hd.page.waitForTimeout(2200);
    out.checks.state_C_collapsed_focused = await hd.page.evaluate(LOOK);
    await blur(); await hd.page.waitForTimeout(800);
    out.checks.state_D_collapsed_blurred = await hd.page.evaluate(LOOK);
    await hd.page.screenshot({ path: `${OUT}/c29601-collapsed-blurred.png` });
    // and back, blurred, so the two blurred states are compared like with like
    await hd.page.click('[data-test-id="toggle_filter_bar"]'); await hd.page.waitForTimeout(2200);
    await blur(); await hd.page.waitForTimeout(800);
    out.checks.state_E_expanded_blurred_again = await hd.page.evaluate(LOOK);
    await hd.page.screenshot({ path: `${OUT}/c29601-expanded-blurred.png` });
  } catch (e) { out.err_desktop = String(e).slice(0, 400); }
  out.bridge_desktop = hd.bridgeErrors.length;
  await hd.browser.close();

  // ---------------- C29622 : what is actually at the top of the sheet ----------------
  const hm = await makeHarness('admin', { width: 390, height: 844 });
  try {
    await hm.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await hm.page.waitForTimeout(SETTLE);
    await hm.page.click('[data-test-id="filter_chip_all_filters"]');
    await hm.page.waitForFunction(() => Array.from(document.querySelectorAll('.q-dialog'))
      .some(d => d.getBoundingClientRect().height > 0 && d.innerText.trim().length > 0), { timeout: 20000 }).catch(() => {});
    await hm.page.waitForTimeout(2500);

    out.checks.c29622_top_band = await hm.page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const ds = Array.from(document.querySelectorAll('.q-dialog')).filter(d => vis(d) && d.innerText.trim().length > 0);
      const d = ds[ds.length - 1]; if (!d) return { found: false };
      const R = d.getBoundingClientRect();
      // DESCRIPTIVE DUMP: everything whose top edge is within 60px of the sheet top
      const band = Array.from(d.querySelectorAll('*')).filter(e => {
        const r = e.getBoundingClientRect();
        return r.height > 0 && r.width > 0 && (r.top - R.top) >= -2 && (r.top - R.top) <= 60;
      }).map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return { tag: e.tagName, cls: (e.className || '').toString().slice(0, 70),
          testid: e.getAttribute('data-test-id'),
          text: e.children.length === 0 ? e.innerText.trim().slice(0, 30) : '',
          w: Math.round(r.width), h: Math.round(r.height), fromTop: Math.round(r.top - R.top),
          left: Math.round(r.left - R.left), bg: cs.backgroundColor, radius: cs.borderRadius,
          before: (() => { const b = getComputedStyle(e, '::before');
            return b.content !== 'none' ? { content: b.content, w: b.width, h: b.height, bg: b.backgroundColor } : null; })() };
      });
      // header block, whatever it is called
      const hdr = d.querySelector('[class*="header"], [class*="__title"]');
      // is Apply sticky? read its position, then scroll the sheet body and read again
      const ap = d.querySelector('[data-test-id="apply_filters"]');
      return { found: true, sheetRect: { top: Math.round(R.top), bottom: Math.round(R.bottom),
          left: Math.round(R.left), right: Math.round(R.right), width: Math.round(R.width) },
        band, headerCls: hdr ? hdr.className.toString().slice(0, 80) : null,
        applyTopBefore: ap ? Math.round(ap.getBoundingClientRect().top) : null };
    });

    // stickiness: scroll inside the sheet and see whether Apply stays put
    out.checks.c29622_apply_sticky = await hm.page.evaluate(async () => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const ds = Array.from(document.querySelectorAll('.q-dialog')).filter(d => vis(d) && d.innerText.trim().length > 0);
      const d = ds[ds.length - 1]; if (!d) return null;
      const ap = d.querySelector('[data-test-id="apply_filters"]'); if (!ap) return null;
      const before = Math.round(ap.getBoundingClientRect().top);
      const scroller = Array.from(d.querySelectorAll('*')).find(e => e.scrollHeight > e.clientHeight + 20);
      if (!scroller) return { before, scrolled: false, note: 'no scrollable region -- sheet content fits, stickiness not exercised' };
      scroller.scrollTop = scroller.scrollHeight;
      await new Promise(r => setTimeout(r, 900));
      return { before, after: Math.round(ap.getBoundingClientRect().top), scrolled: true,
        scrollTop: scroller.scrollTop, scrollHeight: scroller.scrollHeight, clientHeight: scroller.clientHeight };
    });
    await hm.page.screenshot({ path: `${OUT}/c29622-sheet-scrolled.png` });
  } catch (e) { out.err_mobile = String(e).slice(0, 400); }
  out.bridge_mobile = hm.bridgeErrors.length;
  await hm.browser.close();

  out.finished_utc = new Date().toISOString();
  fs.writeFileSync(`${OUT}/fails-3.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.checks, null, 1).slice(0, 6000));
})();
