// finish4 probe F - C38850 C38851 C38849 (working-hours editor, READ ONLY -
// nothing is ever saved), C38866 C43589 (dark mode), C29962 (click-to-arm).
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc } = require('./walkbase.cjs');
const fs = require('fs');
const R = mkRecorder(`${OUT}/walk_misc.json`);
const F = {}; const save = () => fs.writeFileSync(`${OUT}/misc-findings.json`, JSON.stringify(F, null, 1));

(async () => {
  const h = await makeHarness('misc'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/misc-${n}.png` }); } catch (e) { } };

  // ================= C29962 : the click-to-arm alternative =================
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);
  F.arm = await ev(page, ({ v }) => { const vis = eval(v);
    const cards = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')].filter(vis);
    const out = { cards: cards.length, arm_controls: [], aria_pressed: 0, by_testid: [] };
    // (a) anything whose test id or label mentions arming / click-to-schedule
    out.by_testid = [...document.querySelectorAll('[data-test-id]')].filter(vis)
      .map(e => e.getAttribute('data-test-id')).filter(t => /arm|click_to|schedule_by_click/i.test(t));
    // (b) aria-pressed, the shape the control had when it existed
    out.aria_pressed = [...document.querySelectorAll('[aria-pressed]')].filter(vis).length;
    // (c) every control inside the first card, and the card's own hover state
    if (cards[0]) { cards[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      out.arm_controls = [...cards[0].querySelectorAll('button,[role=button],[data-test-id]')].filter(vis)
        .map(e => ({ tid: e.getAttribute('data-test-id'), al: e.getAttribute('aria-label'), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 34) })); }
    return out; });
  // and click the card to see whether a click alone arms anything
  const clicked = await ev(page, ({ v }) => { const vis = eval(v);
    const c = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')].filter(vis)[0];
    if (!c) return null; c.click(); return (c.innerText || '').replace(/\s+/g, ' ').slice(0, 60); });
  await page.waitForTimeout(1800);
  F.arm_after_click = await ev(page, ({ v }) => { const vis = eval(v);
    return { aria_pressed_true: [...document.querySelectorAll('[aria-pressed="true"]')].filter(vis).length,
             armed_cls: [...document.querySelectorAll('[class*="armed"],[class*="selected"]')].filter(vis).length,
             popups: [...document.querySelectorAll('.q-menu,.q-dialog')].filter(vis).map(e => (e.innerText || '').replace(/\s+/g, ' ').slice(0, 120)) }; });
  await shot('arm'); save();
  R.record(29962, [
    { step: 'precondition: a work order with an approved line, on the Schedule page', seen: `${F.arm.cards} work order cards in the sidebar` },
    { step: '1 instead of dragging, click (arm) the work order card in the sidebar', seen: `clicked "${clicked}"; after the click: ${JSON.stringify(F.arm_after_click)}` },
    { step: '  hunted for the control three ways', seen: `test ids matching arm/click-to-schedule: ${JSON.stringify(F.arm.by_testid)} ; aria-pressed elements on the page: ${F.arm.aria_pressed} ; every control inside the card (hover fired first): ${JSON.stringify(F.arm.arm_controls)}` },
  ], 'see RUNNABILITY');

  // ================= C38866 / C43589 : dark mode =================
  const themeCtl = await ev(page, ({ v }) => { const vis = eval(v);
    const cands = [...document.querySelectorAll('[data-test-id],button,.q-btn,.q-toggle')].filter(vis)
      .filter(e => /dark|theme|night/i.test((e.getAttribute('data-test-id') || '') + ' ' + (e.getAttribute('aria-label') || '') + ' ' + (e.innerText || '')));
    return cands.map(e => ({ tid: e.getAttribute('data-test-id'), al: e.getAttribute('aria-label'), t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 30) })); });
  F.theme_control_on_schedule = themeCtl;
  // the app's own dark-mode switch lives in the profile/settings menu; find it
  const bodyCls = await ev(page, () => ({ html: document.documentElement.className, body: document.body.className, dark: document.body.classList.contains('body--dark') }));
  F.theme_state = bodyCls;
  // flip Quasar dark mode the way the app's own toggle does, then read the surfaces
  await page.evaluate(() => { document.body.classList.remove('body--light'); document.body.classList.add('body--dark'); });
  await page.waitForTimeout(1500);
  const sid = await ev(page, ({ v }) => { const vis = eval(v);
    const e = [...document.querySelectorAll('[data-shift-id]')].filter(vis)[0]; return e ? e.getAttribute('data-shift-id') : null; });
  await page.evaluate(async id => { const e = document.querySelector(`[data-shift-id="${id}"]`);
    e.scrollIntoViewIfNeeded && e.scrollIntoViewIfNeeded(); await new Promise(r => setTimeout(r, 600)); (e.querySelector('*') || e).click(); }, sid);
  await page.waitForTimeout(2200);
  F.dark_dialog = await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog__inner > *,.q-dialog [role="dialog"],.q-card')].filter(vis).pop(); if (!d) return null;
    const cs = getComputedStyle(d);
    return { bg: cs.backgroundColor, colour: cs.color, boxShadow: cs.boxShadow, border: cs.border,
             page_bg: getComputedStyle(document.body).backgroundColor }; });
  await shot('dark'); save();
  await esc(page, 3);
  await page.evaluate(() => { document.body.classList.remove('body--dark'); document.body.classList.add('body--light'); });
  await page.waitForTimeout(1200);
  R.record(38866, [
    { step: 'precondition: the app\'s dark mode / theme toggle is available', seen: `theme controls found on the Schedule page itself: ${JSON.stringify(themeCtl)} ; body classes on arrival: ${JSON.stringify(bodyCls)}` },
    { step: '1-3 switch to dark mode and look over the grid and each dialog', seen: `with body--dark applied, the shift detail dialog computes: ${JSON.stringify(F.dark_dialog)}` },
  ], 'see RUNNABILITY');
  R.record(43589, [
    { step: 'precondition: the app is in dark mode, week view, at least one shift', seen: `body--dark applied; shift ${String(sid).slice(0, 8)} present` },
    { step: '1 open a shift\'s details window and look at where it meets the page behind it', seen: `dialog background ${F.dark_dialog && F.dark_dialog.bg} against page background ${F.dark_dialog && F.dark_dialog.page_bg}; box-shadow: ${F.dark_dialog && F.dark_dialog.boxShadow}` },
  ], 'see RUNNABILITY');

  // ================= C38850 / C38851 / C38849 : the working-hours editor =================
  // READ ONLY.  Nothing is saved - a settings write is out of scope for this pass.
  await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(9000);
  F.staff_page = await ev(page, () => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 300));
  const pencil = await ev(page, ({ v }) => { const vis = eval(v);
    const p = [...document.querySelectorAll('[data-test-id],button,i')].filter(vis)
      .filter(e => /edit|pencil/i.test((e.getAttribute('data-test-id') || '') + (e.innerText || '')));
    if (!p.length) return { found: false, ids: [...document.querySelectorAll('[data-test-id]')].filter(vis).map(e => e.getAttribute('data-test-id')).slice(0, 30) };
    p[0].click(); return { found: true, tid: p[0].getAttribute('data-test-id'), t: (p[0].innerText || '').trim() }; });
  await page.waitForTimeout(3500);
  F.staff_edit = pencil;
  F.staff_dialog = await pops(page);
  F.hours_toggle = await ev(page, ({ v }) => { const vis = eval(v);
    const all = [...document.querySelectorAll('*')].filter(vis);
    const t = all.filter(e => /set working hours for this technician/i.test(e.innerText || '') && (e.innerText || '').length < 90);
    return t.map(e => ({ t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 70), tid: e.getAttribute('data-test-id') })); });
  await shot('staff'); save();
  R.record(38849, [
    { step: "precondition: a technician has the 'Set working hours for this technician' toggle OFF", seen: `route: Settings > Staff > the pencil on a technician's row. Page reached: "${String(F.staff_page).slice(0, 140)}"; edit control: ${JSON.stringify(pencil)}; the toggle on the form: ${JSON.stringify(F.hours_toggle)}` },
    { step: '1 confirm the technician has no custom hours set', seen: `dialog read: ${JSON.stringify(F.staff_dialog).slice(0, 400)}` },
  ], 'see RUNNABILITY');
  R.record(38850, [
    { step: 'precondition: you are in the per-day working-hours editor with a day\'s first range set', seen: `the route the case names was followed: ${JSON.stringify(pencil)}; toggle present: ${JSON.stringify(F.hours_toggle)}` },
    { step: "1 on one day, click 'Add Hours'", seen: 'see RUNNABILITY - the editor is behind the toggle, and this pass does not turn a settings toggle on' },
  ], 'see RUNNABILITY');

  fs.writeFileSync(`${OUT}/misc-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET:', JSON.stringify(nonget));
  save(); await h.browser.close();
})();
