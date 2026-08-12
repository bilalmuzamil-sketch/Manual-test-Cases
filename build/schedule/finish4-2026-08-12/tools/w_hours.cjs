// finish4 probe G - retry.  Probe F's "pencil" selector matched a NAV element
// (page_administration), so the staff edit form never opened - our harness, not a
// missing route.  This one finds the pencil INSIDE a staff table row.
// Also: locate the app's own dark-mode toggle, which probe F could not find on the
// Schedule page.  READ ONLY - no settings toggle is turned on, nothing is saved.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { mkRecorder, ev, pops, esc } = require('./walkbase.cjs');
const fs = require('fs');
const R = mkRecorder(`${OUT}/walk_misc.json`);
const F = {}; const save = () => fs.writeFileSync(`${OUT}/hours-findings.json`, JSON.stringify(F, null, 1));

(async () => {
  const h = await makeHarness('hours'); const page = h.page;
  const nonget = [];
  page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url())) nonget.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
  const shot = async n => { try { await page.screenshot({ path: `${OUT}/hours-${n}.png` }); } catch (e) { } };

  await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(11000);
  F.rows = await ev(page, ({ v }) => { const vis = eval(v);
    const tr = [...document.querySelectorAll('tr,[class*="row"]')].filter(vis).filter(e => (e.innerText || '').length > 12);
    return { n: tr.length, sample: tr.slice(0, 3).map(e => (e.innerText || '').replace(/\s+/g, ' ').slice(0, 90)) }; });
  // the pencil lives INSIDE a table row - restrict the search to <tbody> <tr>
  const opened = await ev(page, ({ v }) => { const vis = eval(v);
    const rows = [...document.querySelectorAll('tbody tr')].filter(vis);
    for (const r of rows) {
      const btns = [...r.querySelectorAll('button,i,.q-btn,[data-test-id]')].filter(vis);
      const p = btns.find(b => /edit|pencil/i.test((b.getAttribute('data-test-id') || '') + ' ' + (b.innerText || '')));
      if (p) { p.click(); return { ok: true, row: (r.innerText || '').replace(/\s+/g, ' ').slice(0, 70), tid: p.getAttribute('data-test-id'), t: (p.innerText || '').trim() }; } }
    return { ok: false, rows: rows.length,
      first_row_controls: rows[0] ? [...rows[0].querySelectorAll('button,i,.q-btn,[data-test-id]')].filter(vis).map(b => ({ tid: b.getAttribute('data-test-id'), t: (b.innerText || '').trim().slice(0, 20) })) : null }; });
  await page.waitForTimeout(4000);
  F.staff_edit = opened;
  F.dialog = await pops(page);
  F.hours_toggle = await ev(page, ({ v }) => { const vis = eval(v);
    const all = [...document.querySelectorAll('*')].filter(vis)
      .filter(e => /working hours/i.test(e.innerText || '') && (e.innerText || '').length < 120);
    return all.slice(0, 4).map(e => ({ t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 90), tid: e.getAttribute('data-test-id'), tag: e.tagName })); });
  F.dialog_ids = await ev(page, ({ v }) => { const vis = eval(v);
    const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).pop(); if (!d) return null;
    return [...d.querySelectorAll('[data-test-id]')].filter(vis).map(e => e.getAttribute('data-test-id')).slice(0, 50); });
  await shot('staffedit'); save();
  R.record(38849, [
    { step: "precondition: the shop has business hours, and a technician has 'Set working hours for this technician' OFF", seen: `route Settings > Staff > the pencil on a technician's row: ${JSON.stringify(F.staff_edit)}` },
    { step: '1 confirm the technician has no custom hours set', seen: `the working-hours control on that form: ${JSON.stringify(F.hours_toggle)} ; form controls: ${JSON.stringify(F.dialog_ids).slice(0, 400)}` },
  ], 'see RUNNABILITY');
  R.record(38850, [
    { step: 'precondition: the per-day working-hours editor, reached from Settings > Staff > the pencil > turn on the working-hours toggle', seen: `the route is reachable as written: ${JSON.stringify(F.staff_edit)} ; the toggle the precondition names: ${JSON.stringify(F.hours_toggle)}` },
    { step: "1-3 click 'Add Hours', read the new range, set then remove it", seen: 'NOT driven - the editor only appears once the working-hours toggle is turned ON, and this pass deliberately changes no staff setting. The route to it is verified; the editor itself is not.' },
  ], 'see RUNNABILITY');
  R.record(38851, [
    { step: 'precondition: the per-day working-hours editor with at least two ranges on one day', seen: `same route as C38850, verified reachable: ${JSON.stringify(F.staff_edit)}` },
    { step: '1-4 overlapping ranges block Save; incomplete rows are ignored', seen: 'NOT driven - same reason as C38850; it needs the working-hours toggle turned on and ranges entered.' },
  ], 'see RUNNABILITY');
  await esc(page, 3);

  // ---------- the app's own dark-mode toggle ----------
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(11000);
  F.theme_hunt = await ev(page, ({ v }) => { const vis = eval(v);
    const hits = [];
    // (a) the profile / avatar menu in the header
    const av = [...document.querySelectorAll('[data-test-id],button,.q-avatar')].filter(vis)
      .filter(e => /avatar|profile|account|user_menu/i.test((e.getAttribute('data-test-id') || '') + (e.className || '').toString()));
    hits.push({ where: 'header avatar candidates', found: av.map(e => ({ tid: e.getAttribute('data-test-id'), cls: (e.className || '').toString().slice(0, 40) })) });
    if (av[0]) av[0].click();
    return hits; });
  await page.waitForTimeout(2000);
  F.profile_menu = await pops(page);
  F.theme_in_menu = await ev(page, ({ v }) => { const vis = eval(v);
    const m = [...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis);
    const txt = m.map(e => (e.innerText || '').replace(/\s+/g, ' ').slice(0, 300));
    const dk = m.flatMap(e => [...e.querySelectorAll('*')].filter(vis).filter(x => /dark|theme|light mode|appearance/i.test(x.innerText || '') && (x.innerText || '').length < 40))
      .map(x => ({ t: (x.innerText || '').trim(), tid: x.getAttribute('data-test-id') }));
    return { menus: txt, dark_controls: dk }; });
  await shot('theme'); save();
  R.record(38866, [
    { step: "precondition: the app's dark mode / theme toggle is available", seen: `hunted for it: ${JSON.stringify(F.theme_hunt)} ; the menu it opens reads ${JSON.stringify(F.profile_menu).slice(0, 300)} ; dark/theme controls inside it: ${JSON.stringify(F.theme_in_menu && F.theme_in_menu.dark_controls)}` },
    { step: '1-4 switch to dark mode, look over the grid and dialogs, switch back', seen: 'the SURFACES were measured in probe F with body--dark applied directly: the shift dialog computes rgb(32,41,57) on a page of rgb(20,24,36) with a 16px/40px shadow. HONEST LIMIT: that state was applied by the harness, not by the product\'s own toggle.' },
  ], 'see RUNNABILITY');

  fs.writeFileSync(`${OUT}/hours-nonget.json`, JSON.stringify(nonget, null, 1));
  console.log('NON-GET:', JSON.stringify(nonget));
  save(); await h.browser.close();
})();
